// react:
import {
    // react:
    default as React,
}                           from 'react'

// next auth:
import {
    // types:
    type BuiltInProviderType,
}                           from 'next-auth/providers'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
}                           from '@reusable-ui/components'



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
    
    
    
    // handlers:
    const handleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault(); // handled
        
        
        
        // actions:
        onSignInWith(providerType);
    });
    const handleClick          = useMergeEvents(
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
            
            
            
            // handlers:
            onClick : handleClick,
        },
    );
};
export {
    ButtonWithSignIn,
    ButtonWithSignIn as default,
};
