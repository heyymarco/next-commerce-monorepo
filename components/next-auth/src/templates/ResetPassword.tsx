// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useResetPasswordContext,
}                           from './resetPasswordContext.js'



// react components:

const ResetPasswordUrl = (): React.ReactNode => {
    // contexts:
    const model = useResetPasswordContext();
    
    
    
    // jsx:
    return (
        model.url ?? null
    );
};

export interface ResetPasswordLinkProps {
    // children:
    children ?: React.ReactNode
}
const ResetPasswordLink = (props: ResetPasswordLinkProps): React.ReactNode => {
    // contexts:
    const model = useResetPasswordContext();
    
    
    
    // jsx:
    return (
        <a href={model.url}>
            {props.children ?? 'Reset Password'}
        </a>
    );
};

export const ResetPassword = {
    Url  : ResetPasswordUrl,
    Link : ResetPasswordLink,
};
