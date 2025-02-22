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
        onChange,       // take, will be handled by `handleChange()`
        onChangeAsText, // take, will be handled by `handleChange()`
        
        
        
        // other props:
        ...restInputEditorProps
    } = props;
    
    
    
    // handlers:
    const handleChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        // preserves the original `onChange` from `props`:
        if (onChange) {
            const value = event.target.value;
            switch (props.type ?? 'text') {
                case 'number':
                case 'range' : {
                    const trimmedValue = value.trim();
                    const parsedNumber = trimmedValue ? Number.parseFloat(trimmedValue) : null;
                    onChange(
                        (
                            ((parsedNumber !== null) && isFinite(parsedNumber)) // if not `null` and not `NaN` and not `±Infinity`
                            ? parsedNumber // then, use the `parsedNumber`
                            : null         // otherwise, use `null`
                        ) as TValue,
                        event as unknown as TChangeEvent
                    );
                } break;
                
                case 'date':
                case 'datetime-local':
                case 'month':
                case 'week':
                case 'time': {
                    const trimmedValue = value.trim();
                    const parsedDate   = trimmedValue ? Date.parse(trimmedValue) : null;
                    onChange(
                        (
                            ((parsedDate !== null) && isFinite(parsedDate)) // if not `null` and not `NaN` and not `±Infinity`
                            ? new Date(parsedDate) // then, use the `parsedDate`
                            : null                 // otherwise, use `null`
                        ) as TValue,
                        event as unknown as TChangeEvent
                    );
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
                    onChange(value satisfies string as TValue, event as unknown as TChangeEvent);
                } break;
            } // switch
        } // if
        
        
        
        // preserves the original `onChangeAsText` from `props`:
        onChangeAsText?.(event.target.value, event as unknown as TChangeEvent);
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
            onChange     = {handleChange}
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
