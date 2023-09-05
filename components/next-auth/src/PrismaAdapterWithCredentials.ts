// next-auth:
import type {
    // types:
    Awaitable,
}                           from 'next-auth'
import {
    // databases:
    PrismaAdapter,
}                           from '@auth/prisma-adapter'

// ORMs:
import type {
    PrismaClient,
}                           from '@prisma/client'

// cryptos:
import {
    default as bcrypt,
}                           from 'bcrypt'
import {
    customAlphabet,
}                           from 'nanoid/async'

// internals:
import type {
    // models:
    AdapterUser,
    AdapterRole,
}                           from './types.js'



// types:
type Adapter = ReturnType<typeof PrismaAdapter>
export type Credentials = Record<'username'|'password', string>
export interface ResetPasswordTokenData {
    email    : string
    username : string|null
}


// options:
export interface ValidateCredentialsOptions {
    now                 ?: Date
    failureMaxAttemps   ?: number|null
    failureLockDuration ?: number
}
export interface CreateResetPasswordTokenOptions {
    now                 ?: Date
    resetLimitInHours   ?: number
    emailResetMaxAge    ?: number
}
export interface ValidateResetPasswordTokenOptions {
    now                 ?: Date
}
export interface ApplyResetPasswordTokenOptions {
    now                 ?: Date
}



