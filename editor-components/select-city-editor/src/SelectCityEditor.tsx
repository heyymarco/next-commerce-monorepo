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
    type SelectZoneEditorProps,
    SelectZoneEditor,
}                           from '@heymarco/select-zone-editor'



// react components:
export interface SelectCityEditorProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>
    extends
        // bases:
        Omit<SelectZoneEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>,
            // models:
            |'modelName' // changed to optional
        >,
        Partial<Pick<SelectZoneEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>,
            // models:
            |'modelName' // changed to optional
        >>
{
}
const SelectCityEditor = <TElement extends Element = HTMLDivElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>(props: SelectCityEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // models:
        modelName = 'City',
        
        
        
        // other props:
        ...restSelectCityEditorProps
    } = props;
    
    
    
    // default props:
    const {
        // formats:
        autoComplete = 'address-level2',
        
        
        
        // other props:
        ...restSelectZoneEditorProps
    } = restSelectCityEditorProps satisfies NoForeignProps<typeof restSelectCityEditorProps, Omit<SelectZoneEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>, 'modelName'>>;
    
    
    
    // jsx:
    return (
        <SelectZoneEditor<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>
            // other props:
            {...restSelectZoneEditorProps}
            
            
            
            // models:
            modelName={modelName}
            
            
            
            // formats:
            autoComplete={autoComplete}
        />
    );
};
export {
    SelectCityEditor,            // named export for readibility
    SelectCityEditor as default, // default export to support React.lazy
}
