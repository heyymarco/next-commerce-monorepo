// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    usePasswordResetContext,
}                           from './passwordResetContext.js'



// react components:

const PasswordResetUrl = (): string|null => {
    // contexts:
    const model = usePasswordResetContext();
    
    
    
    // jsx:
    return (
        model.url ?? null
    );
};

export interface PasswordResetLinkProps {
    // children:
    children ?: React.ReactNode
}
const PasswordResetLink = (props: PasswordResetLinkProps): React.ReactNode => {
    const url = PasswordResetUrl();
    
    
    
    // jsx:
    if (!url) return null;
    return (
        <a href={url}>
            {props.children ?? url}
        </a>
    );
};

export const PasswordReset = {
    Url  : PasswordResetUrl,
    Link : PasswordResetLink,
};
