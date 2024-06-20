// react:
import {
    // react:
    default as React,
}                           from 'react'

// heymarco components:
import {
    // react components:
    type TextEditorProps,
    TextEditor,
}                           from '@heymarco/text-editor'



// react components:
export interface NameEditorProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        TextEditorProps<TElement, TChangeEvent>
{
}
const NameEditor = <TElement extends Element = HTMLSpanElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: NameEditorProps<TElement, TChangeEvent>): JSX.Element|null => {
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Name',
        placeholder              = ariaLabel,
        
        
        
        // formats:
        autoCapitalize           = 'words',
        
        
        
        // other props:
        ...restTextEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <TextEditor<TElement, TChangeEvent>
            // other props:
            {...restTextEditorProps}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            placeholder={placeholder}
            
            
            
            // formats:
            autoCapitalize={autoCapitalize}
        />
    );
};
export {
    NameEditor,            // named export for readibility
    NameEditor as default, // default export to support React.lazy
}
