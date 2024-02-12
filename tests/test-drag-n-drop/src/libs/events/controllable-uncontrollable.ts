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
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    // types:
    ScheduleTriggerEventOptions,
    
    
    
    // hooks:
    useScheduleTriggerEvent,
}                           from './hooks'



export interface ControllableAndUncontrollableProps<TValue extends any> {
    // values:
    defaultValue       : TValue
    value              : TValue|undefined
    onValueChange      : ((newValue: TValue) => void)|undefined
}
export interface ControllableAndUncontrollableApi<TValue extends any> {
    // values:
    value              : TValue
    triggerValueChange : (newValue: TValue, options?: ScheduleTriggerEventOptions) => void
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
    const handleUncontrollableValueChange = useEvent((newValue: TValue): void => {
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
    const triggerValueChange              = useEvent((newValue: TValue, options?: ScheduleTriggerEventOptions): void => {
        // conditions:
        if (!handleValueChange) return; // no callback handler => nothing to trigger
        
        
        
        scheduleTriggerEvent(() => {
            // fire `on(Controllable|Uncontrollable)ValueChange` react event:
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
