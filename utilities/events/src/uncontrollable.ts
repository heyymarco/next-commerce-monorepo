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



export interface UncontrollableProps<TValue extends unknown> {
    // values:
    defaultValue       : TValue
    onValueChange      : ValueChangeEventHandler<TValue>|undefined
}
export interface UncontrollablePropsWithChangeEvent<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    defaultValue       : TValue
    onValueChange      : ValueChangeEventHandlerWithChangeEvent<TValue, TChangeEvent>|undefined
}

export interface UncontrollableApi<TValue extends unknown> {
    // values:
    value              : TValue
    triggerValueChange : TriggerValueChangeCallback<TValue>
}
export interface UncontrollableApiWithChangeEvent<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    value              : TValue
    triggerValueChange : TriggerValueChangeCallbackWithChangeEvent<TValue, TChangeEvent>
}

export function useUncontrollable<TValue extends unknown>(props: UncontrollableProps<TValue>): UncontrollableApi<TValue>;
export function useUncontrollable<TValue extends unknown, TChangeEvent extends unknown = unknown>(props: UncontrollablePropsWithChangeEvent<TValue, TChangeEvent>): UncontrollableApiWithChangeEvent<TValue, TChangeEvent>;

export function useUncontrollable<TValue extends unknown, TChangeEvent extends unknown = unknown>(props: UncontrollableProps<TValue>|UncontrollablePropsWithChangeEvent<TValue, TChangeEvent>): UncontrollableApi<TValue>|UncontrollableApiWithChangeEvent<TValue, TChangeEvent> {
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
    const handleUncontrollableValueChange = useEvent<ValueChangeEventHandler<TValue>|ValueChangeEventHandlerWithChangeEvent<TValue, TChangeEvent>>((newValue: TValue) => {
        // update value:
        setUncontrollableValue(newValue);
    });
    const handleValueChange               = useMergeEvents(
        // preserves the original `onUncontrollableValueChange` from `props`:
        onUncontrollableValueChange as any,
        
        
        
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
            // fire `onUncontrollableValueChange` react event:
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
