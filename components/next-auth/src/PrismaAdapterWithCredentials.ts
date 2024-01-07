// next-auth:
import type {
    // types:
    Awaitable,
}                           from 'next-auth'
import type {
    Adapter,
    AdapterAccount,
}                           from '@auth/core/adapters.js'

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
export type Credentials = Record<'username'|'password', string>
export interface CreateResetPasswordTokenData {
    resetPasswordToken : string
    user               : AdapterUser
}
export interface ValidateResetPasswordTokenData {
    email    : string
    username : string|null
}
export interface RegisterUserData {
    userId                 : string
    emailConfirmationToken : string|null
}


// options:
export interface ValidateCredentialsOptions {
    now                  ?: Date
    requireEmailVerified ?: boolean
    failureMaxAttemps    ?: number|null
    failureLockDuration  ?: number
}
export interface CreateResetPasswordTokenOptions {
    now                  ?: Date
    resetLimitInHours    ?: number
    emailResetMaxAge     ?: number
}
export interface ValidateResetPasswordTokenOptions {
    now                  ?: Date
}
export interface ApplyResetPasswordTokenOptions {
    now                  ?: Date
}
export interface RegisterUserOptions {
    requireEmailVerified ?: boolean
}
export interface MarkUserEmailAsVerifiedOptions {
    now                  ?: Date
}
export interface ApplyEmailConfirmationTokenOptions {
    now                  ?: Date
}



