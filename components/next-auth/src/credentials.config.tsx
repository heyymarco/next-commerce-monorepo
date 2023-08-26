export interface CredentialsConfig {
    PASSWORD_MIN_LENGTH    : number /* characters */
    PASSWORD_MAX_LENGTH    : number /* characters */
    PASSWORD_HAS_UPPERCASE : boolean
    PASSWORD_HAS_LOWERCASE : boolean
};
export const defaultCredentialsConfig: CredentialsConfig = {
    PASSWORD_MIN_LENGTH    : 5  /* characters */,
    PASSWORD_MAX_LENGTH    : 20 /* characters */,
    PASSWORD_HAS_UPPERCASE : true,
    PASSWORD_HAS_LOWERCASE : false,
};
