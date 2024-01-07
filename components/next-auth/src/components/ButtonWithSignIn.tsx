'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// auth-js:
import type {
    // types:
    BuiltInProviderType,
}                           from '@auth/core/providers'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// react components:
export interface ButtonWithSignInProps
    extends
        // bases:
        ButtonProps,
        
        // components:
        Required<Pick<ButtonComponentProps,
            'buttonComponent' // a required underlying <Button>
        >>
{
    // auths:
    providerType : BuiltInProviderType
    
    
    
    // handlers:
    onSignInWith : (providerType: BuiltInProviderType) => void
}
const ButtonWithSignIn = (props: ButtonWithSignInProps): JSX.Element|null => {
    // rest props:
    const {
        // auths:
        providerType,
        
        
        
        // components:
        buttonComponent,
        
        
        
        // handlers:
        onSignInWith,
    ...restButtonProps} = props;
    
    
    
    // refs:
    const mergedElmRef   = useMergeRefs(
        // preserves the original `elmRef` from `buttonComponent`:
        buttonComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        props.elmRef,
    );
    const mergedOuterRef = useMergeRefs(
        // preserves the original `outerRef` from `buttonComponent`:
        buttonComponent.props.outerRef,
        
        
        
        // preserves the original `outerRef` from `props`:
        props.outerRef,
    );
    
    
    
    // handlers:
    const handleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault(); // handled
        
        
        
        // actions:
        onSignInWith(providerType);
    });
    const handleClick         = useMergeEvents(
        // preserves the original `onClick` from `buttonComponent`:
        buttonComponent.props.onClick,
        
        
        
        // preserves the original `onClick` from `props`:
        props.onClick,
        
        
        
        // actions:
        handleClickInternal,
    );
    
    
    
    // jsx:
    /* <Button> */
    return React.cloneElement<ButtonProps>(buttonComponent,
        // props:
        {
            // other props:
            ...restButtonProps,
            ...buttonComponent.props, // overwrites restButtonProps (if any conflics)
            
            
            
            // refs:
            elmRef   : mergedElmRef,
            outerRef : mergedOuterRef,
            
            
            
            // handlers:
            onClick  : handleClick,
        },
    );
};
export {
    ButtonWithSignIn,
    ButtonWithSignIn as default,
};
