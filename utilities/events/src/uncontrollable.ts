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
    // types:
    ScheduleTriggerEventOptions,
    
    
    
    // hooks:
    useScheduleTriggerEvent,
}                           from './hooks.js'



export interface UncontrollableProps<TValue extends unknown> {
    // values:
    defaultValue       : TValue
    onValueChange      : ((newValue: TValue) => void)|undefined
}
export interface UncontrollableApi<TValue extends unknown> {
    // values:
    value              : TValue
    triggerValueChange : (newValue: TValue, options?: ScheduleTriggerEventOptions) => void
}
export const useUncontrollable = <TValue extends unknown>(props: UncontrollableProps<TValue>): UncontrollableApi<TValue> => {
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
    const handleUncontrollableValueChange = useEvent((newValue: TValue): void => {
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
    const triggerValueChange              = useEvent((newValue: TValue, options?: ScheduleTriggerEventOptions): void => {
        // conditions:
        if (!handleValueChange) return; // no callback handler => nothing to trigger
        
        
        
        // actions:
        scheduleTriggerEvent(() => {
            // fire `onUncontrollableValueChange` react event:
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
