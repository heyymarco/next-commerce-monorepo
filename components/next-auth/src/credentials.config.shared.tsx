// internals:
import type {
    // types:
    CredentialsConfigShared,
}                           from './types.js'



export const defaultCredentialsConfigShared : CredentialsConfigShared = {
    name     : {
        minLength      : 2,
        maxLength      : 30,
    },
    email    : {
        minLength      : 5,
        maxLength      : 50,
        
        format         : /^[a-zA-Z0-9-_.!#$%&'*+/=?^`{|}~]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
    },
    username : {
        minLength      : 3,
        maxLength      : 20,
        
        format         : /^[a-z][a-z0-9-_]*$/i,
    },
    password : {
        minLength      : 5,
        maxLength      : 30,
        
        hasUppercase   : true,
        hasLowercase   : false,
    },
};
