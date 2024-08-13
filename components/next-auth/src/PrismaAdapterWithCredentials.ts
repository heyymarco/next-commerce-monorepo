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
    user                          ?: Extract<keyof TPrisma, string>
    role                          ?: Extract<keyof TPrisma, string> | null
    account                       ?: Extract<keyof TPrisma, string>
    session                       ?: Extract<keyof TPrisma, string>
    credentials                   ?: Extract<keyof TPrisma, string>
    passwordResetToken            ?: Extract<keyof TPrisma, string> | null
    emailConfirmationToken        ?: Extract<keyof TPrisma, string> | null
    
    userRefRole                   ?: string | null
    accountRefUser                ?: string
    sessionRefUser                ?: string
    credentialsRefUser            ?: string
    passwordResetTokenRefUser     ?: string | null
    emailConfirmationTokenRefUser ?: string | null
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
        user                          : mUser                   = 'user',
        role                          : mRole                   = 'role',
        account                       : mAccount                = 'account',
        session                       : mSession                = 'session',
        credentials                   : mCredentials            = 'credentials',
        passwordResetToken            : mPasswordResetToken     = 'passwordResetToken',
        emailConfirmationToken        : mEmailConfirmationToken = 'emailConfirmationToken',
    } = options;
    
    const {
        userRefRole                   : rUser                   = `${mRole}Id`,
        accountRefUser                : rAccount                = `${mUser}Id`,
        sessionRefUser                : rSession                = `${mUser}Id`,
        credentialsRefUser            : rCredentials            = `${mUser}Id`,
        passwordResetTokenRefUser     : rPasswordResetToken     = `${mUser}Id`,
        emailConfirmationTokenRefUser : rEmailConfirmationToken = `${mUser}Id`,
    } = options;
    
    
    
    return {
        // CRUD users:
        createUser                 : async (userData         ) => {
            const {
                name,
            ...restUserData} = userData;
            if (!name) throw Error('`name` is required.');
            
            
            
            return (prisma[mUser] as any).create({
                data  : {
                    ...restUserData,
                    name,
                },
            });
        },
        
        getUser                    : async (userId           ) => {
            return (prisma[mUser] as any).findUnique({
                where  : {
                    id : userId,
                },
            });
        },
        getUserByEmail             : async (userEmail        ) => {
            return (prisma[mUser] as any).findUnique({
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
                const account = await ((prismaTransaction as TPrisma)[mAccount] as any).findFirst({
                    where  : {
                        provider,
                        providerAccountId,
                    },
                    select : {
                        [rAccount] : true,
                    },
                });
                if (!account) return null;
                
                
                
                return ((prismaTransaction as TPrisma)[mUser] as any).findUnique({
                    where  : {
                        id : account[rAccount],
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
            
            
            
            return (prisma[mUser] as any).update({
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
            return (prisma[mUser] as any).delete({
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
            
            
            
            return (prisma[mSession] as any).create({
                data  : {
                    ...restSessionData,
                    [rSession]   : userId,
                },
            });
        },
        getSessionAndUser          : async (sessionToken     ) => {
            return prisma.$transaction(async (prismaTransaction): Promise<{session: AdapterSession, user: AdapterUser}|null> => {
                const session = await ((prismaTransaction as TPrisma)[mSession] as any).findUnique({
                    where   : {
                        sessionToken,
                    },
                });
                if (!session) return null;
                
                
                
                const user = await ((prismaTransaction as TPrisma)[mUser] as any).findUnique({
                    where  : {
                        id : session[rSession],
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
            
            
            
            return (prisma[mSession] as any).update({
                where  : {
                    sessionToken : restSessionData.sessionToken,
                },
                data   : {
                    ...restSessionData,
                    [rSession]   : userId,
                },
            });
        },
        deleteSession              : async (sessionToken     ) => {
            return (prisma[mSession] as any).delete({
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
            
            
            
            const account = await (prisma[mAccount] as any).create({
                data  : {
                    ...restAccountData,
                    [rAccount] : userId,
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
                const account = await ((prismaTransaction as TPrisma)[mAccount] as any).findFirst({
                    where  : {
                        provider,
                        providerAccountId,
                    },
                    select : {
                        id : true,
                    },
                });
                if (!account) return undefined;
                return await ((prismaTransaction as TPrisma)[mAccount] as any).delete({
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
                                failureAttempts : true, // required: for inspecting the failureMaxAttempts  constraint
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
                        const lockedUntil = new Date(/* since: */ lockedAt.valueOf() + /* duration: */ (failureLockDuration * 60 * 60 * 1000 /* convert hours to milliseconds */));
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
                            await ((prismaTransaction as TPrisma)[mCredentials] as any).update({
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
                            await ((prismaTransaction as TPrisma)[mCredentials] as any).update({
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
                return restUser;
            });
        },
        
        
        
        // password resets:
        createPasswordResetToken   : async (usernameOrEmail                     , options) => {
            // conditions:
            const hasPasswordResetToken = !!mPasswordResetToken && (mPasswordResetToken in prisma);
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
                
                
                
                // limits the rate of passwordResetToken request:
                if (resetThrottle !== undefined) { // there are a limit of passwordResetToken request
                    // find the last request date (if found) of passwordResetToken by user id:
                    const {updatedAt: lastRequestDate} = await ((prismaTransaction as TPrisma)[mPasswordResetToken] as any).findUnique({
                        where  : {
                            [rPasswordResetToken as any] : userId,
                        },
                        select : {
                            updatedAt                    : true,
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
                const relatedPasswordResetToken = await ((prismaTransaction as TPrisma)[mPasswordResetToken] as any).upsert({
                    where  : {
                        [rPasswordResetToken as any] : userId,
                    },
                    create : {
                        [rPasswordResetToken as any] : userId,
                        
                        expiresAt                    : passwordResetExpiry,
                        token                        : passwordResetToken,
                    },
                    update : {
                        expiresAt                    : passwordResetExpiry,
                        token                        : passwordResetToken,
                    },
                    select : {
                        [rPasswordResetToken as any] : true,
                    },
                });
                if (!relatedPasswordResetToken) return null;
                
                return ((prismaTransaction as TPrisma)[mUser] as any).findUnique({
                    where  : {
                        id : relatedPasswordResetToken[rPasswordResetToken as any],
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
            const hasPasswordResetToken = !!mPasswordResetToken && (mPasswordResetToken in prisma);
            if (!hasPasswordResetToken) return null;
            
            
            
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            const user = await (prisma[mUser] as any).findFirst({
                where  : {
                    [mPasswordResetToken] : {
                        token        : passwordResetToken,
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
        usePasswordResetToken      : async (passwordResetToken, password: string, options) => {
            // conditions:
            const hasPasswordResetToken = !!mPasswordResetToken && (mPasswordResetToken in prisma);
            if (!hasPasswordResetToken) return false;
            
            
            
            // options:
            const {
                now = new Date(),
            } = options ?? {};
            
            
            
            // generate the hashed password:
            const hashedPassword = await bcrypt.hash(password, 10);
            
            
            
            // an atomic transaction of [`find user id by passwordResetToken`, `delete current passwordResetToken record`, `create/update user's credentials`]:
            return prisma.$transaction(async (prismaTransaction): Promise<boolean> => {
                // find the related user id by given passwordResetToken:
                const user = await ((prismaTransaction as TPrisma)[mUser] as any).findFirst({
                    where  : {
                        [mPasswordResetToken] : {
                            token        : passwordResetToken,
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
                if (!user) { // there is no user with related passwordResetToken
                    // report the error:
                    return false;
                } // if
                const {
                    id: userId,
                    emailVerified,
                } = user;
                
                
                
                // delete the current passwordResetToken record so it cannot be re-use again:
                await ((prismaTransaction as TPrisma)[mPasswordResetToken] as any).delete({
                    where  : {
                        [rPasswordResetToken as any] : userId,
                    },
                    select : {
                        id                           : true,
                    },
                });
                
                
                
                // create/update user's credentials:
                await ((prismaTransaction as TPrisma)[mCredentials] as any).upsert({
                    where  : {
                        [rCredentials] : userId,
                    },
                    create : {
                        [rCredentials] : userId,
                        
                        password       : hashedPassword,
                    },
                    update : {
                        password       : hashedPassword,
                    },
                    select : {
                        id             : true,
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
        
        
        
        // registrations:
        checkUsernameAvailability  : async (username                                     ) => {
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
        checkEmailAvailability     : async (email                                        ) => {
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
                    failureAttempts : null, // reset
                    lockedAt        : null, // reset
                    
                    username        : username,
                    password        : hashedPassword,
                };
                await ((prismaTransaction as TPrisma)[mCredentials] as any).upsert({
                    where  : {
                        [rCredentials] : userId,
                    },
                    create : {
                        [rCredentials] : userId,
                        
                        ...credentialsData,
                    },
                    update : {
                        ...credentialsData,
                    },
                    select : {
                        id             : true,
                    },
                });
                
                
                
                // create/update EmailConfirmationToken:
                if (hasEmailConfirmationToken && emailConfirmationToken) {
                    await ((prismaTransaction as TPrisma)[mEmailConfirmationToken] as any).upsert({
                        where  : {
                            [rEmailConfirmationToken as any] : userId,
                        },
                        create : {
                            [rEmailConfirmationToken as any] : userId,
                            
                            token                            : emailConfirmationToken,
                        },
                        update : {
                            token                            : emailConfirmationToken,
                        },
                        select : {
                            id                               : true,
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
        useEmailConfirmationToken  : async (emailConfirmationToken              , options) => {
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
                        [rEmailConfirmationToken as any] : userId,
                    },
                    select : {
                        id                               : true,
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
        
        
        
        // user credentials:
        getCredentialsByUserId     : async (userId                                       ) => {
            // database query:
            const user = await (prisma[mUser] as any).findUnique({
                where  : {
                    id : userId,
                },
                select : {
                    [mCredentials] : {
                        select : {
                            username : true,
                        },
                    },
                },
            });
            return user?.[mCredentials] ?? null;
        },
        getCredentialsByUserEmail  : async (userEmail                                    ) => {
            // normalizations:
            userEmail = userEmail.toLowerCase();
            
            
            
            // database query:
            const user = await (prisma[mUser] as any).findUnique({
                where  : {
                    email : userEmail,
                },
                select : {
                    [mCredentials] : {
                        select : {
                            username : true,
                        },
                    },
                },
            });
            return user?.[mCredentials] ?? null;
        },
        
        
        
        // user roles:
        getRoleByUserId            : async (userId                                       ) => {
            // conditions:
            const hasRole = !!mRole && (mRole in prisma);
            if (!hasRole) return null;
            
            
            
            // database query:
            return prisma.$transaction(async (prismaTransaction): Promise<AdapterRole|null> => {
                const relatedUser = await ((prismaTransaction as TPrisma)[mUser] as any).findUnique({
                    where  : {
                        id : userId,
                    },
                    select : {
                        [rUser as any] : true,
                    },
                });
                if (!relatedUser) return null;
                
                
                
                return ((prismaTransaction as TPrisma)[mRole as any] as any).findUnique({
                    where  : {
                        id : relatedUser[rUser as any],
                    },
                });
            });
        },
        getRoleByUserEmail         : async (userEmail                                    ) => {
            // conditions:
            const hasRole = !!mRole && (mRole in prisma);
            if (!hasRole) return null;
            
            
            
            // normalizations:
            userEmail = userEmail.toLowerCase();
            
            
            
            // database query:
            return prisma.$transaction(async (prismaTransaction): Promise<AdapterRole|null> => {
                const relatedUser = await ((prismaTransaction as TPrisma)[mUser] as any).findUnique({
                    where  : {
                        email : userEmail,
                    },
                    select : {
                        [rUser as any] : true,
                    },
                });
                if (!relatedUser) return null;
                
                
                
                return ((prismaTransaction as TPrisma)[mRole as any] as any).findUnique({
                    where  : {
                        id : relatedUser[rUser as any],
                    },
                });
            });
        },
    };
};
