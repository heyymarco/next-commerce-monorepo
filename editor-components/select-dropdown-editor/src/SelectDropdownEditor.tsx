// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
    
    
    
    // a capability of UI to rotate its layout:
    type OrientationName,
    useOrientationableWithDirection,
    
    
    
    // a possibility of UI having an invalid state:
    type ValidityChangeEvent,
    type ValidationDeps,
    type ValidationEventHandler,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    type IconList,
}                           from '@reusable-ui/icon'                    // an icon set component for React app
import {
    // simple-components:
    type ButtonProps,
}                           from '@reusable-ui/button'                  // a button component for initiating an action
import {
    // simple-components:
    type EditableButtonProps,
    EditableButton,
    
    type EditableButtonComponentProps,
}                           from '@reusable-ui/editable-button'         // a button with validation indicator
import {
    // simple-components:
    type ButtonIconProps,
    ButtonIcon,
}                           from '@reusable-ui/button-icon'             // a button component with a nice icon
import {
    // layout-components:
    type ListItemProps,
    type ListItemComponentProps,
}                           from '@reusable-ui/list'                    // represents a series of content
import {
    type DropdownProps,
}                           from '@reusable-ui/dropdown'                // overlays contextual element such as lists, menus, and more
import {
    type DropdownListProps,
}                           from '@reusable-ui/dropdown-list'           // overlays a list element (menu)
import {
    // menu-components:
    type DropdownListExpandedChangeEvent,
    type DropdownListButtonProps,
    DropdownListButton,
    
    
    
    // defaults:
    defaultOrientationableWithDirectionOptions,
}                           from '@reusable-ui/dropdown-list-button'    // a button component with a dropdown list UI

// heymarco core:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// heymarco components:
import {
    // react components:
    type EditorProps,
}                           from '@heymarco/editor'

// internal components:
import {
    // react components:
    SelectDropdownEditorItem,
}                           from './SelectDropdownEditorItem.js'

// internals:
import {
    // react components:
    ListItemWithClickHandler,
}                           from './ListItemWithClickHandler.js'
import {
    // states:
    type SelectValidatorProps,
    useSelectValidator,
}                           from './states/SelectValidator.js'



// utilities:
const defaultValueToUi = <TValue extends any = string>(value: TValue|null): React.ReactNode => `${value ?? ''}`;



