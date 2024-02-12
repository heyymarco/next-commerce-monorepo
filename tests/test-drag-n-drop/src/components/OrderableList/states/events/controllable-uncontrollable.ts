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
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// types:
export type TriggerAt =
    |'immediately'
    |'microtask'
    |'macrotask'
export interface TriggerValueChangeOptions {
    triggerAt ?: TriggerAt
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
    const isMounted                       = useMountedFlag();
    const triggerValueChange              = useEvent((newValue: TValue, options?: TriggerValueChangeOptions): void => {
        // conditions:
        if (!handleValueChange) return; // no callback handler => nothing to trigger
        
        
        
        // options:
        const {
            triggerAt = 'macrotask',
        } = options ?? {};
        
        
        
        switch (triggerAt) {
            case 'macrotask':
                setTimeout(() => {
                    // conditions:
                    if (!isMounted.current) return;
                    
                    
                    
                    // fire `on(Controllable|Uncontrollable)ValueChange` react event:
                    handleValueChange(newValue);
                }, 0); // runs the callback *next after* current macrotask completed
                break;
            
            case 'microtask':
                queueMicrotask(() => {
                    // conditions:
                    if (!isMounted.current) return;
                    
                    
                    
                    // fire `on(Controllable|Uncontrollable)ValueChange` react event:
                    handleValueChange(newValue);
                }); // runs the callback *next after* current microtask completed
                break;
            
            default:
                // fire `on(Controllable|Uncontrollable)ValueChange` react event:
                handleValueChange(newValue);
                break;
        } // switch
    });
    
    
    
    // api:
    return {
        // values:
        value,
        
        
        
        // stable callbacks:
        triggerValueChange,
    };
};
