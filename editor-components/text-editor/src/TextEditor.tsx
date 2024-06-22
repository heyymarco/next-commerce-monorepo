// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeEvents,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    // react components:
    type InputEditorProps,
    InputEditor,
}                           from '@heymarco/input-editor'



// react components:
export interface TextEditorProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        InputEditorProps<TElement, TChangeEvent, string>
{
}
const TextEditor = <TElement extends Element = HTMLSpanElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: TextEditorProps<TElement, TChangeEvent>): JSX.Element|null => {
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
        onChange,
        
        
        
        // preserves the original `onChangeAsText` from `props`:
        onChangeAsText,
    );
    
    
    
    // default props:
    const {
        // formats:
        type = 'text',
        
        
        
        // other props:
        ...restEditorProps
    } = restTextEditorProps;
    
    
    
    // jsx:
    return (
        <InputEditor<TElement, TChangeEvent, string>
            // other props:
            {...restEditorProps}
            
            
            
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



export interface TextEditorComponentProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
{
    // components:
    textEditorComponent ?: React.ReactElement<TextEditorProps<TElement, TChangeEvent>>
}
