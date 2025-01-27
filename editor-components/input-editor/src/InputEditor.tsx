// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    type InputProps,
    Input,
}                           from '@reusable-ui/input'           // an interactive control in order to accept data from the user

// heymarco components:
import {
    // types:
    type EditorChangeEventHandler,
    
    
    
    // react components:
    type EditorProps,
}                           from '@heymarco/editor'



// react components:
export interface InputEditorProps<out TElement extends Element = HTMLSpanElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        Omit<EditorProps<TElement, TValue, TChangeEvent>,
            // refs:
            |'elmRef'                          // moved to <input>
            
            
            
            |'children'                        // no nested children
        >,
        Omit<InputProps<TElement>,
            // values:
            |'defaultValue'|'value'|'onChange' // converted to TValue
        >
{
    // values:
    onChangeAsText ?: EditorChangeEventHandler<string, TChangeEvent>
}
const InputEditor = <TElement extends Element = HTMLSpanElement, TValue extends unknown = string, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: InputEditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // values:
        defaultValue,   // take, to be normalized: null => empty string, TValue => toString
        value,          // take, to be normalized: null => empty string, TValue => toString
        onChange,       // take, will be defined by <SpecificEditor>::onChange(as TSpecific)
        onChangeAsText, // take, will be handled by `handleValueChange()`
        
        
        
        // other props:
        ...restInputEditorProps
    } = props;
    
    
    
    // handlers:
    const handleValueChange = useEvent<React.EventHandler<TChangeEvent & React.ChangeEvent<HTMLInputElement>>>((event) => {
        onChangeAsText?.(event.target.value, event);
        
        if (onChange) {
            const value = event.target.value;
            switch (props.type ?? 'text') {
                case 'number':
                case 'range' : {
                    const trimmedValue = value.trim();
                    onChange((trimmedValue ? Number.parseFloat(trimmedValue) : null) satisfies number|null as TValue, event);
                } break;
                
                case 'date':
                case 'datetime-local':
                case 'month':
                case 'week':
                case 'time': {
                    const trimmedValue = value.trim();
                    onChange((trimmedValue ? new Date(Date.parse(trimmedValue)) : null) satisfies Date|null as TValue, event);
                } break;
                
                // case 'color':
                // case 'email':
                // case 'file':
                // case 'password':
                // case 'search':
                // case 'tel':
                // case 'text':
                // case 'url':
                default : {
                    onChange(value satisfies string as TValue, event);
                } break;
            } // switch
        } // if
    });
    
    
    
    // default props:
    const {
        // accessibilities:
        placeholder = props['aria-label'],
        
        
        
        // other props:
        ...restInputProps
    } = restInputEditorProps satisfies NoForeignProps<typeof restInputEditorProps, InputProps<TElement>>;
    
    
    
    // jsx:
    return (
        <Input<TElement>
            // other props:
            {...restInputProps}
            
            
            
            // accessibilities:
            placeholder={placeholder}
            
            
            
            // values:
            defaultValue = {(defaultValue !== undefined) ? ((defaultValue !== null) ? `${defaultValue}` /* any TValue => toString */ : '' /* null => empty string */) : undefined}
            value        = {(value        !== undefined) ? ((value        !== null) ? `${value}`        /* any TValue => toString */ : '' /* null => empty string */) : undefined}
            onChange     = {handleValueChange}
        />
    );
};
export {
    InputEditor,            // named export for readibility
    InputEditor as default, // default export to support React.lazy
}



export interface InputEditorComponentProps<out TElement extends Element = HTMLSpanElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
{
    // components:
    inputEditorComponent ?: React.ReactElement<InputEditorProps<TElement, TValue, TChangeEvent>>
}
