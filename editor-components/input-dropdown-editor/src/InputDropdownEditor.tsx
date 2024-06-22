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
    // react helper hooks:
    useEvent,
    type EventHandler,
    useMergeEvents,
    useMergeRefs,
    useMountedFlag,
    
    
    
    // a possibility of UI having an invalid state:
    type ValidityChangeEvent,
    
    
    
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
    isSelectionValid,
    
    
    
    // react components:
    type SelectDropdownEditorProps,
    SelectDropdownEditor,
    
    
    
    type SelectDropdownEditorComponentProps,
}                           from '@heymarco/select-dropdown-editor'



// react components:
export interface InputDropdownEditorProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TValue extends unknown = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
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
            // // |'orientation' // the orientation of <Dropdown> __relative_to__ <Button>
            // // 
            // values:
            |'valueOptions'
            |'excludedValueOptions'
            |'valueToUi'
            // // 
            // validations:
            |'freeTextInput'
            |'equalityValueComparison'
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
        
        // components:
        InputEditorComponentProps<Element, TChangeEvent, TValue>,
        SelectDropdownEditorComponentProps<Element, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>
{
    // behaviors:
    autoShowDropdownOnFocus  ?: boolean
    preferFocusOnInputEditor ?: boolean
}
const InputDropdownEditor = <TElement extends Element = HTMLDivElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TValue extends unknown = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: InputDropdownEditorProps<TElement, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,                              // take, moved to <InputEditor>
        outerRef,                            // take, moved to <Group>
        
        
        
        // identifiers:
        id,                                  // take, moved to <Group>
        
        
        
        // variants:
        size,                                // take, moved to <Group>
        theme,                               // take, moved to <Group>
        gradient,                            // take, moved to <Group>
        outlined,                            // take, moved to <Group>
        mild,                                // take, moved to <Group>
        
        
        
        // classes:
        mainClass,                           // take, moved to <Group>
        classes,                             // take, moved to <Group>
        variantClasses,                      // take, moved to <Group>
        stateClasses,                        // take, moved to <Group>
        className,                           // take, moved to <Group>
        
        
        
        // styles:
        style,                               // take, moved to <Group>
        
        
        
        // values:
        valueOptions,                        // take, moved to <SelectDropdownEditor>
        excludedValueOptions,                // take, moved to <SelectDropdownEditor>
        valueToUi,                           // take, moved to <SelectDropdownEditor>
        
        defaultValue   : defaultUncontrollableValue = ('' as TValue),
        value          : controllableValue,
        onChange       : onControllableValueChange,
        onChangeAsText : onControllableTextChange,
        
        
        
        // validations:
        onValidation,                        // take, moved to <InputEditor>
        freeTextInput            = true,      // take, to be handled by internal controllableValidator
        equalityValueComparison  = Object.is, // take, to be handled by internal controllableValidator
        
        
        
        // behaviors:
        autoShowDropdownOnFocus  = true,
        preferFocusOnInputEditor = true,
        
        
        
        // components:
        buttonRef,                                         // take, moved to <SelectDropdownEditor>
        buttonOrientation,                                 // take, moved to <SelectDropdownEditor>
        buttonComponent,                                   // take, moved to <SelectDropdownEditor>
        buttonChildren = null /* remove text on button */, // take, moved to <SelectDropdownEditor>
        toggleButtonComponent,                             // take, moved to <SelectDropdownEditor>
        dropdownRef,                                       // take, moved to <SelectDropdownEditor>
        dropdownOrientation,                               // take, moved to <SelectDropdownEditor>
        dropdownComponent,                                 // take, moved to <SelectDropdownEditor>
        listRef,                                           // take, moved to <SelectDropdownEditor>
        listOrientation,                                   // take, moved to <SelectDropdownEditor>
        listStyle,                                         // take, moved to <SelectDropdownEditor>
        listComponent,                                     // take, moved to <SelectDropdownEditor>
        listItemComponent,                                 // take, moved to <SelectDropdownEditor>
        editableButtonComponent,                           // take, moved to <SelectDropdownEditor>
        inputEditorComponent          = (<InputEditor<Element, TChangeEvent, TValue> />                                                                        as React.ReactElement<InputEditorProps<Element, TChangeEvent, TValue>>),
        selectDropdownEditorComponent = (<SelectDropdownEditor<Element, TChangeEvent, TValue, TDropdownListExpandedChangeEvent> valueOptions={valueOptions} /> as React.ReactElement<SelectDropdownEditorProps<Element, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>>),
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = props;
    
    
    
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // states:
    const handleControllableValueChangeInternal = useEvent<EditorChangeEventHandler<TChangeEvent, TValue>>((newValue, event) => {
        // normalize: null => empty string, any TValue => toString:
        const newValueStr = (newValue !== null) ? `${newValue}` : '' /* null => empty string */;
        onControllableTextChange?.(newValueStr, event);
    });
    const handleControllableValueChange         = useMergeEvents(
        // preserves the original `onChange` from `inputEditorComponent`:
        inputEditorComponent.props.onChange,
        
        
        
        // preserves the original `onChange` from `props`:
        onControllableValueChange,
        
        
        
        // actions:
        handleControllableValueChangeInternal,
    );
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue, TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : handleControllableValueChange,
    });
    
    
    
    // states:
    const [isDropdownValid  , setIsDropdownValid  ] = useState<boolean|null>(null);
    
    const enum ShowDropdown {
        SHOW_BY_TOGGLE      = 2,  // absolute set
        SHOW_BY_INPUT_FOCUS = 1,  // condition:      if     HIDE_BY_BLUR|HIDE_BY_SELECT
        
        HIDE_BY_TYPING      = -1, // condition:      if NOT HIDE_BY_BLUR
        HIDE_BY_SELECT      = -2, // condition:      if NOT HIDE_BY_BLUR
        HIDE_BY_TOGGLE      = -3, // condition:      if NOT HIDE_BY_BLUR
        HIDE_BY_BLUR        = -4, // absolute reset
    }
    const [showDropdown     , setShowDropdown     ] = useState<ShowDropdown>(ShowDropdown.HIDE_BY_BLUR);
    
    const noAutoShowDropdown                        = useRef<boolean>(false);
    
    const [finalValueOptions, setFinalValueOptions] = useState<TValue[]|undefined>(undefined);
    const isMounted = useMountedFlag();
    useEffect(() => {
        // setups:
        (async (): Promise<void> => {
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
            setFinalValueOptions(finalValueOptions);
        })();
        
        
        
        // cleanups:
        return () => {
            setFinalValueOptions(undefined);
        };
    }, [valueOptions, excludedValueOptions]);
    
    
    
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
        // preserves the original `dropdownRef` from `props`:
        dropdownRef,
        
        
        
        dropdownRefInternal,
    );
    
    
    
    // handlers:
    const handleInputChange            = useEvent<EditorChangeEventHandler<TChangeEvent, TValue>>((newValue, event) => {
        triggerValueChange(newValue, { triggerAt: 'immediately', event: event });
        if (showDropdown !== ShowDropdown.HIDE_BY_BLUR) setShowDropdown(ShowDropdown.HIDE_BY_TYPING); // autoClose the <Dropdown> when the user type on <Input>
    });
    
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
    
    const handleValidationInternal     = useEvent<EventHandler<ValidityChangeEvent>>((event) => {
        const inputIsValid = (() => {
            // conditions:
            if (event.isValid !== true) return event.isValid; // ignore if was *invalid*|*uncheck* (only perform a further_validation if was *valid*)
            if (freeTextInput)          return event.isValid; // if freeTextInput => no further validations needed
            
            
            
            // further validations:
            const newIsValid = isSelectionValid(props, finalValueOptions, value);
            event.isValid = newIsValid;
            return newIsValid;
        })();
        
        
        
        // updates:
        if (isDropdownValid === inputIsValid) return; // already in sync => ignore
        setIsDropdownValid(inputIsValid); // sync
    });
    const handleValidation             = useMergeEvents(
        // preserves the original `onValidation` from `inputEditorComponent`:
        inputEditorComponent.props.onValidation,
        
        
        
        // preserves the original `onValidation` from `props`:
        onValidation,
        
        
        
        // states:
        handleValidationInternal,
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
        props.onFocus,
        
        
        
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
        props.onClick,
        
        
        
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
    } = restSelectDropdownEditorProps;
    
    const {
        // classes:
        className          : inputEditorClassName          = 'fluid',
        
        
        
        // accessibilities:
        assertiveFocusable : inputEditorAssertiveFocusable = (!preferFocusOnInputEditor ? false : undefined),
        
        
        
        // values:
        value              : inputEditorValue              = value,
        
        
        
        // other props:
        ...restInputEditorComponentProps
    } = inputEditorComponent.props;
    
    const {
        // values:
        valueOptions            : selectDropdownEditorValueOptions         = valueOptions,
        excludedValueOptions    : selectDropdownEditorExcludedValueOptions = excludedValueOptions,
        valueToUi               : selectDropdownEditorValueToUi            = valueToUi,
        
        value                   : selectDropdownEditorValue                = value, // internally controllable
        
        
        
        // validations:
        enableValidation        : selectDropdownEnableValidation           = props.enableValidation,  // follows <Editor>
        isValid                 : selectDropdownIsValid                    = isDropdownValid,         // controllable
        inheritValidation       : selectDropdownInheritValidation          = props.inheritValidation, // follows <Editor>
        
        // onValidation         : selectDropdownOnValidation               = undefined,
        
        equalityValueComparison : selectDropdownEqualityValueComparison    = equalityValueComparison,
        
        
        
        // states:
        expanded                : selectDropdownexpanded                   = (showDropdown >= 1),
        
        
        
        // floatable:
        floatingOn              : selectDropdownonFloatingOn               = outerRefInternal,
        
        
        
        // auto focusable:
        autoFocus               : selectDropdownonAutoFocus                = (showDropdown === ShowDropdown.SHOW_BY_INPUT_FOCUS) ? !preferFocusOnInputEditor : true, // do NOT autoFocus when (autoDropdown -AND- preferFocusOnInputEditor), otherwise do autoFocus}
        restoreFocus            : selectDropdownonRestoreFocus             = false, // use hard coded restore focus
        
        
        
        // components:
        buttonRef               : selectDropdownonButtonRef                = buttonRef,
        buttonOrientation       : selectDropdownonButtonOrientation        = buttonOrientation,
        buttonComponent         : selectDropdownonButtonComponent          = buttonComponent,
        buttonChildren          : selectDropdownonButtonChildren           = buttonChildren,
        toggleButtonComponent   : selectDropdownonToggleButtonComponent    = toggleButtonComponent,
        dropdownRef             : selectDropdownonDropdownRef              = mergedDropdownRef,
        dropdownOrientation     : selectDropdownonDropdownOrientation      = dropdownOrientation,
        dropdownComponent       : selectDropdownonDropdownComponent        = dropdownComponent,
        listRef                 : selectDropdownonListRef                  = listRef,
        listOrientation         : selectDropdownonListOrientation          = listOrientation,
        listStyle               : selectDropdownonListStyle                = listStyle,
        listComponent           : selectDropdownonListComponent            = listComponent,
        listItemComponent       : selectDropdownonListItemComponent        = listItemComponent,
        editableButtonComponent : selectDropdownonEditableButtonComponent  = editableButtonComponent,
        
        
        
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
                    elmRef             : mergedInputRef,
                    
                    
                    
                    // classes:
                    className          : inputEditorClassName,
                    
                    
                    
                    // accessibilities:
                    assertiveFocusable : inputEditorAssertiveFocusable,
                    
                    
                    
                    // values:
                    value              : inputEditorValue,  // internally controllable
                    onChange           : handleInputChange, // internally controllable
                    
                    
                    
                    // validations:
                    onValidation       : handleValidation,
                    
                    
                    
                    // handlers:
                    onFocus            : handleInputFocus,
                    onClick            : handleInputClick,
                },
            )}
            
            
            {React.cloneElement<SelectDropdownEditorProps<Element, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>>(selectDropdownEditorComponent,
                // props:
                {
                    // other props:
                    ...restSelectDropdownEditorComponentProps,
                    
                    
                    
                    // variants:
                    ...basicVariantProps,
                    
                    
                    
                    // values:
                    valueOptions            : selectDropdownEditorValueOptions,
                    excludedValueOptions    : selectDropdownEditorExcludedValueOptions,
                    valueToUi               : selectDropdownEditorValueToUi,
                    
                    value                   : selectDropdownEditorValue, // internally controllable
                    onChange                : handleDropdownChange,      // internally controllable
                    
                    
                    
                    // validations:
                    enableValidation        : selectDropdownEnableValidation,  // follows <Editor>
                    isValid                 : selectDropdownIsValid,           // controllable
                    inheritValidation       : selectDropdownInheritValidation, // follows <Editor>
                    
                    // onValidation         : selectDropdownOnValidation,
                    
                    equalityValueComparison : selectDropdownEqualityValueComparison,
                    
                    
                    
                    // states:
                    expanded                : selectDropdownexpanded,
                    onExpandedChange        : handleExpandedChange,
                    
                    
                    
                    // floatable:
                    floatingOn              : selectDropdownonFloatingOn,
                    
                    
                    
                    // auto focusable:
                    autoFocus               : selectDropdownonAutoFocus,
                    restoreFocus            : selectDropdownonRestoreFocus,
                    
                    
                    
                    // components:
                    buttonRef               : selectDropdownonButtonRef,
                    buttonOrientation       : selectDropdownonButtonOrientation,
                    buttonComponent         : selectDropdownonButtonComponent,
                    buttonChildren          : selectDropdownonButtonChildren,
                    toggleButtonComponent   : selectDropdownonToggleButtonComponent,
                    dropdownRef             : selectDropdownonDropdownRef,
                    dropdownOrientation     : selectDropdownonDropdownOrientation,
                    dropdownComponent       : selectDropdownonDropdownComponent,
                    listRef                 : selectDropdownonListRef,
                    listOrientation         : selectDropdownonListOrientation,
                    listStyle               : selectDropdownonListStyle,
                    listComponent           : selectDropdownonListComponent,
                    listItemComponent       : selectDropdownonListItemComponent,
                    editableButtonComponent : selectDropdownonEditableButtonComponent,
                },
            )}
        </Group>
    );
};
export {
    InputDropdownEditor,            // named export for readibility
    InputDropdownEditor as default, // default export to support React.lazy
}



export interface InputDropdownEditorComponentProps<out TElement extends Element = HTMLDivElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TValue extends unknown = string, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
{
    // components:
    inputDropdownEditorComponent ?: React.ReactElement<InputDropdownEditorProps<TElement, TChangeEvent, TValue, TDropdownListExpandedChangeEvent>>
}
