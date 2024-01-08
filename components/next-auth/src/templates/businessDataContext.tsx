// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import type {
    // types:
    BusinessConfig,
}                           from '../types.js'
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '../hooks/mock-context.js'



// contexts:
export interface BusinessApi {
    // data:
    model : BusinessConfig|undefined
}
const BusinessContext = createContext<BusinessApi>({
    model : undefined,
});



// hooks:
export const useBusinessContext = () => {
    return useContext(BusinessContext);
};



// react components:
export interface BusinessContextProviderProps {
    // data:
    model : BusinessConfig
}
export const BusinessContextProvider = (props: React.PropsWithChildren<BusinessContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <BusinessContext.Provider value={props}>
            {props.children}
        </BusinessContext.Provider>
    );
};
