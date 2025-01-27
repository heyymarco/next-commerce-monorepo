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

// reusable-ui components:
import {
    type DropdownListExpandedChangeEvent,
}                           from '@reusable-ui/dropdown-list'           // overlays a list element (menu)

// heymarco components:
import {
    // react components:
    type TextEditorProps,
    TextEditor,
}                           from '@heymarco/text-editor'
import {
    // react components:
    type InputDropdownEditorProps,
    InputDropdownEditor,
}                           from '@heymarco/input-dropdown-editor'



// react components:
export interface TextDropdownEditorProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends string = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
    extends
        // bases:
        InputDropdownEditorProps<TElement, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>
{
}
const TextDropdownEditor = <TElement extends Element = HTMLDivElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends string = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: TextDropdownEditorProps<TElement, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // default props:
    const {
        // components:
        inputEditorComponent = (<TextEditor<Element, TChangeEvent, TValue> /> as React.ReactElement<TextEditorProps<Element, TChangeEvent, TValue>>),
        
        
        
        // other props:
        ...restInputDropdownEditorProps
    } = props satisfies NoForeignProps<typeof props, InputDropdownEditorProps<TElement, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>>;
    
    
    
    // jsx:
    return (
        <InputDropdownEditor<TElement, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>
            // other props:
            {...restInputDropdownEditorProps}
            
            
            
            // components:
            inputEditorComponent={inputEditorComponent}
        />
    );
};
export {
    TextDropdownEditor,            // named export for readibility
    TextDropdownEditor as default, // default export to support React.lazy
}



export interface TextDropdownEditorComponentProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends string = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
{
    // components:
    textDropdownEditorComponent ?: React.ReactElement<TextDropdownEditorProps<TElement, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>>
}
