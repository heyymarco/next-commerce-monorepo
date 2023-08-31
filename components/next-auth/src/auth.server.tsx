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

// next-auth:
import {
    // types:
    type NextAuthOptions,
    type SessionOptions,
    
    
    
    // routers:
    default as NextAuthFix,
    
    
    
    // models:
    type User,
}                           from 'next-auth'
import {
    // cryptos:
    encode,
    decode,
}                           from 'next-auth/jwt'
import type {
    // models:
    AdapterUser,
}                           from 'next-auth/adapters'

// credentials providers:
import {
    default as CredentialsProviderFix,
}                           from 'next-auth/providers/credentials'

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

// ORMs:
import type {
    PrismaClient,
}                           from '@prisma/client'

// templates:
import {
    // react components:
    UserContextProvider,
}                           from './templates/userContext.js'
import {
    // react components:
    ResetPasswordContextProvider,
}                           from './templates/resetPasswordContext.js'
import {
    // react components:
    User as TemplateUser,
}                           from './templates/User.js'
import {
    // react components:
    ResetPassword,
}                           from './templates/ResetPassword.js'

// configs:
import type {
    AuthConfig,
}                           from './auth.config.server.js'
import type {
    CredentialsConfig,
}                           from './credentials.config.js'

// internals:
import {
    PrismaAdapterWithCredentials,
}                           from './PrismaAdapterWithCredentials.js'



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



const transporter = nodemailer.createTransport({
    host     :  process.env.EMAIL_RESET_SERVER_HOST ?? '',
    port     : Number.parseInt(process.env.EMAIL_RESET_SERVER_PORT ?? '465'),
    secure   : (process.env.EMAIL_RESET_SERVER_SECURE === 'true'),
    auth     : {
        user :  process.env.EMAIL_RESET_SERVER_USERNAME,
        pass :  process.env.EMAIL_RESET_SERVER_PASSWORD,
    },
});



