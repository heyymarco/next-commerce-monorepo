// next-auth:
import type {
    // types:
    Awaitable,
}                           from 'next-auth'
import type {
    // models:
    AdapterUser,
}                           from 'next-auth/adapters'
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



// types:
type Adapter = ReturnType<typeof PrismaAdapter>
export type Credentials = Record<'username'|'password', string>
export interface ResetPasswordTokenData {
    email    : string
    username : string|null
}


// models:
export type { AdapterUser }



// options:
export interface CreateResetPasswordTokenOptions {
    now               ?: Date
    resetLimitInHours ?: number
    emailResetMaxAge  ?: number
}



export interface AdapterWithCredentials
    extends
        Adapter
{
    validateCredentials        : (credentials: Credentials) => Awaitable<AdapterUser|null>
    createResetPasswordToken   : (usernameOrEmail: string, options?: CreateResetPasswordTokenOptions) => Awaitable<{ resetPasswordToken: string, user: AdapterUser}|Date|null>
    validateResetPasswordToken : (resetPasswordToken: string) => Awaitable<ResetPasswordTokenData|null>
}
export const PrismaAdapterWithCredentials = (prisma: PrismaClient): AdapterWithCredentials => {
    return {
        ...PrismaAdapter(prisma),
        
        validateCredentials       : async (credentials) => {
            // credentials:
            const {
                username : usernameOrEmail,
                password,
            } = credentials;
            
            
            
            const userWithCredentials = await prisma.user.findFirst({
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
                            password : true, // required: for password hash comparison
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
            
            
            
            // perform password hash comparison:
            if (!expectedCredentials) return null; // no credential was configured on the user's account => unable to compare => return null (assumes as password do not match)
            if (!(await bcrypt.compare(password, expectedCredentials.password ?? ''))) return null; // password hash comparison do not match => return null (password do not match)
            
            
            
            // the verification passed => authorized => return An `AdapterUser` object:
            return restUser;
        },
        createResetPasswordToken   : async (usernameOrEmail, options) => {
            // options:
            const {
                now = new Date(),
                resetLimitInHours,
                emailResetMaxAge = 24,
            } = options ?? {};
            
            
            
            // generate the resetPasswordToken data:
            const resetPasswordToken  = await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)();
            const resetPasswordMaxAge = emailResetMaxAge * 60 * 60 * 1000 /* convert to milliseconds */;
            const resetPasswordExpiry = new Date(Date.now() + resetPasswordMaxAge);
            
            
            
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
        validateResetPasswordToken : async (resetPasswordToken: string) => {
            const user = await prisma.user.findFirst({
                where  : {
                    resetPasswordToken : {
                        token        : resetPasswordToken,
                        expiresAt : {
                            gt       : new Date(Date.now()),
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
    };
};
