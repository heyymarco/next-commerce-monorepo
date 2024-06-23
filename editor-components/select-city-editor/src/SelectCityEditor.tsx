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
    type SelectZoneEditorProps,
    SelectZoneEditor,
}                           from '@heymarco/select-zone-editor'



// react components:
export interface SelectCityEditorProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>
    extends
        // bases:
        SelectZoneEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>
{
}
const SelectCityEditor = <TElement extends Element = HTMLDivElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>(props: SelectCityEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // other props:
        ...restSelectCityEditorProps
    } = props;
    
    
    
    // default props:
    const {
        // models:
        modelName = 'City',
        
        
        
        // other props:
        ...restSelectZoneEditorProps
    } = restSelectCityEditorProps;
    
    
    
    // jsx:
    return (
        <SelectZoneEditor<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>
            // other props:
            {...restSelectZoneEditorProps}
            
            
            
            // models:
            modelName={modelName}
        />
    );
};
export {
    SelectCityEditor,            // named export for readibility
    SelectCityEditor as default, // default export to support React.lazy
}
