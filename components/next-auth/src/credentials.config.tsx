// react:
import {
    // react:
    default as React,
}                           from 'react'



export interface CredentialsConfig {
    FULLNAME_MIN_LENGTH    : number /* characters */
    FULLNAME_MAX_LENGTH    : number /* characters */
    
    
    
    EMAIL_MIN_LENGTH       : number /* characters */
    EMAIL_MAX_LENGTH       : number /* characters */
    EMAIL_FORMAT           : RegExp
    EMAIL_FORMAT_HINT      : React.ReactNode
    
    
    
    USERNAME_MIN_LENGTH    : number /* characters */
    USERNAME_MAX_LENGTH    : number /* characters */
    USERNAME_FORMAT        : RegExp
    USERNAME_FORMAT_HINT   : React.ReactNode
    
    
    
    PASSWORD_MIN_LENGTH    : number /* characters */
    PASSWORD_MAX_LENGTH    : number /* characters */
    PASSWORD_HAS_UPPERCASE : boolean
    PASSWORD_HAS_LOWERCASE : boolean
};
export const defaultCredentialsConfig: CredentialsConfig = {
    FULLNAME_MIN_LENGTH    : 2,
    FULLNAME_MAX_LENGTH    : 30,
    
    
    
    EMAIL_MIN_LENGTH       : 5,
    EMAIL_MAX_LENGTH       : 50,
    EMAIL_FORMAT           : /^[a-zA-Z0-9-_.!#$%&'*+/=?^`{|}~]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
    EMAIL_FORMAT_HINT      : <>Must be a common email format.</>,
    
    
    
    USERNAME_MIN_LENGTH    : 3,
    USERNAME_MAX_LENGTH    : 20,
    USERNAME_FORMAT        : /^[a-z][a-z0-9-_]*$/i,
    USERNAME_FORMAT_HINT   : <>Begins with a letter followed by letters, numbers, underscores, or hyphens.</>,
    
    
    
    PASSWORD_MIN_LENGTH    : 5  /* characters */,
    PASSWORD_MAX_LENGTH    : 30 /* characters */,
    PASSWORD_HAS_UPPERCASE : true,
    PASSWORD_HAS_LOWERCASE : false,
};
