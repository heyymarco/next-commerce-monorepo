// react:
import {
    // react:
    default as React,
}                           from 'react'

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
export interface TextDropdownEditorProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>
    extends
        // bases:
        InputDropdownEditorProps<TElement, TChangeEvent, string, TDropdownListExpandedChangeEvent>
{
}
const TextDropdownEditor = <TElement extends Element = HTMLDivElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>(props: TextDropdownEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // default props:
    const {
        // components:
        inputEditorComponent = (<TextEditor<Element, TChangeEvent> /> as React.ReactElement<TextEditorProps<Element, TChangeEvent>>),
        
        
        
        // other props:
        ...restInputDropdownEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <InputDropdownEditor<TElement, TChangeEvent, string, TDropdownListExpandedChangeEvent>
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



export interface TextDropdownEditorComponentProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>
{
    // components:
    textDropdownEditorComponent ?: React.ReactElement<TextDropdownEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>>
}
