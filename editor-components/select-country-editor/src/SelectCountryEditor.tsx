// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
    useMergeEvents,
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
    type CountryCode,
}                           from './types.js'
import {
    getNormalizedCountryName,
    getCountryCodeByName,
    getCountryNameByCode,
    defaultCountryList,
}                           from './utilities.js'



// react components:
export interface SelectCountryEditorProps<out TElement extends Element = HTMLDivElement, TValue extends string = CountryCode|'', in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
    extends
        // bases:
        Omit<SelectZoneEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>,
            // models:
            |'modelName' // changed to optional
        >,
        Partial<Pick<SelectZoneEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>,
            // models:
            |'modelName' // changed to optional
        >>
{
}
const SelectCountryEditor = <TElement extends Element = HTMLDivElement, TValue extends string = CountryCode|'', TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: SelectCountryEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // models:
        modelName = 'Country',
        
        
        
        // values:
        defaultValue   : defaultUncontrollableValue = '' as TValue,
        value          : controllableValue,
        onChange,
        onChangeAsText,
        
        
        
        // other props:
        ...restSelectCountryEditorProps
    } = props;
    
    
    
    // states:
    const handleValueChange = useMergeEvents(
        // preserves the original `onChangeAsText` from `props`:
        onChangeAsText satisfies EditorChangeEventHandler<string, TChangeEvent>|undefined as EditorChangeEventHandler<TValue, TChangeEvent>|undefined,
        
        
        
        // preserves the original `onChange` from `props`:
        onChange,
    );
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue, TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : handleValueChange,
    });
    
    
    
    // converts:
    const valueAsCountryName : TValue = useMemo<TValue>(() => (
        getCountryNameByCode(value)     as TValue|null // converted to countryName
        ??
        getNormalizedCountryName(value) as TValue|null // if valid => normalize the (upper|lower)Case
        ??
        value                                          // invalid|partial countryCode
    ), [value]);
    
    
    
    // handlers:
    const handleChange = useEvent<EditorChangeEventHandler<TValue, TChangeEvent>>((value, event) => {
        // converts:
        const valueAsCountryCode : TValue = (
            getCountryCodeByName(value) as TValue|null // converted to countryCode
            ??
            value                                      // invalid|partial countryName
        );
        
        
        
        triggerValueChange(valueAsCountryCode, { triggerAt: 'immediately', event: event });
    });
    
    
    
    // default props:
    const {
        // values:
        valueOptions             = defaultCountryList as TValue[],
        
        notifyValueChange        = value,
        
        
        
        // validations:
        freeTextInput            = false, // must select a country in the provided valueOptions
        
        
        
        // formats:
        autoComplete             = 'country-name',
        
        
        
        // other props:
        ...restSelectZoneEditorProps
    } = restSelectCountryEditorProps satisfies NoForeignProps<typeof restSelectCountryEditorProps, Omit<SelectZoneEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>, 'modelName'>>;
    
    
    
    // jsx:
    return (
        <SelectZoneEditor<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>
            // other props:
            {...restSelectZoneEditorProps}
            
            
            
            // models:
            modelName={modelName}
            
            
            
            // values:
            valueOptions={valueOptions}
            value={valueAsCountryName} // controllable, always displays the country name instead of the country code
            onChange={handleChange}    // controllable, always reports  the country code instead of the country name
            
            notifyValueChange={notifyValueChange}
            
            
            
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
