// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import * as styles          from './templates/styles.js'

// auth-js:
import GoogleProvider       from '@auth/core/providers/google'
import FacebookProvider     from '@auth/core/providers/facebook'
import InstagramProvider    from '@auth/core/providers/instagram'
import TwitterProvider      from '@auth/core/providers/twitter'

// templates:
import {
    // react components:
    Business,
}                           from './templates/Business.js'
import {
    // react components:
    EmailConfirmation,
}                           from './templates/EmailConfirmation.js'
import {
    // react components:
    User,
}                           from './templates/User.js'
import {
    // react components:
    ResetPassword,
}                           from './templates/ResetPassword.js'

// internals:
import type {
    // types:
    AuthConfig,
}                           from './types.js'



export const defaultAuthConfig : AuthConfig = {
    business : {
        name                 : process.env.BUSINESS_NAME ?? '',
        url                  : process.env.BUSINESS_URL  ?? '',
    },
    signUp : {
        enabled              : true,
    },
    signIn : {
        requireVerifiedEmail : true,
        failureMaxAttempts   : 5    /* times */,
        failureLockDuration  : 0.25 /* hours */,
        path                 : '/auth/signin',
    },
    reset : {
        throttle             : 0.25 /* hours */,
        maxAge               : 24   /* hours */,
    },
    session : {
        maxAge               : 24   /* hours */,
        updateAge            : 6    /* hours */,
    },
    
    
    
    oAuthProviders                     : [
        GoogleProvider({
            clientId     : process.env.GOOGLE_ID        ?? '',
            clientSecret : process.env.GOOGLE_SECRET    ?? '',
            allowDangerousEmailAccountLinking: true,
        }),
        FacebookProvider({
            clientId     : process.env.FACEBOOK_ID      ?? '',
            clientSecret : process.env.FACEBOOK_SECRET  ?? '',
            allowDangerousEmailAccountLinking: true,
        }),
        InstagramProvider({
            clientId     : process.env.INSTAGRAM_ID     ?? '',
            clientSecret : process.env.INSTAGRAM_SECRET ?? '',
            allowDangerousEmailAccountLinking: true,
        }),
        TwitterProvider({
            clientId     : process.env.TWITTER_ID       ?? '',
            clientSecret : process.env.TWITTER_SECRET   ?? '',
            // @ts-ignore
            version      : '2.0',
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    
    
    
    emails                             : {
        signUp : {
            host     : process.env.EMAIL_SIGNUP_HOST     ?? '',
            port     : Number.parseInt(process.env.EMAIL_SIGNUP_PORT ?? '465'),
            secure   : (process.env.EMAIL_SIGNUP_SECURE === 'true'),
            username : process.env.EMAIL_SIGNUP_USERNAME ?? '',
            password : process.env.EMAIL_SIGNUP_PASSWORD ?? '',
            
            from     : process.env.EMAIL_SIGNUP_FROM ?? '',
            subject  : <>
                Your Account Registration at <Business.Name />
            </>,
            message  : <article style={styles.article}>
                <p>
                    Hi <User.Name />.
                </p>
                <p>
                    You&apos;ve successfully signed up for an account at {process.env.BUSINESS_NAME || process.env.WEBSITE_URL || 'our website'}.
                </p>
                <p>
                    In order to sign in to our website,
                    you need to confirm your email address by clicking on the link below:
                    <br />
                    <EmailConfirmation.Link>
                        Confirm Your Email
                    </EmailConfirmation.Link>
                </p>
                <p>
                    Or copy and paste the URL into your browser:
                    <br />
                    <u>
                        <EmailConfirmation.Url />
                    </u>
                </p>
                <p>
                    If you did not signed up on our website then please ignore this email.
                </p>
            </article>,
        },
        reset  : {
            host     : process.env.EMAIL_RESET_HOST     ?? '',
            port     : Number.parseInt(process.env.EMAIL_RESET_PORT ?? '465'),
            secure   : (process.env.EMAIL_RESET_SECURE === 'true'),
            username : process.env.EMAIL_RESET_USERNAME ?? '',
            password : process.env.EMAIL_RESET_PASSWORD ?? '',
            
            from     : process.env.EMAIL_RESET_FROM ?? '',
            subject  : <>
                Password Reset Request at <Business.Name />
            </>,
            message  : <article style={styles.article}>
                <p>
                    Hi <User.Name />.
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
            </article>,
        },
    },
};
