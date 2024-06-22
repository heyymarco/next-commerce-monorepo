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
    type TriggerValueChangeEventOptions,
    type TriggerValueChangeEventOptionsWithChangeEvent,
    type TriggerValueChangeCallback,
    type TriggerValueChangeCallbackWithChangeEvent,
    type ValueChangeEventHandler,
    type ValueChangeEventHandlerWithChangeEvent,
}                           from './types.js'
import {
    // hooks:
    useScheduleTriggerEvent,
}                           from './hooks.js'



export interface ControllableAndUncontrollableProps<TValue extends unknown> {
    // values:
    defaultValue       : TValue
    value              : TValue|undefined
    onValueChange      : ValueChangeEventHandler<TValue>|undefined
}
export interface ControllableAndUncontrollablePropsWithChangeEvent<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    defaultValue       : TValue
    value              : TValue|undefined
    onValueChange      : ValueChangeEventHandlerWithChangeEvent<TValue, TChangeEvent>|undefined
}

export interface ControllableAndUncontrollableApi<TValue extends unknown> {
    // values:
    value              : TValue
    triggerValueChange : TriggerValueChangeCallback<TValue>
}
export interface ControllableAndUncontrollableApiWithChangeEvent<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    value              : TValue
    triggerValueChange : TriggerValueChangeCallbackWithChangeEvent<TValue, TChangeEvent>
}

export function useControllableAndUncontrollable<TValue extends unknown>(props: ControllableAndUncontrollableProps<TValue>): ControllableAndUncontrollableApi<TValue>;
export function useControllableAndUncontrollable<TValue extends unknown, TChangeEvent extends unknown = unknown>(props: ControllableAndUncontrollablePropsWithChangeEvent<TValue, TChangeEvent>): ControllableAndUncontrollableApiWithChangeEvent<TValue, TChangeEvent>;

export function useControllableAndUncontrollable<TValue extends unknown, TChangeEvent extends unknown = unknown>(props: ControllableAndUncontrollableProps<TValue>|ControllableAndUncontrollablePropsWithChangeEvent<TValue, TChangeEvent>): ControllableAndUncontrollableApi<TValue>|ControllableAndUncontrollableApiWithChangeEvent<TValue, TChangeEvent> {
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
    const handleUncontrollableValueChange = useEvent<ValueChangeEventHandler<TValue>|ValueChangeEventHandlerWithChangeEvent<TValue, TChangeEvent>>((newValue: TValue) => {
        // update value if uncontrollable:
        if (!isControllableValue) setUncontrollableValue(newValue);
    });
    const handleValueChange               = useMergeEvents(
        // preserves the original `onControllableValueChange` from `props`:
        onControllableValueChange as any,
        
        
        
        // actions:
        handleUncontrollableValueChange as any,
    ) as (ValueChangeEventHandler<TValue> & ValueChangeEventHandlerWithChangeEvent<TValue, TChangeEvent>|undefined);
    
    
    
    // stable callbacks:
    const scheduleTriggerEvent            = useScheduleTriggerEvent();
    const triggerValueChange              = useEvent<TriggerValueChangeCallback<TValue>|TriggerValueChangeCallbackWithChangeEvent<TValue, TChangeEvent>>((newValue: TValue, options?: TriggerValueChangeEventOptions|TriggerValueChangeEventOptionsWithChangeEvent<TChangeEvent>) => {
        // conditions:
        if (!handleValueChange) return; // no callback handler => nothing to trigger
        
        
        
        // actions:
        scheduleTriggerEvent(() => {
            // fire `on(Controllable|Uncontrollable)ValueChange` react event:
            if (!!options && ('event' in options)) {
                handleValueChange(newValue, options?.event /* an optional event object passed from the options */);
            }
            else {
                handleValueChange(newValue);
            } // if
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
