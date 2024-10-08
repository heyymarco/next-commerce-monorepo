// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-js:
import type {
    NextApiRequest,
    NextApiResponse,
}                           from 'next'
import {
    type NextRequest,
    NextResponse as NextResponseFix,
}                           from 'next/server'

// auth-js:
// import {
//     defaultCookies,
// }                           from '@auth/core/lib/utils/cookie.js'
import {
    // cryptos:
    encode,
    decode,
}                           from '@auth/core/jwt'

// next-auth:
import {
    // types:
    type NextAuthOptions,
    type SessionOptions,
    
    
    
    // routers:
    default as NextAuthFix,
}                           from 'next-auth'
import type {
    CredentialsConfig as NextAuthCredentialsConfig,
    OAuthConfig       as NextAuthOAuthConfig,
}                           from 'next-auth/providers' // TODO: to be removed, for compatibility reason
// import {
//     defaultCookies,
// }                           from 'next-auth/core/lib/cookie.js'

// credentials providers:
import {
    default as CredentialsProviderFix,
}                           from '@auth/core/providers/credentials'

// webs:
import {
    default as nodemailer,
}                           from 'nodemailer'

// cryptos:
import {
    randomUUID,
}                           from 'crypto'

// formats:
import {
    default as moment,
}                           from 'moment'

// templates:
import {
    // react components:
    BusinessContextProviderProps,
    BusinessContextProvider,
}                           from './templates/businessDataContext.js'
import {
    // react components:
    UserContextProvider,
}                           from './templates/userContext.js'
import {
    // react components:
    EmailConfirmationContextProvider,
}                           from './templates/emailConfirmationContext.js'
import {
    // react components:
    PasswordResetContextProvider,
}                           from './templates/passwordResetContext.js'

// internals:
import type {
    // types:
    AuthConfigServer,
    CredentialsConfigServer,
    
    
    
    // models:
    User,
    AdapterUser,
}                           from './types.js'
import type {
    CredentialsSignIn,
    AdapterWithCredentials,
}                           from './PrismaAdapterWithCredentials.js'
import {
    signUpPath,
    passwordResetPath,
    usernameValidationPath,
    emailValidationPath,
    passwordValidationPath,
    emailConfirmationPath,
}                           from './api-paths.js'



// utilities:
const dataKey = Symbol();
const getRequestData = async (req: Request): Promise<any> => {
    switch (req.method) {
        case 'GET'   :
        case 'PUT'   :
            return Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
        
        case 'POST'  :
        case 'PATCH' : {
            if (dataKey in req) return req[dataKey];
            
            const data = await req.json();
            (req as any)[dataKey] = data;
            return data;
        }
    } // switch
};



const NextResponse : typeof NextResponseFix = (
    (NextResponseFix as any).default
    ??
    NextResponseFix
);
const NextAuth : typeof NextAuthFix = (
    (NextAuthFix as any).default
    ??
    NextAuthFix
);
const CredentialsProvider : typeof CredentialsProviderFix = (
    (CredentialsProviderFix as any).default
    ??
    CredentialsProviderFix
);



