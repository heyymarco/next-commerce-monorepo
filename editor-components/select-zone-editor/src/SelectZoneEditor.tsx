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
    // props:
    const {
        // models:
        modelName, // take
        
        
        
        // other props:
        ...restSelectZoneEditorProps
    } = props;
    
    
    
    // default props:
    const {
        // accessibilities:
        'aria-label'            : ariaLabel = `Select ${startsCapitalized(modelName)}`,
        
        
        
        // validations:
        equalityValueComparison = equalityZoneComparison,
        
        
        
        // other props:
        ...restTextDropdownEditorProps
    } = restSelectZoneEditorProps satisfies NoForeignProps<typeof restSelectZoneEditorProps, TextDropdownEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>>;
    
    
    
    // jsx:
    return (
        <TextDropdownEditor<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>
            // other props:
            {...restTextDropdownEditorProps}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            
            
            
            // validations:
            equalityValueComparison={equalityValueComparison}
        />
    );
};
export {
    SelectZoneEditor,            // named export for readibility
    SelectZoneEditor as default, // default export to support React.lazy
}
