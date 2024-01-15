// internals:
import type {
    // types:
    AuthConfigShared,
}                           from './types.js'



export const defaultAuthConfigShared : AuthConfigShared = {
    business                 : {
        name                 : process.env.BUSINESS_NAME ?? '',
        url                  : process.env.BUSINESS_URL  ?? '',
    },
    signUp                   : {
        enabled              : true,
    },
    signIn                   : {
        path                 : '/auth/signin',
    },
    reset                    : {
        enabled              : true,
    },
};
