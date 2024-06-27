// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
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

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

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
    getNormalizedCountryName,
    getCountryCodeByName,
    getCountryNameByCode,
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
        defaultValue   : defaultUncontrollableValue = '',
        value          : controllableValue,
        onChange       : onControllableValueChange,
        onChangeAsText : onControllableTextChange,
        
        
        
        // other props:
        ...restSelectCountryEditorProps
    } = props;
    
    
    
    // states:
    const handleControllableValueChange = useEvent<EditorChangeEventHandler<TChangeEvent, string>>((newValue, event) => {
        // forwards:
        onControllableValueChange?.(newValue, event);
        onControllableTextChange?.(newValue, event);
    });
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<string, TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : handleControllableValueChange,
    });
    
    
    
    // converts:
    const valueAsCountryName = useMemo(() => (
        getCountryNameByCode(value) // converted to countryName
        ??
        getNormalizedCountryName(value) // if valid => normalize the (upper|lower)Case
        ??
        value                       // invalid|partial countryCode
    ), [value]);
    
    
    
    // handlers:
    const handleChange = useEvent<EditorChangeEventHandler<TChangeEvent, string>>((value, event) => {
        // converts:
        const valueAsCountryCode = (
            getCountryCodeByName(value) // converted to countryCode
            ??
            value                       // invalid|partial countryName
        );
        
        
        
        triggerValueChange(valueAsCountryCode, { triggerAt: 'immediately', event: event });
    });
    
    
    
    // default props:
    const {
        // models:
        modelName                = 'Country',
        
        
        
        // values:
        valueOptions             = defaultCountryList,
        
        
        
        // validations:
        freeTextInput            = false, // must select a country in the provided valueOptions
        
        
        
        // formats:
        autoComplete             = 'country-name',
        
        
        
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
            value={valueAsCountryName}
            onChange={handleChange}
            
            
            
            // validations:
            freeTextInput={freeTextInput}
            
            
            
            // formats:
            autoComplete={autoComplete}
        />
    );
};
export {
    SelectCountryEditor,            // named export for readibility
    SelectCountryEditor as default, // default export to support React.lazy
}