// react components:
export interface SelectDropdownEditorProps<out TElement extends Element = HTMLButtonElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
    extends
        // bases:
        Pick<EditorProps<TElement, TValue, TChangeEvent>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            
            |'notifyValueChange'
            
            
            
            // validations:
            |'enableValidation'
            |'isValid'
            |'inheritValidation'
            |'validationDeps'
            |'onValidation'
            
            |'validDelay'
            |'invalidDelay'
            |'noValidationDelay'
            
            |'required'
        >,
        Omit<DropdownListButtonProps<TDropdownListExpandedChangeEvent>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            
            
            
            // components:
            |'buttonComponent' // we use a more specific button: <ButtonIcon>
        >,
        
        // validations:
        SelectValidatorProps<TValue>,
        
        // components:
        ListItemComponentProps<Element>,
        EditableButtonComponentProps
{
    // appearances:
    iconLoading     ?: IconList|null,
    
    
    
    // values:
    valueToUi       ?: (value: TValue|null) => React.ReactNode
    
    
    
    // components:
    buttonComponent ?: React.ReactElement<ButtonIconProps>
}
const SelectDropdownEditor = <TElement extends Element = HTMLButtonElement, TValue extends unknown = string, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: SelectDropdownEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // variants:
    const dropdownOrientationableVariant = useOrientationableWithDirection(props, defaultOrientationableWithDirectionOptions);
    const determineDropdownIcon = () => {
        // TODO: RTL direction aware
        switch(dropdownOrientationableVariant.orientation) {
            case 'inline-start': return 'dropleft';
            case 'inline-end'  : return 'dropright';
            case 'block-start' : return 'dropup';
            default            : return 'dropdown';
        } // switch
    };
    const determineDropdownIconPosition = (buttonOrientation: OrientationName) => {
        switch(dropdownOrientationableVariant.orientation) {
            case 'inline-start':
                if (buttonOrientation === 'inline') return 'start';
                break;
            case 'inline-end'  :
                if (buttonOrientation === 'inline') return 'end';
                break;
            case 'block-start' :
                if (buttonOrientation === 'block') return 'start';
                break;
            default            :
                if (buttonOrientation === 'block') return 'end';
                break;
        } // switch
        
        return 'end';
    };
    
    
    
    // props:
    const {
        // appearances:
        iconLoading             = 'busy',
        
        
        
        // values:
        valueOptions,
        excludedValueOptions,
        valueToUi               = defaultValueToUi,
        
        defaultValue            : defaultUncontrollableValue = '' as TValue,
        value                   : controllableValue,
        onChange                : onValueChange,
        
        
        
        // validations:
        enableValidation,                                  // take, to be handled by `<EditableButton>`
        isValid,                                           // take, to be handled by `<EditableButton>`
        inheritValidation,                                 // take, to be handled by `<EditableButton>`
        validationDeps          : validationDepsOverwrite, // take, to be handled by `<EditableButton>`
        onValidation,                                      // take, to be handled by `<EditableButton>` and `useSelectValidator`
        
        validDelay,                                        // take, to be handled by `<EditableButton>`
        invalidDelay,                                      // take, to be handled by `<EditableButton>`
        noValidationDelay,                                 // take, to be handled by `<EditableButton>`
        
        equalityValueComparison = Object.is,               // take, to be handled by                        `useSelectValidator`
        
        required,                                          // take, to be handled by                        `useSelectValidator`
        freeTextInput,                                     // take, to be handled by                        `useSelectValidator`
        
        
        
        // components:
        listItemComponent       = (<SelectDropdownEditorItem />                                                                                  as React.ReactElement<ListItemProps<Element>>),
        buttonOrientation       = 'inline',
        buttonComponent         = (<ButtonIcon iconPosition={determineDropdownIconPosition(buttonOrientation)} icon={determineDropdownIcon()} /> as React.ReactElement<ButtonIconProps>),
        editableButtonComponent = (<EditableButton />                                                                                            as React.ReactElement<EditableButtonProps>),
        
        
        
        // other props:
        ...restPreSelectDropdownEditorProps
    } = props;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue, TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onValueChange,
    });
    
    
    
    // states:
    const {
        // states:
        validationValues,
        
        
        
        // handlers:
        handleValidation: selectValidatorHandleValidation,
    } = useSelectValidator<TValue>({
        // values:
        valueOptions,
        excludedValueOptions,
        
        
        
        // validations:
        equalityValueComparison,
        
        required,
        freeTextInput,
    }, value);
    const appendValidationDeps = useEvent<ValidationDeps>((bases) => [
        ...bases,
        
        // validations:
        validationValues,
    ]);
    const mergedValidationDeps = useEvent<ValidationDeps>((bases) => {
        const basesStage2 = appendValidationDeps(bases);
        const basesStage3 = validationDepsOverwrite ? validationDepsOverwrite(basesStage2) : basesStage2;
        
        const validationDepsOverwrite2 = editableButtonComponent.props.validationDeps;
        const basesStage4 = validationDepsOverwrite2 ? validationDepsOverwrite2(basesStage3) : basesStage3;
        
        return basesStage4;
    });
    const handleValidation = useEvent<ValidationEventHandler<ValidityChangeEvent>>(async (event) => {
        /* sequentially runs validators from `selectValidatorHandleValidation()` then followed by `editableButtonComponent.props.onValidation()` and `props.onValidation()` */
        
        
        
        // states:
        // `selectValidator` is the primary validator, so it should be the first validation check:
        await selectValidatorHandleValidation(event);
        
        
        
        // preserves the original `onValidation` from `editableButtonComponent`:
        // *component*Validator (if any) is the external supplement validator, so it should be the second-to-last validation check:
        await editableButtonComponent.props.onValidation?.(event);
        
        
        
        // preserves the original `onValidation` from `props`:
        // *props*Validator (if any) is the external supplement validator, so it should be the last validation check:
        await onValidation?.(event);
    });
    
    
    
    // props:
    const {
        // values:
        notifyValueChange       = value,                   // take, to be handled by `<EditableButton>`
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = restPreSelectDropdownEditorProps;
    
    
    
    // default props:
    const {
        // variants:
        floatingPlacement = 'bottom-end',     // defaults to 'bottom-end'
        
        
        
        // components:
        dropdownComponent : dropdownListComponentRaw,
        
        
        
        // children:
        buttonChildren    = valueToUi(value), // defaults to `valueToUi(value)`
        
        
        
        // other props:
        ...restDropdownListButtonProps
    } = restSelectDropdownEditorProps satisfies NoForeignProps<typeof restSelectDropdownEditorProps, DropdownListButtonProps<TDropdownListExpandedChangeEvent>>;
    
    const {
        // values:
        notifyValueChange  : editableButtonComponentNotifyValueChange = notifyValueChange,
        
        
        
        // validations:
        enableValidation   : editableButtonComponentEnableValidation  = enableValidation,
        isValid            : editableButtonComponentIsValid           = isValid,
        inheritValidation  : editableButtonComponentInheritValidation = inheritValidation,
        
        validDelay         : editableButtonComponentValidDelay        = validDelay,
        invalidDelay       : editableButtonComponentInvalidDelay      = invalidDelay,
        noValidationDelay  : editableButtonComponentNoValidationDelay = noValidationDelay,
        
        
        
        // components:
        buttonComponent    : editableButtonComponentButtonComponent   = buttonComponent,
        
        
        
        // other props:
        ...restEditableButtonComponentProps
    } = editableButtonComponent.props;
    
    const defaultChildren : React.ReactElement|false = !!validationValues && <>
        {validationValues.map((validationValue, index) => {
            // default props:
            const {
                // states:
                active   = equalityValueComparison(validationValue, value),
                
                
                
                // children:
                children = valueToUi(validationValue),
                
                
                
                // other props:
                ...restListItemComponentProps
            } = listItemComponent.props;
            
            
            
            // jsx:
            return (
                <ListItemWithClickHandler
                    // identifiers:
                    key={index}
                    
                    
                    
                    // components:
                    listItemComponent={
                        React.cloneElement<ListItemProps<Element>>(listItemComponent,
                            // props:
                            {
                                // other props:
                                ...restListItemComponentProps,
                                
                                
                                
                                // states:
                                active : active,
                            },
                            
                            
                            
                            // children:
                            children,
                        )
                    }
                    
                    
                    
                    // handlers:
                    onClick={((event) => {
                        // conditions:
                        if (event.defaultPrevented) return;
                        
                        
                        
                        // actions:
                        triggerValueChange(validationValue, { triggerAt: 'immediately', event: event });
                    }) satisfies React.EventHandler<TChangeEvent & React.MouseEvent<HTMLInputElement>>}
                />
            );
        })}
    </>;
    
    const dropdownListComponent = dropdownListComponentRaw as React.ReactElement<DropdownListProps<Element, TDropdownListExpandedChangeEvent>>|undefined;
    const {
        // components:
        listComponent,
        dropdownComponent,
        
        
        
        // children:
        children : dropdownListChildren = defaultChildren,
    } = dropdownListComponent?.props ?? {};
    
    const {
        // children:
        children : dropdownChildren,
    } = dropdownComponent?.props ?? {};
    
    
    
    // jsx:
    return (
        <DropdownListButton<TDropdownListExpandedChangeEvent>
            // other props:
            {...restDropdownListButtonProps}
            
            
            
            // variants:
            floatingPlacement={floatingPlacement}
            
            
            
            // components:
            buttonComponent={
                /* <EditableButton> */
                React.cloneElement<EditableButtonProps>(editableButtonComponent,
                    // props:
                    {
                        // other props:
                        ...restEditableButtonComponentProps,
                        
                        
                        
                        // values:
                        notifyValueChange  : editableButtonComponentNotifyValueChange,
                        
                        
                        
                        // validations:
                        enableValidation   : editableButtonComponentEnableValidation,
                        isValid            : editableButtonComponentIsValid,
                        inheritValidation  : editableButtonComponentInheritValidation,
                        validationDeps     : mergedValidationDeps,
                        onValidation       : handleValidation,  // to be handled by `useSelectValidator()`
                        
                        validDelay         : editableButtonComponentValidDelay,
                        invalidDelay       : editableButtonComponentInvalidDelay,
                        noValidationDelay  : editableButtonComponentNoValidationDelay,
                        
                        
                        
                        // components:
                        buttonComponent    : ((!!validationValues && !!validationValues.length) ? editableButtonComponentButtonComponent : React.cloneElement<ButtonIconProps>(editableButtonComponentButtonComponent,
                            // props:
                            (
                                (validationValues === undefined)
                                ? {
                                    // appearances:
                                    icon    : iconLoading ?? undefined,
                                    
                                    
                                    
                                    // states:
                                    enabled : false,
                                }
                                : {
                                    // states:
                                    enabled : false,
                                }
                            ),
                        )) as React.ReactElement<ButtonProps>,
                    },
                )
            }
            dropdownComponent={
                (dropdownListComponent === undefined)
                ? undefined
                
                /* <DropdownList> */
                : React.cloneElement<DropdownListProps<Element, TDropdownListExpandedChangeEvent>>(dropdownListComponent,
                    // props:
                    {
                        // components:
                        listComponent     : listComponent,
                        dropdownComponent : (
                            (dropdownComponent === undefined)
                            ? undefined
                            /* <Dropdown> */
                            : React.cloneElement<DropdownProps<Element, TDropdownListExpandedChangeEvent>>(dropdownComponent,
                                // props:
                                undefined,
                                
                                
                                
                                // children:
                                (
                                    (dropdownChildren !== listComponent)
                                    ? dropdownChildren
                                    : listComponent
                                ),
                            )
                        ),
                    },
                    
                    
                    
                    // children:
                    dropdownListChildren,
                ) as typeof dropdownListComponentRaw
            }
            
            
            
            // children:
            buttonChildren={buttonChildren}
        >
            {dropdownListChildren}
        </DropdownListButton>
    );
};
export {
    SelectDropdownEditor,            // named export for readibility
    SelectDropdownEditor as default, // default export to support React.lazy
}



export interface SelectDropdownEditorComponentProps<out TElement extends Element = HTMLButtonElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
{
    // components:
    selectDropdownEditorComponent ?: React.ReactElement<SelectDropdownEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>>
}
