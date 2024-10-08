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
    // types:
    Awaitable,
    
    
    
    // models:
    Adapter,
    AdapterUser,
    AdapterSession,
    AdapterAccount,
    AdapterCredentials,
    AdapterRole,
}                           from './types.js'



// types:
export type CredentialsSignIn = Record<'username'|'password', string>
export interface CreatePasswordResetTokenData {
    passwordResetToken : string
    user               : AdapterUser
}
export interface ValidatePasswordResetTokenData {
    email    : string
    username : string|null
}
export interface RegisterUserData {
    userId                 : string
    emailConfirmationToken : string|null
}



// options:
export interface CredentialsSignInOptions {
    now                  ?: Date
    requireEmailVerified ?: boolean
    failureMaxAttempts   ?: number|null
    failureLockDuration  ?: number
}
export interface CreatePasswordResetTokenOptions {
    now                  ?: Date
    resetThrottle        ?: number
    resetMaxAge          ?: number
}
export interface ValidatePasswordResetTokenOptions {
    now                  ?: Date
}
export interface UsePasswordResetTokenOptions {
    now                  ?: Date
}
export interface RegisterUserOptions {
    requireEmailVerified ?: boolean
}
export interface MarkEmailAsVerifiedOptions {
    now                  ?: Date
}
export interface UseEmailConfirmationTokenOptions {
    now                  ?: Date
}



export interface ModelOptions<TPrisma extends PrismaClient> {
    modelUser                            ?: Extract<keyof TPrisma, string>
    modelRole                            ?: Extract<keyof TPrisma, string> | null
    modelAccount                         ?: Extract<keyof TPrisma, string>
    modelSession                         ?: Extract<keyof TPrisma, string>
    modelCredentials                     ?: Extract<keyof TPrisma, string>
    modelPasswordResetToken              ?: Extract<keyof TPrisma, string> | null
    modelEmailConfirmationToken          ?: Extract<keyof TPrisma, string> | null
    
