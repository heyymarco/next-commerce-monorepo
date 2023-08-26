// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    IconProps,
    Icon,
    LabelProps,
    Label,
    InputProps,
    Input,
    
    
    
    // composite-components:
    GroupProps,
    Group,
}                           from '@reusable-ui/components'



// react components:
export interface InputWithLabelProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        InputProps<TElement>
{
    // appearances:
    icon            : IconProps<Element>['icon']
    
    
    
    // components:
    /**
     * The underlying `<Input>` to be labeled.
     */
    inputComponent ?: React.ReactComponentElement<any, InputProps<TElement>>
    groupComponent ?: React.ReactComponentElement<any, GroupProps<Element>>
    labelComponent ?: React.ReactComponentElement<any, LabelProps<Element>>
    iconComponent  ?: React.ReactComponentElement<any, IconProps<Element>>
}
const InputWithLabel = <TElement extends Element = HTMLSpanElement>(props: InputWithLabelProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        outerRef,
        
        
        
        // appearances:
        icon,
        
        
        
        // styles:
        style,
        
        
        
        // classes:
        mainClass,
        classes,
        variantClasses,
        stateClasses,
        className,
        
        
        
        // components:
        inputComponent = (<Input<TElement>  /> as React.ReactComponentElement<any, InputProps<TElement>>),
        groupComponent = (<Group            /> as React.ReactComponentElement<any, GroupProps<Element>>),
        labelComponent = (<Label            /> as React.ReactComponentElement<any, LabelProps<Element>>),
        iconComponent  = (<Icon icon={icon} /> as React.ReactComponentElement<any, IconProps<Element>>),
    ...restInputProps} = props;
    
    
    
    // jsx:
    /* <Group> */
    return React.cloneElement<GroupProps<Element>>(groupComponent,
        // props:
        {
            // refs:
            outerRef,
            
            
            
            // styles:
            style,
            
            
            
            // classes:
            mainClass,
            classes,
            variantClasses,
            stateClasses,
            className,
        },
        
        
        
        // children:
        /* <Label> */
        React.cloneElement<LabelProps<Element>>(labelComponent,
            // props:
            {
                // classes:
                className : labelComponent.props.className ?? 'solid',
            },
            
            
            
            // children:
            /* <Icon> */
            React.cloneElement<IconProps<Element>>(iconComponent,
                // props:
                {
                    // appearances:
                    icon : iconComponent.props.icon ?? icon,
                },
            ),
        ),
        /* <Input> */
        React.cloneElement<InputProps<TElement>>(inputComponent,
            // props:
            {
                // other props:
                ...restInputProps,
                ...inputComponent.props, // overwrites restInputProps (if any conflics)
            },
        ),
    );
};
export {
    InputWithLabel,
    InputWithLabel as default,
};
