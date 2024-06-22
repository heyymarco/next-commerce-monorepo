// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    type EditableControlProps,
    EditableControl,
}                           from '@reusable-ui/editable-control'    // a base editable UI (with validation indicator) of Reusable-UI components

// internals:
import {
    type EditorChangeEventHandler,
}                           from './types.js'



// react components:
export interface EditorProps<out TElement extends Element = HTMLElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string>
    extends
        // bases:
        Omit<EditableControlProps<TElement>,
            // values:
            |'defaultValue'|'value'|'onChange' // converted to TValue
        >
{
    // values:
    defaultValue   ?: TValue
    value          ?: TValue
    onChange       ?: EditorChangeEventHandler<TChangeEvent, TValue>
}
const Editor = <TElement extends Element = HTMLElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string>(props: EditorProps<TElement, TChangeEvent, TValue>): JSX.Element|null => {
    // props:
    const {
        // values:
        defaultValue : _defaultValue, // remove, will be defined by <SpecificEditor>::defaultValue as TSpecific
        value        : _value,        // remove, will be defined by <SpecificEditor>::value        as TSpecific
        onChange     : _onChange,     // remove, will be defined by <SpecificEditor>::onChange(as TSpecific)
        
        
        
        // other props:
        ...restEditableControlProps
    } = props;
    
    
    
    // jsx:
    return (
        <EditableControl<TElement>
            // other props:
            {...restEditableControlProps}
        />
    );
};
export {
    Editor,            // named export for readibility
    Editor as default, // default export to support React.lazy
}



export interface EditorComponentProps<out TElement extends Element = HTMLElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string>
{
    // components:
    editorComponent ?: React.ReactElement<EditorProps<TElement, TChangeEvent, TValue>>
}
