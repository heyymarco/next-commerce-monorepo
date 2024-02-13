// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/hooks'           // react helper hooks

// internals:
import {
    // types:
    ScheduleTriggerEventOptions,
    
    
    
    // hooks:
    useScheduleTriggerEvent,
}                           from './hooks.js'



export interface ControllableProps<TValue extends unknown> {
    // values:
    value              : TValue
    onValueChange      : ((newValue: TValue) => void)|undefined
}
export interface ControllableApi<TValue extends unknown> {
    // values:
    value              : TValue
    triggerValueChange : (newValue: TValue, options?: ScheduleTriggerEventOptions) => void
}
export const useControllable = <TValue extends unknown>(props: ControllableProps<TValue>): ControllableApi<TValue> => {
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