// general_implementation auth handlers:
export interface CreateAuthHandlerOptions {
    adapter                  : AdapterWithCredentials
    authConfigServer         : AuthConfigServer
    credentialsConfigServer  : CredentialsConfigServer
    callbacks               ?: NextAuthOptions['callbacks']
}
export interface NextAuthRouteContext {
    params : { nextauth: string[] }
}
const createNextAuthHandler         = (options: CreateAuthHandlerOptions) => {
    // options:
    const {
        adapter,
        authConfigServer,
        credentialsConfigServer,
        callbacks,
    } = options;
    
    const {
        business : {
            name                 : businessName,
            url                  : businessUrl,
        },
        signUp : {
            enabled              : signUpEnabled,
        },
        signIn : {
            requireVerifiedEmail : signInRequireVerifiedEmail,
            failureMaxAttempts   : signInFailureMaxAttempts,
            failureLockDuration  : signInFailureLockDuration,
            path                 : signInPath,
        },
        reset : {
            enabled              : resetEnabled,
            throttle             : resetThrottle,
            maxAge               : resetMaxAge,
        },
        session : {
            maxAge               : sessionMaxAge,
            updateAge            : sessionUpdateAge,
        },
        
        
        
        oAuthProviders,
        
        
        
        emails : {
            signUp               : {
                host             : emailSignUpHost,
                port             : emailSignUpPort,
                secure           : emailSignUpSecure,
                username         : emailSignUpUsername,
                password         : emailSignUpPassword,
                
                from             : emailSignUpFrom,
                subject          : emailSignUpSubject,
                message          : emailSignUpMessage,
            },
            reset                : {
                host             : emailResetHost,
                port             : emailResetPort,
                secure           : emailResetSecure,
                username         : emailResetUsername,
                password         : emailResetPassword,
                
                from             : emailResetFrom,
                subject          : emailResetSubject,
                message          : emailResetMessage,
            },
        },
    } = authConfigServer;
    
    const {
        name     : {
            minLength      : nameMinLength,
            maxLength      : nameMaxLength,
        },
        email    : {
            minLength      : emailMinLength,
            maxLength      : emailMaxLength,
            
            format         : emailFormat,
        },
        username : {
            minLength      : usernameMinLength,
            maxLength      : usernameMaxLength,
            format         : usernameFormat,
            prohibited     : usernameProhibited,
        },
        password : {
            minLength      : passwordMinLength,
            maxLength      : passwordMaxLength,
            hasUppercase   : passwordHasUppercase,
            hasLowercase   : passwordHasLowercase,
            prohibited     : passwordProhibited,
        },
    } = credentialsConfigServer;
    
    
    
    //#region configs
    const session     : SessionOptions = {
        strategy  : 'database',
        
        maxAge    : sessionMaxAge    * 60 * 60 /* convert hours to seconds */,
        updateAge : sessionUpdateAge * 60 * 60 /* convert hours to seconds */,
        
        generateSessionToken() {
            return randomUUID();
        },
    };
    const authOptions : NextAuthOptions = {
        adapter   : adapter as any,
        session   : session,
        providers : [
            // credentials providers:
            CredentialsProvider({
                name         : 'Credentials',
                credentials  : {
                    username : { label: 'Username or Email', type: 'text'    , placeholder: 'jsmith' },
                    password : { label: 'Password'         , type: 'password'                        },
                },
                async authorize(credentials, req): Promise<AdapterUser|null> {
                    // conditions:
                    if (!credentials) return null; // a credentials must be provided to be verified
                    
                    
                    
                    // get user by valid credentials:
                    try {
                        const now    = new Date();
                        const result = await adapter.credentialsSignIn(credentials as CredentialsSignIn, {
                            now                  : now,
                            requireEmailVerified : signInRequireVerifiedEmail,
                            failureMaxAttempts   : signInFailureMaxAttempts,
                            failureLockDuration  : signInFailureLockDuration,
                        });
                        if (result === null) return null;
                        if (result === false) {
                            console.log('EMAIL UNVERIFIED', result); // TODO: remove log
                            throw Error(`Your email has not been verified. Please activate your account by clicking on the link sent to your email.`);
                        }
                        if (result instanceof Date) {
                            console.log('LOGIN LOCKED', result); // TODO: remove log
                            throw Error(`Your account is locked due to too many login attempts. Please try again ${moment(now).to(result)}.`);
                        }
                        return result;
                    }
                    catch {
                        return null; // something was wrong when reading database => unable to verify
                    } // try
                },
            }) as NextAuthCredentialsConfig,
            
            // OAuth providers:
            ...(oAuthProviders as unknown[] as NextAuthOAuthConfig<any>[]),
        ],
        callbacks : {
            ...callbacks,
            
            async signIn(params) {
                const result = callbacks?.signIn?.(params);
                if ((result === true) || (typeof(result) === 'string')) return result;
                
                
                
                const {
                    user,
                    account,
                } = params;
                
                
                
                if (!('emailVerified' in user)) {
                    // sign up (register a new user)
                    
                    
                    
                    if (!signUpEnabled) return false;
                    
                    
                    
                    const newUser : User = {
                        id    : user.id,
                        name  : user.name  ?? '',
                        email : user.email ?? '',
                        image : user.image ?? null,
                    };
                    if (!newUser.name ) return false; // the name  field is required to be stored to model User => sign up failed
                    if (!newUser.email) return false; // the email field is required to be stored to model User => sign up failed
                }
                else {
                    // sign in (existing user)
                    
                    
                    
                    // const dbUser : AdapterUser = user;
                } // if
                
                
                
                if ((account?.type === 'oauth') && (!('emailVerified' in user) || (user.emailVerified === null))) {
                    const markEmailAsVerified = async () => {
                        // login with oAuth is also intrinsically verifies the email:
                        const now = new Date();
                        await adapter.markEmailAsVerified(user.id, {
                            now : now,
                        });
                        (user as any).emailVerified = now; // update the data
                    };
                    if (!('emailVerified' in user)) {
                        // no update: the `User` record is not yet created
                    }
                    else {
                        // immediately update:
                        await markEmailAsVerified();
                    } // if
                } // if
                
                
                
                // all verification passed => logged in
                return true;
            },
            async jwt(params) {
                const {
                    token,
                    user,
                    account,
                } = params;
                
                
                
                // assigning additional data to session:
                if (account) { // if `account` exist, this means that the callback is being invoked for the first time (i.e. the user is being signed in).
                    // add a related userId to token:
                    if (!('userId' in token)) token.userId = user.id;
                    
                    
                    
                    // add a related credentials to token object:
                    const credentials = (
                        !!user.id
                        ? adapter.getCredentialsByUserId(user.id)           // faster
                        :   !!user.email
                            ? adapter.getCredentialsByUserEmail(user.email) // slower
                            : null
                    );
                    if (credentials) token.credentials = credentials;
                    
                    
                    
                    // add a related role to token object:
                    const role = (
                        !!user.id
                        ? adapter.getRoleByUserId(user.id)           // faster
                        :   !!user.email
                            ? adapter.getRoleByUserEmail(user.email) // slower
                            : null
                    );
                    if (role) token.role = role;
                } // if
                
                
                
                // the token object will be attached to the client side cookie:
                return callbacks?.jwt?.({ ...params, token }) ?? token;
            },
            async session(params) {
                const {
                    session,
                    user: dbUser,
                } = params;
                
                
                
                // assigning additional data to session:
                const sessionUser = session.user;
                if (sessionUser) {
                    // add a related userId to sessionUser:
                    if (!('id' in sessionUser)) (sessionUser as unknown as User).id = dbUser.id;
                    
                    
                    
                    // add a related credentials to session object:
                    const credentials = (
                        !!dbUser.id
                        ? await adapter.getCredentialsByUserId(dbUser.id)           // faster
                        :   !!dbUser.email
                            ? await adapter.getCredentialsByUserEmail(dbUser.email) // slower
                            : null
                    );
                    if (credentials) session.credentials = credentials;
                    
                    
                    
                    // add a related role to session object:
                    const role = (
                        !!dbUser.id
                        ? await adapter.getRoleByUserId(dbUser.id)           // faster
                        :   !!dbUser.email
                            ? await adapter.getRoleByUserEmail(dbUser.email) // slower
                            : null
                    );
                    if (role) session.role = role;
                } // if
                
                
                
                // the session object will be synced to the client side:
                return callbacks?.session?.({ ...params, session }) ?? session;
            },
        },
        pages     : {
            signIn        : signInPath,
         // signOut       : '/auth/signout',
            error         : signInPath, // Error code passed in query string as ?error=
         // verifyRequest : '/auth/verify-request', // Check your email: A sign in link has been sent to your email address.
         // newUser       : '/auth/new-user',       // New users will be directed here on first sign in (leave the property out if not of interest)
        },
    };
    //#endregion configs
    
    
    
    //#region custom handlers
    // password resets:
    const requestPasswordResetRouteHandler       = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
        // conditions:
        if (!resetEnabled)                         return false; // ignore
        
        
        
        // filters the request type:
        if (req.method !== 'POST')                 return false; // ignore
        if (context.params.nextauth?.[0] !== path) return false; // ignore
        
        
        
        // validate the request parameter(s):
        const {
            username,
        } = await getRequestData(req);
        if ((typeof(username) !== 'string') || !username) {
            return NextResponse.json({
                error: 'The required username or email is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if (username.length > 50) { // prevents of DDOS attack
            return NextResponse.json({
                error: 'The username or email is too long.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        // create a new passwordResetToken and then send a link of passwordResetToken to the user's email:
        try {
            // create a new passwordResetToken:
            const now    = new Date();
            const result = await adapter.createPasswordResetToken(username, {
                now           : now,
                resetThrottle : resetThrottle,
                resetMaxAge   : resetMaxAge,
            });
            if (!result) {
                // the user account is not found => reject:
                return NextResponse.json({
                    error: 'There is no user with the specified username or email.',
                }, { status: 404 }); // handled with error
            } // if
            if (result instanceof Date) {
                // the reset request is too frequent => reject:
                return NextResponse.json({
                    error: `The password reset request is too often. Please try again ${moment(now).to(result)}.`,
                }, { status: 400 }); // handled with error
            } // if
            const {
                passwordResetToken,
                user,
            } = result;
            
            
            
            // generate a link to a page for resetting password:
            const resetLinkUrl = `${businessUrl ?? ''}${signInPath}?passwordResetToken=${encodeURIComponent(passwordResetToken)}`
            
            
            
            // send a link of passwordResetToken to the user's email:
            const { renderToStaticMarkup } = await import('react-dom/server');
            const businessContextProviderProps  : BusinessContextProviderProps = {
                // data:
                model : {
                    name : businessName,
                    url  : businessUrl,
                },
            };
            const transporter = nodemailer.createTransport({
                host     : emailResetHost,
                port     : emailResetPort,
                secure   : emailResetSecure,
                auth     : {
                    user : emailResetUsername,
                    pass : emailResetPassword,
                },
            });
            try {
                await transporter.sendMail({
                    from    : emailResetFrom, // sender address
                    to      : user.email, // list of receivers
                    subject : renderToStaticMarkup(
                        <BusinessContextProvider {...businessContextProviderProps}>
                            <PasswordResetContextProvider url={resetLinkUrl}>
                                <UserContextProvider model={user}>
                                    {emailResetSubject}
                                </UserContextProvider>
                            </PasswordResetContextProvider>
                        </BusinessContextProvider>
                    ).replace(/[\r\n\t]+/g, ' ').trim(),
                    html    : renderToStaticMarkup(
                        <BusinessContextProvider {...businessContextProviderProps}>
                            <PasswordResetContextProvider url={resetLinkUrl}>
                                <UserContextProvider model={user}>
                                    {emailResetMessage}
                                </UserContextProvider>
                            </PasswordResetContextProvider>
                        </BusinessContextProvider>
                    ),
                });
            }
            finally {
                transporter.close();
            } // try
            
            
            
            // report the success:
            return NextResponse.json({
                ok      : true,
                message : 'A password reset link sent to your email. Please check your inbox in a moment.',
            }); // handled with success
        }
        catch (error: any) {
            // report the failure:
            return NextResponse.json({
                error:
`Oops, there was an error while resetting your password.

There was a problem on our server.
The server may be busy or currently under maintenance.

Please try again in a few minutes.
If the problem still persists, please contact our technical support.`,
            }, { status: 500 }); // handled with error
        } // try
    };
    const validatePasswordResetRouteHandler      = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
        // conditions:
        if (!resetEnabled)                         return false; // ignore
        
        
        
        // filters the request type:
        if (req.method !== 'GET')                  return false; // ignore
        if (context.params.nextauth?.[0] !== path) return false; // ignore
        
        
        
        // validate the request parameter(s):
        const {
            passwordResetToken,
        } = await getRequestData(req);
        if ((typeof(passwordResetToken) !== 'string') || !passwordResetToken) {
            return NextResponse.json({
                error: 'The required password reset token is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if (passwordResetToken.length > 50) { // prevents of DDOS attack
            return NextResponse.json({
                error: 'The password reset token is too long.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        // find the related email & username by given passwordResetToken:
        try {
            const result = await adapter.validatePasswordResetToken(passwordResetToken, {
                now : new Date(),
            });
            if (!result) {
                return NextResponse.json({
                    error: 'The password reset token is invalid or expired.',
                }, { status: 404 }); // handled with error
            } // if
            
            
            
            // report the success:
            return NextResponse.json({
                ok       : true,
                email    : result.email,
                username : result.username,
            }); // handled with success
        }
        catch (error: any) {
            // report the failure:
            return NextResponse.json({
                error:
`Oops, there was an error while validating your token.

There was a problem on our server.
The server may be busy or currently under maintenance.

Please try again in a few minutes.
If the problem still persists, please contact our technical support.`,
            }, { status: 500 }); // handled with error
        } // try
    };
    const usePasswordResetRouteHandler           = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
        // conditions:
        if (!resetEnabled)                         return false; // ignore
        
        
        
        // filters the request type:
        if (req.method !== 'PATCH')                return false; // ignore
        if (context.params.nextauth?.[0] !== path) return false; // ignore
        
        
        
        // validate the request parameter(s):
        const {
            passwordResetToken,
            password,
        } = await getRequestData(req);
        if ((typeof(passwordResetToken) !== 'string') || !passwordResetToken) {
            return NextResponse.json({
                error: 'The required password reset token is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if (passwordResetToken.length > 50) { // prevents of DDOS attack
            return NextResponse.json({
                error: 'The password reset token is too long.',
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(password) !== 'string') || !password) {
            return NextResponse.json({
                error: 'The required password is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(passwordMinLength) === 'number') && Number.isFinite(passwordMinLength) && (password.length < passwordMinLength)) {
            return NextResponse.json({
                error: `The password is too short. Minimum is ${passwordMinLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(passwordMaxLength) === 'number') && Number.isFinite(passwordMaxLength) && (password.length > passwordMaxLength)) {
            return NextResponse.json({
                error: `The password is too long. Maximum is ${passwordMaxLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if (passwordHasUppercase && !password.match(/[A-Z]/)) {
            return NextResponse.json({
                error: `The password must have at least one capital letter.`,
            }, { status: 400 }); // handled with error
        } // if
        if (passwordHasLowercase && !password.match(/[a-z]/)) {
            return NextResponse.json({
                error: `The password must have at least one non-capital letter.`,
            }, { status: 400 }); // handled with error
        } // if
        
        const validationPasswordNotProhibited = await checkPasswordNotProhibitedRouteHandler(req, context, '');
        if (validationPasswordNotProhibited && !validationPasswordNotProhibited.ok) return validationPasswordNotProhibited;
        
        
        
        try {
            const result = await adapter.usePasswordResetToken(passwordResetToken, password, {
                now : new Date(),
            });
            if (!result) {
                return NextResponse.json({
                    error: 'The password reset token is invalid or expired.',
                }, { status: 404 }); // handled with error
            } // if
            
            
            
            return NextResponse.json({
                ok       : true,
                message  : 'The password has been successfully changed. Now you can sign in with the new password.',
            }); // handled with success
        }
        catch (error: any) {
            return NextResponse.json({
                error:
`Oops, there was an error while resetting your password.

There was a problem on our server.
The server may be busy or currently under maintenance.

Please try again in a few minutes.
If the problem still persists, please contact our technical support.`,
            }, { status: 500 }); // handled with error
        } // try
    };
    
    // registrations:
    const checkUsernameAvailabilityRouteHandler  = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
        // conditions:
        if (!signUpEnabled)                            return false; // ignore
        
        
        
        // filters the request type:
        if (path) {
            if (req.method !== 'GET')                  return false; // ignore
            if (context.params.nextauth?.[0] !== path) return false; // ignore
        } // if
        
        
        
        // validate the request parameter(s):
        const {
            username,
        } = await getRequestData(req);
        if ((typeof(username) !== 'string') || !username) {
            return NextResponse.json({
                error: 'The required username is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(usernameMinLength) === 'number') && Number.isFinite(usernameMinLength) && (username.length < usernameMinLength)) {
            return NextResponse.json({
                error: `The username is too short. Minimum is ${usernameMinLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(usernameMaxLength) === 'number') && Number.isFinite(usernameMaxLength) && (username.length > usernameMaxLength)) {
            return NextResponse.json({
                error: `The username is too long. Maximum is ${usernameMaxLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if (!username.match(usernameFormat)) {
            return NextResponse.json({
                error: `The username is not well formatted.`,
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        try {
            const result = await adapter.checkUsernameAvailability(username);
            if (!result) {
                return NextResponse.json({
                    error: `The username "${username}" is already taken.`,
                }, { status: 409 }); // handled with error
            } // if
            
            
            
            return NextResponse.json({
                ok       : true,
                message  : `The username "${username}" can be used.`,
            }); // handled with success
        }
        catch (error: any) {
            return NextResponse.json({
                error:
`Oops, there was an error while checking username availability.

There was a problem on our server.
The server may be busy or currently under maintenance.

Please try again in a few minutes.
If the problem still persists, please contact our technical support.`,
            }, { status: 500 }); // handled with error
        } // try
    };
    const checkEmailAvailabilityRouteHandler     = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
        // conditions:
        if (!signUpEnabled)                            return false; // ignore
        
        
        
        // filters the request type:
        if (path) {
            if (req.method !== 'GET')                  return false; // ignore
            if (context.params.nextauth?.[0] !== path) return false; // ignore
        } // if
        
        
        
        // validate the request parameter(s):
        const {
            email,
        } = await getRequestData(req);
        if ((typeof(email) !== 'string') || !email) {
            return NextResponse.json({
                error: 'The required email is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(emailMinLength) === 'number') && Number.isFinite(emailMinLength) && (email.length < emailMinLength)) {
            return NextResponse.json({
                error: `The email is too short. Minimum is ${emailMinLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(emailMaxLength) === 'number') && Number.isFinite(emailMaxLength) && (email.length > emailMaxLength)) {
            return NextResponse.json({
                error: `The email is too long. Maximum is ${emailMaxLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if (!email.match(emailFormat)) {
            return NextResponse.json({
                error: `The email is not well formatted.`,
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        try {
            const result = await adapter.checkEmailAvailability(email);
            if (!result) {
                return NextResponse.json({
                    error: `The email "${email}" is already taken.`,
                }, { status: 409 }); // handled with error
            } // if
            
            
            
            return NextResponse.json({
                ok       : true,
                message  : `The email "${email}" can be used.`,
            }); // handled with success
        }
        catch (error: any) {
            return NextResponse.json({
                error:
`Oops, there was an error while checking email availability.

There was a problem on our server.
The server may be busy or currently under maintenance.

Please try again in a few minutes.
If the problem still persists, please contact our technical support.`,
            }, { status: 500 }); // handled with error
        } // try
    };
    const checkUsernameNotProhibitedRouteHandler = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
        // conditions:
        if (!signUpEnabled)                            return false; // ignore
        
        
        
        // filters the request type:
        if (path) {
            if (req.method !== 'PUT')                  return false; // ignore
            if (context.params.nextauth?.[0] !== path) return false; // ignore
        } // if
        
        
        
        // validate the request parameter(s):
        const {
            username,
        } = await getRequestData(req);
        if ((typeof(username) !== 'string') || !username) {
            return NextResponse.json({
                error: 'The required username is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(usernameMinLength) === 'number') && Number.isFinite(usernameMinLength) && (username.length < usernameMinLength)) {
            return NextResponse.json({
                error: `The username is too short. Minimum is ${usernameMinLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(usernameMaxLength) === 'number') && Number.isFinite(usernameMaxLength) && (username.length > usernameMaxLength)) {
            return NextResponse.json({
                error: `The username is too long. Maximum is ${usernameMaxLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if (!username.match(usernameFormat)) {
            return NextResponse.json({
                error: `The username is not well formatted.`,
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        if (((): boolean => {
            for (const prohibited of usernameProhibited) {
                if (prohibited instanceof RegExp) {
                    if (prohibited.test(username)) return true; // prohibited word found
                }
                else {
                    if (prohibited === username  ) return true; // prohibited word found
                } // if
            } // for
            
            return false; // all checks passed, no prohibited word was found
        })()) {
            return NextResponse.json({
                error: `The username "${username}" is prohibited.`,
            }, { status: 409 }); // handled with error
        } // if
        
        
        
        return NextResponse.json({
            ok       : true,
            message  : `The username "${username}" can be used.`,
        }); // handled with success
    };
    const checkPasswordNotProhibitedRouteHandler = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
        // conditions:
        if (!signUpEnabled && !resetEnabled)           return false; // ignore
        
        
        
        // filters the request type:
        if (path) {
            if (req.method !== 'PUT')                  return false; // ignore
            if (context.params.nextauth?.[0] !== path) return false; // ignore
        } // if
        
        
        
        // validate the request parameter(s):
        const {
            password,
        } = await getRequestData(req);
        if ((typeof(password) !== 'string') || !password) {
            return NextResponse.json({
                error: 'The required password is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(passwordMinLength) === 'number') && Number.isFinite(passwordMinLength) && (password.length < passwordMinLength)) {
            return NextResponse.json({
                error: `The password is too short. Minimum is ${passwordMinLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(passwordMaxLength) === 'number') && Number.isFinite(passwordMaxLength) && (password.length > passwordMaxLength)) {
            return NextResponse.json({
                error: `The password is too long. Maximum is ${passwordMaxLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if (passwordHasUppercase && !password.match(/[A-Z]/)) {
            return NextResponse.json({
                error: `The password must have at least one capital letter.`,
            }, { status: 400 }); // handled with error
        } // if
        if (passwordHasLowercase && !password.match(/[a-z]/)) {
            return NextResponse.json({
                error: `The password must have at least one non-capital letter.`,
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        if (((): boolean => {
            for (const prohibited of passwordProhibited) {
                if (prohibited instanceof RegExp) {
                    if (prohibited.test(password)) return true; // prohibited word found
                }
                else {
                    if (prohibited === password  ) return true; // prohibited word found
                } // if
            } // for
            
            return false; // all checks passed, no prohibited word was found
        })()) {
            return NextResponse.json({
                error: `The password "${password}" is prohibited.`,
            }, { status: 409 }); // handled with error
        } // if
        
        
        
        return NextResponse.json({
            ok       : true,
            message  : `The password "${password}" can be used.`,
        }); // handled with success
    };
    const signUpRouteHandler                     = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
        // conditions:
        if (!signUpEnabled)                        return false; // ignore
        
        
        
        // filters the request type:
        if (req.method !== 'POST')                 return false; // ignore
        if (context.params.nextauth?.[0] !== path) return false; // ignore
        
        
        
        // validate the request parameter(s):
        const {
            name,
            email,
            username,
            password,
        } = await getRequestData(req);
        if ((typeof(name) !== 'string') || !name) {
            return NextResponse.json({
                error: 'The required name is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(nameMinLength) === 'number') && Number.isFinite(nameMinLength) && (name.length < nameMinLength)) {
            return NextResponse.json({
                error: `The name is too short. Minimum is ${nameMinLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(nameMaxLength) === 'number') && Number.isFinite(nameMaxLength) && (name.length > nameMaxLength)) {
            return NextResponse.json({
                error: `The name is too long. Maximum is ${nameMaxLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        
        const validationEmailAvailability     = await checkEmailAvailabilityRouteHandler(req, context, '');
        if (validationEmailAvailability     && !validationEmailAvailability.ok    ) return validationEmailAvailability;
        
        const validationUsernameAvailability  = await checkUsernameAvailabilityRouteHandler(req, context, '');
        if (validationUsernameAvailability  && !validationUsernameAvailability.ok ) return validationUsernameAvailability;
        
        const validationUsernameNotProhibited = await checkUsernameNotProhibitedRouteHandler(req, context, '');
        if (validationUsernameNotProhibited && !validationUsernameNotProhibited.ok) return validationUsernameNotProhibited;
        
        const validationPasswordNotProhibited = await checkPasswordNotProhibitedRouteHandler(req, context, '');
        if (validationPasswordNotProhibited && !validationPasswordNotProhibited.ok) return validationPasswordNotProhibited;
        
        
        
        try {
            const {
                emailConfirmationToken,
            } = await adapter.registerUser(name, email, username, password, {
                requireEmailVerified : signInRequireVerifiedEmail,
            });
            
            
            if (emailConfirmationToken) {
                // generate a link to a page for confirming email:
                const emailConfirmationLinkUrl = `${businessUrl ?? ''}${signInPath}?emailConfirmationToken=${encodeURIComponent(emailConfirmationToken)}`
                
                
                
                // send a link of emailConfirmationToken to the user's email:
                const { renderToStaticMarkup } = await import('react-dom/server');
                const businessContextProviderProps  : BusinessContextProviderProps = {
                    // data:
                    model : {
                        name : businessName,
                        url  : businessUrl,
                    },
                };
                const transporter = nodemailer.createTransport({
                    host     : emailSignUpHost,
                    port     : emailSignUpPort,
                    secure   : emailSignUpSecure,
                    auth     : {
                        user : emailSignUpUsername,
                        pass : emailSignUpPassword,
                    },
                });
                try {
                    await transporter.sendMail({
                        from    : emailSignUpFrom, // sender address
                        to      : email, // list of receivers
                        subject : renderToStaticMarkup(
                            <BusinessContextProvider {...businessContextProviderProps}>
                                <EmailConfirmationContextProvider url={emailConfirmationLinkUrl}>
                                    <UserContextProvider model={{
                                        name  : name,
                                        email : email,
                                    }}>
                                        {emailSignUpSubject}
                                    </UserContextProvider>
                                </EmailConfirmationContextProvider>
                            </BusinessContextProvider>
                        ).replace(/[\r\n\t]+/g, ' ').trim(),
                        html    : renderToStaticMarkup(
                            <BusinessContextProvider {...businessContextProviderProps}>
                                <EmailConfirmationContextProvider url={emailConfirmationLinkUrl}>
                                    <UserContextProvider model={{
                                        name  : name,
                                        email : email,
                                    }}>
                                        {emailSignUpMessage}
                                    </UserContextProvider>
                                </EmailConfirmationContextProvider>
                            </BusinessContextProvider>
                        ),
                    });
                }
                finally {
                    transporter.close();
                } // try
            } // if
            
            
            
            return NextResponse.json({
                ok       : true,
                message  :
                    !emailConfirmationToken
                    ? 'Your account has been successfully created.\n\nNow you can sign in with the new username and password.'
                    : 'Your account has been successfully created.\n\nWe have sent a confirmation link to your email to activate your account. Please check your inbox in a moment.'
                ,
            }, { status: !emailConfirmationToken ? 200 : 201 }); // handled with success
        }
        catch (error: any) {
            return NextResponse.json({
                error:
`Oops, there was an error while registering your account.

There was a problem on our server.
The server may be busy or currently under maintenance.

Please try again in a few minutes.
If the problem still persists, please contact our technical support.`,
            }, { status: 500 }); // handled with error
        } // try
    };
    
    // email verifications:
    const useEmailConfirmationRouteHandler       = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
        // conditions:
        if (!signUpEnabled)                        return false; // ignore
        
        
        
        // filters the request type:
        if (req.method !== 'PATCH')                return false; // ignore
        if (context.params.nextauth?.[0] !== path) return false; // ignore
        
        
        
        // validate the request parameter(s):
        const {
            emailConfirmationToken,
        } = await getRequestData(req);
        if ((typeof(emailConfirmationToken) !== 'string') || !emailConfirmationToken) {
            return NextResponse.json({
                error: 'The required email confirmation token is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if (emailConfirmationToken.length > 50) { // prevents of DDOS attack
            return NextResponse.json({
                error: 'The email confirmation token is too long.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        try {
            const result = await adapter.useEmailConfirmationToken(emailConfirmationToken, {
                now : new Date(),
            });
            if (!result) {
                return NextResponse.json({
                    error: 'The email confirmation token is invalid or expired.',
                }, { status: 404 }); // handled with error
            } // if
            
            
            
            return NextResponse.json({
                ok       : true,
                message  : 'Your email has been successfully confirmed. Now you can sign in with your username (or email) and password.',
            }); // handled with success
        }
        catch (error: any) {
            return NextResponse.json({
                error:
`Oops, there was an error while confirming your token.

There was a problem on our server.
The server may be busy or currently under maintenance.

Please try again in a few minutes.
If the problem still persists, please contact our technical support.`,
            }, { status: 500 }); // handled with error
        } // try
    };
    //#endregion custom handlers
    
    
    
    // built in handlers:
    const nextAuthHandler                        = async (req: Request, context: NextAuthRouteContext): Promise<Response> => {
        /*
            The next-auth design limitation:
            The `CredentialsProvider` is NOT COMPATIBLE with `Database Sessions`.
            In order to the `CredentialsProvider` to WORK with `Database Sessions`,
            a `session` + `cookie` HACK is used to force next-auth to treat the authenticated user as loggedIn.
            
            Check if this sign in callback is being called in the credentials authentication flow.
            If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
            
            Credit:
            https://nneko.branche.online/next-auth-credentials-provider-with-the-database-session-strategy/
        */
        const isUpdatingCookie : boolean     = (session.strategy === 'database') && (
            (req.method === 'POST')
            &&
            context.params.nextauth.includes('callback')
            &&
            context.params.nextauth.includes('credentials')
        );
        let sessionCookie      : string|null = null;
        
        
        
        const response = await NextAuth(req as NextRequest, context, {
            ...authOptions,
            callbacks : {
                ...authOptions.callbacks,
                async signIn(params) {
                    if (isUpdatingCookie) {
                        // extract the user detail:
                        const {user: userDetail} = params;
                        
                        
                        
                        // generate the sessionToken data:
                        const sessionToken  = await session.generateSessionToken();
                        const sessionMaxAge = session.maxAge /* relative time from now in seconds */ * 1000 /* convert seconds to milliseconds */;
                        const sessionExpiry = new Date(Date.now() + sessionMaxAge);
                        
                        
                        
                        // create the sessionToken record into database:
                        await adapter.createSession?.({
                            sessionToken : sessionToken,
                            expires      : sessionExpiry,
                            
                            userId       : userDetail.id,
                        });
                        
                        
                        
                        const useSecureCookies = (process.env.AUTH_URL ?? process.env.NEXTAUTH_URL)?.startsWith?.('https://') ?? !!process.env.VERCEL;
                        const cookiePrefix     = useSecureCookies ? '__Secure-' : '';
                        const {
                            sessionToken : {
                                name : cookieName,
                                options : {
                                    httpOnly : cookieHttpOnly,
                                    sameSite : cookieSameSite,
                                    path     : cookiePath,
                                    secure   : cookieSecure,
                                },
                            },
                        } = { // defaultCookies(useSecureCookies); // not exported from 'next-auth/core/lib/cookie.js' / '@auth/core/lib/utils/cookie.js'
                            sessionToken: {
                                // name: `${cookiePrefix}authjs.session-token`,
                                name: `${cookiePrefix}next-auth.session-token`,
                                options: {
                                    httpOnly : true  as boolean,
                                    sameSite : 'lax' as string|boolean,
                                    path     : '/',
                                    secure   : useSecureCookies,
                                },
                            },
                        };
                        const cookieSameSiteValue = (() => {
                            switch (cookieSameSite) {
                                case 'lax':
                                    return 'Lax';
                                
                                case true:
                                case 'strict':
                                    return 'Strict';
                                
                                case 'none':
                                    return 'None';
                                
                                case false:
                                default:
                                    return '';
                            } // switch
                        })();
                        // const cookieName     = `${isSecureCookie ? '__Secure-' : ''}next-auth.session-token`;
                        // create the sessionToken record into cookie:
                        // const cookies = new Cookies(req, context);
                        // cookies.set(cookieName, sessionToken, {
                        //     path         : '/',
                        //     expires      : sessionExpiry,
                        //     httpOnly     : true,
                        //     secure       : true,
                        //     sameSite     : 'lax',
                        // });
                        sessionCookie = `${cookieName}=${sessionToken}; Path=${cookiePath}; Expires=${sessionExpiry.toUTCString()};${cookieHttpOnly ? ' HttpOnly;' : '' }${cookieSecure ? ' Secure;' : '' }${cookieSameSiteValue ? ` SameSite=${cookieSameSiteValue}` : ''}`;
                    } // if
                    
                    
                    
                    // config's origin signIn handler:
                    return await authOptions.callbacks?.signIn?.(params) ?? true;
                },
            },
            jwt : {
                async encode(params) {
                    if (isUpdatingCookie) return ''; // force not to use jwt token => fallback to database token
                    
                    
                    
                    // jwt's built in encode handler:
                    return encode(params as any);
                },
                async decode(params) {
                    if (isUpdatingCookie) return null; // force not to use jwt token => fallback to database token
                    
                    
                    
                    // jwt's built in decode handler:
                    return decode(params as any);
                },
            },
        });
        
        
        
        if (!!sessionCookie) {
            response.headers.append('Set-Cookie', sessionCookie);
        } // if
        
        
        
        return response;
    };
    
    
    
    // merged handlers:
    const mergedRouteHandler                     = async (req: Request, context: NextAuthRouteContext): Promise<Response> => {
        return (
            // password resets:
            await requestPasswordResetRouteHandler(req, context, passwordResetPath)
            ||
            await validatePasswordResetRouteHandler(req, context, passwordResetPath)
            ||
            await usePasswordResetRouteHandler(req, context, passwordResetPath)
            
            ||
            
            // registrations:
            await checkEmailAvailabilityRouteHandler(req, context, emailValidationPath)
            ||
            await checkUsernameAvailabilityRouteHandler(req, context, usernameValidationPath)
            ||
            await checkUsernameNotProhibitedRouteHandler(req, context, usernameValidationPath)
            ||
            await checkPasswordNotProhibitedRouteHandler(req, context, passwordValidationPath)
            ||
            await signUpRouteHandler(req, context, signUpPath)
            
            ||
            
            // email verifications:
            await useEmailConfirmationRouteHandler(req, context, emailConfirmationPath)
            
            ||
            
            // built in handlers:
            await nextAuthHandler(req, context)
        );
    };
    
    
    
    return {
        authHandler : mergedRouteHandler,
        authOptions,
    };
};

// specific next-js /app auth handlers:
export const createAuthRouteHandler = (options: CreateAuthHandlerOptions) => {
    const {
        authHandler,
        authOptions,
    } = createNextAuthHandler(options);
    
    
    
    const authRouteHandler = async (req: NextRequest, context: NextAuthRouteContext): Promise<Response> => {
        // responses HEAD request as success:
        if(req.method === 'HEAD') return new Response(null, { status: 200 });
        
        
        
        return await authHandler(req, context);
    };
    authRouteHandler.authOptions = authOptions;
    return authRouteHandler;
};

// specific next-js /pages auth handlers:
export const createAuthApiHandler   = (options: CreateAuthHandlerOptions) => {
    const {
        authHandler,
        authOptions,
    } = createNextAuthHandler(options);
    
    
    
    const nextApiWrapperHandler = async (req: NextApiRequest, res: NextApiResponse, handler: (request: Request, context: NextAuthRouteContext) => Promise<false|Response>): Promise<boolean> => {
        const response = await handler(
            /* request: */ new Request(new URL(req.url ?? '/', 'https://localhost').href, {
                method : req.method,
                body   : /^(POST|PUT|PATCH)$/i.test(req.method ?? '') ? JSON.stringify(req.body) : null,
            }),
            /* context: */ {
                params : {
                    nextauth : req.query.nextauth as string[],
                },
            }
        );
        if (!response) return false;
        
        
        
        for (const [headerKey, headerValue] of response.headers.entries()) {
            res.setHeader(headerKey, headerValue);
        } // for
        res.status(response.status).send(await response.text());
        return true;
    };
    const authApiHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
        // responses HEAD request as success:
        if(req.method === 'HEAD') return res.status(200).send(null);
        
        
        
        await nextApiWrapperHandler(req, res, (request, context) =>
            authHandler(request, context)
        );
    };
    authApiHandler.authOptions = authOptions;
    return authApiHandler;
};
