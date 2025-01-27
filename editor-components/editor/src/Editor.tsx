// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

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
export interface EditorProps<out TElement extends Element = HTMLElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
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
    onChange       ?: EditorChangeEventHandler<TValue, TChangeEvent>
}
const Editor = <TElement extends Element = HTMLElement, TValue extends unknown = string, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: EditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
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
            {...restEditableControlProps satisfies NoForeignProps<typeof restEditableControlProps, EditableControlProps<TElement>>}
        />
    );
};
export {
    Editor,            // named export for readibility
    Editor as default, // default export to support React.lazy
}



export interface EditorComponentProps<out TElement extends Element = HTMLElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
{
    // components:
    editorComponent ?: React.ReactElement<EditorProps<TElement, TValue, TChangeEvent>>
}
