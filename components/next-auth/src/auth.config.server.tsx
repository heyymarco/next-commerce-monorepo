// react:
import {
    // react:
    default as React,
}                           from 'react'

// OAuth providers:
import type {
    OAuthConfig,
}                           from 'next-auth/providers'
import GoogleProvider       from 'next-auth/providers/google'
import FacebookProvider     from 'next-auth/providers/facebook'
import InstagramProvider    from 'next-auth/providers/instagram'
import TwitterProvider      from 'next-auth/providers/twitter'

// templates:
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



export interface AuthConfig {
    PAGE_SIGNIN_PATH                   : string
    
    
    
    USER_SIGNUP_ENABLE                 : boolean
    
    EMAIL_SIGNUP_SUBJECT               : string
    EMAIL_SIGNUP_MESSAGE               : React.ReactNode
    
    
    
    USER_SIGNIN_REQUIRE_EMAIL_VERIFIED : boolean
    USER_SIGNIN_FAILURE_MAX_ATTEMPS    : number /* times */
    USER_SIGNIN_FAILURE_LOCK_DURATION  : number /* hours */
    
    
    
    SESSION_MAX_AGE                    : number /* hours */
    SESSION_UPDATE_AGE                 : number /* hours */
    
    
    
    EMAIL_RESET_SUBJECT                : string
    EMAIL_RESET_MESSAGE                : React.ReactNode
    EMAIL_RESET_LIMITS                 : number /* hours */
    EMAIL_RESET_MAX_AGE                : number /* hours */
    
    
    
    oAuthProviders                     : OAuthConfig<any>[]
}
export const defaultAuthConfig : AuthConfig = {
    PAGE_SIGNIN_PATH                   : '/auth/signin',
    
    
    
    USER_SIGNUP_ENABLE                 : true,
    
    EMAIL_SIGNUP_SUBJECT               : `Your Account Registration at ${process.env.BUSINESS_NAME || process.env.WEBSITE_URL || 'our website'}`,
    EMAIL_SIGNUP_MESSAGE               : <>
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
    </>,
    
    
    
    USER_SIGNIN_REQUIRE_EMAIL_VERIFIED : true,
    USER_SIGNIN_FAILURE_MAX_ATTEMPS    : 5    /* times */,
    USER_SIGNIN_FAILURE_LOCK_DURATION  : 0.25 /* hours */,
    
    
    
    SESSION_MAX_AGE                    : 24   /* hours */,
    SESSION_UPDATE_AGE                 : 6    /* hours */,
    
    
    
    EMAIL_RESET_SUBJECT                : 'Password Reset Request',
    EMAIL_RESET_MESSAGE                : <>
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
    </>,
    EMAIL_RESET_LIMITS                 : 0.25 /* hours */,
    EMAIL_RESET_MAX_AGE                : 24   /* hours */,
    
    
    
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
            version      : '2.0',
            allowDangerousEmailAccountLinking: true,
        }),
    ],
};