export interface ModelOptions<TPrisma extends PrismaClient> {
    account                ?: keyof TPrisma
    session                ?: keyof TPrisma
    user                   ?: keyof TPrisma
    credentials            ?: keyof TPrisma
    resetPasswordToken     ?: keyof TPrisma | null
    emailConfirmationToken ?: keyof TPrisma | null
    role                   ?: keyof TPrisma | null
}
export interface AdapterWithCredentials
    extends
        Adapter
{
    // sign in:
    validateCredentials          : (credentials            : Credentials                               , options?: ValidateCredentialsOptions        ) => Awaitable<AdapterUser|false|Date|null>
    
    
    
    // reset password:
    createResetPasswordToken     : (usernameOrEmail        : string                                    , options?: CreateResetPasswordTokenOptions   ) => Awaitable<CreateResetPasswordTokenData|Date|null>
    validateResetPasswordToken   : (resetPasswordToken     : string                                    , options?: ValidateResetPasswordTokenOptions ) => Awaitable<ValidateResetPasswordTokenData|null>
    applyResetPasswordToken      : (resetPasswordToken     : string, password: string                  , options?: ApplyResetPasswordTokenOptions    ) => Awaitable<boolean>
    
    
    
    // user roles:
    getRoleByUserId              : (userId                 : string                                                                                  ) => Awaitable<AdapterRole|null>
    getRoleByUserEmail           : (userEmail              : string                                                                                  ) => Awaitable<AdapterRole|null>
    
    
    
    // registrations:
    checkUsernameAvailability    : (username               : string                                                                                  ) => Awaitable<boolean>
    checkEmailAvailability       : (email                  : string                                                                                  ) => Awaitable<boolean>
    registerUser                 : (name: string   , email : string, username: string, password: string, options?: RegisterUserOptions               ) => Awaitable<RegisterUserData>
    
    
    
    // email verification:
    markUserEmailAsVerified      : (userId                 : string                                    , options?: MarkUserEmailAsVerifiedOptions    ) => Awaitable<void>
    applyEmailConfirmationToken  : (emailConfirmationToken : string                                    , options?: ApplyEmailConfirmationTokenOptions) => Awaitable<boolean>
}
export const PrismaAdapterWithCredentials = <TPrisma extends PrismaClient>(prisma: TPrisma, options?: ModelOptions<TPrisma>): AdapterWithCredentials => {
    // options:
    const {
        account                 : mAccount                = 'account',
        session                 : mSession                = 'session',
        user                    : mUser                   = 'user',
        credentials             : mCredentials            = 'credentials',
        resetPasswordToken      : mResetPasswordToken     = 'resetPasswordToken',
        emailConfirmationToken  : mEmailConfirmationToken = 'emailConfirmationToken',
        role                    : mRole                   = 'role',
    } = options ?? {};
    
    
    
    return {
        // CRUD users:
        createUser                   : async (userData         ) => {
            const {
                name,
            ...restUserData} = userData;
            if (!name) throw Error('`name` is required.');
            
            
            
            return prisma.user.create({
                data  : {
                    ...restUserData,
                    name,
                },
            });
        },
        
        getUser                      : async (userId           ) => {
            return prisma.user.findUnique({
                where  : {
                    id : userId,
                },
            });
        },
        getUserByEmail               : async (userEmail        ) => {
            return prisma.user.findUnique({
                where  : {
                    email : userEmail,
                },
            });
        },
        getUserByAccount             : async (userAccount      ) => {
            const {
                provider,
                providerAccountId,
            } = userAccount;
            
            
            
            const account = await prisma.account.findFirst({
                where  : {
                    provider,
                    providerAccountId,
                },
                select : {
                    user : true,
                },
            });
            return account?.user ?? null;
        },
        
        updateUser                   : async (userData         ) => {
            const {
                id,
                name,
            ...restUserData} = userData;
            if ((name !== undefined) && !name) throw Error('`name` is required.');
            
            
            
            return prisma.user.update({
                where : {
                    id,
                },
                data  : {
                    ...restUserData,
                    name,
                },
            });
        },
        deleteUser                   : async (userId           ) => {
            return prisma.user.delete({
                where  : {
                    id : userId,
                },
            });
        },
        
        
        
        // CRUD sessions:
        createSession                : async (sessionData      ) => {
            return prisma.session.create({
                data  : sessionData,
            });
        },
        getSessionAndUser            : async (sessionToken     ) => {
            const sessionAndUser = await prisma.session.findUnique({
                where   : {
                    sessionToken,
                },
                include : {
                    user : true,
                },
            });
            if (!sessionAndUser) return null;
            
            
            
            const {
                user,
            ...session} = sessionAndUser;
            return {
                user,
                session,
            };
        },
        updateSession                : async (sessionData      ) => {
            return prisma.session.update({
                where  : {
                    sessionToken: sessionData.sessionToken,
                },
                data   : sessionData,
            });
        },
        deleteSession                : async (sessionToken     ) => {
            return prisma.session.delete({
                where  : {
                    sessionToken,
                },
            });
        },
        
        
        
        // CRUD accounts:
        linkAccount                  : async (accountData      ) => {
            const account = await prisma.account.create({
                data  : accountData,
            });
            return account as AdapterAccount;
        },
        unlinkAccount                : async (userAccount      ) => {
            const {
                provider,
                providerAccountId,
            } = userAccount;
            
            
            
            const deletedAccount = await prisma.$transaction(async (prismaTransaction) => {
                const account = await prismaTransaction.account.findFirst({
                    where  : {
                        provider,
                        providerAccountId,
                    },
                    select : {
                        id : true,
                    },
                });
                if (!account) return undefined;
                return await prismaTransaction.account.delete({
                    where  : {
                        id : account?.id,
                    },
                });
            });
            return deletedAccount as AdapterAccount;
        },
        
        
        
        // token verifications:
        createVerificationToken      : undefined,
        useVerificationToken         : undefined,
        
        
        
        // --------------------------------------------------------------------------------------
        
        
        
        // sign in:
        validateCredentials          : async (credentials                         , options) => {
            // options:
            const {
                now                  = new Date(),
                requireEmailVerified = true,
                failureMaxAttemps    = null,
                failureLockDuration  = 0.25,
            } = options ?? {};
            
            
            
            // credentials:
            const {
                username : usernameOrEmailRaw,
                password,
            } = credentials;
            
            
            
            // normalizations:
            const usernameOrEmail = usernameOrEmailRaw.toLowerCase();
            
            
            
            // a database transaction for preventing multiple bulk login for bypassing failureMaxAttemps (forced to be a sequential operation):
            // an atomic transaction of [`find user's credentials by username (or email)`, `update the failuresAttemps & lockedAt`]:
            return prisma.$transaction(async (prismaTransaction): Promise<AdapterUser|false|Date|null> => { // AdapterUser: succeeded; false: email is not verified; Date: account locked up; null: invalid username and/or password
                // find user data + credentials by given username (or email):
                const userWithCredentials = await ((prismaTransaction as TPrisma)[mUser] as any).findFirst({
                    where   : (
                        usernameOrEmail.includes('@') // if username contains '@' => treat as email, otherwise regular username
                        ? {
                            email        : usernameOrEmail,
                        }
                        : {
                            [mCredentials] : {
                                username : usernameOrEmail,
                            },
                        }
                    ),
                    
                    // all User's columns plus credentials:
                    include : {
                        [mCredentials] : {
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
                
                
                
                // exclude credentials property to increase security strength:
                const {
                    [mCredentials] : expectedCredentials,
                ...restUser} = userWithCredentials;
                
                
                
                // check if user's email was verified:
                if (requireEmailVerified) {
                    if (restUser.emailVerified === null) return false;
                } // if
                
                
                
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
                            // the locked period expired => unlock & reset the failure_counter:
                            await ((prismaTransaction as TPrisma)[mCredentials] as any).update({
                                where  : {
                                    id : expectedCredentials.id,
                                },
                                data   : {
                                    failuresAttemps : null, // reset the failure_counter
                                    lockedAt        : null, // reset the lock_date constraint
                                },
                                select : {
                                    id : true,
                                },
                            });
                            expectedCredentials.failuresAttemps = null; // reset this variable too
                            expectedCredentials.lockedAt        = null; // reset this variable too
                        } // if
                    } // if
                }
                
                
                
                // perform password hash comparison:
                {
                    const isSuccess = !!password && !!expectedCredentials.password && await bcrypt.compare(password, expectedCredentials.password);
                    if (isSuccess) { // signIn attemp succeeded:
                        if (expectedCredentials.failuresAttemps !== null) { // there are some failure attemps => reset
                            // reset the failure_counter:
                            await ((prismaTransaction as TPrisma)[mCredentials] as any).update({
                                where  : {
                                    id : expectedCredentials.id,
                                },
                                data   : {
                                    failuresAttemps : null, // reset the failure_counter
                                },
                                select : {
                                    id : true,
                                },
                            });
                        } // if
                    }
                    else { // signIn attemp failed:
                        if (failureMaxAttemps) { // there are a limit of failure signIn attemps
                            // increase the failure_counter and/or lockedAt:
                            const currentFailuresAttemps : number  = (expectedCredentials.failuresAttemps ?? 0) + 1;
                            const isLocked               : boolean = (currentFailuresAttemps >= failureMaxAttemps);
                            await ((prismaTransaction as TPrisma)[mCredentials] as any).update({
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
                                select : {
                                    id : true,
                                },
                            });
                            
                            
                            
                            if (isLocked) return new Date(/* since: */ now.valueOf() + /* duration: */ (failureLockDuration * 60 * 60 * 1000 /* convert to milliseconds */)); // the credentials has been locked
                        } // if
                    } // if
                    
                    
                    
                    if (!isSuccess) return null; // password hash comparison do not match => return null (password do not match)
                }
                
                
                
                // the verification passed => authorized => return An `AdapterUser` object:
                return restUser;
            });
        },
        
        
        
        // reset password:
        createResetPasswordToken     : async (usernameOrEmail                     , options) => {
            // conditions:
            const hasResetPasswordToken = !!mResetPasswordToken && (mResetPasswordToken in prisma);
            if (!hasResetPasswordToken) return null;
            
            
            
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
            const user = await prisma.$transaction(async (prismaTransaction): Promise<AdapterUser|Date|null> => { // AdapterUser: succeeded; Date: reset request is too frequent; null: invalid username or email
                // find user id by given username (or email):
                const {id: userId} = await ((prismaTransaction as TPrisma)[mUser] as any).findFirst({
                    where   : (
                        usernameOrEmail.includes('@') // if username contains '@' => treat as email, otherwise regular username
                        ? {
                            email        : usernameOrEmail,
                        }
                        : {
                            [mCredentials] : {
                                username : usernameOrEmail,
                            },
                        }
                    ),
                    
                    select : {
                        id               : true, // required: for id key
                    },
                }) ?? {};
                if (userId === undefined) return null;
                
                
                
                // limits the rate of resetPasswordToken request:
                if (resetLimitInHours) { // there are a limit of resetPasswordToken request
                    // find the last request date (if found) of resetPasswordToken by user id:
                    const {updatedAt: lastRequestDate} = await ((prismaTransaction as TPrisma)[mResetPasswordToken] as any).findUnique({
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
                const {user} = await ((prismaTransaction as TPrisma)[mResetPasswordToken] as any).upsert({
                    where  : {
                        userId       : userId,
                    },
                    create : {
                        userId       : userId,
                        
                        expiresAt    : resetPasswordExpiry,
                        token        : resetPasswordToken,
                    },
                    update : {
                        expiresAt    : resetPasswordExpiry,
                        token        : resetPasswordToken,
                    },
                    select : {
                        [mUser]      : true,
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
        validateResetPasswordToken   : async (resetPasswordToken                  , options) => {
            // conditions:
            const hasResetPasswordToken = !!mResetPasswordToken && (mResetPasswordToken in prisma);
            if (!hasResetPasswordToken) return null;
            
            
            
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            const user = await (prisma[mUser] as any).findFirst({
                where  : {
                    [mResetPasswordToken] : {
                        token        : resetPasswordToken,
                        expiresAt : {
                            gt       : now, // not expired yet (expires in the future)
                        },
                    },
                },
                select : {
                    email            : true,
                    [mCredentials] : {
                        select : {
                            username : true,
                        },
                    },
                },
            });
            if (!user) return null;
            return {
                email    : user.email,
                username : user[mCredentials]?.username || null,
            };
        },
        applyResetPasswordToken      : async (resetPasswordToken, password: string, options) => {
            // conditions:
            const hasResetPasswordToken = !!mResetPasswordToken && (mResetPasswordToken in prisma);
            if (!hasResetPasswordToken) return false;
            
            
            
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            // generate the hashed password:
            const hashedPassword = await bcrypt.hash(password, 10);
            
            
            
            // an atomic transaction of [`find user id by resetPasswordToken`, `delete current resetPasswordToken record`, `create/update user's credentials`]:
            return prisma.$transaction(async (prismaTransaction): Promise<boolean> => {
                // find the related user id by given resetPasswordToken:
                const user = await ((prismaTransaction as TPrisma)[mUser] as any).findFirst({
                    where  : {
                        [mResetPasswordToken] : {
                            token        : resetPasswordToken,
                            expiresAt : {
                                gt       : now, // not expired yet (expires in the future)
                            },
                        },
                    },
                    select : {
                        id               : true, // required: for id key
                        emailVerified    : true, // required: for marking user's email has verified
                    },
                });
                if (!user) { // there is no user with related resetPasswordToken
                    // report the error:
                    return false;
                } // if
                const {
                    id: userId,
                    emailVerified,
                } = user;
                
                
                
                // delete the current resetPasswordToken record so it cannot be re-use again:
                await ((prismaTransaction as TPrisma)[mResetPasswordToken] as any).delete({
                    where  : {
                        userId : userId,
                    },
                    select : {
                        id     : true,
                    },
                });
                
                
                
                // create/update user's credentials:
                await ((prismaTransaction as TPrisma)[mCredentials] as any).upsert({
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
                
                
                
                // resetting password is also intrinsically verifies the email:
                if (emailVerified === null) {
                    await ((prismaTransaction as TPrisma)[mUser] as any).update({
                        where  : {
                            id            : userId,
                        },
                        data   : {
                            emailVerified : now,
                        },
                        select : {
                            id            : true,
                        },
                    });
                } // if
                
                
                
                // report the success:
                return true;
            });
        },
        
        
        
        // user roles:
        getRoleByUserId              : async (userId                                       ) => {
            // conditions:
            const hasRole = !!mRole && (mRole in prisma);
            if (!hasRole) return null;
            
            
            
            // database query:
            const user = await (prisma[mUser] as any).findUnique({
                where  : {
                    id : userId,
                },
                select : {
                    [mRole] : true,
                },
            });
            return user?.[mRole] ?? null;
        },
        getRoleByUserEmail           : async (userEmail                                    ) => {
            // conditions:
            const hasRole = !!mRole && (mRole in prisma);
            if (!hasRole) return null;
            
            
            
            // normalizations:
            userEmail = userEmail.toLowerCase();
            
            
            
            // database query:
            const user = await (prisma[mUser] as any).findUnique({
                where  : {
                    email : userEmail,
                },
                select : {
                    [mRole] : true,
                },
            });
            return user?.[mRole] ?? null;
        },
        
        
        
        // registrations:
        checkUsernameAvailability    : async (username                                     ) => {
            // normalizations:
            username = username.toLowerCase();
            
            
            
            // database query:
            return !(await (prisma[mCredentials] as any).findUnique({
                where  : {
                    username : username,
                },
                select : {
                    id : true,
                },
            }));
        },
        checkEmailAvailability       : async (email                                        ) => {
            // normalizations:
            email = email.toLowerCase();
            
            
            
            // database query:
            return !(await (prisma[mUser] as any).findUnique({
                where  : {
                    email : email,
                },
                select : {
                    id : true,
                },
            }));
        },
        registerUser                 : async (name, email, username, password     , options) => {
            // options:
            const {
                requireEmailVerified = false,
            } = options ?? {};
            
            
            
            // normalizations:
            email    = email.toLowerCase();
            username = username.toLowerCase();
            
            
            
            // generate the hashed password:
            const hashedPassword = await bcrypt.hash(password, 10);
            
            
            
            // generate the emailConfirmationToken data:
            const hasEmailConfirmationToken = !!mEmailConfirmationToken && (mEmailConfirmationToken in prisma);
            const emailConfirmationToken : string|null = (requireEmailVerified && hasEmailConfirmationToken) ? await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)() : null;
            
            
            
            // an atomic transaction of [`create/update User`, `create/update Credentials`, `create/update EmailConfirmationToken`]:
            return prisma.$transaction(async (prismaTransaction): Promise<RegisterUserData> => {
                // create/update User:
                const userData = {
                    name          : name,
                    email         : email,
                    
                    emailVerified : null,  // reset
                };
                const { id: userId } = await ((prismaTransaction as TPrisma)[mUser] as any).upsert({
                    where  : {
                        email         : email,
                        emailVerified : null,
                    },
                    create : userData,
                    update : userData,
                    select : {
                        id : true,
                    },
                });
                
                
                
                // create/update Credentials:
                const credentialsData = {
                    failuresAttemps : null, // reset
                    lockedAt        : null, // reset
                    
                    username        : username,
                    password        : hashedPassword,
                };
                await ((prismaTransaction as TPrisma)[mCredentials] as any).upsert({
                    where  : {
                        userId   : userId,
                    },
                    create : {
                        userId   : userId,
                        
                        ...credentialsData,
                    },
                    update : {
                        ...credentialsData,
                    },
                    select : {
                        id       : true,
                    },
                });
                
                
                
                // create/update EmailConfirmationToken:
                if (hasEmailConfirmationToken && emailConfirmationToken) {
                    await ((prismaTransaction as TPrisma)[mEmailConfirmationToken] as any).upsert({
                        where  : {
                            userId   : userId,
                        },
                        create : {
                            userId   : userId,
                            
                            token    : emailConfirmationToken,
                        },
                        update : {
                            token    : emailConfirmationToken,
                        },
                        select : {
                            id       : true,
                        },
                    });
                } // if
                
                
                
                return {
                    userId,
                    emailConfirmationToken,
                };
            });
        },
        
        
        
        // email verification:
        markUserEmailAsVerified      : async (userId                              , options) => {
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            await (prisma[mUser] as any).update({
                where  : {
                    id            : userId,
                },
                data   : {
                    emailVerified : now,
                },
                select : {
                    id            : true,
                },
            });
        },
        applyEmailConfirmationToken  : async (emailConfirmationToken              , options) => {
            // conditions:
            const hasEmailConfirmationToken = !!mEmailConfirmationToken && (mEmailConfirmationToken in prisma);
            if (!hasEmailConfirmationToken) return false;
            
            
            
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            // an atomic transaction of [`find user id by emailConfirmationToken`, `delete current emailConfirmationToken record`, `update user's emailVerified field`]:
            return prisma.$transaction(async (prismaTransaction): Promise<boolean> => {
                // find the related user id by given emailConfirmationToken:
                const user = await ((prismaTransaction as TPrisma)[mUser] as any).findFirst({
                    where  : {
                        [mEmailConfirmationToken] : {
                            token        : emailConfirmationToken,
                        },
                    },
                    select : {
                        id               : true, // required: for id key
                        emailVerified    : true, // required: for marking user's email has verified
                    },
                });
                if (!user) { // there is no user with related emailConfirmationToken
                    // report the error:
                    return false;
                } // if
                const {
                    id: userId,
                    emailVerified,
                } = user;
                
                
                
                // delete the current emailConfirmationToken record so it cannot be re-use again:
                await ((prismaTransaction as TPrisma)[mEmailConfirmationToken] as any).delete({
                    where  : {
                        userId : userId,
                    },
                    select : {
                        id     : true,
                    },
                });
                
                
                
                // update user's emailVerified field (if not already verified):
                if (emailVerified === null) {
                    await ((prismaTransaction as TPrisma)[mUser] as any).update({
                        where  : {
                            id            : userId,
                        },
                        data   : {
                            emailVerified : now,
                        },
                        select : {
                            id            : true,
                        },
                    });
                } // if
                
                
                
                // report the success:
                return true;
            });
        },
    };
};
