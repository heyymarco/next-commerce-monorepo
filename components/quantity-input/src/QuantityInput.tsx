// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// cssfn:
import type {
    // types:
    Optional,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
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
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    ButtonProps,
    
    ButtonIcon,
    
    Group,
    
    InputProps,
    Input,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



export interface QuantityInputProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        Omit<InputProps<TElement>,
            // values:
            |'defaultValue'|'value'  // only supports numeric value -or- null (blank value)
            
            // validations:
            |'minLength'|'maxLength' // text length constraint is not supported
            |'pattern'               // text regex is not supported
            |'min'|'max'|'step'      // only supports numeric value
            
            // formats:
            |'type'                  // only supports number
            |'autoCapitalize'        // nothing to capitalize of number
            |'inputMode'             // always 'numeric'
            
            // children:
            |'children'              // no nested children
        >
{
    // values:
    defaultValue            ?: number|null
    value                   ?: number|null
    
    
    
    // validations:
    min                     ?: number
    max                     ?: number
    step                    ?: number
    
    
    
    // components:
    decreaseButtonComponent ?: React.ReactComponentElement<any, ButtonProps>
    increaseButtonComponent ?: React.ReactComponentElement<any, ButtonProps>
    inputComponent          ?: React.ReactComponentElement<any, InputProps<TElement>>
    
    
    
    // children:
    childrenBeforeButton    ?: React.ReactNode
    childrenBeforeInput     ?: React.ReactNode
    childrenAfterInput      ?: React.ReactNode
    childrenAfterButton     ?: React.ReactNode
}
const QuantityInput = <TElement extends Element = HTMLSpanElement>(props: QuantityInputProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id,
        
        
        
        // variants:
        size,
        theme,
        gradient,
        outlined,
        mild,
        
        
        
        // classes:
        mainClass,
        classes,
        variantClasses,
        stateClasses,
        className,
        
        
        
        // styles:
        style,
        
        
        
        // values:
        defaultValue,
        value,
        onChange,
        
        
        
        // validations:
        required,
        
        min,
        max,
        step,
        
        
        
        // components:
        decreaseButtonComponent = (<ButtonIcon icon='remove' /> as React.ReactComponentElement<any, ButtonProps>),
        increaseButtonComponent = (<ButtonIcon icon='add'    /> as React.ReactComponentElement<any, ButtonProps>),
        inputComponent          = (<Input                    /> as React.ReactComponentElement<any, InputProps<TElement>>),
        
        
        
        // children:
        childrenBeforeButton,
        childrenBeforeInput,
        childrenAfterInput,
        childrenAfterButton,
    ...restInputProps} = props;
    
    
    
    // accessibilities:
    const propAccess = usePropAccessibility(props);
    const {enabled: propEnabled, readOnly: propReadOnly} = propAccess;
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // utilities:
    const minFn      : number  = min ?? 0;
    const maxFn      : number  = max ?? 9;
    const stepFn     : number  = Math.abs(step ?? 1);
    const negativeFn : boolean = (maxFn < minFn);
    
    const trimValue = useEvent(<TOpt extends number|null|undefined>(value: number|TOpt): number|TOpt => {
        return clamp(minFn, value, maxFn, stepFn);
    });
    
    
    
    // fn props:
    const valueFn        : number|null|undefined = trimValue(value);
    const defaultValueFn : number|null|undefined = trimValue(defaultValue);
    
    
    
    // events:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    
    
    
    // source of truth:
    const valueRef         = useRef<number|null>(/*initialState: */
        (valueFn !== undefined)
        ? valueFn // as number|null
        : (
            (defaultValueFn !== undefined)
            ? defaultValueFn // as number|null
            : null
        )
    );
    if (valueFn !== undefined) valueRef.current = valueFn;  //   controllable component mode: update the source_of_truth on every_re_render -- on every [value] prop changes
    const [triggerRender]  = useTriggerRender();            // uncontrollable component mode: update the source_of_truth when modified internally by internal component(s)
    
    type ChangeValueAction = 'setValue'|'decrease'|'increase'
    const changeValue      = useEvent((action: ChangeValueAction, amount: number|null): void => {
        let value = valueRef.current;
        const defaultValueInternal = minFn;
        switch (action) {
            case 'setValue': {
                value = trimValue(amount);
            } break;
            
            case 'decrease' : {
                if (amount !== null) {
                    if (value === null) {
                        value = trimValue(defaultValueInternal);
                    }
                    else {
                        value = trimValue(value - ((stepFn || 1) * (negativeFn ? -1 : 1) * amount));
                    } // if
                } // if
            } break;
            case 'increase' : {
                if (amount !== null) {
                    if (value === null) {
                        value = trimValue(defaultValueInternal);
                    }
                    else {
                        value = trimValue(value + ((stepFn || 1) * (negativeFn ? -1 : 1) * amount));
                    } // if
                } // if
            } break;
        } // switch
        
        
        
        // trigger `onChange` if the value changed:
        if (valueRef.current !== value) {
            const oldValue = valueRef.current; // react *hack* get_prev_value *before* modifying (by any re-render => fully controllable `value = valueRef.current`)
            
            
            
            if (valueFn === undefined) { // uncontrollable component mode: update the source_of_truth when modified internally by internal component(s)
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
                        // do not use `valueAsNumber`, the underlying `inputElm` is not always `type='number'`, maybe `type='text'` with `inputMode='numeric'`
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
    
    
    
    // refs:
    const inputRefInternal = useRef<HTMLInputElement|null>(null);
    const mergedInputRef   = useMergeRefs(
        // preserves the original `elmRef` from `inputComponent`:
        inputComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        inputRefInternal,
    );
    
    
    
    // classes:
    const specialClasses    = ['solid', 'fluid', 'not-solid', 'not-fluid'];
    const hasSpecialClasses = (className: Optional<string>): boolean => !!className && specialClasses.includes(className);
    const decreaseButtonClasses = useMergeClasses(
        // preserves the original `classes` from `decreaseButtonComponent`:
        decreaseButtonComponent.props.classes,
        
        
        
        // classes:
        ...(decreaseButtonComponent.props.classes?.some(hasSpecialClasses) ? [/* do not inject any className */] : ['solid']),
    );
    const inputClasses = useMergeClasses(
        // preserves the original `classes` from `inputComponent`:
        inputComponent.props.classes,
        
        
        
        // classes:
        ...(inputComponent.props.classes?.some(hasSpecialClasses) ? [/* do not inject any className */] : ['fluid']),
    );
    const increaseButtonClasses = useMergeClasses(
        // preserves the original `classes` from `increaseButtonComponent`:
        increaseButtonComponent.props.classes,
        
        
        
        // classes:
        ...(increaseButtonComponent.props.classes?.some(hasSpecialClasses) ? [/* do not inject any className */] : ['solid']),
    );
    
    
    // handlers:
    const handleChangeInternal      = useEvent<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        if (isDisabledOrReadOnly)   return; // control is disabled or readOnly => no response required
        
        
        
        // action:
        if (event.isTrusted) { // ignores the event emmited by `inputElm.dispatchEvent(new Event('input', { bubbles: true, cancelable: false, composed: true }));`
            changeValue('setValue', event.target.value ? event.target.valueAsNumber : null);
        } // if
    });
    const handleChange              = useMergeEvents(
        // preserves the original `onChange` from `inputComponent`:
        inputComponent.props.onChange,
        
        
        
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
                        // classes:
                        classes      : decreaseButtonClasses,
                        
                        
                        
                        // accessibilities:
                        title        : decreaseButtonComponent.props.title   ?? 'decrease quantity',
                        enabled      : decreaseButtonComponent.props.enabled ?? (!isDisabledOrReadOnly && ((valueRef.current === null) || (valueRef.current > minFn))),
                        
                        
                        
                        // handlers:
                        onClick      : handleDecreaseButtonClick,
                    },
                )}
                
                {childrenBeforeInput}
                
                {/* <Input> */}
                {React.cloneElement<InputProps<TElement>>(inputComponent,
                    // props:
                    {
                        // rest props:
                        ...restInputProps,
                        
                        
                        
                        // refs:
                        elmRef       : mergedInputRef,
                        
                        
                        
                        // classes:
                        classes      : inputClasses,
                        
                        
                        
                        // values:
                    // defaultValue : inputComponent.props.defaultValue ?? defaultValueFn   ?? '', // fully controllable, no defaultValue
                        value        : inputComponent.props.value        ?? valueRef.current ?? '', // fully controllable
                        onChange     : handleChange,
                        
                        
                        
                        // validations:
                        required     : inputComponent.props.required,
                        
                        min          : inputComponent.props.min  ?? (negativeFn ? maxFn : minFn),
                        max          : inputComponent.props.max  ?? (negativeFn ? minFn : maxFn),
                        step         : inputComponent.props.step ?? stepFn,
                        
                        
                        
                        // formats:
                        type         : inputComponent.props.type ?? 'number',
                    },
                )}
                
                {childrenAfterInput}
                
                {/* <Button> */}
                {React.cloneElement<ButtonProps>(increaseButtonComponent,
                    // props:
                    {
                        // classes:
                        classes      : increaseButtonClasses,
                        
                        
                        
                        // accessibilities:
                        title        : increaseButtonComponent.props.title   ?? 'increase quantity',
                        enabled      : increaseButtonComponent.props.enabled ?? (!isDisabledOrReadOnly && ((valueRef.current === null) || (valueRef.current < maxFn))),
                        
                        
                        
                        // handlers:
                        onClick      : handleIncreaseButtonClick,
                    },
                )}
                
                {childrenAfterButton}
            </Group>
        </AccessibilityProvider>
    );
};
export {
    QuantityInput,
    QuantityInput as default,
}
