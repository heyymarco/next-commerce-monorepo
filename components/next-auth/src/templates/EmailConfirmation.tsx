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

const EmailConfirmationUrl = (): React.ReactNode => {
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
    // contexts:
    const model = useEmailConfirmationContext();
    
    
    
    // jsx:
    return (
        <a href={model.url}>
            {props.children ?? 'Reset Password'}
        </a>
    );
};

export const EmailConfirmation = {
    Url  : EmailConfirmationUrl,
    Link : EmailConfirmationLink,
};
