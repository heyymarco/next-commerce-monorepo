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

// internals:
import {
    type EditorChangeEventHandler,
}                           from './types.js'



// react components:
export interface EditorProps<TElement extends Element = HTMLSpanElement, TValue extends unknown = string, TEvent = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        Omit<InputProps<TElement>,
            // values:
            |'defaultValue'|'value'|'onChange' // converted to TValue
        >
{
    // values:
    defaultValue   ?: TValue
    value          ?: TValue
    onChange       ?: EditorChangeEventHandler<TValue, TEvent>
    onChangeAsText ?: EditorChangeEventHandler<string, TEvent>
}
const Editor = <TElement extends Element = HTMLSpanElement, TValue extends unknown = string>(props: EditorProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue,         // take  , to be normalized: null => empty string, TValue => toString
        value,                // take  , to be normalized: null => empty string, TValue => toString
        onChange : _onChange, // remove, will be defined by <SpecificEditor>::onChange(TSpecific)
        onChangeAsText,       // take  , will be handled by `handleValueChange`
        
        
        
        // other props:
        ...restEditorProps
    } = props;
    
    
    
    // handlers:
    const handleValueChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        onChangeAsText?.(event.target.value, event);
    });
    
    
    
    // jsx:
    return (
        <Input<TElement>
            // other props:
            {...restEditorProps}
            
            
            
            // values:
            defaultValue = {(defaultValue !== undefined) ? ((defaultValue !== null) ? `${defaultValue}` /* any TValue => toString */ : '' /* null => empty string */) : undefined}
            value        = {(value        !== undefined) ? ((value        !== null) ? `${value}`        /* any TValue => toString */ : '' /* null => empty string */) : undefined}
            onChange     = {handleValueChange}
        />
    );
};
export {
    Editor,            // named export for readibility
    Editor as default, // default export to support React.lazy
}
