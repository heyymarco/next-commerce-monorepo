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
    useMergeClasses,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    type RadioProps,
    Radio,
}                           from '@reusable-ui/radio'               // a UI for the user to select single option

// internals:
import {
    DummyInput,
}                           from './DummyInput.js'



// react components:
export interface RadioDecoratorProps<out TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        Omit<RadioProps<TElement>,
            // accessibilities:
            |'readOnly'       // always readOnly because no actual <input> to trigger `onChange()` event
            
            
            
            // forms:
            |'name'           // just a decorator, no actual <input> for <form>
            |'form'           // just a decorator, no actual <input> for <form>
            
            
            
            // values:
            |'defaultValue'   // just a decorator, no actual <input> for <form>
            |'value'          // just a decorator, no actual <input> for <form>
            |'onChange'       // no change event because no actual <input>
            
            |'defaultChecked' // no internal checked state => no uncontrollable
            
            
            
            // validations:
            |'required'       // no internal validation (no access to `validityState`), just an `inheritValidation` from <Parent>
            
            
            
            // formats:
            |'type'           // just a decorator, no actual <input> for <form>
            
            
            
            // states:
            |'defaultActive'  // no uncontrollable checked state
            // |'onActiveChange' // supported (called when `onClick()` and `onKeyDown([space])`)
        >
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
    
    
    
    // default props:
    const {
        // variants:
        outlined             = true,  // show the <Parent>'s background
        
        
        
        // accessibilities:
        tabIndex             = -1,    // unfocusable, always focus on the <Parent>
        
        
        
        // validations:
        enableValidation     = false, // change the default 'auto' to 'no_validation' at root level and at <ValidationProvider>
        
        
        
        // states:
        active               = false, // prevents the *uncontrollable* active by clicking the <RadioDecorator> => `toggleActive()`
        inheritActive        = true,  // change the default `false` to `true` => follows the <Parent>'s active
        
        
        
        // components:
        // replace the native <input> with <span> to avoid browser confusing with many <input> => autocomplete broken
        nativeInputComponent = (<DummyInput /> as React.ReactElement<React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>),
        
        
        
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
            
            
            
            // classes:
            classes={mergedClasses}
            
            
            
            // accessibilities:
            tabIndex={tabIndex}
            
            
            
            // validations:
            enableValidation={enableValidation}
            
            
            
            // states:
            active={active}
            inheritActive={inheritActive}
            
            
            
            // components:
            nativeInputComponent={nativeInputComponent}
        />
    );
};
export {
    RadioDecorator,            // named export for readibility
    RadioDecorator as default, // default export to support React.lazy
}



export interface RadioDecoratorComponentProps<out TElement extends Element = HTMLSpanElement>
{
    // components:
    radioDecoratorComponent ?: React.ReactElement<RadioDecoratorProps<TElement>>|null
}
