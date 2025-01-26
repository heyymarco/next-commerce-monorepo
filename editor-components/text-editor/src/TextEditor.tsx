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
    useMergeEvents,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    // types:
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
import {
    // react components:
    type InputEditorProps,
    InputEditor,
}                           from '@heymarco/input-editor'



// react components:
export interface TextEditorProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends string = string>
    extends
        // bases:
        InputEditorProps<TElement, TChangeEvent, TValue>
{
}
const TextEditor = <TElement extends Element = HTMLSpanElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends string = string>(props: TextEditorProps<TElement, TChangeEvent, TValue>): JSX.Element|null => {
    // props:
    const {
        // values:
        onChange,
        onChangeAsText,
        
        
        
        // other props:
        ...restTextEditorProps
    } = props;
    
    
    
    // handlers:
    const handleChangeAsText = useMergeEvents(
        // preserves the original `onChangeAsText` from `props`:
        onChangeAsText,
        
        
        
        // preserves the original `onChange` from `props`:
        onChange satisfies EditorChangeEventHandler<TChangeEvent, TValue>|undefined as EditorChangeEventHandler<TChangeEvent, string>|undefined,
    );
    
    
    
    // default props:
    const {
        // formats:
        type = 'text',
        
        
        
        // other props:
        ...restInputEditorProps
    } = restTextEditorProps satisfies NoForeignProps<typeof restTextEditorProps, InputEditorProps<TElement, TChangeEvent, TValue>>;
    
    
    
    // jsx:
    return (
        <InputEditor<TElement, TChangeEvent, TValue>
            // other props:
            {...restInputEditorProps}
            
            
            
            // values:
            onChangeAsText={handleChangeAsText}
            
            
            
            // formats:
            type={type}
        />
    );
};
export {
    TextEditor,            // named export for readibility
    TextEditor as default, // default export to support React.lazy
}



export interface TextEditorComponentProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends string = string>
{
    // components:
    textEditorComponent ?: React.ReactElement<TextEditorProps<TElement, TChangeEvent, TValue>>
}
