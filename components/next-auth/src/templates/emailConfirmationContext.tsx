// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '../hooks/mock-context.js'



// contexts:
export interface EmailConfirmationApi {
    // data:
    url : string
}
const EmailConfirmationContext = createContext<Partial<EmailConfirmationApi>>({
});



// hooks:
export const useEmailConfirmationContext = () => {
    return useContext(EmailConfirmationContext);
};



// react components:
export interface EmailConfirmationContextProviderProps {
    // data:
    url : string
}
export const EmailConfirmationContextProvider = (props: React.PropsWithChildren<EmailConfirmationContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <EmailConfirmationContext.Provider value={{ url: props.url }}>
            {props.children}
        </EmailConfirmationContext.Provider>
    );
};
