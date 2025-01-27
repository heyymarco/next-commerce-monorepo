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
export interface NameEditorProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends string = string>
    extends
        // bases:
        TextEditorProps<TElement, TChangeEvent, TValue>
{
}
const NameEditor = <TElement extends Element = HTMLSpanElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends string = string>(props: NameEditorProps<TElement, TChangeEvent, TValue>): JSX.Element|null => {
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Name',
        
        
        
        // formats:
        autoCapitalize           = 'words',
        
        
        
        // other props:
        ...restTextEditorProps
    } = props satisfies NoForeignProps<typeof props, TextEditorProps<TElement, TChangeEvent, TValue>>;
    
    
    
    // jsx:
    return (
        <TextEditor<TElement, TChangeEvent, TValue>
            // other props:
            {...restTextEditorProps}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            
            
            
            // formats:
            autoCapitalize={autoCapitalize}
        />
    );
};
export {
    NameEditor,            // named export for readibility
    NameEditor as default, // default export to support React.lazy
}
