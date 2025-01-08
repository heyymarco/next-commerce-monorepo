// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

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
        
        
        
        // formats:
        type                     = 'email',
        
        
        
        // other props:
        ...restTextEditorProps
    } = props satisfies NoForeignProps<typeof props, TextEditorProps<TElement, TChangeEvent>>;
    
    
    
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
    EmailEditor,            // named export for readibility
    EmailEditor as default, // default export to support React.lazy
}