export interface AdapterWithCredentials
    extends
        Adapter
{
    validateCredentials        : (credentials        : Credentials             , options?: ValidateCredentialsOptions       ) => Awaitable<AdapterUser|Date|null>
    createResetPasswordToken   : (usernameOrEmail    : string                  , options?: CreateResetPasswordTokenOptions  ) => Awaitable<{ resetPasswordToken: string, user: AdapterUser}|Date|null>
    validateResetPasswordToken : (resetPasswordToken : string                  , options?: ValidateResetPasswordTokenOptions) => Awaitable<ResetPasswordTokenData|null>
    applyResetPasswordToken    : (resetPasswordToken : string, password: string, options?: ApplyResetPasswordTokenOptions   ) => Awaitable<boolean>
    
    getRoleByUserId            : (userId             : string                                                               ) => Awaitable<AdapterRole|null>
    getRoleByUserEmail         : (userEmail          : string                                                               ) => Awaitable<AdapterRole|null>
    
    checkUsernameAvailability  : (username           : string                                                               ) => Awaitable<boolean>
    checkEmailAvailability     : (email              : string                                                               ) => Awaitable<boolean>
    
    registerUser               : (fullname: string, email : string, username: string, password: string                      ) => Awaitable<string>
}
export const PrismaAdapterWithCredentials = (prisma: PrismaClient): AdapterWithCredentials => {
    return {
        ...PrismaAdapter(prisma),
        
        validateCredentials        : async (credentials                         , options) => {
            // options:
            const {
                now                 = new Date(),
                failureMaxAttemps   = null,
                failureLockDuration = 0.25,
            } = options ?? {};
            
            
            
            // credentials:
            const {
                username : usernameOrEmailRaw,
                password,
            } = credentials;
            const usernameOrEmail = usernameOrEmailRaw.toLowerCase();
            
            
            
            // a database transaction for preventing multiple bulk login for bypassing failureMaxAttemps (forced to be a sequential operation):
            // an atomic transaction of [`find user's credentials by username (or email)`, `update the failuresAttemps & lockedAt`]:
            return prisma.$transaction(async (prismaTransaction): Promise<AdapterUser|Date|null> => {
                const userWithCredentials = await prismaTransaction.user.findFirst({
                    where  :
                        usernameOrEmail.includes('@') // if username contains '@' => treat as email, otherwise regular username
                        ? {
                            email        : usernameOrEmail,
                        }
                        : {
                            credentials  : {
                                username : usernameOrEmail,
                            },
                        },
                    include : {
                        credentials : {
                            select : {
                                id              : true, // required: for further updating failure_counter and/or lockedAt
                                failuresAttemps : true, // required: for inspecting the failureMaxAttemps   constraint
                                lockedAt        : true, // required: for inspecting the failureLockDuration constraint
                                password        : true, // required: for password hash comparison
                            },
                        },
                    },
                });
                if (!userWithCredentials) return null; // no user found with given username (or email) => return null (not found)
                
                
                
                // remove credentials property to increase security strength:
                const {
                    credentials : expectedCredentials,
                    ...restUser
                } = userWithCredentials;
                
                
                
                // verify whether the credentials does exist:
                if (!expectedCredentials) return null; // no credential was configured on the user's account => unable to compare => return null (assumes as password do not match)
                
                
                
                // verify whether the credentials is not locked out:
                {
                    const lockedAt = expectedCredentials.lockedAt ?? null;
                    if (lockedAt !== null) {
                        const lockedUntil = new Date(/* since: */ lockedAt.valueOf() + /* duration: */ (failureLockDuration * 60 * 60 * 1000 /* convert to milliseconds */));
                        if (lockedUntil > now) {
                            // still in locked period => return the released_out date:
                            return lockedUntil;
                        }
                        else {
                            // the locked period expires => unlock & reset the failure_counter:
                            await prismaTransaction.credentials.update({
                                where  : {
                                    id : expectedCredentials.id,
                                },
                                data   : {
                                    failuresAttemps : null, // clear the failure_counter
                                    lockedAt        : null, // clear the lock_date constraint
                                },
                            });
                            expectedCredentials.failuresAttemps = null; // reset this variable too
                        } // if
                    } // if
                }
                
                
                
                // perform password hash comparison:
                {
                    const isSuccess = !!password && !!expectedCredentials.password && await bcrypt.compare(password, expectedCredentials.password);
                    if (isSuccess) { // signIn attemp succeeded:
                        if (expectedCredentials.failuresAttemps !== null) {
                            // reset the failure_counter:
                            await prismaTransaction.credentials.update({
                                where  : {
                                    id : expectedCredentials.id,
                                },
                                data   : {
                                    failuresAttemps : null, // clear the failure_counter
                                },
                            });
                        } // if
                    }
                    else { // signIn attemp failed:
                        if (failureMaxAttemps) {
                            // increase the failure_counter and/or lockedAt:
                            const currentFailuresAttemps = (expectedCredentials.failuresAttemps ?? 0) + 1;
                            const isLocked               = (currentFailuresAttemps >= failureMaxAttemps);
                            await prismaTransaction.credentials.update({
                                where  : {
                                    id : expectedCredentials.id,
                                },
                                data   : {
                                    failuresAttemps : currentFailuresAttemps,
                                    lockedAt        : (
                                        !isLocked   // if under limit
                                        ? undefined // do not lock now, the user still have a/some chance(s) to retry
                                        : now       // lock now, too many retries
                                    ),
                                },
                            });
                            if (isLocked) return new Date(/* since: */ now.valueOf() + /* duration: */ (failureLockDuration * 60 * 60 * 1000 /* convert to milliseconds */)); // the credentials is has been locked
                        } // if
                    } // if
                    if (!isSuccess) return null; // password hash comparison do not match => return null (password do not match)
                }
                
                
                
                // the verification passed => authorized => return An `AdapterUser` object:
                return restUser;
            });
        },
        createResetPasswordToken   : async (usernameOrEmail                     , options) => {
            // options:
            const {
                now = new Date(),
                resetLimitInHours,
                emailResetMaxAge = 24,
            } = options ?? {};
            
            
            
            // normalizations:
            usernameOrEmail = usernameOrEmail.toLowerCase();
            
            
            
            // generate the resetPasswordToken data:
            const resetPasswordToken  = await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)();
            const resetPasswordMaxAge = emailResetMaxAge * 60 * 60 * 1000 /* convert to milliseconds */;
            const resetPasswordExpiry = new Date(now.valueOf() + resetPasswordMaxAge);
            
            
            
            // an atomic transaction of [`find user by username (or email)`, `find resetPasswordToken by user id`, `create/update the new resetPasswordToken`]:
            const user = await prisma.$transaction(async (prismaTransaction): Promise<AdapterUser|Date|null> => {
                // find user id by given username (or email):
                const {id: userId} = await prismaTransaction.user.findFirst({
                    where  :
                        usernameOrEmail.includes('@') // if username contains '@' => treat as email, otherwise regular username
                        ? {
                            email        : usernameOrEmail,
                        }
                        : {
                            credentials  : {
                                username : usernameOrEmail,
                            },
                        },
                    select : {
                        id               : true, // required: for id key
                    },
                }) ?? {};
                if (userId === undefined) return null;
                
                
                
                // limits the rate of resetPasswordToken request:
                if (resetLimitInHours) {
                    // find the last request date (if found) of resetPasswordToken by user id:
                    const {updatedAt: lastRequestDate} = await prismaTransaction.resetPasswordToken.findUnique({
                        where  : {
                            userId       : userId,
                        },
                        select : {
                            updatedAt    : true,
                        },
                    }) ?? {};
                    
                    // calculate how often the last request of resetPasswordToken:
                    if (!!lastRequestDate) {
                        const minInterval = resetLimitInHours * 60 * 60 * 1000 /* convert to milliseconds */;
                        if ((now.valueOf() - lastRequestDate.valueOf()) < minInterval) { // the request interval is shorter than minInterval  => reject the request
                            // the reset request is too frequent => reject:
                            return new Date(lastRequestDate.valueOf() + minInterval);
                        } // if
                    } // if
                } // if
                
                
                
                // create/update the resetPasswordToken record and get the related user name & email:
                const {user} = await prismaTransaction.resetPasswordToken.upsert({
                    where  : {
                        userId        : userId,
                    },
                    create : {
                        userId        : userId,
                        
                        expiresAt     : resetPasswordExpiry,
                        token         : resetPasswordToken,
                    },
                    update : {
                        expiresAt     : resetPasswordExpiry,
                        token         : resetPasswordToken,
                    },
                    select : {
                        user : true,
                    },
                });
                return user;
            });
            if (!user || (user instanceof Date)) return user;
            return {
                resetPasswordToken,
                user,
            };
        },
        validateResetPasswordToken : async (resetPasswordToken                  , options) => {
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            const user = await prisma.user.findFirst({
                where  : {
                    resetPasswordToken : {
                        token        : resetPasswordToken,
                        expiresAt : {
                            gt       : now,
                        },
                    },
                },
                select : {
                    email            : true,
                    credentials : {
                        select : {
                            username : true,
                        },
                    },
                },
            });
            if (!user) return null;
            return {
                email    : user.email,
                username : user.credentials?.username || null,
            };
        },
        applyResetPasswordToken    : async (resetPasswordToken, password: string, options) => {
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            // generate the hashed password:
            const hashedPassword = await bcrypt.hash(password, 10);
            
            
            
            // an atomic transaction of [`find user id by resetPasswordToken`, `delete current resetPasswordToken record`, `create/update user's credentials`]:
            return prisma.$transaction(async (prismaTransaction): Promise<boolean> => {
                // find the related user id by given resetPasswordToken:
                const {id: userId} = await prismaTransaction.user.findFirst({
                    where  : {
                        resetPasswordToken : {
                            token        : resetPasswordToken,
                            expiresAt : {
                                gt       : now,
                            },
                        },
                    },
                    select : {
                        id               : true, // required: for id key
                    },
                }) ?? {};
                if (userId === undefined) {
                    // report the error:
                    return false;
                } // if
                
                
                
                // delete the current resetPasswordToken record so it cannot be re-use again:
                await prismaTransaction.resetPasswordToken.delete({
                    where  : {
                        userId : userId,
                    },
                    select : {
                        id     : true,
                    },
                });
                
                
                
                // create/update user's credentials:
                await prismaTransaction.credentials.upsert({
                    where  : {
                        userId   : userId,
                    },
                    create : {
                        userId   : userId,
                        password : hashedPassword,
                    },
                    update : {
                        password : hashedPassword,
                    },
                    select : {
                        id       : true,
                    },
                });
                
                
                
                // report the success:
                return true;
            });
        },
        
        getRoleByUserId            : async (userId                                       ) => {
            if (!('role' in prisma)) return null;
            
            const user = await prisma.user.findUnique({
                where  : {
                    id : userId,
                },
                select : {
                    // @ts-ignore
                    role : true,
                },
            });
            // @ts-ignore
            return user?.role ?? null;
        },
        getRoleByUserEmail         : async (userEmail                                    ) => {
            // conditions:
            if (!('role' in prisma)) return null;
            
            
            
            // normalizations:
            userEmail = userEmail.toLowerCase();
            
            
            
            // database query:
            const user = await prisma.user.findUnique({
                where  : {
                    email : userEmail,
                },
                select : {
                    // @ts-ignore
                    role : true,
                },
            });
            // @ts-ignore
            return user?.role ?? null;
        },
        
        checkUsernameAvailability  : async (username                                     ) => {
            // normalizations:
            username = username.toLowerCase();
            
            
            
            // database query:
            return !(await prisma.credentials.findUnique({
                where  : {
                    username : username,
                },
                select : {
                    id : true,
                },
            }));
        },
        checkEmailAvailability     : async (email                                        ) => {
            // normalizations:
            email = email.toLowerCase();
            
            
            
            // database query:
            return !(await prisma.user.findUnique({
                where  : {
                    email : email,
                },
                select : {
                    id : true,
                },
            }));
        },
        
        registerUser               : async (fullname, email, username, password          ) => {
            // normalizations:
            username = username.toLowerCase();
            email = email.toLowerCase();
            
            
            
            // database query:
            // generate the hashed password:
            const hashedPassword = await bcrypt.hash(password, 10);
            
            
            
            const data = {
                name          : fullname,
                email         : email,
                emailVerified : null,
                credentials   : {
                    create    : {
                        failuresAttemps : null,
                        lockedAt        : null,
                        
                        username        : username,
                        password        : hashedPassword,
                    },
                },
            };
            const user = await prisma.user.upsert({
                where  : {
                    email         : email,
                    emailVerified : null,
                },
                create : data,
                update : data,
                select : {
                    id : true,
                },
            });
            return user.id;
        },
    };
};