    modelUserRefRoleId                   ?: string | null
    modelAccountRefUserId                ?: string
    modelSessionRefUserId                ?: string
    modelCredentialsRefUserId            ?: string
    modelPasswordResetTokenRefUserId     ?: string | null
    modelEmailConfirmationTokenRefUserId ?: string | null
}
export interface AdapterWithCredentials
    extends
        Adapter
{
    // sign in:
    credentialsSignIn          : (credentials            : CredentialsSignIn                         , options?: CredentialsSignInOptions         ) => Awaitable<AdapterUser|false|Date|null>
    
    
    
    // password resets:
    createPasswordResetToken   : (usernameOrEmail        : string                                    , options?: CreatePasswordResetTokenOptions  ) => Awaitable<CreatePasswordResetTokenData|Date|null>
    validatePasswordResetToken : (passwordResetToken     : string                                    , options?: ValidatePasswordResetTokenOptions) => Awaitable<ValidatePasswordResetTokenData|null>
    usePasswordResetToken      : (passwordResetToken     : string, password: string                  , options?: UsePasswordResetTokenOptions     ) => Awaitable<boolean>
    
    
    
    // registrations:
    checkUsernameAvailability  : (username               : string                                                                                 ) => Awaitable<boolean>
    checkEmailAvailability     : (email                  : string                                                                                 ) => Awaitable<boolean>
    registerUser               : (name: string   , email : string, username: string, password: string, options?: RegisterUserOptions              ) => Awaitable<RegisterUserData>
    
    
    
    // email verifications:
    markEmailAsVerified        : (userId                 : string                                    , options?: MarkEmailAsVerifiedOptions       ) => Awaitable<void>
    useEmailConfirmationToken  : (emailConfirmationToken : string                                    , options?: UseEmailConfirmationTokenOptions ) => Awaitable<boolean>
    
    
    
    // user credentials:
    getCredentialsByUserId     : (userId                 : string                                                                                 ) => Awaitable<AdapterCredentials|null>
    getCredentialsByUserEmail  : (userEmail              : string                                                                                 ) => Awaitable<AdapterCredentials|null>
    
    
    
    // user roles:
    getRoleByUserId            : (userId                 : string                                                                                 ) => Awaitable<AdapterRole|null>
    getRoleByUserEmail         : (userEmail              : string                                                                                 ) => Awaitable<AdapterRole|null>
}
export const PrismaAdapterWithCredentials = <TPrisma extends PrismaClient>(prisma: TPrisma, options?: ModelOptions<TPrisma>): AdapterWithCredentials => {
    // options:
    options ??= {};
    
    const {
        modelUser                            = 'user',
        modelRole                            = 'role',
        modelAccount                         = 'account',
        modelSession                         = 'session',
        modelCredentials                     = 'credentials',
        modelPasswordResetToken              = 'passwordResetToken',
        modelEmailConfirmationToken          = 'emailConfirmationToken',
    } = options;
    
    const {
        modelUserRefRoleId                   = `${modelRole}Id`,
        modelAccountRefUserId                = `${modelUser}Id`,
        modelSessionRefUserId                = `${modelUser}Id`,
        modelCredentialsRefUserId            = `${modelUser}Id`,
        modelPasswordResetTokenRefUserId     = `${modelUser}Id`,
        modelEmailConfirmationTokenRefUserId = `${modelUser}Id`,
    } = options;
    
    
    
    return {
        // CRUD users:
        createUser                 : async (userData         ) => {
            const {
                name,
            ...restUserData} = userData;
            if (!name) throw Error('`name` is required.');
            
            
            
            return (prisma[modelUser] as any).create({
                data  : {
                    ...restUserData,
                    name,
                },
            });
        },
        
        getUser                    : async (userId           ) => {
            return (prisma[modelUser] as any).findUnique({
                where  : {
                    id : userId,
                },
            });
        },
        getUserByEmail             : async (userEmail        ) => {
            return (prisma[modelUser] as any).findUnique({
                where  : {
                    email : userEmail,
                },
            });
        },
        getUserByAccount           : async (userAccount      ) => {
            const {
                provider,
                providerAccountId,
            } = userAccount;
            
            
            
            return prisma.$transaction(async (prismaTransaction): Promise<AdapterUser|null> => {
                const account = await ((prismaTransaction as TPrisma)[modelAccount] as any).findFirst({
                    where  : {
                        provider,
                        providerAccountId,
                    },
                    select : {
                        [modelAccountRefUserId] : true,
                    },
                });
                if (!account) return null;
                
                
                
                return ((prismaTransaction as TPrisma)[modelUser] as any).findUnique({
                    where  : {
                        id : account[modelAccountRefUserId],
                    },
                });
            });
        },
        
        updateUser                 : async (userData         ) => {
            const {
                id,
                name,
            ...restUserData} = userData;
            if ((name !== undefined) && !name) throw Error('`name` is required.');
            
            
            
            return (prisma[modelUser] as any).update({
                where : {
                    id,
                },
                data  : {
                    ...restUserData,
                    name,
                },
            });
        },
        deleteUser                 : async (userId           ) => {
            return (prisma[modelUser] as any).delete({
                where  : {
                    id : userId,
                },
            });
        },
        
        
        
        // CRUD sessions:
        createSession              : async (sessionData      ) => {
            const {
                userId : userId,
            ...restSessionData} = sessionData;
            
            
            
            return (prisma[modelSession] as any).create({
                data  : {
                    ...restSessionData,
                    [modelSessionRefUserId] : userId,
                },
            });
        },
        getSessionAndUser          : async (sessionToken     ) => {
            return prisma.$transaction(async (prismaTransaction): Promise<{session: AdapterSession, user: AdapterUser}|null> => {
                const session = await ((prismaTransaction as TPrisma)[modelSession] as any).findUnique({
                    where   : {
                        sessionToken,
                    },
                });
                if (!session) return null;
                
                
                
                const user = await ((prismaTransaction as TPrisma)[modelUser] as any).findUnique({
                    where  : {
                        id : session[modelSessionRefUserId],
                    },
                });
                if (!user) return null;
                
                
                
                return {
                    session,
                    user,
                };
            });
        },
        updateSession              : async (sessionData      ) => {
            const {
                userId : userId,
            ...restSessionData} = sessionData;
            
            
            
            return (prisma[modelSession] as any).update({
                where  : {
                    sessionToken : restSessionData.sessionToken,
                },
                data   : {
                    ...restSessionData,
                    [modelSessionRefUserId] : userId,
                },
            });
        },
        deleteSession              : async (sessionToken     ) => {
            return (prisma[modelSession] as any).delete({
                where  : {
                    sessionToken,
                },
            });
        },
        
        
        
        // CRUD accounts:
        linkAccount                : async (accountData      ) => {
            const {
                userId : userId,
            ...restAccountData} = accountData;
            
            
            
            const account = await (prisma[modelAccount] as any).create({
                data  : {
                    ...restAccountData,
                    [modelAccountRefUserId] : userId,
                },
            });
            return account as AdapterAccount;
        },
        unlinkAccount              : async (userAccount      ) => {
            const {
                provider,
                providerAccountId,
            } = userAccount;
            
            
            
            const deletedAccount = await prisma.$transaction(async (prismaTransaction) => {
                const account = await ((prismaTransaction as TPrisma)[modelAccount] as any).findFirst({
                    where  : {
                        provider,
                        providerAccountId,
                    },
                    select : {
                        id : true,
                    },
                });
                if (!account) return undefined;
                return await ((prismaTransaction as TPrisma)[modelAccount] as any).delete({
                    where  : {
                        id : account?.id,
                    },
                });
            });
            return deletedAccount as AdapterAccount;
        },
        
        
        
        // token verifications:
        createVerificationToken    : undefined,
        useVerificationToken       : undefined,
        
        
        
        // --------------------------------------------------------------------------------------
        
        
        
        // sign in:
        credentialsSignIn          : async (credentials                         , options) => {
            // options:
            const {
                now                  = new Date(),
                requireEmailVerified = true,
                failureMaxAttempts   = null,
                failureLockDuration  = 0.25,
            } = options ?? {};
            
            
            
            // credentials:
            const {
                username : usernameOrEmailRaw,
                password,
            } = credentials;
            
            
            
            // normalizations:
            const usernameOrEmail = usernameOrEmailRaw.toLowerCase();
            
            
            
            // a database transaction for preventing multiple bulk login for bypassing failureMaxAttempts (forced to be a sequential operation):
            // an atomic transaction of [`find user's credentials by username (or email)`, `update the failureAttempts & lockedAt`]:
            return prisma.$transaction(async (prismaTransaction): Promise<AdapterUser|false|Date|null> => { // AdapterUser: succeeded; false: email is not verified; Date: account locked up; null: invalid username and/or password
                // find user data + credentials by given username (or email):
                const userWithCredentials = (
                    usernameOrEmail.includes('@') // if username contains '@' => treat as email, otherwise regular username
                    ? await (async () => {
                        // first: find the user:
                        const user = await ((prismaTransaction as TPrisma)[modelUser] as any).findUnique({
                            where   : {
                                email    : usernameOrEmail,
                            },
                        });
                        if (!user) return null;
                        
                        // then: find the related credentials:
                        const credentials = await ((prismaTransaction as TPrisma)[modelCredentials] as any).findUnique({
                            where   : {
                                [modelCredentialsRefUserId] : user.id,
                            },
                            select  : {
                                id                          : true, // required: for further updating failure_counter and/or lockedAt
                                failureAttempts             : true, // required: for inspecting the failureMaxAttempts  constraint
                                lockedAt                    : true, // required: for inspecting the failureLockDuration constraint
                                password                    : true, // required: for password hash comparison
                            },
                        });
                        
                        // then: combine them:
                        return {
                            user,
                            credentials,
                        };
                    })()
                    : await (async () => {
                        // first: find the credentials:
                        const credentials = await ((prismaTransaction as TPrisma)[modelCredentials] as any).findUnique({
                            where   : {
                                username : usernameOrEmail,
                            },
                            select  : {
                                id                          : true, // required: for further updating failure_counter and/or lockedAt
                                failureAttempts             : true, // required: for inspecting the failureMaxAttempts  constraint
                                lockedAt                    : true, // required: for inspecting the failureLockDuration constraint
                                password                    : true, // required: for password hash comparison
                                
                                [modelCredentialsRefUserId] : true, // required: for finding the related user
                            },
                        });
                        if (!credentials) return null;
                        
                        // then: find the user:
                        const user = await ((prismaTransaction as TPrisma)[modelUser] as any).findUnique({
                            where   : {
                                id : credentials[modelCredentialsRefUserId],
                            },
                        });
                        
                        // then: combine them:
                        return {
                            user,
                            credentials,
                        };
                    })()
                );
                if (!userWithCredentials) return null; // no user found with given username (or email) => return null (not found)
                
                
                
                // exclude credentials property to increase security strength:
                const {
                    user        : user,
                    credentials : expectedCredentials,
                } = userWithCredentials;
                
                
                
                // check if user's email was verified:
                if (requireEmailVerified) {
                    if (user.emailVerified === null) return false;
                } // if
                
                
                
                // verify whether the credentials does exist:
                if (!expectedCredentials) return null; // no credential was configured on the user's account => unable to compare => return null (assumes as password do not match)
                
                
                
                // verify whether the credentials is not locked out:
                {
                    const lockedAt = expectedCredentials.lockedAt ?? null;
                    if (lockedAt !== null) {
                        const lockedUntil = new Date(/* since: */ lockedAt.valueOf() + /* duration: */ (failureLockDuration * 60 * 60 * 1000 /* convert hours to milliseconds */));
                        if (lockedUntil > now) {
                            // still in locked period => return the released_out date:
                            return lockedUntil;
                        }
                        else {
                            // the locked period expired => unlock & reset the failure_counter:
                            await ((prismaTransaction as TPrisma)[modelCredentials] as any).update({
                                where  : {
                                    id : expectedCredentials.id,
                                },
                                data   : {
                                    failureAttempts : null, // reset the failure_counter
                                    lockedAt        : null, // reset the lock_date constraint
                                },
                                select : {
                                    id : true,
                                },
                            });
                            expectedCredentials.failureAttempts = null; // reset this variable too
                            expectedCredentials.lockedAt        = null; // reset this variable too
                        } // if
                    } // if
                }
                
                
                
                // perform password hash comparison:
                {
                    const isSuccess = !!password && !!expectedCredentials.password && await bcrypt.compare(password, expectedCredentials.password);
                    if (isSuccess) { // signIn attemp succeeded:
                        if (expectedCredentials.failureAttempts !== null) { // there are some failure attempts => reset
                            // reset the failure_counter:
                            await ((prismaTransaction as TPrisma)[modelCredentials] as any).update({
                                where  : {
                                    id : expectedCredentials.id,
                                },
                                data   : {
                                    failureAttempts : null, // reset the failure_counter
                                },
                                select : {
                                    id : true,
                                },
                            });
                        } // if
                    }
                    else { // signIn attemp failed:
                        if (failureMaxAttempts !== null) { // there are a limit of failure signIn attempts
                            // increase the failure_counter and/or lockedAt:
                            const currentFailureAttempts : number  = (expectedCredentials.failureAttempts ?? 0) + 1;
                            const isLocked               : boolean = (currentFailureAttempts >= failureMaxAttempts);
                            await ((prismaTransaction as TPrisma)[modelCredentials] as any).update({
                                where  : {
                                    id : expectedCredentials.id,
                                },
                                data   : {
                                    failureAttempts : currentFailureAttempts,
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
                            
                            
                            
                            if (isLocked) return new Date(/* since: */ now.valueOf() + /* duration: */ (failureLockDuration * 60 * 60 * 1000 /* convert hours to milliseconds */)); // the credentials has been locked
                        } // if
                    } // if
                    
                    
                    
                    if (!isSuccess) return null; // password hash comparison do not match => return null (password do not match)
                }
                
                
                
                // the verification passed => authorized => return An `AdapterUser` object:
                return user;
            });
        },
        
        
        
        // password resets:
        createPasswordResetToken   : async (usernameOrEmail                     , options) => {
            // conditions:
            const hasPasswordResetToken = !!modelPasswordResetToken && (modelPasswordResetToken in prisma);
            if (!hasPasswordResetToken) return null;
            
            
            
            // options:
            const {
                now = new Date(),
                resetThrottle,
                resetMaxAge = 24,
            } = options ?? {};
            
            
            
            // normalizations:
            usernameOrEmail = usernameOrEmail.toLowerCase();
            
            
            
            // generate the passwordResetToken data:
            const passwordResetToken  = await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)();
            const passwordResetMaxAge = resetMaxAge * 60 * 60 * 1000 /* convert hours to milliseconds */;
            const passwordResetExpiry = new Date(now.valueOf() + passwordResetMaxAge);
            
            
            
            // an atomic transaction of [`find user by username (or email)`, `find passwordResetToken by user id`, `create/update the new passwordResetToken`]:
            const user = await prisma.$transaction(async (prismaTransaction): Promise<AdapterUser|Date|null> => { // AdapterUser: succeeded; Date: reset request is too frequent; null: invalid username or email
                // find user id by given username (or email):
                const userId = (
                    usernameOrEmail.includes('@') // if username contains '@' => treat as email, otherwise regular username
                    ? (await ((prismaTransaction as TPrisma)[modelUser] as any).findUnique({
                        where   : {
                            email    : usernameOrEmail,
                        },
                        select  : {
                            id             : true, // required: for id key
                        },
                    }))?.id
                    : (await ((prismaTransaction as TPrisma)[modelCredentials] as any).findUnique({
                        where   : {
                            username : usernameOrEmail,
                        },
                        select  : {
                            [modelCredentialsRefUserId] : true, // required: for id key
                        },
                    }))?.[modelCredentialsRefUserId]
                );
                if (userId === undefined) return null;
                
                
                
                // limits the rate of passwordResetToken request:
                if (resetThrottle !== undefined) { // there are a limit of passwordResetToken request
                    // find the last request date (if found) of passwordResetToken by user id:
                    const {updatedAt: lastRequestDate} = await ((prismaTransaction as TPrisma)[modelPasswordResetToken] as any).findUnique({
                        where  : {
                            [modelPasswordResetTokenRefUserId as any] : userId,
                        },
                        select : {
                            updatedAt                                 : true,
                        },
                    }) ?? {};
                    
                    // calculate how often the last request of passwordResetToken:
                    if (!!lastRequestDate) {
                        const minInterval = resetThrottle * 60 * 60 * 1000 /* convert hours to milliseconds */;
                        if ((now.valueOf() - lastRequestDate.valueOf()) < minInterval) { // the request interval is shorter than minInterval  => reject the request
                            // the reset request is too frequent => reject:
                            return new Date(lastRequestDate.valueOf() + minInterval);
                        } // if
                    } // if
                } // if
                
                
                
                // create/update the passwordResetToken record and get the related user name & email:
                const relatedPasswordResetToken = await ((prismaTransaction as TPrisma)[modelPasswordResetToken] as any).upsert({
                    where  : {
                        [modelPasswordResetTokenRefUserId as any] : userId,
                    },
                    create : {
                        [modelPasswordResetTokenRefUserId as any] : userId,
                        
                        expiresAt                                 : passwordResetExpiry,
                        token                                     : passwordResetToken,
                    },
                    update : {
                        expiresAt                                 : passwordResetExpiry,
                        token                                     : passwordResetToken,
                    },
                    select : {
                        [modelPasswordResetTokenRefUserId as any] : true,
                    },
                });
                if (!relatedPasswordResetToken) return null;
                
                
                
                return ((prismaTransaction as TPrisma)[modelUser] as any).findUnique({
                    where  : {
                        id : relatedPasswordResetToken[modelPasswordResetTokenRefUserId as any],
                    },
                });
            });
            if (!user || (user instanceof Date)) return user;
            return {
                passwordResetToken,
                user,
            };
        },
        validatePasswordResetToken : async (passwordResetToken                  , options) => {
            // conditions:
            const hasPasswordResetToken = !!modelPasswordResetToken && (modelPasswordResetToken in prisma);
            if (!hasPasswordResetToken) return null;
            
            
            
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            return prisma.$transaction(async (prismaTransaction): Promise<ValidatePasswordResetTokenData|null> => {
                const relatedPasswordResetToken = await ((prismaTransaction as TPrisma)[modelPasswordResetToken] as any).findUnique({
                    where  : {
                        token     : passwordResetToken,
                        expiresAt : {
                            gt    : now, // not expired yet (expires in the future)
                        },
                    },
                    select : {
                        [modelPasswordResetTokenRefUserId as any] : true,
                    },
                });
                if (!relatedPasswordResetToken) return null;
                
                
                
                const [user, credentials] = await Promise.all([
                    ((prismaTransaction as TPrisma)[modelUser] as any).findUnique({
                        where  : {
                            id                          : relatedPasswordResetToken[modelPasswordResetTokenRefUserId as any],
                        },
                        select : {
                            email                       : true,
                        },
                    }),
                    ((prismaTransaction as TPrisma)[modelCredentials] as any).findUnique({
                        where  : {
                            [modelCredentialsRefUserId] : relatedPasswordResetToken[modelPasswordResetTokenRefUserId as any],
                        },
                        select : {
                            username                    : true,
                        },
                    }),
                ]);
                if (!user) return null;
                if (!credentials) return null;
                
                
                
                return {
                    email    : user.email,
                    username : credentials.username || null,
                };
            });
        },
        usePasswordResetToken      : async (passwordResetToken, password: string, options) => {
            // conditions:
            const hasPasswordResetToken = !!modelPasswordResetToken && (modelPasswordResetToken in prisma);
            if (!hasPasswordResetToken) return false;
            
            
            
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            // generate the hashed password:
            const hashedPassword = await bcrypt.hash(password, 10);
            
            
            
            // an atomic transaction of [`find user id by passwordResetToken`, `delete current passwordResetToken record`, `create/update user's credentials`]:
            return prisma.$transaction(async (prismaTransaction): Promise<boolean> => {
                // find the existance of passwordResetToken record by given passwordResetToken:
                const relatedPasswordResetToken = await ((prismaTransaction as TPrisma)[modelPasswordResetToken] as any).findUnique({
                    where  : {
                        token     : passwordResetToken,
                        expiresAt : {
                            gt    : now, // not expired yet (expires in the future)
                        },
                    },
                    select : {
                        id                                        : true,
                        [modelPasswordResetTokenRefUserId as any] : true,
                    },
                });
                if (!relatedPasswordResetToken) { // there is no passwordResetToken record with related passwordResetToken
                    // report the error:
                    return false;
                } // if
                
                
                
                await Promise.all([
                    // delete the current passwordResetToken record so it cannot be re-use again:
                    await ((prismaTransaction as TPrisma)[modelPasswordResetToken] as any).deleteMany({
                        where  : {
                            id : relatedPasswordResetToken.id,
                        },
                    }),
                    
                    
                    
                    // create/update user's credentials:
                    ((prismaTransaction as TPrisma)[modelCredentials] as any).upsert({
                        where  : {
                            [modelCredentialsRefUserId] : relatedPasswordResetToken[modelPasswordResetTokenRefUserId as any],
                        },
                        create : {
                            [modelCredentialsRefUserId] : relatedPasswordResetToken[modelPasswordResetTokenRefUserId as any],
                            
                            password                    : hashedPassword,
                        },
                        update : {
                            password                    : hashedPassword,
                        },
                        select : {
                            id                          : true,
                        },
                    }),
                    
                    
                    
                    // resetting password is also intrinsically verifies the email:
                    await ((prismaTransaction as TPrisma)[modelUser] as any).updateMany({
                        where  : {
                            id            : relatedPasswordResetToken[modelPasswordResetTokenRefUserId as any], // unique, guarantees only update one or zero
                        },
                        data   : {
                            emailVerified : now,
                        },
                    }),
                ]);
                
                
                
                // report the success:
                return true;
            });
        },
        
        
        
        // registrations:
        checkUsernameAvailability  : async (username                                     ) => {
            // normalizations:
            username = username.toLowerCase();
            
            
            
            // database query:
            return !(await (prisma[modelCredentials] as any).findUnique({
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
            return !(await (prisma[modelUser] as any).findUnique({
                where  : {
                    email : email,
                },
                select : {
                    id : true,
                },
            }));
        },
        registerUser               : async (name, email, username, password     , options) => {
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
            const hasEmailConfirmationToken = !!modelEmailConfirmationToken && (modelEmailConfirmationToken in prisma);
            const emailConfirmationToken : string|null = (requireEmailVerified && hasEmailConfirmationToken) ? await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)() : null;
            
            
            
            // an atomic transaction of [`create/update User`, `create/update Credentials`, `create/update EmailConfirmationToken`]:
            return prisma.$transaction(async (prismaTransaction): Promise<RegisterUserData> => {
                // create/update User:
                const userData = {
                    name          : name,
                    email         : email,
                    
                    emailVerified : null,  // reset
                };
                const { id: userId } = await ((prismaTransaction as TPrisma)[modelUser] as any).upsert({
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
                    failureAttempts : null, // reset
                    lockedAt        : null, // reset
                    
                    username        : username,
                    password        : hashedPassword,
                };
                await ((prismaTransaction as TPrisma)[modelCredentials] as any).upsert({
                    where  : {
                        [modelCredentialsRefUserId] : userId,
                    },
                    create : {
                        [modelCredentialsRefUserId] : userId,
                        
                        ...credentialsData,
                    },
                    update : {
                        ...credentialsData,
                    },
                    select : {
                        id                          : true,
                    },
                });
                
                
                
                // create/update EmailConfirmationToken:
                if (hasEmailConfirmationToken && emailConfirmationToken) {
                    await ((prismaTransaction as TPrisma)[modelEmailConfirmationToken] as any).upsert({
                        where  : {
                            [modelEmailConfirmationTokenRefUserId as any] : userId,
                        },
                        create : {
                            [modelEmailConfirmationTokenRefUserId as any] : userId,
                            
                            token                                         : emailConfirmationToken,
                        },
                        update : {
                            token                                         : emailConfirmationToken,
                        },
                        select : {
                            id                                            : true,
                        },
                    });
                } // if
                
                
                
                return {
                    userId,
                    emailConfirmationToken,
                };
            });
        },
        
        
        
        // email verifications:
        markEmailAsVerified        : async (userId                              , options) => {
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            await (prisma[modelUser] as any).update({
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
        useEmailConfirmationToken  : async (emailConfirmationToken              , options) => {
            // conditions:
            const hasEmailConfirmationToken = !!modelEmailConfirmationToken && (modelEmailConfirmationToken in prisma);
            if (!hasEmailConfirmationToken) return false;
            
            
            
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            // an atomic transaction of [`find user id by emailConfirmationToken`, `delete current emailConfirmationToken record`, `update user's emailVerified field`]:
            return prisma.$transaction(async (prismaTransaction): Promise<boolean> => {
                // find the existance of emailConfirmationToken record by given emailConfirmationToken:
                const relatedEmailConfirmationToken = await ((prismaTransaction as TPrisma)[modelEmailConfirmationToken] as any).findUnique({
                    where  : {
                        token : emailConfirmationToken,
                    },
                    select : {
                        id                                            : true,
                        [modelEmailConfirmationTokenRefUserId as any] : true,
                    },
                });
                if (!relatedEmailConfirmationToken) { // there is no emailConfirmationToken record with related emailConfirmationToken
                    // report the error:
                    return false;
                } // if
                
                
                
                await Promise.all([
                    // delete the current emailConfirmationToken record so it cannot be re-use again:
                    ((prismaTransaction as TPrisma)[modelEmailConfirmationToken] as any).deleteMany({
                        where  : {
                            [modelEmailConfirmationTokenRefUserId as any] : relatedEmailConfirmationToken.id,
                        },
                    }),
                    
                    
                    
                    // update user's emailVerified field (if not already verified):
                    ((prismaTransaction as TPrisma)[modelUser] as any).updateMany({
                        where  : {
                            id            : relatedEmailConfirmationToken[modelEmailConfirmationTokenRefUserId as any], // unique, guarantees only update one or zero
                        },
                        data   : {
                            emailVerified : now,
                        },
                    }),
                ]);
                
                
                
                // report the success:
                return true;
            });
        },
        
        
        
        // user credentials:
        getCredentialsByUserId     : async (userId                                       ) => {
            // database query:
            return (prisma[modelCredentials] as any).findUnique({
                where  : {
                    [modelCredentialsRefUserId] : userId,
                },
                select : {
                    username : true, // only username is shown for security purpose
                },
            });
        },
        getCredentialsByUserEmail  : async (userEmail                                    ) => {
            // normalizations:
            userEmail = userEmail.toLowerCase();
            
            
            
            // database query:
            return prisma.$transaction(async (prismaTransaction): Promise<AdapterCredentials|null> => {
                const relatedUser = await ((prismaTransaction as TPrisma)[modelUser] as any).findUnique({
                    where  : {
                        email : userEmail,
                    },
                    select : {
                        id : true,
                    },
                });
                if (!relatedUser) return null;
                
                
                
                return ((prismaTransaction as TPrisma)[modelCredentials] as any).findUnique({
                    where  : {
                        [modelCredentialsRefUserId] : relatedUser.id,
                    },
                    select : {
                        username : true, // only username is shown for security purpose
                    },
                });
            });
        },
        
        
        
        // user roles:
        getRoleByUserId            : async (userId                                       ) => {
            // conditions:
            const hasRole = !!modelRole && (modelRole in prisma);
            if (!hasRole) return null;
            
            
            
            // database query:
            return prisma.$transaction(async (prismaTransaction): Promise<AdapterRole|null> => {
                const relatedUser = await ((prismaTransaction as TPrisma)[modelUser] as any).findUnique({
                    where  : {
                        id : userId,
                    },
                    select : {
                        [modelUserRefRoleId as any] : true,
                    },
                });
                if (!relatedUser) return null;
                if (relatedUser[modelUserRefRoleId as any] === null) return null;
                
                
                
                return ((prismaTransaction as TPrisma)[modelRole as any] as any).findUnique({
                    where  : {
                        id : relatedUser[modelUserRefRoleId as any],
                    },
                });
            });
        },
        getRoleByUserEmail         : async (userEmail                                    ) => {
            // conditions:
            const hasRole = !!modelRole && (modelRole in prisma);
            if (!hasRole) return null;
            
            
            
            // normalizations:
            userEmail = userEmail.toLowerCase();
            
            
            
            // database query:
            return prisma.$transaction(async (prismaTransaction): Promise<AdapterRole|null> => {
                const relatedUser = await ((prismaTransaction as TPrisma)[modelUser] as any).findUnique({
                    where  : {
                        email : userEmail,
                    },
                    select : {
                        [modelUserRefRoleId as any] : true,
                    },
                });
                if (!relatedUser) return null;
                if (relatedUser[modelUserRefRoleId as any] === null) return null;
                
                
                
                return ((prismaTransaction as TPrisma)[modelRole as any] as any).findUnique({
                    where  : {
                        id : relatedUser[modelUserRefRoleId as any],
                    },
                });
            });
        },
    };
};
