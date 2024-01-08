// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useEmailConfirmationContext,
}                           from './emailConfirmationContext.js'



// react components:

const EmailConfirmationUrl = (): string|null => {
    // contexts:
    const model = useEmailConfirmationContext();
    
    
    
    // jsx:
    return (
        model.url ?? null
    );
};

export interface EmailConfirmationLinkProps {
    // children:
    children ?: React.ReactNode
}
const EmailConfirmationLink = (props: EmailConfirmationLinkProps): React.ReactNode => {
    const url = EmailConfirmationUrl();
    
    
    
    // jsx:
    if (!url) return null;
    return (
        <a href={url}>
            {props.children ?? url}
        </a>
    );
};

export const EmailConfirmation = {
    Url  : EmailConfirmationUrl,
    Link : EmailConfirmationLink,
};
