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
    type EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    // react components:
    type EditorProps,
    Editor,
}                           from '@heymarco/editor'



// react components:
export interface ActionEditorProps<out TElement extends Element = HTMLElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string>
    extends
        // bases:
        EditorProps<TElement, TChangeEvent, TValue>
{
    // handlers:
    onSave   ?: EventHandler<React.SyntheticEvent<unknown, Event>>
    onCancel ?: EventHandler<React.SyntheticEvent<unknown, Event>>
    onDelete ?: EventHandler<React.SyntheticEvent<unknown, Event>>
}
const ActionEditor = <TElement extends Element = HTMLElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string>(props: ActionEditorProps<TElement, TChangeEvent, TValue>): JSX.Element|null => {
    // props:
    const {
        // handlers:
        onSave   : _onSave,   // remove, will be defined by <SpecificActionEditor>::onSave(event: TSaveEvent)
        onCancel : _onCancel, // remove, will be defined by <SpecificActionEditor>::onCancel(event: TCancelEvent)
        onDelete : _onDelete, // remove, will be defined by <SpecificActionEditor>::onDelete(event: TDeleteEvent)
        
        
        
        // other props:
        ...restEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <Editor<TElement, TChangeEvent, TValue>
            // other props:
            {...restEditorProps satisfies NoForeignProps<typeof restEditorProps, EditorProps<TElement, TChangeEvent, TValue>>}
        />
    );
};
export {
    ActionEditor,            // named export for readibility
    ActionEditor as default, // default export to support React.lazy
}



export interface ActionEditorComponentProps<out TElement extends Element = HTMLElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string>
{
    // components:
    actionEditorComponent ?: React.ReactElement<ActionEditorProps<TElement, TChangeEvent, TValue>>
}
