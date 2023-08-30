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



type Adapter = ReturnType<typeof PrismaAdapter>
export type Credentials = Record<'username'|'password', string>
export interface AdapterWithCredentials
    extends
        Adapter
{
    getUserByCredentials : (credentials: Credentials) => Awaitable<AdapterUser|null>
}
export const PrismaAdapterWithCredentials = (prisma: PrismaClient): AdapterWithCredentials => {
    return {
        ...PrismaAdapter(prisma),
        
        getUserByCredentials: async (credentials) => {
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
    };
};
