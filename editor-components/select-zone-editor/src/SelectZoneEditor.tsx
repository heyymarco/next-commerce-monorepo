// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // writes css in javascript:
    startsCapitalized,
}                           from '@cssfn/core'                          // writes css in javascript

// reusable-ui components:
import {
    type DropdownListExpandedChangeEvent,
}                           from '@reusable-ui/dropdown-list'           // overlays a list element (menu)

// heymarco components:
import {
    // react components:
    type TextDropdownEditorProps,
    TextDropdownEditor,
}                           from '@heymarco/text-dropdown-editor'

// internals:
import {
    equalityZoneComparison,
}                           from './utilities.js'



// react components:
export interface SelectZoneEditorProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>
    extends
        // bases:
        TextDropdownEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>
{
    // models:
    modelName : string
}
const SelectZoneEditor = <TElement extends Element = HTMLDivElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>(props: SelectZoneEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // default props:
    const {
        // models:
        modelName,
        
        
        
        // accessibilities:
        'aria-label'            : ariaLabel = `Select ${startsCapitalized(modelName)}`,
        placeholder             = ariaLabel,
        
        
        
        // validations:
        equalityValueComparison = equalityZoneComparison,
        
        
        
        // other props:
        ...restTextDropdownEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <TextDropdownEditor<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>
            // other props:
            {...restTextDropdownEditorProps}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            placeholder={placeholder}
            
            
            
            // validations:
            equalityValueComparison={equalityValueComparison}
        />
    );
};
export {
    SelectZoneEditor,            // named export for readibility
    SelectZoneEditor as default, // default export to support React.lazy
}
