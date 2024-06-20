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
export interface EmailEditorProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        TextEditorProps<TElement, TChangeEvent>
{
}
const EmailEditor = <TElement extends Element = HTMLSpanElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: EmailEditorProps<TElement, TChangeEvent>): JSX.Element|null => {
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Email',
        placeholder              = ariaLabel,
        
        
        
        // formats:
        type                     = 'email',
        
        
        
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
            type={type}
        />
    );
};
export {
    EmailEditor,            // named export for readibility
    EmailEditor as default, // default export to support React.lazy
}
