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
    useIsomorphicLayoutEffect,
    useMergeEvents,
    useMergeRefs,
    
    
    
    // an accessibility management system:
    usePropEnabled,
    usePropReadOnly,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    EditableControl,
}                           from '@reusable-ui/editable-control'        // a base editable UI (with validation indicator) of Reusable-UI components
import {
    // react components:
    type InputProps,
    
    
    
    // styles:
    useInputStyleSheet,
}                           from '@reusable-ui/input'                   // an interactive control in order to accept data from the user
import {
    type DropdownListExpandedChangeEvent,
}                           from '@reusable-ui/dropdown-list'           // overlays a list element (menu)
import {
    // styles:
    useVisuallyHiddenStyleSheet,
}                           from '@reusable-ui/visually-hidden'         // a generic element that is visually invisible while still allowing it to be exposed to screen readers

// heymarco components:
import {
    // react components:
    type SelectDropdownEditorProps,
}                           from '@heymarco/select-dropdown-editor'



// handlers:
const handleChangeDummy : React.ChangeEventHandler<HTMLInputElement> = (_event) => {
    /* nothing to do */
};



// react components:
export interface DummyInputProps<out TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        InputProps<TElement>,
        
        // values:
        Pick<SelectDropdownEditorProps<TElement, React.ChangeEvent<HTMLInputElement>, string, DropdownListExpandedChangeEvent<string>>,
            // values:
            |'valueToUi'
        >
{
    defaultValue ?: string // disallow number as value
    value        ?: string // disallow number as value
}
const DummyInput = <TElement extends Element = HTMLSpanElement>(props: DummyInputProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // accessibilities:
        autoFocus,
        // tabIndex, // still on <EditableControl> element
        enterKeyHint,
        
        
        
        // forms:
        name,
        form,
        
        
        
        // values:
        valueToUi,
        
        defaultValue,
        value,
        onChange, // forwards to `input[type]`
        
        
        
        // validations:
        required,
        
        minLength,
        maxLength,
        
        min,
        max,
        step,
        pattern,
        
        
        
        // formats:
        type,
        placeholder,
        autoComplete,
        autoCapitalize,
        list,
        inputMode,
        
        
        
        // components:
        nativeInputComponent = (<input /> as React.ReactElement<React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>),
        
        
        
        // other props:
        ...restDummyInputProps
    } = props;
    
    
    
    // styles:
    const inputStyleSheet          = useInputStyleSheet();
    const visuallyHiddenstyleSheet = useVisuallyHiddenStyleSheet();
    
    
    
    // refs:
    const inputRefInternal = useRef<HTMLInputElement|null>(null);
    const mergedInputRef   = useMergeRefs(
        // preserves the original `elmRef` from `nativeInputComponent`:
        nativeInputComponent.props.ref as React.Ref<HTMLInputElement>|undefined,
        
        
        
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        // internals:
        inputRefInternal,
    );
    
    const outerRefInternal = useRef<TElement|null>(null);
    const mergedOuterRef   = useMergeRefs(
        // preserves the original `outerRef` from `props`:
        outerRef,
        
        
        
        // internals:
        outerRefInternal,
    );
    
    
    
    // fn props:
    const propEnabled  = usePropEnabled(props);
    const propReadOnly = usePropReadOnly(props);
    
    
    
    // handlers:
    const handleChange = useMergeEvents(
        // preserves the original `onChange` from `nativeInputComponent`:
        nativeInputComponent.props.onChange,
        
        
        
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // dummy:
        handleChangeDummy, // just for satisfying React of controllable <input>
    );
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const inputElm = inputRefInternal.current;
        const dummyElm = outerRefInternal.current;
        if (!inputElm) return;
        if (!dummyElm) return;
        
        
        
        // setups:
        const backupOriginFocusFunc = inputElm.focus;
        inputElm.focus = (options?: FocusOptions) => {
            const dummyFocus = (dummyElm as unknown as HTMLElement)?.focus;
            if (!dummyFocus) return;
            dummyFocus.call(/* this: */dummyElm, options);
        };
        
        
        
        // celanups:
        return () => {
            inputElm.focus = backupOriginFocusFunc;
        };
    }, []);
    
    
    
    // default props:
    const {
        // semantics:
        tag                = 'span',
        
        
        
        // classes:
        mainClass          = inputStyleSheet.main,
        
        
        
        // states:
        assertiveFocusable = true,
        
        
        
        // other props:
        ...restEditableControlProps
    } = restDummyInputProps;
    
    const {
        // classes:
        className         : nativeInputClassName      = visuallyHiddenstyleSheet.main,
        
        
        
        // accessibilities:
        autoFocus         : nativeInputAutoFocus      = autoFocus,
        tabIndex          : nativeInputTabIndex       = -2,           // not focusable // do not use `tabIndex : -1`, causing to be ignored by <EditableControl> for `inputValidator.handleInit()`
        enterKeyHint      : nativeInputEnterKeyHint   = enterKeyHint,
        
        disabled          : nativeInputDisabled       = !propEnabled, // do not submit the value if disabled
        readOnly          : nativeInputReadOnly       = propReadOnly, // locks the value & no validation if readOnly
        
        
        
        // forms:
        name              : nativeInputName           = name,
        form              : nativeInputForm           = form,
        
        
        
        // values:
        defaultValue      : nativeInputDefaultValue   = defaultValue,
        value             : nativeInputValue          = value,
        
        
        
        // validations:
        required          : nativeInputRequired       = required,
        
        minLength         : nativeInputMinLength      = minLength,
        maxLength         : nativeInputMaxLength      = maxLength,
        
        min               : nativeInputMin            = min,
        max               : nativeInputMax            = max,
        step              : nativeInputStep           = step,
        pattern           : nativeInputPattern        = pattern,
        
        
        
        // formats:
        type              : nativeInputType           = type,
        placeholder       : nativeInputPlaceholder    = placeholder,
        autoComplete      : nativeInputAutoComplete   = autoComplete,
        autoCapitalize    : nativeInputAutoCapitalize = autoCapitalize,
        list              : nativeInputList           = list,
        inputMode         : nativeInputInputMode      = inputMode,
        
        
        
        // other props:
        ...restNativeInputComponentProps
    } = nativeInputComponent.props;
    
    
    
    // jsx:
    return (
        <EditableControl<TElement>
            // other props:
            {...restEditableControlProps}
            
            
            
            // refs:
            outerRef={mergedOuterRef}
            
            
            
            // semantics:
            tag={tag}
            
            
            
            // classes:
            mainClass={mainClass}
            
            
            
            // states:
            assertiveFocusable={assertiveFocusable}
        >
            {/* the span must be the :first-child in order to be styled like native <input> */}
            <span>
                {!!value && (valueToUi ? valueToUi(value) : value)}
                { !value && !!placeholder && <span className='placeholder'>{placeholder}</span>}
            </span>
            
            {/* <input> */}
            {React.cloneElement<React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>(nativeInputComponent,
                // props:
                {
                    // other props:
                    ...restNativeInputComponentProps,
                    
                    
                    
                    // refs:
                    ref               : mergedInputRef,
                    
                    
                    
                    // classes:
                    className         : nativeInputClassName,
                    
                    
                    
                    // accessibilities:
                    autoFocus         : nativeInputAutoFocus,
                    tabIndex          : nativeInputTabIndex,
                    enterKeyHint      : nativeInputEnterKeyHint,
                    
                    disabled          : nativeInputDisabled,
                    readOnly          : nativeInputReadOnly,
                    
                    
                    
                    // forms:
                    name              : nativeInputName,
                    form              : nativeInputForm,
                    
                    
                    
                    // values:
                    defaultValue      : nativeInputDefaultValue,
                    value             : nativeInputValue,
                    onChange          : handleChange,
                    
                    
                    
                    // validations:
                    required          : nativeInputRequired,
                    
                    minLength         : nativeInputMinLength,
                    maxLength         : nativeInputMaxLength,
                    
                    min               : nativeInputMin,
                    max               : nativeInputMax,
                    step              : nativeInputStep,
                    pattern           : nativeInputPattern,
                    
                    
                    
                    // formats:
                    type              : nativeInputType,
                    placeholder       : nativeInputPlaceholder,
                    autoComplete      : nativeInputAutoComplete,
                    autoCapitalize    : nativeInputAutoCapitalize,
                    list              : nativeInputList,
                    inputMode         : nativeInputInputMode,
                },
            )}
        </EditableControl>
    );
};
export {
    DummyInput,            // named export for readibility
    DummyInput as default, // default export to support React.lazy
}
