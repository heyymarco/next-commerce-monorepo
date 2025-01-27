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
export interface ActionEditorProps<out TElement extends Element = HTMLElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, in TActionEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>>
    extends
        // bases:
        EditorProps<TElement, TValue, TChangeEvent>
{
    // handlers:
    onSave   ?: EventHandler<TActionEvent>
    onCancel ?: EventHandler<TActionEvent>
    onDelete ?: EventHandler<TActionEvent>
}
const ActionEditor = <TElement extends Element = HTMLElement, TValue extends unknown = string, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TActionEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>>(props: ActionEditorProps<TElement, TValue, TChangeEvent, TActionEvent>): JSX.Element|null => {
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
        <Editor<TElement, TValue, TChangeEvent>
            // other props:
            {...restEditorProps satisfies NoForeignProps<typeof restEditorProps, EditorProps<TElement, TValue, TChangeEvent>>}
        />
    );
};
export {
    ActionEditor,            // named export for readibility
    ActionEditor as default, // default export to support React.lazy
}



export interface ActionEditorComponentProps<out TElement extends Element = HTMLElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, in TActionEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>>
{
    // components:
    actionEditorComponent ?: React.ReactElement<ActionEditorProps<TElement, TValue, TChangeEvent, TActionEvent>>
}
