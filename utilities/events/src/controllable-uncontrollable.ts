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



export interface ControllableAndUncontrollableProps<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    defaultValue       : TValue
    value              : TValue|undefined
    onValueChange      : ValueChangeEventHandler<TValue, TChangeEvent>|undefined
}
export interface ControllableAndUncontrollableApi<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    value              : TValue
    triggerValueChange : TriggerValueChangeCallback<TValue, TChangeEvent>
}
export const useControllableAndUncontrollable = <TValue extends unknown, TChangeEvent extends unknown = unknown>(props: ControllableAndUncontrollableProps<TValue, TChangeEvent>): ControllableAndUncontrollableApi<TValue, TChangeEvent> => {
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
    const handleUncontrollableValueChange = useEvent<ValueChangeEventHandler<TValue, TChangeEvent>>((newValue) => {
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
    const triggerValueChange              = useEvent<TriggerValueChangeCallback<TValue, TChangeEvent>>((newValue, options) => {
        // conditions:
        if (!handleValueChange) return; // no callback handler => nothing to trigger
        
        
        
        // actions:
        scheduleTriggerEvent(() => {
            // fire `on(Controllable|Uncontrollable)ValueChange` react event:
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
