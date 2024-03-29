// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useScheduleTriggerEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    Label,
    EditableButton,
    ButtonIcon,
    TextInput,
    TelInput,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // menu-components:
    DropdownListButton,
    
    
    
    // composite-components:
    Group,
    
    
    
    // utility-components:
    VisuallyHidden,
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components

// redux:
import type {
    EntityState
}                           from '@reduxjs/toolkit'



// types:
export interface CountryEntry {
    code : string
    name : string
}



export interface AddressFieldsProps {
    // refs:
    addressRef        ?: React.Ref<HTMLInputElement> // setter ref
    
    
    
    // types:
    addressType       ?: 'shipping'|'billing'|(string & {})
    
    
    
    // values:
    firstName         ?: string
    lastName          ?: string
    
    phone             ?: string
    
    address           ?: string
    city              ?: string
    zone              ?: string
    zip               ?: string
    country           ?: string
    countryList       ?: EntityState<CountryEntry>
    
    
    
    // events:
    onFirstNameChange ?: React.ChangeEventHandler<HTMLInputElement>
    onLastNameChange  ?: React.ChangeEventHandler<HTMLInputElement>
    
    onPhoneChange     ?: React.ChangeEventHandler<HTMLInputElement>
    
    onAddressChange   ?: React.ChangeEventHandler<HTMLInputElement>
    onCityChange      ?: React.ChangeEventHandler<HTMLInputElement>
    onZoneChange      ?: React.ChangeEventHandler<HTMLInputElement>
    onZipChange       ?: React.ChangeEventHandler<HTMLInputElement>
    onCountryChange   ?: React.ChangeEventHandler<HTMLInputElement>
}
const AddressFields = (props: AddressFieldsProps) => {
    // props:
    const {
        // refs:
        addressRef,
        
        
        
        // types:
        addressType,
        
        
        
        // values:
        firstName = '',
        lastName  = '',
        
        phone     = '',
        
        address   = '',
        city      = '',
        zone      = '',
        zip       = '',
        country   = '',
        countryList,
        
        
        
        // events:
        onFirstNameChange,
        onLastNameChange,
        
        onPhoneChange,
        
        onAddressChange,
        onCityChange,
        onZoneChange,
        onZipChange,
        onCountryChange,
    } = props;
    
    const filteredCountryList = !countryList ? undefined : Object.values(countryList.entities).filter((countryEntry): countryEntry is Exclude<typeof countryEntry, undefined> => !!countryEntry);
    const selectedCountry     = countryList?.entities?.[country ?? ''];
    
    
    
    // fn props:
    const addressTypeFn      = addressType ? `${addressType} ` : '';
    
    
    
    // refs:
    const countryInputRefInternal = useRef<HTMLInputElement|null>(null);
    
    
    
    // events:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    
    
    
    // jsx:
    return (
        <>
            <Group className='country'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='flag' theme='primary' mild={true} />
                    <VisuallyHidden>
                        <input type='text' tabIndex={-1} role='none' required minLength={2} maxLength={3} autoComplete={`${addressTypeFn}country`}        value={country}                   onChange={onCountryChange}      ref={countryInputRefInternal} />
                    </VisuallyHidden>
                </Label>
                <DropdownListButton
                    buttonChildren={selectedCountry?.name ?? 'Country'}
                    buttonComponent={
                        <EditableButton
                            // accessibilities:
                            assertiveFocusable={true}
                            
                            
                            
                            // validations:
                            isValid={!!selectedCountry}
                            
                            
                            
                            // components:
                            buttonComponent={
                                <ButtonIcon
                                    // appearances:
                                    icon='dropdown'
                                    iconPosition='end'
                                />
                            }
                        />
                    }
                    
                    theme='primary'
                    mild={true}
                    
                    aria-label='Country'
                >
                    {!!filteredCountryList && filteredCountryList.map(({code, name}, index) =>
                        <ListItem
                            // key={code} // the country may be duplicated in several places
                            key={index}
                            
                            active={code === country}
                            onClick={() => {
                                const countryInputElm = countryInputRefInternal.current;
                                if (countryInputElm) {
                                    // react *hack*: trigger `onChange` event:
                                    scheduleTriggerEvent(() => { // runs the `input` event *next after* current macroTask completed
                                        const oldValue = countryInputElm.value; // react *hack* get_prev_value *before* modifying
                                        countryInputElm.value = code;           // react *hack* set_value *before* firing `input` event
                                        (countryInputElm as any)._valueTracker?.setValue(oldValue); // react *hack* in order to React *see* the changes when `input` event fired
                                        
                                        
                                        
                                        // fire `input` native event to trigger `onChange` synthetic event:
                                        countryInputElm.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: false, composed: true, data: code, dataTransfer: null, inputType: 'insertFromPaste', isComposing: false, view: null, detail: 0 }));
                                    });
                                } // if
                            }}
                        >
                            {name}
                        </ListItem>
                    )}
                </DropdownListButton>
            </Group>
            
            <Group className='firstName'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='person' theme='primary' mild={true} />
                </Label>
                <TextInput  placeholder='First Name'         required minLength={2} maxLength={30} autoComplete={`${addressTypeFn}given-name`}     autoCapitalize='words' value={firstName} onChange={onFirstNameChange} />
            </Group>
            <Group className='lastName'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='person_outline' theme='primary' mild={true} />
                </Label>
                <TextInput  placeholder='Last Name'          required minLength={1} maxLength={30} autoComplete={`${addressTypeFn}family-name`}    autoCapitalize='words' value={lastName}  onChange={onLastNameChange}  />
            </Group>
            <Group className='phone'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='phone' theme='primary' mild={true} />
                </Label>
                <TelInput   placeholder='Phone'              required minLength={5} maxLength={15} autoComplete={`${addressTypeFn}tel`}            value={phone}                            onChange={onPhoneChange}     />
            </Group>
            <Group className='address'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='house' theme='primary' mild={true} />
                </Label>
                <TextInput  placeholder='Address'            required minLength={5} maxLength={90} autoComplete={`${addressTypeFn}street-address`} value={address}                          onChange={onAddressChange}      elmRef={addressRef} />
            </Group>
            <Group className='city'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='location_city' theme='primary' mild={true} />
                </Label>
                <TextInput  placeholder='City'               required minLength={3} maxLength={50} autoComplete={`${addressTypeFn}address-level2`} autoCapitalize='words' value={city}      onChange={onCityChange}      />
            </Group>
            <Group className='zone'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='location_pin' theme='primary' mild={true} />
                </Label>
                <TextInput  placeholder='State'              required minLength={3} maxLength={50} autoComplete={`${addressTypeFn}address-level1`} autoCapitalize='words' value={zone}      onChange={onZoneChange}      />
            </Group>
            <Group className='zip'>
                <Label theme='secondary' mild={false} className='solid'>
                    <Icon icon='edit_location' theme='primary' mild={true} />
                </Label>
                <TextInput  placeholder='ZIP Code'                    minLength={2} maxLength={11} autoComplete={`${addressTypeFn}postal-code`}    value={zip}                              onChange={onZipChange}       />
            </Group>
        </>
    );
};
export {
    AddressFields,
    AddressFields as default,
}
