// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    type DropdownListExpandedChangeEvent,
}                           from '@reusable-ui/dropdown-list'           // overlays a list element (menu)

// heymarco components:
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
import {
    // react components:
    type SelectZoneEditorProps,
    SelectZoneEditor,
}                           from '@heymarco/select-zone-editor'

// internals:
import {
    getCountryCodeByName,
    defaultCountryList,
}                           from './utilities.js'



// react components:
export interface SelectCountryEditorProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>
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
const SelectCountryEditor = <TElement extends Element = HTMLDivElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>(props: SelectCountryEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // values:
        // value,
        onChange,
        
        
        
        // other props:
        ...restSelectCountryEditorProps
    } = props;
    
    
    
    // handlers:
    const handleChangeToCountryCode = useEvent<EditorChangeEventHandler<TChangeEvent, string>>((value, event) => {
        // conditions:
        if (!onChange) return;
        
        
        
        // converts:
        const valueAsCountryCode = (
            getCountryCodeByName(value) // converted to countryCode
            ??
            value                       // partial countryName
        );
        onChange(valueAsCountryCode, event);
    });
    
    
    
    // default props:
    const {
        // models:
        modelName                = 'Country',
        
        
        
        // values:
        valueOptions             = defaultCountryList,
        
        
        
        // validations:
        freeTextInput            = false, // must select a country in the provided valueOptions
        
        
        
        // other props:
        ...restSelectZoneEditorProps
    } = restSelectCountryEditorProps;
    
    
    
    // jsx:
    return (
        <SelectZoneEditor<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>
            // other props:
            {...restSelectZoneEditorProps}
            
            
            
            // models:
            modelName={modelName}
            
            
            
            // values:
            valueOptions={valueOptions}
            onChange={handleChangeToCountryCode}
            
            
            
            // validations:
            freeTextInput={freeTextInput}
        />
    );
};
export {
    SelectCountryEditor,            // named export for readibility
    SelectCountryEditor as default, // default export to support React.lazy
}
