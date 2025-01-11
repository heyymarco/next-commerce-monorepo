// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
    type EventHandler,
    useMergeEvents,
    useMergeRefs,
    
    
    
    // a possibility of UI having an invalid state:
    type ValidityChangeEvent,
    type ValidationDeps,
    type ValidationEventHandler,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    type DropdownListExpandedChangeEvent,
}                           from '@reusable-ui/dropdown-list'           // overlays a list element (menu)
import {
    // react components:
    type GroupProps,
    Group,
}                           from '@reusable-ui/group'                   // groups a list of components as a single component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// heymarco components:
import {
    // types:
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
import {
    // react components:
    type InputEditorProps,
    InputEditor,
    
    
    
    type InputEditorComponentProps,
}                           from '@heymarco/input-editor'
import {
    // validations:
    useSelectValidator,
    
    
    
    // react components:
    type SelectDropdownEditorProps,
    SelectDropdownEditor,
    
    
    
    type SelectDropdownEditorComponentProps,
}                           from '@heymarco/select-dropdown-editor'



// utilities:
const emptyValueOptions : unknown[] = [];



// react components:
export interface InputDropdownEditorProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
    extends
        // bases:
        Pick<GroupProps<TElement>,
            // refs:
            |'outerRef'       // moved to <Group>
            
            // identifiers:
            |'id'             // moved to <Group>
            
            // variants:
            |'size'           // moved to <Group>
            |'theme'          // moved to <Group>
            |'gradient'       // moved to <Group>
            |'outlined'       // moved to <Group>
            |'mild'           // moved to <Group>
            
            // classes:
            |'mainClass'      // moved to <Group>
            |'classes'        // moved to <Group>
            |'variantClasses' // moved to <Group>
            |'stateClasses'   // moved to <Group>
            |'className'      // moved to <Group>
            
            // styles:
            |'style'          // moved to <Group>
        >,
        Omit<InputEditorProps<Element, TChangeEvent, TValue>,
            // refs:
            |'outerRef'       // moved to <Group>
            
            // identifiers:
            |'id'             // moved to <Group>
            
            // variants:
            |'size'           // moved to <Group>
            |'theme'          // moved to <Group>
            |'gradient'       // moved to <Group>
            |'outlined'       // moved to <Group>
            |'mild'           // moved to <Group>
            
            // classes:
            |'mainClass'      // moved to <Group>
            |'classes'        // moved to <Group>
            |'variantClasses' // moved to <Group>
            |'stateClasses'   // moved to <Group>
            |'className'      // moved to <Group>
            
            // styles:
            |'style'          // moved to <Group>
        >,
        Pick<SelectDropdownEditorProps<Element, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>,
            // // // ONLY NECESSARY props:
            // // // variants:
            // // |'buttonStyle'
            // // |'orientation' // the orientation of <Dropdown> *relative_to* <Button>
            // // 
            // values:
            // |'valueOptions' // changed to optional
            |'excludedValueOptions'
            |'valueToUi'
            // // 
            // validations:
            |'equalityValueComparison'
            |'freeTextInput'
            // // // ONLY NECESSARY props:
            // // 
            // // // states:
            // // |'defaultExpanded'
            // // |'expanded'
            // // |'onExpandedChange'
            // // 
            // // |'onExpandStart'
            // // |'onCollapseStart'
            // // |'onExpandEnd'
            // // |'onCollapseEnd'
            // // 
            // // // floatable:
            // // |'floatingRef'
            // // 
            // // |'floatingOn'
            // // // |'floatingFriends'
            // // |'floatingPlacement'
            // // |'floatingMiddleware'
            // // |'floatingStrategy'
            // // 
            // // |'floatingAutoFlip'
            // // |'floatingAutoShift'
            // // |'floatingOffset'
            // // |'floatingShift'
            // // 
            // // |'onFloatingUpdate'
            // // 
            // // // global stackable:
            // // |'viewport'
            // // 
            // // // auto focusable:
            // // |'autoFocusOn'
            // // |'restoreFocusOn'
            // // |'autoFocus'
            // // |'restoreFocus'
            // // |'autoFocusScroll'
            // // |'restoreFocusScroll'
            
            // components:
            |'buttonRef'
            |'buttonOrientation'
            |'buttonComponent'
            |'buttonChildren'
            |'toggleButtonComponent'
            |'dropdownRef'
            |'dropdownOrientation'
            |'dropdownComponent'
            |'listRef'
            |'listOrientation'
            |'listStyle'
            |'listComponent'
            |'listItemComponent'
            |'editableButtonComponent'
        >,
        Partial<Pick<SelectDropdownEditorProps<Element, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>,
            // values:
            |'valueOptions' // changed to optional
        >>,
        
        // components:
        InputEditorComponentProps<Element, TChangeEvent, TValue>,
        SelectDropdownEditorComponentProps<Element, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>
{
    // behaviors:
    autoShowDropdownOnFocus  ?: boolean
    preferFocusOnInputEditor ?: boolean
}
const InputDropdownEditor = <TElement extends Element = HTMLDivElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: InputDropdownEditorProps<TElement, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,                                                          // take, moved to <InputEditor>
        outerRef,                                                        // take, moved to <Group>
        
        
        
        // identifiers:
        id,                                                              // take, moved to <Group>
        
        
        
        // variants:
        size,                                                            // take, moved to <Group>
        theme,                                                           // take, moved to <Group>
        gradient,                                                        // take, moved to <Group>
        outlined,                                                        // take, moved to <Group>
        mild,                                                            // take, moved to <Group>
        
        
        
        // classes:
        mainClass,                                                       // take, moved to <Group>
        classes,                                                         // take, moved to <Group>
        variantClasses,                                                  // take, moved to <Group>
        stateClasses,                                                    // take, moved to <Group>
        className,                                                       // take, moved to <Group>
        
        
        
        // styles:
        style,                                                           // take, moved to <Group>
        
        
        
        // values:
        valueOptions                  = (emptyValueOptions as TValue[]), // take, moved to <SelectDropdownEditor>, defaults to empty option
        excludedValueOptions,                                            // take, moved to <SelectDropdownEditor>
        valueToUi,                                                       // take, moved to <SelectDropdownEditor>
        
        defaultValue                  : defaultUncontrollableValue = ('' as TValue), // defaults to empty string
        value                         : controllableValue,
        onChange                      : onValueChange,
        onChangeAsText                : onTextChange,
        
        
        
        // validations:
        enableValidation,                                                // take, moved to <InputEditor>
        isValid,                                                         // take, moved to <InputEditor>
        inheritValidation,                                               // take, moved to <InputEditor>
        validationDeps                : validationDepsOverwrite,         // take, moved to <InputEditor>
        onValidation,                                                    // take, moved to <InputEditor>
        
        validDelay,                                                      // take, moved to <InputEditor>, mirrored to <SelectDropdownEditor>
        invalidDelay,                                                    // take, moved to <InputEditor>, mirrored to <SelectDropdownEditor>
        noValidationDelay,                                               // take, moved to <InputEditor>, mirrored to <SelectDropdownEditor>
        
        equalityValueComparison,                                         // take, to be handled by `useSelectValidator`, mirrored to <SelectDropdownEditor>
        
        freeTextInput,                                                   // take, to be handled by `useSelectValidator`
        
        
        
        // behaviors:
        autoShowDropdownOnFocus       = true,
        preferFocusOnInputEditor      = true,
        
        
        
        // components:
        buttonRef,                                                       // take, moved to <SelectDropdownEditor>
        buttonOrientation,                                               // take, moved to <SelectDropdownEditor>
        buttonComponent,                                                 // take, moved to <SelectDropdownEditor>
        buttonChildren = null /* remove text on button */,               // take, moved to <SelectDropdownEditor>
        toggleButtonComponent,                                           // take, moved to <SelectDropdownEditor>
        dropdownRef,                                                     // take, moved to <SelectDropdownEditor>
        dropdownOrientation,                                             // take, moved to <SelectDropdownEditor>
        dropdownComponent,                                               // take, moved to <SelectDropdownEditor>
        listRef,                                                         // take, moved to <SelectDropdownEditor>
        listOrientation,                                                 // take, moved to <SelectDropdownEditor>
        listStyle,                                                       // take, moved to <SelectDropdownEditor>
        listComponent,                                                   // take, moved to <SelectDropdownEditor>
        listItemComponent,                                               // take, moved to <SelectDropdownEditor>
        editableButtonComponent,                                         // take, moved to <SelectDropdownEditor>
        inputEditorComponent          = (<InputEditor<Element, TChangeEvent, TValue> />                                                                        as React.ReactElement<InputEditorProps<Element, TChangeEvent, TValue>>),
        selectDropdownEditorComponent = (<SelectDropdownEditor<Element, TChangeEvent, TValue, TDropdownListExpandedChangeEvent> valueOptions={valueOptions} /> as React.ReactElement<SelectDropdownEditorProps<Element, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>>),
        
        
        
        // handlers:
        onFocus,
        onClick,
        
        
        
        // other props:
        ...restPreInputDropdownEditorProps
    } = props;
    
    
    
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // states:
    const handleValueChangeInternal = useEvent<EditorChangeEventHandler<TChangeEvent, TValue>>((newValue, event) => {
        // normalize: null => empty string, any TValue => toString:
        const newValueStr = (newValue !== null) ? `${newValue}` : '' /* null => empty string */;
        onTextChange?.(newValueStr, event);
    });
    const handleValueChange         = useMergeEvents(
        // we place `inputEditorComponent.props.onChange` here, so it receives the change event by `triggerValueChange()`:
        // preserves the original `onChange` from `inputEditorComponent`:
        inputEditorComponent.props.onChange,
        
        
        
        // preserves the original `onChange` from `props`:
        onValueChange,
        
        
        
        // actions:
        handleValueChangeInternal,
    );
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue, TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : handleValueChange,
    });
    
    
    
    // props:
    const {
        // values:
        notifyValueChange             = value,                           // take, to be handled by `<EditableButton>`
        
        
        
        // other props:
        ...restInputDropdownEditorProps
    } = restPreInputDropdownEditorProps;
    
    
    
    // states:
    const [isValidControllable, setIsValidControllable] = useState<boolean|null>(null);
    
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
        
        required : props.required,
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
        
        const validationDepsOverwrite2 = inputEditorComponent.props.validationDeps;
        const basesStage4 = validationDepsOverwrite2 ? validationDepsOverwrite2(basesStage3) : basesStage3;
        
        // no need to validate by <SelectDropdownEditor>, because it's a secondary component:
        // const validationDepsOverwrite3 = selectDropdownEditorComponent.props.validationDeps;
        // const basesStage5 = validationDepsOverwrite3 ? validationDepsOverwrite3(basesStage4) : basesStage4;
        
        return basesStage4;
    });
    const handleValidationInternal = useEvent<ValidationEventHandler<ValidityChangeEvent>>((event) => {
        setIsValidControllable(event.isValid);
    });
    const handleValidation = useEvent<ValidationEventHandler<ValidityChangeEvent>>(async (event) => {
        /* sequentially runs validators from `inputEditorComponent.props.onValidation()` (primary validator, if any) then followed by `selectValidatorHandleValidation` (secondary validator), `selectDropdownEditorComponent.props.onValidation()`, `props.onValidation()` and `setIsValidControllable()` */
        
        
        
        // preserves the original `onValidation` from `inputEditorComponent`:
        // `inputValidator` is the primary validator, so it should be the first validation check:
        await inputEditorComponent.props.onValidation?.(event);
        
        
        
        // states:
        // `selectValidator` is the secondary validator, so it should be the second validation check:
        await selectValidatorHandleValidation(event);
        
        
        
        // no need to validate by <SelectDropdownEditor>, because it's a secondary component:
        // // preserves the original `onValidation` from `selectDropdownEditorComponent`:
        // // *component*Validator (if any) is the external supplement validator, so it should be the second-to-last validation check:
        // await selectDropdownEditorComponent.props.onValidation?.(event);
        
        
        
        // preserves the original `onValidation` from `props`:
        // *props*Validator (if any) is the external supplement validator, so it should be the last validation check:
        await onValidation?.(event);
        
        
        
        // updates:
        // `handleValidationInternal` reads the validation result, so it should be placed at the end:
        handleValidationInternal(event);
    });
    
    
    
    // states:
    const enum ShowDropdown {
        SHOW_BY_TOGGLE      = 2,  // absolute set
        SHOW_BY_INPUT_FOCUS = 1,  // condition:      if     HIDE_BY_BLUR|HIDE_BY_SELECT
        
        HIDE_BY_TYPING      = -1, // condition:      if NOT HIDE_BY_BLUR
        HIDE_BY_SELECT      = -2, // condition:      if NOT HIDE_BY_BLUR
        HIDE_BY_TOGGLE      = -3, // condition:      if NOT HIDE_BY_BLUR
        HIDE_BY_BLUR        = -4, // absolute reset
    }
    const [showDropdown, setShowDropdown] = useState<ShowDropdown>(ShowDropdown.HIDE_BY_BLUR);
    const noAutoShowDropdown = useRef<boolean>(false);
    
    
    
    // refs:
    const inputRefInternal      = useRef<HTMLInputElement|null>(null);
    const mergedInputRef        = useMergeRefs(
        // preserves the original `elmRef` from `inputEditorComponent`:
        inputEditorComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        inputRefInternal,
    );
    
    const outerRefInternal      = useRef<TElement|null>(null);
    const mergedOuterRef        = useMergeRefs(
        // preserves the original `outerRef` from `props`:
        outerRef,
        
        
        
        outerRefInternal,
    );
    
    const dropdownRefInternal   = useRef<Element|null>(null);
    const mergedDropdownRef     = useMergeRefs(
        // preserves the original `dropdownRef` from `selectDropdownEditorComponent`:
        selectDropdownEditorComponent.props.dropdownRef,
        
        
        
        // preserves the original `dropdownRef` from `props`:
        dropdownRef,
        
        
        
        dropdownRefInternal,
    );
    
    
    
    // handlers:
    const handleInputChangeInternal    = useEvent<EditorChangeEventHandler<TChangeEvent, TValue>>((newValue, event) => {
        triggerValueChange(newValue, { triggerAt: 'immediately', event: event });
        if (showDropdown !== ShowDropdown.HIDE_BY_BLUR) setShowDropdown(ShowDropdown.HIDE_BY_TYPING); // autoClose the <Dropdown> when the user type on <Input>
    });
    const handleInputChange            = useMergeEvents(
        // the code below is not required because it's already handled by `handleInputChangeInternal()` => `triggerValueChange()` => `useControllableAndUncontrollable` => `onValueChange` => `handleValueChange()` => `inputEditorComponent.props.onChange()`:
        // // preserves the original `onChange` from `inputEditorComponent`:
        // inputEditorComponent.props.onChange,
        
        
        
        // actions:
        handleInputChangeInternal,
    );
    
    const handleDropdownChangeInternal = useEvent<EditorChangeEventHandler<TChangeEvent, TValue>>((newValue) => {
        const inputElm = inputRefInternal.current;
        if (inputElm) {
            // react *hack*: trigger `onChange` event:
            const oldValue = inputElm.value;                     // react *hack* get_prev_value *before* modifying
            // normalize: null => empty string, any TValue => toString:
            const newValueStr = (newValue !== null) ? `${newValue}` : '' /* null => empty string */;
            inputElm.value = newValueStr;                        // react *hack* set_value *before* firing `input` event
            (inputElm as any)._valueTracker?.setValue(oldValue); // react *hack* in order to React *see* the changes when `input` event fired
            
            
            
            // fire `input` native event to trigger `onChange` synthetic event:
            inputElm.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: false, composed: true, data: newValueStr, dataTransfer: null, inputType: 'insertText', isComposing: false, view: null, detail: 0 }));
        } // if
    });
    const handleDropdownChange         = useMergeEvents(
        // preserves the original `onChange` from `selectDropdownEditorComponent`:
        selectDropdownEditorComponent.props.onChange,
        
        
        
        // actions:
        handleDropdownChangeInternal,
    );
    
    const handleInputFocusInternal     = useEvent<React.FocusEventHandler<Element>>(() => {
        // conditions:
        if (!autoShowDropdownOnFocus) return; // the autoDropdown is not active => ignore
        if (noAutoShowDropdown.current) {
            noAutoShowDropdown.current = false;
            return; // ignore focus internal_programatically
        } // if
        
        
        
        // actions:
        if ((showDropdown === ShowDropdown.HIDE_BY_BLUR) || (showDropdown === ShowDropdown.HIDE_BY_SELECT)) setShowDropdown(ShowDropdown.SHOW_BY_INPUT_FOCUS);
    });
    const handleInputFocus             = useMergeEvents(
        // preserves the original `onFocus` from `inputEditorComponent`:
        inputEditorComponent.props.onFocus,
        
        
        
        // preserves the original `onFocus` from `props`:
        onFocus,
        
        
        
        // actions:
        handleInputFocusInternal,
    );
    
    const handleInputClickInternal     = useEvent<React.MouseEventHandler<Element>>(() => {
        // conditions:
        if (preferFocusOnInputEditor) return; // prefer focus on inputEditor => no need to autoDropdown => ignore
        
        
        
        // actions:
        if ((showDropdown === ShowDropdown.HIDE_BY_BLUR) || (showDropdown === ShowDropdown.HIDE_BY_SELECT) || (showDropdown === ShowDropdown.HIDE_BY_TOGGLE)) setShowDropdown(ShowDropdown.SHOW_BY_TOGGLE);;
    });
    const handleInputClick             = useMergeEvents(
        // preserves the original `onClick` from `inputEditorComponent`:
        inputEditorComponent.props.onClick,
        
        
        
        // preserves the original `onClick` from `props`:
        onClick,
        
        
        
        // actions:
        handleInputClickInternal,
    );
    
    const handleExpandedChangeInternal = useEvent<EventHandler<TDropdownListExpandedChangeEvent>>(({expanded, actionType}) => {
        if (expanded) {
            setShowDropdown(ShowDropdown.SHOW_BY_TOGGLE);
        }
        else if (showDropdown !== ShowDropdown.HIDE_BY_BLUR) {
            const isHideBySelect = (typeof(actionType) === 'number');
            setShowDropdown(
                isHideBySelect
                ? ShowDropdown.HIDE_BY_SELECT
                : ShowDropdown.HIDE_BY_TOGGLE
            );
            
            
            
            // restore focus to <Input>:
            if (preferFocusOnInputEditor) {
                const performRestoreFocus = () => {
                    const inputElm = inputRefInternal.current;
                    if (inputElm) {
                        const textLength = inputElm.value.length; // get the latest text replacement
                        inputElm.setSelectionRange(textLength, textLength);
                        noAutoShowDropdown.current = true;
                        inputElm.focus?.({ preventScroll: true });
                    } // if
                };
                if (isHideBySelect) {
                    // wait until <Input>'s text is fully replaced:
                    setTimeout(performRestoreFocus, 0);
                } else {
                    // nothing was replaced => restore immediately:
                    performRestoreFocus();
                } // if
            } // if
        } // if
    });
    const handleExpandedChange         = useMergeEvents(
        // preserves the original `onExpandedChange` from `selectDropdownEditorComponent`:
        selectDropdownEditorComponent.props.onExpandedChange,
        
        
        
        // actions:
        handleExpandedChangeInternal,
    );
    
    
    
    // effects:
    
    // a *custom* onBlur event by watching onFocus *outside* of <Group> and <Dropdown>:
    useEffect(() => {
        // conditions:
        if (showDropdown === ShowDropdown.HIDE_BY_BLUR) return; // ignore if already fully hidden
        
        
        
        // handlers:
        const handleMouseDown = (event: MouseEvent): void => {
            // conditions:
            if (event.button !== 0) return; // only handle left click
            
            
            
            // although clicking on page won't change the focus, but we decided this event as lost focus on <Dropdown>:
            handleFocus({ target: event.target } as FocusEvent);
        };
        const handleFocus     = (event: FocusEvent): void => {
            const focusedTarget = event.target;
            if (!focusedTarget) return;
            
            
            
            if (focusedTarget instanceof Element) {
                if (outerRefInternal.current?.contains(focusedTarget))    return; // consider still focus if has focus inside <Group>
                if (dropdownRefInternal.current?.contains(focusedTarget)) return; // consider still focus if has focus inside <Dropdown>
            } // if
            setShowDropdown(ShowDropdown.HIDE_BY_BLUR);
        };
        
        
        
        // setups:
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('focus'    , handleFocus    , { capture: true }); // force `focus` as bubbling
        
        
        
        // cleanups:
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('focus'    , handleFocus    , { capture: true });
        };
    }, [showDropdown]);
    
    
    
    // default props:
    const {
        // other props:
        ...restInputEditorProps
    } = restInputDropdownEditorProps satisfies NoForeignProps<typeof restInputDropdownEditorProps, InputEditorProps<Element, TChangeEvent, TValue>>;
    
    const {
        // classes:
        className               : inputEditorComponentClassName                        = 'fluid',
        
        
        
        // accessibilities:
        assertiveFocusable      : inputEditorComponentAssertiveFocusable               = (!preferFocusOnInputEditor ? false : undefined),
        
        
        
        // values:
        value                   : inputEditorComponentValue                            = value, // internally controllable
        
        notifyValueChange       : inputEditorComponentNotifyValueChange                = notifyValueChange,
        
        
        
        // validations:
        enableValidation        : inputEditorComponentEnableValidation                 = enableValidation,
        isValid                 : inputEditorComponentIsValid                          = isValid,
        inheritValidation       : inputEditorComponentInheritValidation                = inheritValidation,
        
        validDelay              : inputEditorComponentValidDelay                       = validDelay,
        invalidDelay            : inputEditorComponentInvalidDelay                     = invalidDelay,
        noValidationDelay       : inputEditorComponentNoValidationDelay                = noValidationDelay,
        
        
        
        // other props:
        ...restInputEditorComponentProps
    } = inputEditorComponent.props;
    
    const {
        // accessibilities:
        'aria-invalid'          : selectDropdownEditorComponentAriaInvalid             = false, // the <SelectDropdownEditor> ia a *secondary* control and is *never* invalid, always refer to <InputEditor> as the *primary* control
        
        
        
        // values:
        valueOptions            : selectDropdownEditorComponentValueOptions            = valueOptions,
        excludedValueOptions    : selectDropdownEditorComponentExcludedValueOptions    = excludedValueOptions,
        valueToUi               : selectDropdownEditorComponentValueToUi               = valueToUi,
        
        value                   : selectDropdownEditorComponentValue                   = value, // internally controllable
        
        
        
        // validations:
        isValid                 : selectDropdownEditorComponentIsValid                 = isValidControllable,     // mirrored to <SelectDropdownEditor>, defaults to internally controllable
        
        validDelay              : selectDropdownEditorComponentValidDelay              = validDelay,              // mirrored to <SelectDropdownEditor>, required for syncing validity delay
        invalidDelay            : selectDropdownEditorComponentInvalidDelay            = invalidDelay,            // mirrored to <SelectDropdownEditor>, required for syncing validity delay
        noValidationDelay       : selectDropdownEditorComponentNoValidationDelay       = noValidationDelay,       // mirrored to <SelectDropdownEditor>, required for syncing validity delay
        
        equalityValueComparison : selectDropdownEditorComponentEqualityValueComparison = equalityValueComparison, // mirrored to <SelectDropdownEditor>, required for correctly determines active selection in dropdown
        
        
        
        // states:
        expanded                : selectDropdownEditorComponentExpanded                = (showDropdown >= 1), // positive value: SHOW_BY_**, negative value: HIDE_BY_**, zero value: never
        
        
        
        // floatable:
        floatingOn              : selectDropdownEditorComponentFloatingOn              = outerRefInternal,
        
        
        
        // auto focusable:
        autoFocus               : selectDropdownEditorComponentAutoFocus               = (showDropdown === ShowDropdown.SHOW_BY_INPUT_FOCUS) ? !preferFocusOnInputEditor : true, // do NOT autoFocus when (autoDropdown -AND- preferFocusOnInputEditor), otherwise do autoFocus}
        restoreFocus            : selectDropdownEditorComponentRestoreFocus            = false, // use hard coded restore focus
        
        
        
        // components:
        buttonRef               : selectDropdownEditorComponentButtonRef               = buttonRef,
        buttonOrientation       : selectDropdownEditorComponentButtonOrientation       = buttonOrientation,
        buttonComponent         : selectDropdownEditorComponentButtonComponent         = buttonComponent,
        buttonChildren          : selectDropdownEditorComponentButtonChildren          = buttonChildren,
        toggleButtonComponent   : selectDropdownEditorComponentToggleButtonComponent   = toggleButtonComponent,
        dropdownOrientation     : selectDropdownEditorComponentDropdownOrientation     = dropdownOrientation,
        dropdownComponent       : selectDropdownEditorComponentDropdownComponent       = dropdownComponent,
        listRef                 : selectDropdownEditorComponentListRef                 = listRef,
        listOrientation         : selectDropdownEditorComponentListOrientation         = listOrientation,
        listStyle               : selectDropdownEditorComponentListStyle               = listStyle,
        listComponent           : selectDropdownEditorComponentListComponent           = listComponent,
        listItemComponent       : selectDropdownEditorComponentListItemComponent       = listItemComponent,
        editableButtonComponent : selectDropdownEditorComponentEditableButtonComponent = editableButtonComponent,
        
        
        
        // other props:
        ...restSelectDropdownEditorComponentProps
    } = selectDropdownEditorComponent.props;
    
    
    
    // jsx:
    return (
        <Group<TElement>
            // refs:
            outerRef={mergedOuterRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // variants:
            size={size}
            theme={theme}
            gradient={gradient}
            outlined={outlined}
            mild={mild}
            
            
            
            // classes:
            mainClass={mainClass}
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            className={className}
            
            
            
            // styles:
            style={style}
        >
            {/* <InputEditor> */}
            {React.cloneElement<InputEditorProps<Element, TChangeEvent, TValue>>(inputEditorComponent,
                // props:
                {
                    // other props:
                    ...restInputEditorProps,
                    ...restInputEditorComponentProps, // overwrites restInputEditorProps (if any conflics)
                    
                    
                    
                    // refs:
                    elmRef                  : mergedInputRef,
                    
                    
                    
                    // classes:
                    className               : inputEditorComponentClassName,
                    
                    
                    
                    // accessibilities:
                    assertiveFocusable      : inputEditorComponentAssertiveFocusable,
                    
                    
                    
                    // values:
                    value                   : inputEditorComponentValue, // internally controllable
                    onChange                : handleInputChange,         // internally controllable
                    
                    notifyValueChange       : inputEditorComponentNotifyValueChange,
                    
                    
                    
                    // validations:
                    enableValidation        : inputEditorComponentEnableValidation,
                    isValid                 : inputEditorComponentIsValid,
                    inheritValidation       : inputEditorComponentInheritValidation,
                    validationDeps          : mergedValidationDeps,
                    onValidation            : handleValidation,
                    
                    validDelay              : inputEditorComponentValidDelay,
                    invalidDelay            : inputEditorComponentInvalidDelay,
                    noValidationDelay       : inputEditorComponentNoValidationDelay,
                    
                    
                    
                    // handlers:
                    onFocus                 : handleInputFocus,
                    onClick                 : handleInputClick,
                },
            )}
            
            
            {/* <SelectDropdownEditor> */}
            {React.cloneElement<SelectDropdownEditorProps<Element, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>>(selectDropdownEditorComponent,
                // props:
                {
                    // other props:
                    ...restSelectDropdownEditorComponentProps,
                    
                    
                    
                    // variants:
                    ...basicVariantProps,
                    
                    
                    
                    // accessibilities:
                    'aria-invalid'          : selectDropdownEditorComponentAriaInvalid,
                    
                    
                    
                    // values:
                    valueOptions            : selectDropdownEditorComponentValueOptions,
                    excludedValueOptions    : selectDropdownEditorComponentExcludedValueOptions,
                    valueToUi               : selectDropdownEditorComponentValueToUi,
                    
                    value                   : selectDropdownEditorComponentValue, // internally controllable
                    onChange                : handleDropdownChange,               // internally controllable (forwards to <Input>'s onChange)
                    
                    
                    
                    // validations:
                    isValid                 : selectDropdownEditorComponentIsValid,
                    
                    validDelay              : selectDropdownEditorComponentValidDelay,
                    invalidDelay            : selectDropdownEditorComponentInvalidDelay,
                    noValidationDelay       : selectDropdownEditorComponentNoValidationDelay,
                    
                    equalityValueComparison : selectDropdownEditorComponentEqualityValueComparison,
                    
                    
                    
                    // states:
                    expanded                : selectDropdownEditorComponentExpanded,
                    onExpandedChange        : handleExpandedChange,
                    
                    
                    
                    // floatable:
                    floatingOn              : selectDropdownEditorComponentFloatingOn,
                    
                    
                    
                    // auto focusable:
                    autoFocus               : selectDropdownEditorComponentAutoFocus,
                    restoreFocus            : selectDropdownEditorComponentRestoreFocus,
                    
                    
                    
                    // components:
                    buttonRef               : selectDropdownEditorComponentButtonRef,
                    buttonOrientation       : selectDropdownEditorComponentButtonOrientation,
                    buttonComponent         : selectDropdownEditorComponentButtonComponent,
                    buttonChildren          : selectDropdownEditorComponentButtonChildren,
                    toggleButtonComponent   : selectDropdownEditorComponentToggleButtonComponent,
                    dropdownRef             : mergedDropdownRef,
                    dropdownOrientation     : selectDropdownEditorComponentDropdownOrientation,
                    dropdownComponent       : selectDropdownEditorComponentDropdownComponent,
                    listRef                 : selectDropdownEditorComponentListRef,
                    listOrientation         : selectDropdownEditorComponentListOrientation,
                    listStyle               : selectDropdownEditorComponentListStyle,
                    listComponent           : selectDropdownEditorComponentListComponent,
                    listItemComponent       : selectDropdownEditorComponentListItemComponent,
                    editableButtonComponent : selectDropdownEditorComponentEditableButtonComponent,
                },
            )}
        </Group>
    );
};
export {
    InputDropdownEditor,            // named export for readibility
    InputDropdownEditor as default, // default export to support React.lazy
}



export interface InputDropdownEditorComponentProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
{
    // components:
    inputDropdownEditorComponent ?: React.ReactElement<InputDropdownEditorProps<TElement, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>>
}
