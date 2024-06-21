// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
    useMountedFlag,
    
    
    
    // a capability of UI to rotate its layout:
    type OrientationName,
    useOrientationableWithDirection,
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
    // types:
    type ValueChangeEventHandler,
    
    
    
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
const defaultValueToUi = <TValue extends any = string>(value: TValue|null): string => `${value ?? ''}`;



// react components:
export interface SelectDropdownEditorProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TValue extends unknown = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
    extends
        // bases:
        Pick<EditorProps<TElement, TChangeEvent, TValue>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            
            
            
            // validations:
            |'enableValidation'
            |'isValid'
            |'inheritValidation'
            |'onValidation'
            
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
    valueToUi       ?: (value: TValue|null) => string
    
    
    
    // components:
    buttonComponent ?: React.ReactElement<ButtonIconProps>
}
const SelectDropdownEditor = <TElement extends Element = HTMLSpanElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TValue extends unknown = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: SelectDropdownEditorProps<TElement, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
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
        onChange                : onControllableValueChange,
        
        
        
        // validations:
        enableValidation,                    // take, to be handled by `<EditableButton>`
        isValid,                             // take, to be handled by `<EditableButton>`
        inheritValidation,                   // take, to be handled by `<EditableButton>`
        onValidation,                        // take, to be handled by `<EditableButton>` and `useSelectValidator`
        equalityValueComparison = Object.is, // take, to be handled by                        `useSelectValidator`
        
        required,                            // take, to be handled by                        `useSelectValidator`
        freeTextInput,                       // take, to be handled by                        `useSelectValidator`
        
        
        
        // components:
        listItemComponent       = (<SelectDropdownEditorItem />                                                                                  as React.ReactElement<ListItemProps<Element>>),
        buttonOrientation       = 'inline',
        buttonComponent         = (<ButtonIcon iconPosition={determineDropdownIconPosition(buttonOrientation)} icon={determineDropdownIcon()} /> as React.ReactElement<ButtonIconProps>),
        editableButtonComponent = (<EditableButton />                                                                                            as React.ReactElement<EditableButtonProps>),
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props;
    
    
    
    // states:
    const selectValidator  = useSelectValidator<TChangeEvent, TValue>({
        // values:
        valueOptions,
        excludedValueOptions,
        
        
        
        // validations:
        required,
        freeTextInput,
        equalityValueComparison,
    });
    const handleValidation = useMergeEvents(
        // preserves the original `onValidation` from `editableButtonComponent`:
        editableButtonComponent.props.onValidation,
        
        
        
        // preserves the original `onValidation` from `props`:
        onValidation,
        
        
        
        // states:
        selectValidator.handleValidation,
    );
    
    
    
    // states:
    const handleControllableValueChange    = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onControllableValueChange,
        
        
        
        // validations:
        selectValidator.handleChange,
    );
    const handleControllableValueChangeRaw = useEvent<ValueChangeEventHandler<TValue, TChangeEvent>>((newValue, event) => {
        handleControllableValueChange?.(newValue, event!);
    });
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue, TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : handleControllableValueChangeRaw,
    });
    
    
    
    // states:
    const [isLoading, setIsLoading] = useState<undefined|false|TValue[]>(undefined);
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    useIsomorphicLayoutEffect(() => {
        selectValidator.handleInit(value);
    }, []);
    
    useIsomorphicLayoutEffect(() => {
        // setups:
        setIsLoading(undefined); // loading
        (async (): Promise<void> => {
            try {
                const [resolvedValueOptions, resolvedExcludedValueOptions] = await Promise.all([
                    (
                        ((typeof(valueOptions) === 'object') && ('current' in valueOptions))
                        ? (valueOptions.current ?? [])
                        : valueOptions
                    ),
                    (
                        ((typeof(excludedValueOptions) === 'object') && ('current' in excludedValueOptions))
                        ? (excludedValueOptions.current ?? [])
                        : excludedValueOptions
                    ),
                ]);
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
                
                
                
                const finalValueOptions = (
                    !resolvedExcludedValueOptions?.length
                    ? resolvedValueOptions
                    : resolvedValueOptions.filter((item) =>
                        !resolvedExcludedValueOptions.includes(item)
                    )
                );
                setIsLoading(finalValueOptions); // loaded
            }
            catch {
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
                setIsLoading(false); // error
            } // try
        })();
    }, [valueOptions, excludedValueOptions]);
    
    
    
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
    } = restSelectDropdownEditorProps;
    
    const {
        // validations:
        enableValidation   : editableButtonEnableValidation  = enableValidation,
        isValid            : editableButtonIsValid           = isValid,
        inheritValidation  : editableButtonInheritValidation = inheritValidation,
        
        
        
        // components:
        buttonComponent    : editableButtonButtonComponent   = buttonComponent,
        
        
        
        // other props:
        ...restEditableButtonProps
    } = editableButtonComponent.props;
    
    const defaultChildren : React.ReactElement|false = !!isLoading && <>
        {isLoading.map((valueOption, index) => {
            // default props:
            const {
                // states:
                active   = equalityValueComparison(valueOption, value),
                
                
                
                // children:
                children = valueToUi(valueOption),
                
                
                
                // other props:
                ...restListItemProps
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
                                ...restListItemProps,
                                
                                
                                
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
                        triggerValueChange(valueOption, { triggerAt: 'immediately', event: event });
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
                        ...restEditableButtonProps,
                        
                        
                        
                        // validations:
                        enableValidation   : editableButtonEnableValidation,
                        isValid            : editableButtonIsValid,
                        inheritValidation  : editableButtonInheritValidation,
                        onValidation       : handleValidation,  // to be handled by `useSelectValidator()`
                        
                        
                        
                        // components:
                        buttonComponent    : ((!!isLoading && !!isLoading.length) ? editableButtonButtonComponent : React.cloneElement<ButtonIconProps>(editableButtonButtonComponent,
                            // props:
                            (
                                (isLoading === undefined)
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



export interface SelectDropdownEditorComponentProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TValue extends unknown = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
{
    // components:
    selectDropdownEditorComponent ?: React.ReactElement<SelectDropdownEditorProps<TElement, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>>
}
