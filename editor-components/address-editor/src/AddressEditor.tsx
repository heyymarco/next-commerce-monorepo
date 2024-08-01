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
    
    company   : '',
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
    addressType              ?: AddressType
    
    
    
    // components:
    countryEditorComponent   ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>> | null
    stateEditorComponent     ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>> | null
    cityEditorComponent      ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>> | null
    zipEditorComponent       ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>> | null
    addressEditorComponent   ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>> | null
    
    companyEditorComponent   ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>> | null
    firstNameEditorComponent ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>> | null
    lastNameEditorComponent  ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>> | null
    phoneEditorComponent     ?: React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>> | null
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
        addressType       : addressTypeRaw,
        
        defaultValue      : defaultUncontrollableValue = emptyAddress,
        value             : controllableValue,
        onChange          : onControllableValueChange,
        
        
        
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
        
        companyEditorComponent   = (<NameEditor<  Element , React.ChangeEvent<HTMLInputElement>> aria-label='Company'           /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        firstNameEditorComponent = (<NameEditor<  Element , React.ChangeEvent<HTMLInputElement>> aria-label='First Name'        /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        lastNameEditorComponent  = (<NameEditor<  Element , React.ChangeEvent<HTMLInputElement>> aria-label='Last Name'         /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        phoneEditorComponent     = (<PhoneEditor< Element , React.ChangeEvent<HTMLInputElement>>                                /> as React.ReactElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>),
        
        
        
        // other props:
        ...restAddressEditorProps
    } = props;
    const addressType = (
        !addressTypeRaw
        ? ''
        : `${addressTypeRaw} `
    );
    
    
    
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
    
    const handleCompanyChangeInternal   = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, string>>((value, event) => {
        handleChangeInternal('company', value, event);
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
        countryEditorComponent?.props.onChange,
        
        
        
        // actions:
        handleCountryChangeInternal,
    );
    const handleStateChange             = useMergeEvents(
        // preserves the original `onChange` from `stateEditorComponent`:
        stateEditorComponent?.props.onChange,
        
        
        
        // actions:
        handleStateChangeInternal,
    );
    const handleCityChange              = useMergeEvents(
        // preserves the original `onChange` from `cityEditorComponent`:
        cityEditorComponent?.props.onChange,
        
        
        
        // actions:
        handleCityChangeInternal,
    );
    const handleZipChange               = useMergeEvents(
        // preserves the original `onChange` from `zipEditorComponent`:
        zipEditorComponent?.props.onChange,
        
        
        
        // actions:
        handleZipChangeInternal,
    );
    const handleAddressChange           = useMergeEvents(
        // preserves the original `onChange` from `addressEditorComponent`:
        addressEditorComponent?.props.onChange,
        
        
        
        // actions:
        handleAddressChangeInternal,
    );
    
    const handleCompanyChange           = useMergeEvents(
        // preserves the original `onChange` from `companyEditorComponent`:
        companyEditorComponent?.props.onChange,
        
        
        
        // actions:
        handleCompanyChangeInternal,
    );
    const handleFirstNameChange         = useMergeEvents(
        // preserves the original `onChange` from `firstNameEditorComponent`:
        firstNameEditorComponent?.props.onChange,
        
        
        
        // actions:
        handleFirstNameChangeInternal,
    );
    const handleLastNameChange          = useMergeEvents(
        // preserves the original `onChange` from `lastNameEditorComponent`:
        lastNameEditorComponent?.props.onChange,
        
        
        
        // actions:
        handleLastNameChangeInternal,
    );
    const handlePhoneChange             = useMergeEvents(
        // preserves the original `onChange` from `phoneEditorComponent`:
        phoneEditorComponent?.props.onChange,
        
        
        
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
        className    : countryClassName      = '',
        
        
        
        // values:
        value        : countryValue          = value?.country ?? '',
        
        
        
        // validations:
        required     : countryRequired       = required,
        
        
        
        // formats:
        autoComplete : countryAutoComplete   = `${addressType}country-name`,
        
        
        
        // other props:
        ...countryEditorComponentProps
    } = countryEditorComponent?.props ?? {};
    
    const {
        // classes:
        className    : stateClassName        = '',
        
        
        
        // values:
        value        : stateValue            = value?.state ?? '',
        
        
        
        // validations:
        required     : stateRequired         = required,
        
        
        
        // formats:
        autoComplete : stateAutoComplete     = `${addressType}address-level1`,
        
        
        
        // other props:
        ...stateEditorComponentProps
    } = stateEditorComponent?.props ?? {};
    
    const {
        // classes:
        className    : cityClassName         = '',
        
        
        
        // values:
        value        : cityValue             = value?.city ?? '',
        
        
        
        // validations:
        required     : cityRequired          = required,
        
        
        
        // formats:
        autoComplete : cityAutoComplete      = `${addressType}address-level2`,
        
        
        
        // other props:
        ...cityEditorComponentProps
    } = cityEditorComponent?.props ?? {};
    
    const {
        // classes:
        className    : zipClassName          = '',
        
        
        
        // values:
        value        : zipValue              = value?.zip ?? '',
        
        
        
        // validations:
        required     : zipRequired           = false,
        
        
        
        // formats:
        autoComplete : zipAutoComplete       = `${addressType}postal-code`,
        
        
        
        // other props:
        ...zipEditorComponentProps
    } = zipEditorComponent?.props ?? {};
    
    const {
        // classes:
        className    : addressClassName      = '',
        
        
        
        // values:
        value        : addressValue          = value?.address ?? '',
        
        
        
        // validations:
        required     : addressRequired       = required,
        
        
        
        // formats:
        autoComplete : addressAutoComplete   = `${addressType}street-address`,
        
        
        
        // other props:
        ...addressEditorComponentProps
    } = addressEditorComponent?.props ?? {};
    
    
    const {
        // classes:
        className    : companyClassName      = '',
        
        
        
        // values:
        value        : companyValue          = value?.company ?? '',
        
        
        
        // validations:
        required     : companyRequired       = required,
        
        
        
        // formats:
        autoComplete : companyAutoComplete   = `${addressType}organization`,
        
        
        
        // other props:
        ...companyEditorComponentProps
    } = companyEditorComponent?.props ?? {};
    
    const {
        // classes:
        className    : firstNameClassName    = '',
        
        
        
        // values:
        value        : firstNameValue        = value?.firstName ?? '',
        
        
        
        // validations:
        required     : firstNameRequired     = required,
        
        
        
        // formats:
        autoComplete : firstNameAutoComplete = `${addressType}given-name`,
        
        
        
        // other props:
        ...firstNameEditorComponentProps
    } = firstNameEditorComponent?.props ?? {};
    
    const {
        // classes:
        className    : lastNameClassName     = '',
        
        
        
        // values:
        value        : lastNameValue         = value?.lastName ?? '',
        
        
        
        // validations:
        required     : lastNameRequired      = required,
        
        
        
        // formats:
        autoComplete : lastNameAutoComplete  = `${addressType}family-name`,
        
        
        
        // other props:
        ...lastNameEditorComponentProps
    } = lastNameEditorComponent?.props ?? {};
    
    const {
        // classes:
        className    : phoneClassName        = '',
        
        
        
        // values:
        value        : phoneValue            = value?.phone ?? '',
        
        
        
        // validations:
        required     : phoneRequired         = required,
        
        
        
        // formats:
        autoComplete : phoneAutoComplete     = `${addressType}tel`,
        
        
        
        // other props:
        ...phoneEditorComponentProps
    } = phoneEditorComponent?.props ?? {};
    
    
    
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
                {!!countryEditorComponent && React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(countryEditorComponent,
                    // props:
                    {
                        // other props:
                        ...countryEditorComponentProps,
                        
                        
                        
                        // classes:
                        className    : `${countryClassName} country`,
                        
                        
                        
                        // values:
                        value        : countryValue,
                        onChange     : handleCountryChange,
                        
                        
                        
                        // validations:
                        required     : countryRequired,
                        
                        
                        
                        // formats:
                        autoComplete : countryAutoComplete,
                    },
                )}
                
                {/* <State> */}
                {!!stateEditorComponent && React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(stateEditorComponent,
                    // props:
                    {
                        // other props:
                        ...stateEditorComponentProps,
                        
                        
                        
                        // classes:
                        className    : `${stateClassName} state`,
                        
                        
                        
                        // values:
                        value        : stateValue,
                        onChange     : handleStateChange,
                        
                        
                        
                        // validations:
                        required     : stateRequired,
                        
                        
                        
                        // formats:
                        autoComplete : stateAutoComplete,
                    },
                )}
                
                {/* <City> */}
                {!!cityEditorComponent && React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(cityEditorComponent,
                    // props:
                    {
                        // other props:
                        ...cityEditorComponentProps,
                        
                        
                        
                        // classes:
                        className    : `${cityClassName} city`,
                        
                        
                        
                        // values:
                        value        : cityValue,
                        onChange     : handleCityChange,
                        
                        
                        
                        // validations:
                        required     : cityRequired,
                        
                        
                        
                        // formats:
                        autoComplete : cityAutoComplete,
                    },
                )}
                
                {/* <Zip> */}
                {!!zipEditorComponent && React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(zipEditorComponent,
                    // props:
                    {
                        // other props:
                        ...zipEditorComponentProps,
                        
                        
                        
                        // classes:
                        className    : `${zipClassName} zip`,
                        
                        
                        
                        // values:
                        value        : zipValue,
                        onChange     : handleZipChange,
                        
                        
                        
                        // validations:
                        required     : zipRequired,
                        
                        
                        
                        // formats:
                        autoComplete : zipAutoComplete,
                    },
                )}
                
                {/* <Address> */}
                {!!addressEditorComponent && React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(addressEditorComponent,
                    // props:
                    {
                        // other props:
                        ...addressEditorComponentProps,
                        
                        
                        
                        // classes:
                        className    : `${addressClassName} address`,
                        
                        
                        
                        // values:
                        value        : addressValue,
                        onChange     : handleAddressChange,
                        
                        
                        
                        // validations:
                        required     : addressRequired,
                        
                        
                        
                        // formats:
                        autoComplete : addressAutoComplete,
                    },
                )}
                
                
                {/* <Company> */}
                {!!companyEditorComponent && React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(companyEditorComponent,
                    // props:
                    {
                        // other props:
                        ...companyEditorComponentProps,
                        
                        
                        
                        // classes:
                        className    : `${companyClassName} company`,
                        
                        
                        
                        // values:
                        value        : companyValue,
                        onChange     : handleCompanyChange,
                        
                        
                        
                        // validations:
                        required     : companyRequired,
                        
                        
                        
                        // formats:
                        autoComplete : companyAutoComplete,
                    },
                )}
                
                {/* <FirstName> */}
                {!!firstNameEditorComponent && React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(firstNameEditorComponent,
                    // props:
                    {
                        // other props:
                        ...firstNameEditorComponentProps,
                        
                        
                        
                        // classes:
                        className    : `${firstNameClassName} firstName`,
                        
                        
                        
                        // values:
                        value        : firstNameValue,
                        onChange     : handleFirstNameChange,
                        
                        
                        
                        // validations:
                        required     : firstNameRequired,
                        
                        
                        
                        // formats:
                        autoComplete : firstNameAutoComplete,
                    },
                )}
                
                {/* <LastName> */}
                {!!lastNameEditorComponent && React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(lastNameEditorComponent,
                    // props:
                    {
                        // other props:
                        ...lastNameEditorComponentProps,
                        
                        
                        
                        // classes:
                        className    : `${lastNameClassName} lastName`,
                        
                        
                        
                        // values:
                        value        : lastNameValue,
                        onChange     : handleLastNameChange,
                        
                        
                        
                        // validations:
                        required     : lastNameRequired,
                        
                        
                        
                        // formats:
                        autoComplete : lastNameAutoComplete,
                    },
                )}
                
                {/* <Phone> */}
                {!!phoneEditorComponent && React.cloneElement<TextEditorProps<Element, React.ChangeEvent<HTMLInputElement>>>(phoneEditorComponent,
                    // props:
                    {
                        // other props:
                        ...phoneEditorComponentProps,
                        
                        
                        
                        // classes:
                        className    : `${phoneClassName} phone`,
                        
                        
                        
                        // values:
                        value        : phoneValue,
                        onChange     : handlePhoneChange,
                        
                        
                        
                        // validations:
                        required     : phoneRequired,
                        
                        
                        
                        // formats:
                        autoComplete : phoneAutoComplete,
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
