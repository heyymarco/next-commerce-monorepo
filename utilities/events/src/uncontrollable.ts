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



export interface UncontrollableProps<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    defaultValue       : TValue
    onValueChange      : ValueChangeEventHandler<TValue, TChangeEvent>|undefined
}
export interface UncontrollableApi<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    value              : TValue
    triggerValueChange : TriggerValueChangeCallback<TValue, TChangeEvent>
}
export const useUncontrollable = <TValue extends unknown, TChangeEvent extends unknown = unknown>(props: UncontrollableProps<TValue, TChangeEvent>): UncontrollableApi<TValue, TChangeEvent> => {
    // props:
    const {
        // values:
        defaultValue  : defaultUncontrollableValue,
        onValueChange : onUncontrollableValueChange,
    } = props;
    
    
    
    // states:
    const [uncontrollableValue, setUncontrollableValue] = useState<TValue>(defaultUncontrollableValue);
    const value = uncontrollableValue;
    
    
    
    // handlers:
    const handleUncontrollableValueChange = useEvent<ValueChangeEventHandler<TValue, TChangeEvent>>((newValue) => {
        // update value:
        setUncontrollableValue(newValue);
    });
    const handleValueChange               = useMergeEvents(
        // preserves the original `onUncontrollableValueChange` from `props`:
        onUncontrollableValueChange,
        
        
        
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
            // fire `onUncontrollableValueChange` react event:
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
