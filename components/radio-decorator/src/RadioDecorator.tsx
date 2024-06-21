// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useRadioDecoratorStyleSheet,
}                           from './styles/loader.js'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeEvents,
    useMergeClasses,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    type RadioProps,
    Radio,
}                           from '@reusable-ui/radio'               // a UI for the user to select single option



// handlers:
const handleRadioDecorator : React.MouseEventHandler<Element> = (event) => {
    // conditions:
    if (event.defaultPrevented) return; // the event was already handled by user => nothing to do
    
    
    
    // actions:
    event.currentTarget.parentElement?.click(); // forwards click to <Parent> while preserving the hover effect (without `pointerEvent: 'none'`)
    event.preventDefault(); // handled
}



// react components:
export interface RadioDecoratorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        RadioProps<TElement>
{
}
const RadioDecorator = <TElement extends Element = HTMLSpanElement>(props: RadioDecoratorProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet    = useRadioDecoratorStyleSheet();
    
    
    
    // classes:
    const mergedClasses = useMergeClasses(
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // additional styles:
        styleSheet.main,
    );
    
    
    
    // handlers:
    const handleClick = useMergeEvents(
        // preserves the original `onClick` from `props`:
        props.onClick,
        
        
        
        // actions:
        handleRadioDecorator,
    );
    
    
    
    // default props:
    const {
        // variants:
        outlined         = true,  // show the <Parent>'s background
        nude             = true,  // no outer layout
        
        
        
        // accessibilities:
        enableValidation = false, // no validation
        inheritActive    = true,  // follows the <Parent>'s active
        tabIndex         = -1,    // unfocusable, focus on the <Parent>
        
        
        
        // other props:
        ...restRadioProps
    } = props;
    
    
    
    // jsx:
    return (
        <Radio<TElement>
            // other props:
            {...restRadioProps}
            
            
            
            // variants:
            outlined={outlined}
            nude={nude}
            
            
            
            // classes:
            classes={mergedClasses}
            
            
            
            // accessibilities:
            enableValidation={enableValidation}
            inheritActive={inheritActive}
            tabIndex={tabIndex}
            
            
            
            // handlers:
            onClick={handleClick}
        />
    );
};
export {
    RadioDecorator,            // named export for readibility
    RadioDecorator as default, // default export to support React.lazy
}



export interface RadioDecoratorComponentProps
{
    // components:
    radioDecoratorComponent ?: React.ReactElement<RadioDecoratorProps<Element>>|null
}
