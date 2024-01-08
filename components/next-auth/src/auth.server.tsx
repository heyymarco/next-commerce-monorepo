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
    ResetPasswordContextProvider,
}                           from './templates/resetPasswordContext.js'

// internals:
import type {
    // types:
    AuthConfig,
    CredentialsConfig,
    
    
    
    // models:
    User,
    AdapterUser,
}                           from './types.js'
import type {
    Credentials,
    AdapterWithCredentials,
}                           from './PrismaAdapterWithCredentials.js'
import {
    signUpPath             as defaultSignUpPath,
    resetPasswordPath      as defaultResetPasswordPath,
    usernameValidationPath as defaultUsernameValidationPath,
    emailValidationPath    as defaultEmailValidationPath,
    passwordValidationPath as defaultPasswordValidationPath,
    emailConfirmationPath  as defaultEmailConfirmationPath,
}                           from './api-paths.js'

// configs:
import {
    defaultAuthConfig,
}                           from './auth.config.server.js'



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
    adapter            : AdapterWithCredentials
    authConfig         : AuthConfig
    credentialsConfig  : CredentialsConfig
    callbacks         ?: NextAuthOptions['callbacks']
}
export interface NextAuthRouteContext {
    params : { nextauth: string[] }
}
const createNextAuthHandler         = (options: CreateAuthHandlerOptions) => {
    // options:
    const {
        adapter,
        authConfig = defaultAuthConfig,
        credentialsConfig,
        callbacks,
    } = options;
    
    const {
        business : {
            name                 : businessName               = defaultAuthConfig.business.name,
            url                  : businessUrl                = defaultAuthConfig.business.url,
        },
        signUp : {
            enabled              : signUpEnabled              = defaultAuthConfig.signUp.enabled,
        },
        signIn : {
            requireVerifiedEmail : signInRequireVerifiedEmail = defaultAuthConfig.signIn.requireVerifiedEmail,
            failureMaxAttempts   : signInFailureMaxAttempts   = defaultAuthConfig.signIn.failureMaxAttempts,
            failureLockDuration  : signInFailureLockDuration  = defaultAuthConfig.signIn.failureLockDuration,
            path                 : signInPath                 = defaultAuthConfig.signIn.path,
        },
        reset : {
            throttle             : resetThrottle              = defaultAuthConfig.reset.throttle,
            maxAge               : resetMaxAge                = defaultAuthConfig.reset.maxAge,
        },
        session : {
            maxAge               : sessionMaxAge              = defaultAuthConfig.session.maxAge,
            updateAge            : sessionUpdateAge           = defaultAuthConfig.session.updateAge,
        },
        
        
        
        oAuthProviders                                        = defaultAuthConfig.oAuthProviders,
        
        
        
        emails : {
            signUp               : {
                host             : emailsSignUpHost           = defaultAuthConfig.emails.signUp.host,
                port             : emailsSignUpPort           = defaultAuthConfig.emails.signUp.port,
                secure           : emailsSignUpSecure         = defaultAuthConfig.emails.signUp.secure,
                username         : emailsSignUpUsername       = defaultAuthConfig.emails.signUp.username,
                password         : emailsSignUpPassword       = defaultAuthConfig.emails.signUp.password,
                
                from             : emailsSignUpFrom           = defaultAuthConfig.emails.signUp.from,
                subject          : emailsSignUpSubject        = defaultAuthConfig.emails.signUp.subject,
                message          : emailsSignUpMessage        = defaultAuthConfig.emails.signUp.message,
            },
            reset                : {
                host             : emailsResetHost            = defaultAuthConfig.emails.reset.host,
                port             : emailsResetPort            = defaultAuthConfig.emails.reset.port,
                secure           : emailsResetSecure          = defaultAuthConfig.emails.reset.secure,
                username         : emailsResetUsername        = defaultAuthConfig.emails.reset.username,
                password         : emailsResetPassword        = defaultAuthConfig.emails.reset.password,
                
                from             : emailsResetFrom            = defaultAuthConfig.emails.reset.from,
                subject          : emailsResetSubject         = defaultAuthConfig.emails.reset.subject,
                message          : emailsResetMessage         = defaultAuthConfig.emails.reset.message,
            },
        },
    } = authConfig;
    
    
    
    //#region configs
    const session     : SessionOptions = {
        strategy  : 'database',
        
        maxAge    : sessionMaxAge,
        updateAge : sessionUpdateAge,
        
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
                        const result = await adapter.validateCredentials(credentials as Credentials, {
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
                    
                    
                    
                    const newUser : User = user;
                    if (!newUser.name ) return false; // the name  field is required to be stored to model User => sign up failed
                    if (!newUser.email) return false; // the email field is required to be stored to model User => sign up failed
                }
                else {
                    // sign in (existing user)
                    
                    
                    
                    // const dbUser : AdapterUser = user;
                } // if
                
                
                
                if ((account?.type === 'oauth') && (!('emailVerified' in user) || (user.emailVerified === null))) {
                    const markUserEmailAsVerified = async () => {
                        // login with oAuth is also intrinsically verifies the email:
                        const now = new Date();
                        await adapter.markUserEmailAsVerified(user.id, {
                            now : now,
                        });
                        (user as any).emailVerified = now; // update the data
                    };
                    if (!('emailVerified' in user)) {
                        // no update: the `User` record is not yet created
                    }
                    else {
                        // immediately update:
                        await markUserEmailAsVerified();
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
                
                
                
                // assigning userRole(s):
                if (account) { // if `account` exist, this means that the callback is being invoked for the first time (i.e. the user is being signed in).
                    // add a related role to token object:
                    const role = (
                        !!user.id
                        ? adapter.getRoleByUserId(user.id)           // faster
                        :   !!user.email
                            ? adapter.getRoleByUserEmail(user.email) // slower
                            : null
                    );
                    token.role = role;
                } // if
                
                
                
                // the token object will be attached to the client side cookie:
                return callbacks?.jwt?.({ ...params, token }) ?? token;
            },
            async session(params) {
                const {
                    session,
                    user: dbUser,
                } = params;
                
                
                
                // assigning userRole(s):
                const sessionUser = session.user;
                if (sessionUser) {
                    // add a related role to session object:
                    const role = (
                        !!dbUser.id
                        ? await adapter.getRoleByUserId(dbUser.id)           // faster
                        :   !!dbUser.email
                            ? await adapter.getRoleByUserEmail(dbUser.email) // slower
                            : null
                    );
                    session.role = role ?? null;
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
    // general_implementation custom handlers:
    const requestPasswordResetRouteHandler       = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
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
        
        
        
        // create a new resetPasswordToken and then send a link of resetPasswordToken to the user's email:
        try {
            // create a new resetPasswordToken:
            const now    = new Date();
            const result = await adapter.createResetPasswordToken(username, {
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
                resetPasswordToken,
                user,
            } = result;
            
            
            
            // generate a link to a page for resetting password:
            const resetLinkUrl = `${process.env.WEBSITE_URL ?? ''}${signInPath}?resetPasswordToken=${encodeURIComponent(resetPasswordToken)}`
            
            
            
            // send a link of resetPasswordToken to the user's email:
            const { renderToStaticMarkup } = await import('react-dom/server');
            const businessContextProviderProps  : BusinessContextProviderProps = {
                // data:
                model : {
                    name : businessName,
                    url  : businessUrl,
                },
            };
            const transporter = nodemailer.createTransport({
                host     : emailsResetHost,
                port     : emailsResetPort,
                secure   : emailsResetSecure,
                auth     : {
                    user : emailsResetUsername,
                    pass : emailsResetPassword,
                },
            });
            try {
                await transporter.sendMail({
                    from    : emailsResetFrom, // sender address
                    to      : user.email, // list of receivers
                    subject : renderToStaticMarkup(
                        <BusinessContextProvider {...businessContextProviderProps}>
                            <ResetPasswordContextProvider url={resetLinkUrl}>
                                <UserContextProvider model={user}>
                                    {emailsResetSubject}
                                </UserContextProvider>
                            </ResetPasswordContextProvider>
                        </BusinessContextProvider>
                    ).replace(/[\r\n\t]+/g, ' ').trim(),
                    html    : renderToStaticMarkup(
                        <BusinessContextProvider {...businessContextProviderProps}>
                            <ResetPasswordContextProvider url={resetLinkUrl}>
                                <UserContextProvider model={user}>
                                    {emailsResetMessage}
                                </UserContextProvider>
                            </ResetPasswordContextProvider>
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
        // filters the request type:
        if (req.method !== 'GET')                  return false; // ignore
        if (context.params.nextauth?.[0] !== path) return false; // ignore
        
        
        
        // validate the request parameter(s):
        const {
            resetPasswordToken,
        } = await getRequestData(req);
        if ((typeof(resetPasswordToken) !== 'string') || !resetPasswordToken) {
            return NextResponse.json({
                error: 'The required reset password token is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if (resetPasswordToken.length > 50) { // prevents of DDOS attack
            return NextResponse.json({
                error: 'The reset password token is too long.',
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        // find the related email & username by given resetPasswordToken:
        try {
            const result = await adapter.validateResetPasswordToken(resetPasswordToken, {
                now : new Date(),
            });
            if (!result) {
                return NextResponse.json({
                    error: 'The reset password token is invalid or expired.',
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
    const applyPasswordResetRouteHandler         = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
        // filters the request type:
        if (req.method !== 'PATCH')                return false; // ignore
        if (context.params.nextauth?.[0] !== path) return false; // ignore
        
        
        
        // validate the request parameter(s):
        const {
            resetPasswordToken,
            password,
        } = await getRequestData(req);
        if ((typeof(resetPasswordToken) !== 'string') || !resetPasswordToken) {
            return NextResponse.json({
                error: 'The required reset password token is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        if (resetPasswordToken.length > 50) { // prevents of DDOS attack
            return NextResponse.json({
                error: 'The reset password token is too long.',
            }, { status: 400 }); // handled with error
        } // if
        if ((typeof(password) !== 'string') || !password) {
            return NextResponse.json({
                error: 'The required password is not provided.',
            }, { status: 400 }); // handled with error
        } // if
        const passwordMinLength = credentialsConfig.PASSWORD_MIN_LENGTH;
        if ((typeof(passwordMinLength) === 'number') && Number.isFinite(passwordMinLength) && (password.length < passwordMinLength)) {
            return NextResponse.json({
                error: `The password is too short. Minimum is ${passwordMinLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        const passwordMaxLength = credentialsConfig.PASSWORD_MAX_LENGTH;
        if ((typeof(passwordMaxLength) === 'number') && Number.isFinite(passwordMaxLength) && (password.length > passwordMaxLength)) {
            return NextResponse.json({
                error: `The password is too long. Maximum is ${passwordMaxLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        const passwordHasUppercase = credentialsConfig.PASSWORD_HAS_UPPERCASE;
        if (passwordHasUppercase && !password.match(/[A-Z]/)) {
            return NextResponse.json({
                error: `The password must have at least one capital letter.`,
            }, { status: 400 }); // handled with error
        } // if
        const passwordHasLowercase = credentialsConfig.PASSWORD_HAS_LOWERCASE;
        if (passwordHasLowercase && !password.match(/[a-z]/)) {
            return NextResponse.json({
                error: `The password must have at least one non-capital letter.`,
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        try {
            const result = await adapter.applyResetPasswordToken(resetPasswordToken, password, {
                now : new Date(),
            });
            if (!result) {
                return NextResponse.json({
                    error: 'The reset password token is invalid or expired.',
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
    const checkEmailAvailabilityRouteHandler     = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
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
        const emailMinLength = credentialsConfig.EMAIL_MIN_LENGTH;
        if ((typeof(emailMinLength) === 'number') && Number.isFinite(emailMinLength) && (email.length < emailMinLength)) {
            return NextResponse.json({
                error: `The email is too short. Minimum is ${emailMinLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        const emailMaxLength = credentialsConfig.EMAIL_MAX_LENGTH;
        if ((typeof(emailMaxLength) === 'number') && Number.isFinite(emailMaxLength) && (email.length > emailMaxLength)) {
            return NextResponse.json({
                error: `The email is too long. Maximum is ${emailMaxLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if (!email.match(credentialsConfig.EMAIL_FORMAT)) {
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
    const checkUsernameAvailabilityRouteHandler  = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
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
        const usernameMinLength = credentialsConfig.USERNAME_MIN_LENGTH;
        if ((typeof(usernameMinLength) === 'number') && Number.isFinite(usernameMinLength) && (username.length < usernameMinLength)) {
            return NextResponse.json({
                error: `The username is too short. Minimum is ${usernameMinLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        const usernameMaxLength = credentialsConfig.USERNAME_MAX_LENGTH;
        if ((typeof(usernameMaxLength) === 'number') && Number.isFinite(usernameMaxLength) && (username.length > usernameMaxLength)) {
            return NextResponse.json({
                error: `The username is too long. Maximum is ${usernameMaxLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if (!username.match(credentialsConfig.USERNAME_FORMAT)) {
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
    const checkUsernameNotProhibitedRouteHandler = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
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
        const usernameMinLength = credentialsConfig.USERNAME_MIN_LENGTH;
        if ((typeof(usernameMinLength) === 'number') && Number.isFinite(usernameMinLength) && (username.length < usernameMinLength)) {
            return NextResponse.json({
                error: `The username is too short. Minimum is ${usernameMinLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        const usernameMaxLength = credentialsConfig.USERNAME_MAX_LENGTH;
        if ((typeof(usernameMaxLength) === 'number') && Number.isFinite(usernameMaxLength) && (username.length > usernameMaxLength)) {
            return NextResponse.json({
                error: `The username is too long. Maximum is ${usernameMaxLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        if (!username.match(credentialsConfig.USERNAME_FORMAT)) {
            return NextResponse.json({
                error: `The username is not well formatted.`,
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        if (((): boolean => {
            for (const prohibited of credentialsConfig.USERNAME_PROHIBITED) {
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
        const passwordMinLength = credentialsConfig.PASSWORD_MIN_LENGTH;
        if ((typeof(passwordMinLength) === 'number') && Number.isFinite(passwordMinLength) && (password.length < passwordMinLength)) {
            return NextResponse.json({
                error: `The password is too short. Minimum is ${passwordMinLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        const passwordMaxLength = credentialsConfig.PASSWORD_MAX_LENGTH;
        if ((typeof(passwordMaxLength) === 'number') && Number.isFinite(passwordMaxLength) && (password.length > passwordMaxLength)) {
            return NextResponse.json({
                error: `The password is too long. Maximum is ${passwordMaxLength} characters.`,
            }, { status: 400 }); // handled with error
        } // if
        
        
        
        if (((): boolean => {
            for (const prohibited of credentialsConfig.PASSWORD_PROHIBITED) {
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
        // filters the request type:
        if (req.method !== 'POST')                 return false; // ignore
        if (context.params.nextauth?.[0] !== path) return false; // ignore
        
        
        
        // validate the request parameter(s):
        const validation1 = await checkEmailAvailabilityRouteHandler(req, context, '');
        if (validation1 && !validation1.ok) return validation1;
        
        const validation2 = await checkUsernameAvailabilityRouteHandler(req, context, '');
        if (validation2 && !validation2.ok) return validation2;
        
        const validation3 = await checkUsernameNotProhibitedRouteHandler(req, context, '');
        if (validation3 && !validation3.ok) return validation3;
        
        const validation4 = await checkPasswordNotProhibitedRouteHandler(req, context, '');
        if (validation4 && !validation4.ok) return validation4;
        
        const {
            fullname,
            email,
            username,
            password,
        } = await getRequestData(req);
        
        
        
        try {
            const {
                emailConfirmationToken,
            } = await adapter.registerUser(fullname, email, username, password, {
                requireEmailVerified : signInRequireVerifiedEmail,
            });
            
            
            if (emailConfirmationToken) {
                // generate a link to a page for confirming email:
                const emailConfirmationLinkUrl = `${process.env.WEBSITE_URL ?? ''}${signInPath}?emailConfirmationToken=${encodeURIComponent(emailConfirmationToken)}`
                
                
                
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
                    host     : emailsSignUpHost,
                    port     : emailsSignUpPort,
                    secure   : emailsSignUpSecure,
                    auth     : {
                        user : emailsSignUpUsername,
                        pass : emailsSignUpPassword,
                    },
                });
                try {
                    await transporter.sendMail({
                        from    : emailsSignUpFrom, // sender address
                        to      : email, // list of receivers
                        subject : renderToStaticMarkup(
                            <BusinessContextProvider {...businessContextProviderProps}>
                                <EmailConfirmationContextProvider url={emailConfirmationLinkUrl}>
                                    <UserContextProvider model={{
                                        name  : fullname,
                                        email : email,
                                    }}>
                                        {emailsSignUpSubject}
                                    </UserContextProvider>
                                </EmailConfirmationContextProvider>
                            </BusinessContextProvider>
                        ).replace(/[\r\n\t]+/g, ' ').trim(),
                        html    : renderToStaticMarkup(
                            <BusinessContextProvider {...businessContextProviderProps}>
                                <EmailConfirmationContextProvider url={emailConfirmationLinkUrl}>
                                    <UserContextProvider model={{
                                        name  : fullname,
                                        email : email,
                                    }}>
                                        {emailsSignUpMessage}
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
                    ? 'Your account has been successfully created. Now you can sign in with the new username and password.'
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
    const applyEmailConfirmationRouteHandler     = async (req: Request, context: NextAuthRouteContext, path: string): Promise<false|Response> => {
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
            const result = await adapter.applyEmailConfirmationToken(emailConfirmationToken, {
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
    
    // specific next-js /app custom handlers:
    interface CustomRouteHandlerOptions {
        resetPasswordPath      ?: string
        usernameValidationPath ?: string
        emailValidationPath    ?: string
        passwordValidationPath ?: string
        signUpPath             ?: string
        emailConfirmationPath  ?: string
    }
    const customRouteHandler                     = async (req: Request, context: NextAuthRouteContext, options?: CustomRouteHandlerOptions): Promise<false|Response> => {
        // options:
        const {
            resetPasswordPath      = defaultResetPasswordPath,
            usernameValidationPath = defaultUsernameValidationPath,
            emailValidationPath    = defaultEmailValidationPath,
            passwordValidationPath = defaultPasswordValidationPath,
            signUpPath             = defaultSignUpPath,
            emailConfirmationPath  = defaultEmailConfirmationPath,
        } = options ?? {};
        
        
        
        return (
            await requestPasswordResetRouteHandler(req, context, resetPasswordPath)
            ||
            await validatePasswordResetRouteHandler(req, context, resetPasswordPath)
            ||
            await applyPasswordResetRouteHandler(req, context, resetPasswordPath)
            ||
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
            await applyEmailConfirmationRouteHandler(req, context, emailConfirmationPath)
        );
    };
    
    // specific next-js /pages custom handlers:
    const customApiHandler                       = async (req: NextApiRequest, res: NextApiResponse  , options?: CustomRouteHandlerOptions): Promise<boolean> => {
        const customRouteResponse = await customRouteHandler(
            new Request(new URL(req.url ?? '/', 'https://localhost').href, {
                method : req.method,
                body   : /^(POST|PUT|PATCH)$/i.test(req.method ?? '') ? JSON.stringify(req.body) : null,
            }),
            {
                params : {
                    nextauth : req.query.nextauth as string[],
                },
            },
            options
        );
        if (!customRouteResponse) return false;
        
        
        
        for (const [headerKey, headerValue] of customRouteResponse.headers.entries()) {
            res.setHeader(headerKey, headerValue);
        } // for
        res.status(customRouteResponse.status).send(await customRouteResponse.text());
        return true;
    };
    //#endregion custom handlers
    
    
    
    //#region next-auth's built in handlers
    const nextAuthHandler                   = async (req: Request|NextApiRequest, contextOrRes: NextAuthRouteContext|NextApiResponse, isCredentialsCallback: (() => boolean)): Promise<any> => {
        const isDatabaseSession = (session.strategy === 'database');
        let sessionCookie : string|null = null;
        
        
        
        const response = await NextAuth(req as any, contextOrRes as any, {
            ...authOptions,
            callbacks : {
                ...authOptions.callbacks,
                async signIn(params) {
                    if (isDatabaseSession && isCredentialsCallback()) {
                        // extract the user detail:
                        const {user: userDetail} = params;
                        
                        
                        
                        // generate the sessionToken data:
                        const sessionToken  = await session.generateSessionToken();
                        const sessionMaxAge = session.maxAge /* relative time from now in seconds */ * 1000 /* convert to milliseconds */;
                        const sessionExpiry = new Date(Date.now() + sessionMaxAge);
                        
                        
                        
                        // create the sessionToken record into database:
                        await adapter.createSession?.({
                            sessionToken : sessionToken,
                            expires      : sessionExpiry,
                            
                            userId       : userDetail.id,
                        });
                        
                        
                        
                        const isSecureCookie = process.env.NEXTAUTH_URL?.startsWith?.('https://') ?? !!process.env.VERCEL;
                        const cookieName     = `${isSecureCookie ? '__Secure-' : ''}next-auth.session-token`;
                        // create the sessionToken record into cookie:
                        // const cookies = new Cookies(req as any, contextOrRes as any);
                        // cookies.set(cookieName, sessionToken, {
                        //     path         : '/',
                        //     expires      : sessionExpiry,
                        //     httpOnly     : true,
                        //     sameSite     : 'lax',
                        // });
                        sessionCookie = `${cookieName}=${sessionToken}; Path=/; Expires=${sessionExpiry.toUTCString()}; HttpOnly;${isSecureCookie ? ' Secure;' : '' } SameSite=Lax`;
                    } // if
                    
                    
                    
                    // config's origin signIn handler:
                    return await authOptions.callbacks?.signIn?.(params) ?? true;
                },
            },
            jwt : {
                async encode(params) {
                    if (isDatabaseSession && isCredentialsCallback()) return ''; // force not to use jwt token => fallback to database token
                    
                    
                    
                    // jwt's built in encode handler:
                    return encode(params as any);
                },
                async decode(params) {
                    if (isDatabaseSession && isCredentialsCallback()) return null; // force not to use jwt token => fallback to database token
                    
                    
                    
                    // jwt's built in decode handler:
                    return decode(params as any);
                },
            },
        });
        
        
        
        if (!!sessionCookie) {
            if (!(contextOrRes as any).params) {
                (contextOrRes as NextApiResponse).appendHeader('Set-Cookie', sessionCookie);
            }
            else if (response instanceof Response) {
                response.headers.append('Set-Cookie', sessionCookie);
            } // if
        } // if
        
        
        
        return response;
    };
    //#endregion next-auth's built in handlers
    
    
    
    return {
        customRouteHandler,
        customApiHandler,
        nextAuthHandler,
        authOptions,
    };
};

// specific next-js /app auth handlers:
export const createAuthRouteHandler = (options: CreateAuthHandlerOptions) => {
    const {
        customRouteHandler,
        nextAuthHandler,
        authOptions,
    } = createNextAuthHandler(options);
    
    
    
    const authRouteHandler = async (req: NextRequest, context: NextAuthRouteContext): Promise<Response> => {
        // responses HEAD request as success:
        if(req.method === 'HEAD') return new Response(null, { status: 200 });
        
        
        
        // custom handlers:
        const customRouteResponse = await customRouteHandler(req, context);
        if (customRouteResponse) return customRouteResponse;
        
        
        
        // tests:
        const isCredentialsCallback = (): boolean => (
            (req.method === 'POST')
            &&
            !!context.params.nextauth
            &&
            context.params.nextauth.includes('callback')
            &&
            context.params.nextauth.includes('credentials')
        );
        
        
        
        return await nextAuthHandler(req, context, isCredentialsCallback);
    };
    authRouteHandler.authOptions = authOptions;
    return authRouteHandler;
};

// specific next-js /pages auth handlers:
export const createAuthApiHandler   = (options: CreateAuthHandlerOptions) => {
    const {
        customApiHandler,
        nextAuthHandler,
        authOptions,
    } = createNextAuthHandler(options);
    
    
    
    const authApiHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
        // responses HEAD request as success:
        if(req.method === 'HEAD') return res.status(200).send(null);
        
        
        
        // custom handlers:
        if (await customApiHandler(req, res)) return;
        
        
        
        // tests:
        const isCredentialsCallback = (): boolean => (
            (req.method === 'POST')
            &&
            !!req.query.nextauth
            &&
            req.query.nextauth.includes('callback')
            &&
            req.query.nextauth.includes('credentials')
        );
        
        
        
        await nextAuthHandler(req, res, isCredentialsCallback);
    };
    authApiHandler.authOptions = authOptions;
    return authApiHandler;
};
