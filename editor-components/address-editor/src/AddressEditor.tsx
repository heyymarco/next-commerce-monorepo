// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useAddressEditorStyleSheet,
}                           from './styles/loader.js'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    
    
    
    // an accessibility management system:
    type AccessibilityProps,
    AccessibilityProvider,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    type GenericProps,
    Generic,
}                           from '@reusable-ui/generic'                 // an unstyled basic building block of Reusable-UI components

// heymarco core:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// heymarco components:
import {
    // types:
    type EditorChangeEventHandler,
    
    
    
    // react components:
    type EditorProps,
}                           from '@heymarco/editor'
import {
    // react components:
    type TextEditorProps,
    TextEditor,
}                           from '@heymarco/text-editor'
import {
    // react components:
    NameEditor,
}                           from '@heymarco/name-editor'
import {
    // react components:
    PhoneEditor,
}                           from '@heymarco/phone-editor'

// internals:
import {
    type Address,
    type AddressType,
}                           from './types.js'



// utilities:
const emptyAddress : Address = {
    country   : '',
    state     : '',
    city      : '',
    zip       : '',
    address   : '',
    
    firstName : '',
    lastName  : '',
    phone     : '',
}



// react components:
export interface AddressEditorProps<out TElement extends Element = HTMLDivElement>
    extends
        // bases:
        Pick<EditorProps<HTMLDivElement, React.ChangeEvent<HTMLInputElement>, Address|null>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            
            
            
            // validations:
            |'enableValidation'
            |'isValid'
            |'inheritValidation'
            // |'onValidation' // not supported
            
            |'required'
        >,
        Omit<GenericProps<TElement>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >,
        
        // accessibilities:
        Omit<AccessibilityProps,
            // accessibilities:
            |'active'
            |'inheritActive'
        >
{
    // values:
    addressType ?: AddressType
    
    
    
    // components:
    countryEditorComponent   ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>
    stateEditorComponent     ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>
    cityEditorComponent      ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>
    zipEditorComponent       ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>
    addressEditorComponent   ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>
    
    firstNameEditorComponent ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>
    lastNameEditorComponent  ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>
    phoneEditorComponent     ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>
}
const AddressEditor         = <TElement extends Element = HTMLDivElement>(props: AddressEditorProps<TElement>): JSX.Element|null => {
    // jsx:
    return (
        <AccessibilityProvider {...props}>
            <AddressEditorInternal {...props} />
        </AccessibilityProvider>
    );
};
const AddressEditorInternal = <TElement extends Element = HTMLDivElement>(props: AddressEditorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // values:
        addressType,
        
        defaultValue            : defaultUncontrollableValue = emptyAddress,
        value                   : controllableValue,
        onChange                : onControllableValueChange,
        
        
        
        // validations:
        enableValidation  : _enableValidation,  // remove
        isValid           : _isValid,           // remove
        inheritValidation : _inheritValidation, // remove
        
        required = true,                        // take, to be forwarded to nested <Editor>(s)
        
        
        
        // states:
        enabled,         // take, to be handled by `<AccessibilityProvider>`
        inheritEnabled,  // take, to be handled by `<AccessibilityProvider>`
        
        readOnly,        // take, to be handled by `<AccessibilityProvider>`
        inheritReadOnly, // take, to be handled by `<AccessibilityProvider>`
        
        
        
        // components:
        countryEditorComponent   = (<TextEditor<  Element , React.ChangeEvent<HTMLInputElement>> aria-label='Country'           /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        stateEditorComponent     = (<TextEditor<  Element , React.ChangeEvent<HTMLInputElement>> aria-label='State'             /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        cityEditorComponent      = (<TextEditor<  Element , React.ChangeEvent<HTMLInputElement>> aria-label='City'              /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        zipEditorComponent       = (<TextEditor<  Element , React.ChangeEvent<HTMLInputElement>> aria-label='Zip (Postal) Code' /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        addressEditorComponent   = (<TextEditor<  Element , React.ChangeEvent<HTMLInputElement>> aria-label='Street Address'    /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        
        firstNameEditorComponent = (<NameEditor<  Element , React.ChangeEvent<HTMLInputElement>> aria-label='First Name'        /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        lastNameEditorComponent  = (<NameEditor<  Element , React.ChangeEvent<HTMLInputElement>> aria-label='Last Name'         /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        phoneEditorComponent     = (<PhoneEditor< Element , React.ChangeEvent<HTMLInputElement>>                                /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        
        
        
        // other props:
        ...restAddressEditorProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useAddressEditorStyleSheet();
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<Address|null, React.ChangeEvent<HTMLInputElement>>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    
    
    // handlers:
    const handleChangeInternal          = useEvent((field: keyof Address, newValue: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const newAddress : Address = {
            ...emptyAddress,
            ...value,
            [field] : newValue,
        };
        
        triggerValueChange(
            Object.values<string>(newAddress as unknown as { [key: string] : string }).some((field) => !!field?.trim().length) ? newAddress : null,
            { triggerAt: 'immediately', event: event }
        );
    });
    
    const handleCountryChangeInternal   = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, string>>((value, event) => {
        handleChangeInternal('country', value, event);
    });
    const handleStateChangeInternal     = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, string>>((value, event) => {
        handleChangeInternal('state', value, event);
    });
    const handleCityChangeInternal      = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, string>>((value, event) => {
        handleChangeInternal('city', value, event);
    });
    const handleZipChangeInternal       = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, string>>((value, event) => {
        handleChangeInternal('zip', value, event);
    });
    const handleAddressChangeInternal   = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, string>>((value, event) => {
        handleChangeInternal('address', value, event);
    });
    
    const handleFirstNameChangeInternal = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, string>>((value, event) => {
        handleChangeInternal('firstName', value, event);
    });
    const handleLastNameChangeInternal  = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, string>>((value, event) => {
        handleChangeInternal('lastName', value, event);
    });
    const handlePhoneChangeInternal     = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, string>>((value, event) => {
        handleChangeInternal('phone', value, event);
    });
    
    const handleCountryChange           = useMergeEvents(
        // preserves the original `onChange` from `countryEditorComponent`:
        countryEditorComponent.props.onChange,
        
        
        
        // actions:
        handleCountryChangeInternal,
    );
    const handleStateChange             = useMergeEvents(
        // preserves the original `onChange` from `stateEditorComponent`:
        stateEditorComponent.props.onChange,
        
        
        
        // actions:
        handleStateChangeInternal,
    );
    const handleCityChange              = useMergeEvents(
        // preserves the original `onChange` from `cityEditorComponent`:
        cityEditorComponent.props.onChange,
        
        
        
        // actions:
        handleCityChangeInternal,
    );
    const handleZipChange               = useMergeEvents(
        // preserves the original `onChange` from `zipEditorComponent`:
        zipEditorComponent.props.onChange,
        
        
        
        // actions:
        handleZipChangeInternal,
    );
    const handleAddressChange           = useMergeEvents(
        // preserves the original `onChange` from `addressEditorComponent`:
        addressEditorComponent.props.onChange,
        
        
        
        // actions:
        handleAddressChangeInternal,
    );
    
    const handleFirstNameChange         = useMergeEvents(
        // preserves the original `onChange` from `firstNameEditorComponent`:
        firstNameEditorComponent.props.onChange,
        
        
        
        // actions:
        handleFirstNameChangeInternal,
    );
    const handleLastNameChange          = useMergeEvents(
        // preserves the original `onChange` from `lastNameEditorComponent`:
        lastNameEditorComponent.props.onChange,
        
        
        
        // actions:
        handleLastNameChangeInternal,
    );
    const handlePhoneChange             = useMergeEvents(
        // preserves the original `onChange` from `phoneEditorComponent`:
        phoneEditorComponent.props.onChange,
        
        
        
        // actions:
        handlePhoneChangeInternal,
    );
    
    
    
    // default props:
    const {
        // classes:
        mainClass = styleSheet.main,
        
        
        
        // other props:
        ...restGenericProps
    } = restAddressEditorProps;
    
    const {
        // classes:
        className : countryClassName,
        
        
        
        // values:
        value     : countryValue,
        
        
        
        // validations:
        required  : countryRequired = required,
        
        
        
        // other props:
        ...CountryEditorComponentProps
    } = countryEditorComponent.props;
    
    const {
        // classes:
        className : stateClassName,
        
        
        
        // values:
        value     : stateValue,
        
        
        
        // validations:
        required  : stateRequired = required,
        
        
        
        // other props:
        ...StateEditorComponentProps
    } = stateEditorComponent.props;
    
    const {
        // classes:
        className : cityClassName,
        
        
        
        // values:
        value     : cityValue,
        
        
        
        // validations:
        required  : cityRequired = required,
        
        
        
        // other props:
        ...CityEditorComponentProps
    } = cityEditorComponent.props;
    
    const {
        // classes:
        className : zipClassName,
        
        
        
        // values:
        value     : zipValue,
        
        
        
        // validations:
        required  : zipRequired = false,
        
        
        
        // other props:
        ...ZipEditorComponentProps
    } = zipEditorComponent.props;
    
    const {
        // classes:
        className : addressClassName,
        
        
        
        // values:
        value     : addressValue,
        
        
        
        // validations:
        required  : addressRequired = required,
        
        
        
        // other props:
        ...AddressEditorComponentProps
    } = addressEditorComponent.props;
    
    
    const {
        // classes:
        className : firstNameClassName,
        
        
        
        // values:
        value     : firstNameValue,
        
        
        
        // validations:
        required  : firstNameRequired = required,
        
        
        
        // other props:
        ...FirstNameEditorComponentProps
    } = firstNameEditorComponent.props;
    
    const {
        // classes:
        className : lastNameClassName,
        
        
        
        // values:
        value     : lastNameValue,
        
        
        
        // validations:
        required  : lastNameRequired = required,
        
        
        
        // other props:
        ...LastNameEditorComponentProps
    } = lastNameEditorComponent.props;
    
    const {
        // classes:
        className : phoneClassName,
        
        
        
        // values:
        value     : phoneValue,
        
        
        
        // validations:
        required  : phoneRequired = required,
        
        
        
        // other props:
        ...PhoneEditorComponentProps
    } = phoneEditorComponent.props;
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // classes:
            mainClass={mainClass}
        >
            {/* <ResponsiveContainer> */}
            <div>
                {/* <Country> */}
                {React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(countryEditorComponent,
                    // props:
                    {
                        // other props:
                        ...CountryEditorComponentProps,
                        
                        
                        
                        // classes:
                        className : `${countryClassName} country`,
                        
                        
                        
                        // values:
                        value     : countryValue,
                        onChange  : handleCountryChange,
                        
                        
                        
                        // validations:
                        required  : countryRequired,
                    },
                )}
                
                {/* <State> */}
                {React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(stateEditorComponent,
                    // props:
                    {
                        // other props:
                        ...StateEditorComponentProps,
                        
                        
                        
                        // classes:
                        className : `${stateClassName} state`,
                        
                        
                        
                        // values:
                        value     : stateValue,
                        onChange  : handleStateChange,
                        
                        
                        
                        // validations:
                        required  : stateRequired,
                    },
                )}
                
                {/* <City> */}
                {React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(cityEditorComponent,
                    // props:
                    {
                        // other props:
                        ...CityEditorComponentProps,
                        
                        
                        
                        // classes:
                        className : `${cityClassName} city`,
                        
                        
                        
                        // values:
                        value     : cityValue,
                        onChange  : handleCityChange,
                        
                        
                        
                        // validations:
                        required  : cityRequired,
                    },
                )}
                
                {/* <Zip> */}
                {React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(zipEditorComponent,
                    // props:
                    {
                        // other props:
                        ...ZipEditorComponentProps,
                        
                        
                        
                        // classes:
                        className : `${zipClassName} zip`,
                        
                        
                        
                        // values:
                        value     : zipValue,
                        onChange  : handleZipChange,
                        
                        
                        
                        // validations:
                        required  : zipRequired,
                    },
                )}
                
                {/* <Address> */}
                {React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(addressEditorComponent,
                    // props:
                    {
                        // other props:
                        ...AddressEditorComponentProps,
                        
                        
                        
                        // classes:
                        className : `${addressClassName} address`,
                        
                        
                        
                        // values:
                        value     : addressValue,
                        onChange  : handleAddressChange,
                        
                        
                        
                        // validations:
                        required  : addressRequired,
                    },
                )}
                
                
                {/* <FirstName> */}
                {React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(firstNameEditorComponent,
                    // props:
                    {
                        // other props:
                        ...FirstNameEditorComponentProps,
                        
                        
                        
                        // classes:
                        className : `${firstNameClassName} firstName`,
                        
                        
                        
                        // values:
                        value     : firstNameValue,
                        onChange  : handleFirstNameChange,
                        
                        
                        
                        // validations:
                        required  : firstNameRequired,
                    },
                )}
                
                {/* <LastName> */}
                {React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(lastNameEditorComponent,
                    // props:
                    {
                        // other props:
                        ...LastNameEditorComponentProps,
                        
                        
                        
                        // classes:
                        className : `${lastNameClassName} lastName`,
                        
                        
                        
                        // values:
                        value     : lastNameValue,
                        onChange  : handleLastNameChange,
                        
                        
                        
                        // validations:
                        required  : lastNameRequired,
                    },
                )}
                
                {/* <Phone> */}
                {React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(phoneEditorComponent,
                    // props:
                    {
                        // other props:
                        ...PhoneEditorComponentProps,
                        
                        
                        
                        // classes:
                        className : `${phoneClassName} phone`,
                        
                        
                        
                        // values:
                        value     : phoneValue,
                        onChange  : handlePhoneChange,
                        
                        
                        
                        // validations:
                        required  : phoneRequired,
                    },
                )}
            </div>
        </Generic>
    );
};
export {
    AddressEditor,            // named export for readibility
    AddressEditor as default, // default export to support React.lazy
}
