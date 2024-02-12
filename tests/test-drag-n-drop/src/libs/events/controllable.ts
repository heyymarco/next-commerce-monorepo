// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    // types:
    ScheduleTriggerEventOptions,
    
    
    
    // hooks:
    useScheduleTriggerEvent,
}                           from './hooks'



export interface ControllableProps<TValue extends any> {
    // values:
    value              : TValue
    onValueChange      : ((newValue: TValue) => void)|undefined
}
export interface ControllableApi<TValue extends any> {
    // values:
    value              : TValue
    triggerValueChange : (newValue: TValue, options?: ScheduleTriggerEventOptions) => void
}
export const useControllable = <TValue extends any>(props: ControllableProps<TValue>): ControllableApi<TValue> => {
    // props:
    const {
        // values:
        value         : controllableValue,
        onValueChange : onControllableValueChange,
    } = props;
    
    
    
    // states:
    const value = controllableValue;
    
    
    
    // handlers:
    const handleValueChange    = onControllableValueChange;
    
    
    
    // stable callbacks:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    const triggerValueChange   = useEvent((newValue: TValue, options?: ScheduleTriggerEventOptions): void => {
        // conditions:
        if (!handleValueChange) return; // no callback handler => nothing to trigger
        
        
        
        // actions:
        scheduleTriggerEvent(() => {
            // fire `onControllableValueChange` react event:
            handleValueChange(newValue);
        }, options);
    });
    
    
    
    // api:
    return {
        // values:
        value,
        
        
        
        // stable callbacks:
        triggerValueChange,
    };
};
