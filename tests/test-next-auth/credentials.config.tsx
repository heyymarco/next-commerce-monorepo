import type { CredentialsConfig } from "@heymarco/next-auth";



export const credentialsConfig: CredentialsConfig = {
    EMAIL_MIN_LENGTH       : 5,
    EMAIL_MAX_LENGTH       : 30,
    EMAIL_FORMAT           : /^[a-zA-Z0-9-_.!#$%&'*+/=?^`{|}~]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
    EMAIL_FORMAT_HINT      : <>Invalid common email format.</>,
    
    
    
    USERNAME_MIN_LENGTH    : 3,
    USERNAME_MAX_LENGTH    : 20,
    USERNAME_FORMAT        : /^[a-z][a-z0-9-_]*$/i,
    USERNAME_FORMAT_HINT   : <>Begins with a letter followed by letters, numbers, underscores, or hyphens.</>,
    
    
    
    PASSWORD_MIN_LENGTH    : 5  /* characters */,
    PASSWORD_MAX_LENGTH    : 20 /* characters */,
    PASSWORD_HAS_UPPERCASE : true,
    PASSWORD_HAS_LOWERCASE : false,
};
