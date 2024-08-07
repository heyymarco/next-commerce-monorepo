// react:
import {
    // hooks:
    useRef,
    useEffect,
    useState,
    
    
    
    // utilities:
    startTransition,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useTriggerRender,
    useEvent,
    type EventHandler,
    useMountedFlag,
    
    
    
    // a validation management system:
    type Result as ValResult,
    
    
    
    // a possibility of UI having an invalid state:
    type ValidityChangeEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    type EditorChangeEventHandler
}                           from '@heymarco/editor'

// internals:
import {
    type ValueOptions,
}                           from '../types.js'



// hooks:

// states:

//#region SelectValidator
export const isSelectionValid = <TValue extends unknown = string>(props: SelectValidatorProps<TValue>, finalValueOptions: TValue[]|undefined, value: TValue): ValResult => {
    // props:
    const {
        // values:
        equalityValueComparison = Object.is,
        
        
        
        // validations:
        required                = false,
        freeTextInput           = true,
    } = props;
    
    
    
    // conditions:
    if ((value === undefined) || (value === null) || (value === '')) { // blank value
        return !required; // blank value & required => *invalid*
    } // if
    
    if (freeTextInput) return true; // *valid* for any value
    
    if (!finalValueOptions) return null; // no finalValueOptions => cannot perform check => *uncheck*
    
    
    
    // validations:
    try {
        if (!finalValueOptions.some((finalValueOption) => equalityValueComparison(finalValueOption, value))) return false; // match option is not found => *invalid*
    }
    catch {
        return false; // unknown error => *invalid*
    } // try
    
    
    
    // all validation passes:
    return true; // *valid*
};

export interface SelectValidatorProps<TValue extends unknown = string> {
    // values:
    valueOptions             : ValueOptions<TValue> // required! because it's a <SELECT> component
    excludedValueOptions    ?: ValueOptions<TValue>
    
    
    
    // validations:
    required                ?: boolean
    freeTextInput           ?: boolean
    equalityValueComparison ?: (a: TValue, b: TValue) => boolean
}
export interface SelectValidatorApi<in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TValue extends unknown = string> {
    handleValidation : EventHandler<ValidityChangeEvent>
    handleInit       : EventHandler<TValue>
    handleChange     : EditorChangeEventHandler<TChangeEvent, TValue>
}
export const useSelectValidator = <TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TValue extends unknown = string>(props: SelectValidatorProps<TValue>): SelectValidatorApi<TChangeEvent, TValue> => {
    // props:
    const {
        // values:
        valueOptions,
        excludedValueOptions,
    } = props;
    
    
    
    // states:
    // we stores the `isValid` in `useRef` instead of `useState` because we need to *real-time export* of its value:
    const isValid = useRef<ValResult>(null); // initially unchecked (neither valid nor invalid)
    
    // manually controls the (re)render event:
    const [triggerRender] = useTriggerRender();
    
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
    
    
    
    // functions:
    
    const validate = (value: TValue): void => {
        // remember the validation result:
        const newIsValid = isSelectionValid<TValue>(props, finalValueOptions, value);
        if (isValid.current !== newIsValid) {
            isValid.current = newIsValid;
            
            // lazy responsives => a bit delayed of responsives is ok:
            startTransition(() => {
                triggerRender(); // notify to react runtime to re-render with a new validity state, causing `useInvalidable()` runs the effect => calls `onValidation` => `handleValidation()`
            });
        } // if
    };
    
    
    
    // handlers:
    
    /**
     * Handles the validation result.
     * @returns  
     * `null`  = uncheck.  
     * `true`  = valid.  
     * `false` = invalid.
     */
    const handleValidation   = useEvent<EventHandler<ValidityChangeEvent>>((event) => {
        // conditions:
        if (event.isValid !== true) return; // ignore if was *invalid*|*uncheck* (only perform a further_validation if was *valid*)
        
        
        
        // further validations:
        event.isValid = isValid.current;
    });
    
    const handleInitOrChange = useEvent<EventHandler<TValue>>((value) => {
        validate(value);
    });
    
    
    
    // api:
    return {
        handleValidation,
        handleInit   : handleInitOrChange,
        handleChange : handleInitOrChange,
    };
};
//#endregion SelectValidator
