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

// internal components:
import {
    // react components:
    MirroredInput,
}                           from './MirroredInput.js'

// internals:
import {
    getCountryDisplay,
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
    // default props:
    const {
        // models:
        modelName                = 'Country',
        
        
        
        // values:
        valueOptions             = defaultCountryList,
        valueToUi                = getCountryDisplay,
        
        
        
        // validations:
        minLength                = 2,
        maxLength                = 2,
        freeTextInput            = false,
        
        
        
        // behaviors:
        preferFocusOnInputEditor = false,
        
        
        
        // states:
        assertiveFocusable       = false,
        
        
        
        // components:
        nativeInputComponent     = (
            <MirroredInput
                // values:
                valueToUi={valueToUi}
            />
        ),
        
        
        
        // other props:
        ...restSelectZoneEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <SelectZoneEditor<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>
            // other props:
            {...restSelectZoneEditorProps}
            
            
            
            // models:
            modelName={modelName}
            
            
            
            // values:
            valueOptions={valueOptions}
            valueToUi={valueToUi}
            
            
            
            // validations:
            minLength={minLength}
            maxLength={maxLength}
            freeTextInput={freeTextInput}
            
            
            
            // behaviors:
            preferFocusOnInputEditor={preferFocusOnInputEditor}
            
            
            
            // states:
            assertiveFocusable={assertiveFocusable}
            
            
            
            // components:
            nativeInputComponent={nativeInputComponent}
        />
    );
};
export {
    SelectCountryEditor,            // named export for readibility
    SelectCountryEditor as default, // default export to support React.lazy
}
