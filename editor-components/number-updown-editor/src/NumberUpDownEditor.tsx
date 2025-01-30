// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // a set of numeric utility functions:
    clamp,
    
    
    
    // react helper hooks:
    useTriggerRender,
    useEvent,
    useMergeEvents,
    useMergeRefs,
    useMergeClasses,
    useScheduleTriggerEvent,
    
    
    
    // an accessibility management system:
    usePropAccessibility,
    AccessibilityProvider,
    
    
    
    // a possibility of UI having an invalid state:
    type ValidationDeps,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    type ButtonProps,
}                           from '@reusable-ui/button'                  // a button component for initiating an action
import {
    // react components:
    ButtonIcon,
}                           from '@reusable-ui/button-icon'             // a button component with a nice icon
import {
    // react components:
    type GroupProps,
    Group,
}                           from '@reusable-ui/group'                   // groups a list of components as a single component

// heymarco components:
import {
    // types:
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
import {
    // react components:
    type NumberEditorProps,
    NumberEditor,
    
    
    
    type NumberEditorComponentProps,
}                           from '@heymarco/number-editor'



// react components:
export interface NumberUpDownEditorProps<out TElement extends Element = HTMLDivElement, TValue extends number|null = number|null, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
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
        Omit<NumberEditorProps<Element, TValue, TChangeEvent>,
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
        
        // components:
        NumberEditorComponentProps<Element, TValue, TChangeEvent>
{
    // components:
    decreaseButtonComponent ?: React.ReactElement<ButtonProps>
    increaseButtonComponent ?: React.ReactElement<ButtonProps>
    
    
    
    // children:
    childrenBeforeButton    ?: React.ReactNode
    childrenBeforeInput     ?: React.ReactNode
    childrenAfterInput      ?: React.ReactNode
    childrenAfterButton     ?: React.ReactNode
}
const NumberUpDownEditor = <TElement extends Element = HTMLDivElement, TValue extends number|null = number|null, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: NumberUpDownEditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,                                            // take, moved to <NumberEditor>
        outerRef,                                          // take, moved to <Group>
        
        
        
        // identifiers:
        id,                                                // take, moved to <Group>
        
        
        
        // variants:
        size,                                              // take, moved to <Group>
        theme,                                             // take, moved to <Group>
        gradient,                                          // take, moved to <Group>
        outlined,                                          // take, moved to <Group>
        mild,                                              // take, moved to <Group>
        
        
        
        // classes:
        mainClass,                                         // take, moved to <Group>
        classes,                                           // take, moved to <Group>
        variantClasses,                                    // take, moved to <Group>
        stateClasses,                                      // take, moved to <Group>
        className,                                         // take, moved to <Group>
        
        
        
        // styles:
        style,                                             // take, moved to <Group>
        
        
        
        // values:
        defaultValue            : defaultUncontrollableValueRaw,
        value                   : controllableValueRaw,
        onChange,
        
        
        
        // validations:
        enableValidation,                                  // take, moved to <NumberEditor>
        isValid,                                           // take, moved to <NumberEditor>
        inheritValidation,                                 // take, moved to <NumberEditor>
        validationDeps          : validationDepsOverwrite, // take, moved to <NumberEditor>
        onValidation,                                      // take, moved to <NumberEditor>
        
        validDelay,                                        // take, moved to <NumberEditor>
        invalidDelay,                                      // take, moved to <NumberEditor>
        noValidationDelay,                                 // take, moved to <NumberEditor>
        
        min                     : min     = 0,
        max                     : max     = 100,
        step                    : stepRaw = 1,
        
        
        
        // components:
        decreaseButtonComponent = (<ButtonIcon icon='remove'                    /> as React.ReactElement<ButtonProps>),
        increaseButtonComponent = (<ButtonIcon icon='add'                       /> as React.ReactElement<ButtonProps>),
        numberEditorComponent   = (<NumberEditor<Element, TValue, TChangeEvent> /> as React.ReactElement<NumberEditorProps<Element, TValue, TChangeEvent>>),
        
        
        
        // children:
        childrenBeforeButton,
        childrenBeforeInput,
        childrenAfterInput,
        childrenAfterButton,
        
        
        
        // other props:
        ...restPreNumberEditorProps
    } = props;
    
    const step       : number  = Math.abs(stepRaw);
    const isReversed : boolean = (max < min);
    
    const appendValidationDeps = useEvent<ValidationDeps>((bases) => [
        ...bases,
        
        // validations:
        /* none */
    ]);
    const mergedValidationDeps = useEvent<ValidationDeps>((bases) => {
        const basesStage2 = appendValidationDeps(bases);
        const basesStage3 = validationDepsOverwrite ? validationDepsOverwrite(basesStage2) : basesStage2;
        
        const validationDepsOverwrite2 = numberEditorComponent.props.validationDeps;
        const basesStage4 = validationDepsOverwrite2 ? validationDepsOverwrite2(basesStage3) : basesStage3;
        
        return basesStage4;
    });
    
    
    
    // accessibilities:
    const propAccess = usePropAccessibility(props);
    const {enabled: propEnabled, readOnly: propReadOnly} = propAccess;
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // utilities:
    const trimValue = useEvent(<TOpt extends number|null|undefined>(value: number|TOpt): number|TOpt => {
        return clamp(min, value, max, step);
    });
    
    
    
    // fn props:
    const controllableValue          : number|null|undefined = trimValue(controllableValueRaw);
    const defaultUncontrollableValue : number|null|undefined = trimValue(defaultUncontrollableValueRaw);
    
    
    
    // refs:
    const inputRefInternal = useRef<HTMLInputElement|null>(null);
    const mergedInputRef   = useMergeRefs(
        // preserves the original `elmRef` from `numberEditorComponent`:
        numberEditorComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        inputRefInternal,
    );
    
    
    
    // classes:
    const specialClasses        = ['solid', 'fluid', 'not-solid', 'not-fluid'];
    const hasSpecialClasses     = (className: string|null|undefined): boolean => !!className && specialClasses.includes(className);
    const decreaseButtonClasses = useMergeClasses(
        // preserves the original `classes` from `decreaseButtonComponent`:
        decreaseButtonComponent.props.classes,
        
        
        
        // classes:
        ...(decreaseButtonComponent.props.classes?.some(hasSpecialClasses) ? [/* do not inject any className */] : ['solid']),
    );
    const mergedInputClasses    = useMergeClasses(
        // preserves the original `classes` from `numberEditorComponent`:
        numberEditorComponent.props.classes,
        
        
        
        // classes:
        ...(numberEditorComponent.props.classes?.some(hasSpecialClasses) ? [/* do not inject any className */] : ['fluid']),
    );
    const increaseButtonClasses = useMergeClasses(
        // preserves the original `classes` from `increaseButtonComponent`:
        increaseButtonComponent.props.classes,
        
        
        
        // classes:
        ...(increaseButtonComponent.props.classes?.some(hasSpecialClasses) ? [/* do not inject any className */] : ['solid']),
    );
    
    
    
    // events:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    
    
    
    // source of truth:
    const valueRef         = useRef<number|null>(/*initialState: */
        (controllableValue !== undefined) // has provided `value` prop
        ? controllableValue               // as number|null
        : (
            (defaultUncontrollableValue !== undefined) // has provided `defaultValue` prop
            ? defaultUncontrollableValue               // as number|null
            : null                                     // the internal default value
        )
    );
    const value : TValue = (valueRef.current ?? null) as TValue;
    if (controllableValue !== undefined) valueRef.current = controllableValue; //   controllable component mode: update the source_of_truth on every_re_render -- on every [value] prop changes
    const [triggerRender]  = useTriggerRender();                               // uncontrollable component mode: update the source_of_truth when modified internally by internal component(s)
    
    type ChangeValueAction = 'setValue'|'decrease'|'increase'
    const changeValue      = useEvent((action: ChangeValueAction, amount: number|null): void => {
        let value = valueRef.current;
        const defaultValueInternal = min;
        switch (action) {
            case 'setValue': {
                value = trimValue(amount);
            } break;
            
            case 'decrease' : {
                if (amount !== null) { // if `amount` is `null`, nothing to decrease
                    if (value === null) { // if `value` is blank, auto-fill with `defaultValue`
                        value = trimValue(defaultValueInternal);
                    }
                    else {
                        value = trimValue(value - ((step || 1) * (isReversed ? -1 : 1) * amount));
                    } // if
                } // if
            } break;
            case 'increase' : {
                if (amount !== null) { // if `amount` is `null`, nothing to increase
                    if (value === null) { // if `value` is blank, auto-fill with `defaultValue`
                        value = trimValue(defaultValueInternal);
                    }
                    else {
                        value = trimValue(value + ((step || 1) * (isReversed ? -1 : 1) * amount));
                    } // if
                } // if
            } break;
        } // switch
        
        
        
        // trigger `onChange` if the value changed:
        if (valueRef.current !== value) {
            const oldValue = valueRef.current; // react *hack* get_prev_value *before* modifying (by any re-render => fully controllable `value = valueRef.current`)
            
            
            
            if (controllableValue === undefined) { // uncontrollable component mode: update the source_of_truth when modified internally by internal component(s)
                valueRef.current = value; // update
                triggerRender();          // sync the UI to `valueRef.current`
            }
            // else {
            //     // for controllable component mode: the update of [value] prop and the source_of_truth are decided by <Parent> component (on every_re_render).
            // }
            
            
            
            const inputElm = inputRefInternal.current;
            if (inputElm) {
                // react *hack*: trigger `onChange` event:
                scheduleTriggerEvent(() => { // runs the `input` event *next after* current macroTask completed
                    if (value !== null) {
                        // do not use `valueAsNumber`, the underlying `inputElm` is not always `type='number'`, maybe `type='text'` with `inputMode='numeric'` (in case of custom hexadecimal or non-decimal number input)
                        // inputElm.valueAsNumber = value; // react *hack* set_value *before* firing `input` event
                        
                        // instead, pass the value as string:
                        inputElm.value = value.toString(); // react *hack* set_value *before* firing `input` event
                    }
                    else {
                        inputElm.value = '';            // react *hack* set_value *before* firing `input` event
                    } // if
                    (inputElm as any)._valueTracker?.setValue(`${oldValue}`); // react *hack* in order to React *see* the changes when `input` event fired
                    
                    
                    
                    // fire `input` native event to trigger `onChange` synthetic event:
                    inputElm.dispatchEvent(new Event('input', { bubbles: true, cancelable: false, composed: true }));
                });
            } // if
        } // if
    });
    
    
    
    // props:
    const {
        // values:
        notifyValueChange       = value,                   // take, to be handled by `<NumberEditor>`
        
        
        
        // other props:
        ...restNumberEditorProps
    } = restPreNumberEditorProps;
    
    
    
    // handlers:
    const handleChangeInternal      = useEvent<EditorChangeEventHandler<number|null, TChangeEvent>>((value, event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        if (isDisabledOrReadOnly)   return; // control is disabled or readOnly => no response required
        
        
        
        // action:
        if (event.isTrusted) { // ignores the event emmited by `inputElm.dispatchEvent(new Event('input', { bubbles: true, cancelable: false, composed: true }));`
            changeValue('setValue', (event.currentTarget as EventTarget & HTMLInputElement).value ? (event.currentTarget as EventTarget & HTMLInputElement).valueAsNumber : null);
        } // if
    });
    const handleChange              = useMergeEvents(
        // preserves the original `onChange` from `numberEditorComponent`:
        numberEditorComponent.props.onChange,
        
        
        
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    const handleDecreaseInternal    = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        if (isDisabledOrReadOnly)   return; // control is disabled or readOnly => no response required
        
        
        
        // action:
        changeValue('decrease', 1);
    });
    const handleDecreaseButtonClick = useMergeEvents(
        // preserves the original `onClick` from `decreaseButtonComponent`:
        decreaseButtonComponent.props.onClick,
        
        
        
        // actions:
        handleDecreaseInternal,
    );
    const handleIncreaseInternal    = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        if (isDisabledOrReadOnly)   return; // control is disabled or readOnly => no response required
        
        
        
        // action:
        changeValue('increase', 1);
    });
    const handleIncreaseButtonClick = useMergeEvents(
        // preserves the original `onClick` from `increaseButtonComponent`:
        increaseButtonComponent.props.onClick,
        
        
        
        // actions:
        handleIncreaseInternal,
    );
    
    
    
    // default props:
    const {
        // values:
     // defaultValue      : numberEditorComponentDefaultValue      = (defaultValueFn   ?? null), // internally controllable, no defaultValue
        value             : numberEditorComponentValue             = value,                      // internally controllable
        
        notifyValueChange : numberEditorComponentNotifyValueChange = notifyValueChange,
        
        
        
        // validations:
        enableValidation  : numberEditorComponentEnableValidation  = enableValidation,
        isValid           : numberEditorComponentIsValid           = isValid,
        inheritValidation : numberEditorComponentInheritValidation = inheritValidation,
        
        validDelay        : numberEditorComponentValidDelay        = validDelay,
        invalidDelay      : numberEditorComponentInvalidDelay      = invalidDelay,
        noValidationDelay : numberEditorComponentNoValidationDelay = noValidationDelay,
        
        min               : numberEditorComponentMin               = (isReversed ? max : min),
        max               : numberEditorComponentMax               = (isReversed ? min : max),
        step              : numberEditorComponentStep              = step,
        
        
        
        // other props:
        ...restNumberEditorComponentProps
    } = numberEditorComponent.props;
    
    const {
        // accessibilities:
        title   : decreaseButtonComponentTitle   = 'decrease quantity',
        
        
        
        // states:
        enabled : decreaseButtonComponentEnabled = (!isDisabledOrReadOnly && ((valueRef.current === null) || (valueRef.current > min))),
        
        
        
        // other props:
        ...restDecreaseButtonComponentProps
    } = decreaseButtonComponent.props;
    
    const {
        // accessibilities:
        title   : increaseButtonComponentTitle   = 'increase quantity',
        
        
        
        // states:
        enabled : increaseButtonComponentEnabled = (!isDisabledOrReadOnly && ((valueRef.current === null) || (valueRef.current < max))),
        
        
        
        // other props:
        ...restIncreaseButtonComponentProps
    } = increaseButtonComponent.props;
    
    
    
    // jsx:
    return (
        <AccessibilityProvider {...propAccess}>
            <Group<TElement>
                // refs:
                outerRef={outerRef}
                
                
                
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
                {childrenBeforeButton}
                
                {/* <Button> */}
                {React.cloneElement<ButtonProps>(decreaseButtonComponent,
                    // props:
                    {
                        // other props:
                        ...restDecreaseButtonComponentProps,
                        
                        
                        
                        // classes:
                        classes : decreaseButtonClasses,
                        
                        
                        
                        // accessibilities:
                        title   : decreaseButtonComponentTitle,
                        
                        
                        
                        // states:
                        enabled : decreaseButtonComponentEnabled,
                        
                        
                        
                        // handlers:
                        onClick : handleDecreaseButtonClick,
                    },
                )}
                
                {childrenBeforeInput}
                
                {/* <NumberEditor> */}
                {React.cloneElement<NumberEditorProps<Element, TValue, TChangeEvent>>(numberEditorComponent,
                    // props:
                    {
                        // other props:
                        ...restNumberEditorProps satisfies NoForeignProps<typeof restNumberEditorProps, NumberEditorProps<Element, TValue, TChangeEvent>>,
                        ...restNumberEditorComponentProps, // overwrites restNumberEditorProps (if any conflics)
                        
                        
                        
                        // refs:
                        elmRef            : mergedInputRef,
                        
                        
                        
                        // classes:
                        classes           : mergedInputClasses,
                        
                        
                        
                        // values:
                     // defaultValue      : numberEditorComponentDefaultValue as TValue, // internally controllable, no defaultValue
                        value             : numberEditorComponentValue        as TValue, // internally controllable
                        onChange          : handleChange,
                        
                        notifyValueChange : numberEditorComponentNotifyValueChange,
                        
                        
                        
                        // validations:
                        enableValidation  : numberEditorComponentEnableValidation,
                        isValid           : numberEditorComponentIsValid,
                        inheritValidation : numberEditorComponentInheritValidation,
                        validationDeps    : mergedValidationDeps,
                        onValidation      : onValidation,
                        
                        validDelay        : numberEditorComponentValidDelay,
                        invalidDelay      : numberEditorComponentInvalidDelay,
                        noValidationDelay : numberEditorComponentNoValidationDelay,
                        
                        min               : numberEditorComponentMin,
                        max               : numberEditorComponentMax,
                        step              : numberEditorComponentStep,
                    },
                )}
                
                {childrenAfterInput}
                
                {/* <Button> */}
                {React.cloneElement<ButtonProps>(increaseButtonComponent,
                    // props:
                    {
                        // other props:
                        ...restIncreaseButtonComponentProps,
                        
                        
                        
                        // classes:
                        classes : increaseButtonClasses,
                        
                        
                        
                        // accessibilities:
                        title   : increaseButtonComponentTitle,
                        
                        
                        
                        // states:
                        enabled : increaseButtonComponentEnabled,
                        
                        
                        
                        // handlers:
                        onClick : handleIncreaseButtonClick,
                    },
                )}
                
                {childrenAfterButton}
            </Group>
        </AccessibilityProvider>
    );
};
export {
    NumberUpDownEditor,            // named export for readibility
    NumberUpDownEditor as default, // default export to support React.lazy
}
