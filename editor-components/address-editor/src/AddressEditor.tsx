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
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
    useMergeEvents,
    
    
    
    // an accessibility management system:
    type AccessibilityProps,
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
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
export interface AddressEditorProps<out TElement extends Element = HTMLDivElement, TValue extends Address|null = Address|null, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        Pick<EditorProps<TElement, TValue, TChangeEvent>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            
            
            
            // validations:
            |'enableValidation'
            |'isValid'
            |'inheritValidation'
            // |'validationDeps'    // not supported
            // |'onValidation'      // not supported
            
            // |'validDelay'        // not supported
            // |'invalidDelay'      // not supported
            // |'noValidationDelay' // not supported
            
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
    countryEditorComponent   ?: React.ReactElement<TextEditorProps<Element, string, TChangeEvent>> | null
    stateEditorComponent     ?: React.ReactElement<TextEditorProps<Element, string, TChangeEvent>> | null
    cityEditorComponent      ?: React.ReactElement<TextEditorProps<Element, string, TChangeEvent>> | null
    zipEditorComponent       ?: React.ReactElement<TextEditorProps<Element, string, TChangeEvent>> | null
    addressEditorComponent   ?: React.ReactElement<TextEditorProps<Element, string, TChangeEvent>> | null
    
    companyEditorComponent   ?: React.ReactElement<TextEditorProps<Element, string, TChangeEvent>> | null
    firstNameEditorComponent ?: React.ReactElement<TextEditorProps<Element, string, TChangeEvent>> | null
    lastNameEditorComponent  ?: React.ReactElement<TextEditorProps<Element, string, TChangeEvent>> | null
    phoneEditorComponent     ?: React.ReactElement<TextEditorProps<Element, string, TChangeEvent>> | null
}
const AddressEditor         = <TElement extends Element = HTMLDivElement, TValue extends Address|null = Address|null, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: AddressEditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
    // jsx:
    return (
        <AccessibilityProvider {...props}>
            <ValidationProvider {...props}>
                <AddressEditorInternal<TElement, TValue, TChangeEvent> {...props} />
            </ValidationProvider>
        </AccessibilityProvider>
    );
};
const AddressEditorInternal = <TElement extends Element = HTMLDivElement, TValue extends Address|null = Address|null, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: AddressEditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // values:
        addressType       : addressTypeRaw,
        
        defaultValue      : defaultUncontrollableValue = emptyAddress as TValue,
        value             : controllableValue,
        onChange          : onValueChange,
        
        
        
        // validations:
        enableValidation  : _enableValidation,  // remove, already handled by `<ValidationProvider>`
        isValid           : _isValid,           // remove, already handled by `<ValidationProvider>`
        inheritValidation : _inheritValidation, // remove, already handled by `<ValidationProvider>`
        
        required          = true,               // take to nested <Editor>(s)
        
        
        
        // states:
        enabled           : _enabled,           // remove, already handled by `<AccessibilityProvider>`
        inheritEnabled    : _inheritEnabled,    // remove, already handled by `<AccessibilityProvider>`
        
        readOnly          : _readOnly,          // remove, already handled by `<AccessibilityProvider>`
        inheritReadOnly   : _inheritReadOnly,   // remove, already handled by `<AccessibilityProvider>`
        
        
        
        // components:
        countryEditorComponent   = (<TextEditor<  Element , string, TChangeEvent> aria-label='Country'           /> as React.ReactElement<TextEditorProps<Element, string, TChangeEvent>>),
        stateEditorComponent     = (<TextEditor<  Element , string, TChangeEvent> aria-label='State'             /> as React.ReactElement<TextEditorProps<Element, string, TChangeEvent>>),
        cityEditorComponent      = (<TextEditor<  Element , string, TChangeEvent> aria-label='City'              /> as React.ReactElement<TextEditorProps<Element, string, TChangeEvent>>),
        zipEditorComponent       = (<TextEditor<  Element , string, TChangeEvent> aria-label='Zip (Postal) Code' /> as React.ReactElement<TextEditorProps<Element, string, TChangeEvent>>),
        addressEditorComponent   = (<TextEditor<  Element , string, TChangeEvent> aria-label='Street Address'    /> as React.ReactElement<TextEditorProps<Element, string, TChangeEvent>>),
        
        companyEditorComponent   = (<NameEditor<  Element , string, TChangeEvent> aria-label='Company'           /> as React.ReactElement<TextEditorProps<Element, string, TChangeEvent>>),
        firstNameEditorComponent = (<NameEditor<  Element , string, TChangeEvent> aria-label='First Name'        /> as React.ReactElement<TextEditorProps<Element, string, TChangeEvent>>),
        lastNameEditorComponent  = (<NameEditor<  Element , string, TChangeEvent> aria-label='Last Name'         /> as React.ReactElement<TextEditorProps<Element, string, TChangeEvent>>),
        phoneEditorComponent     = (<PhoneEditor< Element , string, TChangeEvent>                                /> as React.ReactElement<TextEditorProps<Element, string, TChangeEvent>>),
        
        
        
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
    } = useControllableAndUncontrollable<TValue, TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onValueChange,
    });
    
    
    
    // handlers:
    const handleChangeInternal          = useEvent((field: keyof Exclude<TValue, null>, newValue: string, event: TChangeEvent) => {
        const newAddress : Exclude<TValue, null> = {
            ...emptyAddress as Exclude<TValue, null>,
            ...value,
            [field] : newValue,
        };
        
        triggerValueChange(
            Object.values<string>(newAddress as unknown as { [key: string] : string }).some((field) => !!field?.trim().length) ? newAddress : (null as TValue),
            { triggerAt: 'immediately', event: event }
        );
    });
    
    const handleCountryChangeInternal   = useEvent<EditorChangeEventHandler<string, TChangeEvent>>((value, event) => {
        handleChangeInternal('country', value, event);
    });
    const handleStateChangeInternal     = useEvent<EditorChangeEventHandler<string, TChangeEvent>>((value, event) => {
        handleChangeInternal('state', value, event);
    });
    const handleCityChangeInternal      = useEvent<EditorChangeEventHandler<string, TChangeEvent>>((value, event) => {
        handleChangeInternal('city', value, event);
    });
    const handleZipChangeInternal       = useEvent<EditorChangeEventHandler<string, TChangeEvent>>((value, event) => {
        handleChangeInternal('zip', value, event);
    });
    const handleAddressChangeInternal   = useEvent<EditorChangeEventHandler<string, TChangeEvent>>((value, event) => {
        handleChangeInternal('address', value, event);
    });
    
    const handleCompanyChangeInternal   = useEvent<EditorChangeEventHandler<string, TChangeEvent>>((value, event) => {
        handleChangeInternal('company', value, event);
    });
    const handleFirstNameChangeInternal = useEvent<EditorChangeEventHandler<string, TChangeEvent>>((value, event) => {
        handleChangeInternal('firstName', value, event);
    });
    const handleLastNameChangeInternal  = useEvent<EditorChangeEventHandler<string, TChangeEvent>>((value, event) => {
        handleChangeInternal('lastName', value, event);
    });
    const handlePhoneChangeInternal     = useEvent<EditorChangeEventHandler<string, TChangeEvent>>((value, event) => {
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
    } = restAddressEditorProps satisfies NoForeignProps<typeof restAddressEditorProps, GenericProps<TElement>>;
    
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
                {!!countryEditorComponent && React.cloneElement<TextEditorProps<Element, string, TChangeEvent>>(countryEditorComponent,
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
                {!!stateEditorComponent && React.cloneElement<TextEditorProps<Element, string, TChangeEvent>>(stateEditorComponent,
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
                {!!cityEditorComponent && React.cloneElement<TextEditorProps<Element, string, TChangeEvent>>(cityEditorComponent,
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
                {!!zipEditorComponent && React.cloneElement<TextEditorProps<Element, string, TChangeEvent>>(zipEditorComponent,
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
                {!!addressEditorComponent && React.cloneElement<TextEditorProps<Element, string, TChangeEvent>>(addressEditorComponent,
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
                {!!companyEditorComponent && React.cloneElement<TextEditorProps<Element, string, TChangeEvent>>(companyEditorComponent,
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
                {!!firstNameEditorComponent && React.cloneElement<TextEditorProps<Element, string, TChangeEvent>>(firstNameEditorComponent,
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
                {!!lastNameEditorComponent && React.cloneElement<TextEditorProps<Element, string, TChangeEvent>>(lastNameEditorComponent,
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
                {!!phoneEditorComponent && React.cloneElement<TextEditorProps<Element, string, TChangeEvent>>(phoneEditorComponent,
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
