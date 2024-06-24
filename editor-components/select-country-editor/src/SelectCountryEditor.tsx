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
    DummyTextEditor,
}                           from './DummyTextEditor.js'

// internals:
import {
    getCountryDisplay,
    defaultCountryList,
}                           from './utilities.js'



// react components:
export interface SelectCountryEditorProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<string> = DropdownListExpandedChangeEvent<string>>
    extends
        // bases:
        SelectZoneEditorProps<TElement, TChangeEvent, TDropdownListExpandedChangeEvent>
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
        freeTextInput            = false,
        
        
        
        // behaviors:
        preferFocusOnInputEditor = false,
        
        
        
        // components:
        inputEditorComponent     = (
            <DummyTextEditor<Element, TChangeEvent>
                // values:
                valueToUi={valueToUi}
                
                
                
                // validations:
                minLength={2}
                maxLength={2}
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
            freeTextInput={freeTextInput}
            
            
            
            // behaviors:
            preferFocusOnInputEditor={preferFocusOnInputEditor}
            
            
            
            // components:
            inputEditorComponent={inputEditorComponent}
        />
    );
};
export {
    SelectCountryEditor,            // named export for readibility
    SelectCountryEditor as default, // default export to support React.lazy
}