// general_implementation auth handlers:
export interface CreateAuthHandlerOptions {
    prisma            : PrismaClient
    authConfig        : AuthConfig
    credentialsConfig : CredentialsConfig
}
export interface NextAuthRouteContext {
    params : { nextauth: string[] }
}
const createNextAuthHandler         = (options: CreateAuthHandlerOptions) => {
    // options:
    const {
        prisma,
        authConfig,
        credentialsConfig,
    } = options;
    
    
    
    //#region configs
    const adapter     = PrismaAdapterWithCredentials(prisma);
    const session     : SessionOptions = {
        strategy  : 'database',
        
        maxAge    : (authConfig.SESSION_MAX_AGE    ?? 24) * 60 * 60, // hours
        updateAge : (authConfig.SESSION_UPDATE_AGE ??  6) * 60 * 60, // hours
        
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
                        const result = await adapter.validateCredentials(credentials, {
                            now                 : new Date(),
                            failureMaxAttemps   : (authConfig.USER_SIGNIN_FAILURE_MAX_ATTEMPS   ?? null),
                            failureLockDuration : (authConfig.USER_SIGNIN_FAILURE_LOCK_DURATION ?? 0.25),
                        });
                        if (result === null) return null;
                        if (result instanceof Date) return null;
                        return result;
                    }
                    catch {
                        return null; // something was wrong when reading database => unable to verify
                    } // try
                },
            }),
            
            // OAuth providers:
            ...authConfig.oAuthProviders ?? [],
        ],
        callbacks : {
            async signIn({ user, account, credentials, profile: oAuthProfile }) {
                if (!('emailVerified' in user)) {
                    // sign up (register a new user)
                    
                    
                    
                    // if sign up is disabled => refuse any registration:
                    const envUserSignupEnable = process.env.USER_SIGNUP_ENABLE ?? '';
                    const    userSignupEnable = (
                        !!envUserSignupEnable
                        ? (envUserSignupEnable === 'true')
                        : authConfig.USER_SIGNUP_ENABLE
                    );
                    if (!userSignupEnable) return false;
                    
                    
                    
                    const newUser : User = user;
                    if (!newUser.name ) return false; // the name  field is required to be stored to model User => sign up failed
                    if (!newUser.email) return false; // the email field is required to be stored to model User => sign up failed
                }
                else {
                    // sign in (existing user)
                    
                    
                    
                    // const dbUser : AdapterUser = user;
                } // if
                
                
                
                // all verification passed => logged in
                return true;
            },
            async jwt({ token, user, account, profile: oAuthProfile }) {
                // assigning userRole(s):
                if (account) { // if `account` exist, this means that the callback is being invoked for the first time (i.e. the user is being signed in).
                    // TODO: read roles from database
                    token.userRole ='admin';
                } // if
                
                
                
                // the token object will be attached to the client side cookie:
                return token;
            },
            async session({ session, user: dbUser, token }) {
                // assigning userRole(s):
                const sessionUser = session.user;
                if (sessionUser) {
                    // TODO: read roles from database
                    // sessionUser.userRole ='admin';
                } // if
                
                
                
                // the session object will be synced to the client side:
                return session;
            },
        },
        pages     : {
            signIn        : authConfig.PAGE_SIGNIN_PATH,
         // signOut       : '/auth/signout',
            error         : authConfig.PAGE_SIGNIN_PATH, // Error code passed in query string as ?error=
         // verifyRequest : '/auth/verify-request',      // Check your email: A sign in link has been sent to your email address.
         // newUser       : '/auth/new-user',            // New users will be directed here on first sign in (leave the property out if not of interest)
        },
    };
    //#endregion configs
    
    
    
    //#region password_reset handlers
    // general_implementation password_reset handlers:
    const requestPasswordResetRouteHandler  = async (req: Request, context: NextAuthRouteContext, resetPath: string): Promise<false|Response> => {
        // filters the request type:
        if (req.method !== 'POST')                      return false; // ignore
        if (context.params.nextauth?.[0] !== resetPath) return false; // ignore
        
        
        
        // validate the request parameter(s):
        const {
            username,
        } = await req.json();
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
                now,
                resetLimitInHours : (authConfig.EMAIL_RESET_LIMITS  ?? 0.25),
                emailResetMaxAge  : (authConfig.EMAIL_RESET_MAX_AGE ?? 24),
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
            const resetLinkUrl = `${process.env.WEBSITE_URL}${authConfig.PAGE_SIGNIN_PATH}?resetPasswordToken=${encodeURIComponent(resetPasswordToken)}`
            
            
            
            // send a link of resetPasswordToken to the user's email:
            const { renderToStaticMarkup } = await import('react-dom/server');
            await transporter.sendMail({
                from    : process.env.EMAIL_RESET_FROM, // sender address
                to      : user.email, // list of receivers
                subject : authConfig.EMAIL_RESET_SUBJECT ?? 'Password Reset Request',
                html    : renderToStaticMarkup(
                    <ResetPasswordContextProvider url={resetLinkUrl}>
                        <UserContextProvider model={user}>
                            {
                                authConfig.EMAIL_RESET_MESSAGE
                                ??
                                <>
                                    <p>
                                        Hi <TemplateUser.Name />.
                                    </p>
                                    <p>
                                        <strong>
                                            Forgot your password?
                                        </strong>
                                        <br />
                                        We received a request to reset the password for your account.
                                    </p>
                                    <p>
                                        To reset your password, click on the link below:
                                        <br />
                                        <ResetPassword.Link>
                                            Reset Password
                                        </ResetPassword.Link>
                                    </p>
                                    <p>
                                        Or copy and paste the URL into your browser:
                                        <br />
                                        <u>
                                            <ResetPassword.Url />
                                        </u>
                                    </p>
                                    <p>
                                        If you did not make this request then please ignore this email.
                                    </p>
                                </>
                            }
                        </UserContextProvider>
                    </ResetPasswordContextProvider>
                ),
            });
            
            
            
            // report the success:
            return NextResponse.json({
                ok      : true,
                message : 'A password reset link sent to your email. Please check your inbox in a moment.',
            }); // handled with success
        }
        catch (error: any) {
            // report the failure:
            console.log('send email failed: ', error); // TODO: remove log
            return NextResponse.json({
                error:
`Oops, there was an error for resetting your password.

There was a problem on our server.
The server may be busy or currently under maintenance.

Please try again in a few minutes.
If the problem still persists, please contact our technical support.`,
            }, { status: 500 }); // handled with error
        } // try
    };
    const validatePasswordResetRouteHandler = async (req: Request, context: NextAuthRouteContext, resetPath: string): Promise<false|Response> => {
        // filters the request type:
        if (req.method !== 'GET')                       return false; // ignore
        if (context.params.nextauth?.[0] !== resetPath) return false; // ignore
        
        
        
        // validate the request parameter(s):
        const {
            resetPasswordToken,
        } = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
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
`Oops, there was an error for validating your token.

There was a problem on our server.
The server may be busy or currently under maintenance.

Please try again in a few minutes.
If the problem still persists, please contact our technical support.`,
            }, { status: 500 }); // handled with error
        } // try
    };
    const applyPasswordResetRouteHandler    = async (req: Request, context: NextAuthRouteContext, resetPath: string): Promise<false|Response> => {
        // filters the request type:
        if (req.method !== 'PATCH')                     return false; // ignore
        if (context.params.nextauth?.[0] !== resetPath) return false; // ignore
        
        
        
        // validate the request parameter(s):
        const {
            resetPasswordToken,
            password,
        } = await req.json();
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
`Oops, there was an error for resetting your password.

There was a problem on our server.
The server may be busy or currently under maintenance.

Please try again in a few minutes.
If the problem still persists, please contact our technical support.`,
            }, { status: 500 }); // handled with error
        } // try
    };
    
    // specific next-js /app password_reset handlers:
    const passwordResetRouteHandler         = async (req: Request, context: NextAuthRouteContext, resetPath: string): Promise<false|Response> => {
        return (
            await requestPasswordResetRouteHandler(req, context, resetPath)
            ||
            await validatePasswordResetRouteHandler(req, context, resetPath)
            ||
            await applyPasswordResetRouteHandler(req, context, resetPath)
        );
    };
    
    // specific next-js /pages password_reset handlers:
    const passwordResetApiHandler           = async (req: NextApiRequest, res: NextApiResponse, resetPath: string): Promise<boolean> => {
        const passwordResetRouteResponse = await passwordResetRouteHandler(
            new Request(new URL(req.url ?? '/', 'https://localhost').href, {
                method : req.method,
                body   : /^(POST|PUT|PATCH)$/i.test(req.method ?? '') ? JSON.stringify(req.body) : null,
            }),
            {
                params : {
                    nextauth : req.query.nextauth as string[],
                },
            },
            resetPath
        );
        if (!passwordResetRouteResponse) return false;
        
        
        
        for (const [headerKey, headerValue] of passwordResetRouteResponse.headers.entries()) {
            res.setHeader(headerKey, headerValue);
        } // for
        res.status(passwordResetRouteResponse.status).send(await passwordResetRouteResponse.text());
        return true;
    };
    //#endregion password_reset handlers
    
    
    
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
                        
                        
                        
                        // create the sessionToken record into cookie:
                        // const cookies = new Cookies(req as any, contextOrRes as any);
                        // cookies.set('next-auth.session-token', sessionToken, {
                        //     path         : '/',
                        //     expires      : sessionExpiry,
                        //     httpOnly     : true,
                        //     sameSite     : 'lax',
                        // });
                        sessionCookie = `next-auth.session-token=${sessionToken}; Path=/; Expires=${sessionExpiry.toUTCString()}; HttpOnly; SameSite=Lax`;
                    } // if
                    
                    
                    
                    // config's origin signIn handler:
                    return await authOptions.callbacks?.signIn?.(params) ?? true;
                },
            },
            jwt : {
                async encode(params) {
                    if (isDatabaseSession && isCredentialsCallback()) return ''; // force not to use jwt token => fallback to database token
                    
                    
                    
                    // jwt's built in encode handler:
                    return encode(params);
                },
                async decode(params) {
                    if (isDatabaseSession && isCredentialsCallback()) return null; // force not to use jwt token => fallback to database token
                    
                    
                    
                    // jwt's built in decode handler:
                    return decode(params);
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
        passwordResetRouteHandler,
        passwordResetApiHandler,
        nextAuthHandler,
    };
};

// specific next-js /app auth handlers:
export const createAuthRouteHandler = (options: CreateAuthHandlerOptions) => {
    const {
        passwordResetRouteHandler,
        nextAuthHandler,
    } = createNextAuthHandler(options);
    
    
    
    return async (req: NextRequest, context: NextAuthRouteContext): Promise<Response> => {
        // responses HEAD request as success:
        if(req.method === 'HEAD') return new Response(null, { status: 200 });
        
        
        
        // custom handlers:
        const passwordResetRouteResponse = await passwordResetRouteHandler(req, context, 'reset');
        if (passwordResetRouteResponse) return passwordResetRouteResponse;
        
        
        
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
};

// specific next-js /pages auth handlers:
export const createAuthApiHandler   = (options: CreateAuthHandlerOptions) => {
    const {
        passwordResetApiHandler,
        nextAuthHandler,
    } = createNextAuthHandler(options);
    
    
    
    return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
        // responses HEAD request as success:
        if(req.method === 'HEAD') return res.status(200).send(null);
        
        
        
        // custom handlers:
        if (await passwordResetApiHandler(req, res, 'reset')) return;
        
        
        
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
};
