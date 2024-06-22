// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
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
export interface InputEditorProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string>
    extends
        // bases:
        Omit<EditorProps<TElement, TChangeEvent, TValue>,
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
    onChangeAsText ?: EditorChangeEventHandler<TChangeEvent, string>
}
const InputEditor = <TElement extends Element = HTMLSpanElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string>(props: InputEditorProps<TElement, TChangeEvent, TValue>): JSX.Element|null => {
    // props:
    const {
        // values:
        defaultValue,         // take  , to be normalized: null => empty string, TValue => toString
        value,                // take  , to be normalized: null => empty string, TValue => toString
        onChange : _onChange, // remove, will be defined by <SpecificEditor>::onChange(as TSpecific)
        onChangeAsText,       // take  , will be handled by `handleValueChange()`
        
        
        
        // other props:
        ...restInputEditorProps
    } = props;
    
    
    
    // handlers:
    const handleValueChange = useEvent<React.EventHandler<TChangeEvent & React.ChangeEvent<HTMLInputElement>>>((event) => {
        onChangeAsText?.(event.target.value, event);
    });
    
    
    
    // jsx:
    return (
        <Input<TElement>
            // other props:
            {...restInputEditorProps}
            
            
            
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



export interface InputEditorComponentProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string>
{
    // components:
    inputEditorComponent ?: React.ReactElement<InputEditorProps<TElement, TChangeEvent, TValue>>
}
