// react:
import {
    // hooks:
    useEffect,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
    
    
    
    // a validation management system:
    type Result as ValResult,
    
    
    
    // a possibility of UI having an invalid state:
    type ValidityChangeEvent,
    type ValidationEventHandler,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    type ValueOptions,
}                           from '../types.js'



// hooks:

// states:

//#region SelectValidator
export const isSelectionValid = <TValue extends unknown = string>(props: SelectValidatorProps<TValue>, validationValues: TValue[]|undefined, value: TValue): ValResult => {
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
    
    if (!validationValues) return null; // no validationValues => cannot perform check => *uncheck*
    
    
    
    // validations:
    try {
        if (!validationValues.some((validationValue) => equalityValueComparison(validationValue, value))) return false; // match option is not found => *invalid*
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
export interface SelectValidatorApi<TValue extends unknown = string> {
    // states:
    validationValues : TValue[]|undefined
    
    
    
    // handlers:
    handleValidation : ValidationEventHandler<ValidityChangeEvent>
}
export const useSelectValidator = <TValue extends unknown = string>(props: SelectValidatorProps<TValue>, value: TValue): SelectValidatorApi<TValue> => {
    // props:
    const {
        // values:
        valueOptions,
        excludedValueOptions,
    } = props;
    
    
    
    // states:
    
    // resolving `valueOptions` and `excludedValueOptions` to `validationValues`:
    const [validationValues, setValidationValues] = useState<TValue[]|undefined>(undefined);
    const isMounted = useMountedFlag();
    useEffect(() => {
        // setups:
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
                
                
                
                const newValidationValues = (
                    !resolvedExcludedValueOptions?.length
                    ? resolvedValueOptions
                    : resolvedValueOptions.filter((item) =>
                        !resolvedExcludedValueOptions.includes(item)
                    )
                );
                setValidationValues(newValidationValues);
            }
            catch {
                // unable to resolve, maybe due to a fetch error:
                setValidationValues(undefined);
            } // try
        })();
        
        
        
        // cleanups:
        return () => {
            setValidationValues(undefined);
        };
    }, [valueOptions, excludedValueOptions]);
    
    
    
    // handlers:
    /**
     * Handles the validation result.
     * @returns  
     * `null`  = uncheck.  
     * `true`  = valid.  
     * `false` = invalid.
     */
    const handleValidation = useEvent<ValidationEventHandler<ValidityChangeEvent>>(async (event) => {
        // conditions:
        if (event.isValid !== true) return; // ignore if was *invalid*|*uncheck* (only perform a further_validation if was *valid*)
        
        
        
        // further validations:
        const newIsValid : ValResult = isSelectionValid<TValue>(props, validationValues, value);
        event.isValid = newIsValid; // update the validation result
    });
    
    
    
    // api:
    return {
        // states:
        validationValues,
        
        
        
        // handlers:
        handleValidation,
    };
};
//#endregion SelectValidator
