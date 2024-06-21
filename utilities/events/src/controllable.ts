// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/hooks'           // react helper hooks

// internals:
import {
    type TriggerValueChangeCallback,
    type ValueChangeEventHandler,
}                           from './types.js'
import {
    // hooks:
    useScheduleTriggerEvent,
}                           from './hooks.js'



export interface ControllableProps<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    value              : TValue
    onValueChange      : ValueChangeEventHandler<TValue, TChangeEvent>|undefined
}
export interface ControllableApi<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    value              : TValue
    triggerValueChange : TriggerValueChangeCallback<TValue, TChangeEvent>
}
export const useControllable = <TValue extends unknown, TChangeEvent extends unknown = unknown>(props: ControllableProps<TValue, TChangeEvent>): ControllableApi<TValue, TChangeEvent> => {
    // props:
    const {
        // values:
        value         : controllableValue,
        onValueChange : onControllableValueChange,
    } = props;
    
    
    
    // states:
    const value = controllableValue;
    
    
    
    // handlers:
    const handleValueChange               = onControllableValueChange;
    
    
    
    // stable callbacks:
    const scheduleTriggerEvent            = useScheduleTriggerEvent();
    const triggerValueChange              = useEvent<TriggerValueChangeCallback<TValue, TChangeEvent>>((newValue, options) => {
        // conditions:
        if (!handleValueChange) return; // no callback handler => nothing to trigger
        
        
        
        // actions:
        scheduleTriggerEvent(() => {
            // fire `onControllableValueChange` react event:
            handleValueChange(newValue, options?.event /* an optional event object passed from the options */);
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
