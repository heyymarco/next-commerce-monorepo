'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    
    ButtonIconProps,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // types:
    BusyState,
    
    
    
    // states:
    useSignInState,
}                           from './states/signInState.js'



// react components:
export interface ButtonWithBusyProps
    extends
        // bases:
        ButtonProps,
        
        // components:
        Required<Pick<ButtonComponentProps,
            'buttonComponent' // a required underlying <Button>
        >>
{
    // appearances:
    iconBusy ?: ButtonIconProps['icon']
    
    
    
    // behaviors:
    busyType ?: BusyState
}
const ButtonWithBusy = (props: ButtonWithBusyProps): JSX.Element|null => {
    // states:
    const {
        // states:
        isBusy,
    } = useSignInState();
    
    
    
    // rest props:
    const {
        // appearances:
        iconBusy = 'busy',
        
        
        
        // behaviors:
        busyType,
        
        
        
        // components:
        buttonComponent,
    ...restButtonIconProps} = props;
    
    
    
    
    // fn props:
    const isBusyType = !busyType ? isBusy : (isBusy === busyType);
    const icon       = (buttonComponent?.props as ButtonIconProps|undefined)?.icon
    
    
    
    // jsx:
    /* <Button> or <ButtonIcon> */
    return React.cloneElement<ButtonIconProps>(buttonComponent,
        // props:
        {
            // other props:
            ...restButtonIconProps,
            ...buttonComponent.props, // overwrites restButtonIconProps (if any conflics)
            
            
            
            // appearances:
            icon : !icon ? undefined : (isBusyType ? iconBusy : icon),
        },
    );
};
export {
    ButtonWithBusy,
    ButtonWithBusy as default,
};
