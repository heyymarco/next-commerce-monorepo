// react:
import {
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    useScheduleTriggerEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// types:
export interface TriggerValueChangeOptions {
    runsOnMacrotask ?: boolean
}



export interface ControllableAndUncontrollableProps<TValue extends any> {
    // values:
    defaultValue       : TValue
    value              : TValue|undefined
    onValueChange      : ((newValue: TValue) => void)|undefined
}
export interface ControllableAndUncontrollableApi<TValue extends any> {
    // values:
    value              : TValue
    triggerValueChange : (newValue: TValue, options?: TriggerValueChangeOptions) => void
}
export const useControllableAndUncontrollable = <TValue extends any>(props: ControllableAndUncontrollableProps<TValue>): ControllableAndUncontrollableApi<TValue> => {
    // props:
    const {
        // values:
        defaultValue  : defaultUncontrollableValue,
        value         : controllableValue,
        onValueChange : onControllableValueChange,
    } = props;
    
    
    
    // states:
    const [uncontrollableValue, setUncontrollableValue] = useState<TValue>(defaultUncontrollableValue);
    const isControllableValue = (controllableValue !== undefined);
    const value               = isControllableValue ? controllableValue : uncontrollableValue;
    
    
    
    // handlers:
    const handleUncontrollableValueChange = useEvent((newValue: TValue) => {
        // update value if uncontrollable:
        if (!isControllableValue) setUncontrollableValue(newValue);
    });
    const handleValueChange               = useMergeEvents(
        // preserves the original `onControllableValueChange` from `props`:
        onControllableValueChange,
        
        
        
        // actions:
        handleUncontrollableValueChange,
    );
    
    
    
    // stable callbacks:
    const scheduleTriggerEvent            = useScheduleTriggerEvent();
    const triggerValueChange              = useEvent((newValue: TValue, options?: TriggerValueChangeOptions): void => {
        if (options?.runsOnMacrotask ?? true) {
            if (handleValueChange) scheduleTriggerEvent(() => { // runs the `on(Controllable|Uncontrollable)ValueChange` event *next after* current macroTask completed
                // fire `on(Controllable|Uncontrollable)ValueChange` react event:
                handleValueChange(newValue);
            });
        }
        else {
            // fire `on(Controllable|Uncontrollable)ValueChange` react event:
            handleValueChange?.(newValue);
        } // if
    });
    
    
    
    // api:
    return {
        // values:
        value,
        
        
        
        // stable callbacks:
        triggerValueChange,
    };
};
