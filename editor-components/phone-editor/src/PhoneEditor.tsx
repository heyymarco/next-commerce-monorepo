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
export interface PhoneEditorProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        TextEditorProps<TElement, TChangeEvent>
{
}
const PhoneEditor = <TElement extends Element = HTMLSpanElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: PhoneEditorProps<TElement, TChangeEvent>): JSX.Element|null => {
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Phone',
        
        
        
        // formats:
        type                     = 'tel',
        
        
        
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
            
            
            
            // formats:
            type={type}
        />
    );
};
export {
    PhoneEditor,            // named export for readibility
    PhoneEditor as default, // default export to support React.lazy
}
