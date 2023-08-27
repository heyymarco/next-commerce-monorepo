import type { CredentialsConfig } from "@heymarco/next-auth";



export const credentialsConfig: CredentialsConfig = {
    PASSWORD_MIN_LENGTH    : 5  /* characters */,
    PASSWORD_MAX_LENGTH    : 20 /* characters */,
    PASSWORD_HAS_UPPERCASE : true,
    PASSWORD_HAS_LOWERCASE : false,
};
