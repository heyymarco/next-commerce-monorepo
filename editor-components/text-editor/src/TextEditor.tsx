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
export interface TextEditorProps<out TElement extends Element = HTMLSpanElement, TValue extends string = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        InputEditorProps<TElement, TValue, TChangeEvent>
{
}
const TextEditor = <TElement extends Element = HTMLSpanElement, TValue extends string = string, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: TextEditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
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
        // preserves the original `onChange` from `props`:
        onChange satisfies EditorChangeEventHandler<TValue, TChangeEvent>|undefined as EditorChangeEventHandler<string, TChangeEvent>|undefined,
        
        
        
        // preserves the original `onChangeAsText` from `props`:
        onChangeAsText,
    );
    
    
    
    // default props:
    const {
        // formats:
        type = 'text',
        
        
        
        // other props:
        ...restInputEditorProps
    } = restTextEditorProps satisfies NoForeignProps<typeof restTextEditorProps, InputEditorProps<TElement, TValue, TChangeEvent>>;
    
    
    
    // jsx:
    return (
        <InputEditor<TElement, TValue, TChangeEvent>
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



export interface TextEditorComponentProps<out TElement extends Element = HTMLSpanElement, TValue extends string = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
{
    // components:
    textEditorComponent ?: React.ReactElement<TextEditorProps<TElement, TValue, TChangeEvent>>
}
