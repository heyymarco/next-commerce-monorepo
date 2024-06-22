// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
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



export interface ControllableProps<TValue extends unknown> {
    // values:
    value              : TValue
    onValueChange      : ValueChangeEventHandler<TValue>|undefined
}
export interface ControllablePropsWithChangeEvent<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    value              : TValue
    onValueChange      : ValueChangeEventHandlerWithChangeEvent<TValue, TChangeEvent>|undefined
}

export interface ControllableApi<TValue extends unknown> {
    // values:
    value              : TValue
    triggerValueChange : TriggerValueChangeCallback<TValue>
}
export interface ControllableApiWithChangeEvent<TValue extends unknown, in TChangeEvent extends unknown = unknown> {
    // values:
    value              : TValue
    triggerValueChange : TriggerValueChangeCallbackWithChangeEvent<TValue, TChangeEvent>
}

export function useControllable<TValue extends unknown>(props: ControllableProps<TValue>): ControllableApi<TValue>;
export function useControllable<TValue extends unknown, TChangeEvent extends unknown = unknown>(props: ControllablePropsWithChangeEvent<TValue, TChangeEvent>): ControllableApiWithChangeEvent<TValue, TChangeEvent>;

export function useControllable<TValue extends unknown, TChangeEvent extends unknown = unknown>(props: ControllableProps<TValue>|ControllablePropsWithChangeEvent<TValue, TChangeEvent>): ControllableApi<TValue>|ControllableApiWithChangeEvent<TValue, TChangeEvent> {
    // props:
    const {
        // values:
        value         : controllableValue,
        onValueChange : onControllableValueChange,
    } = props;
    
    
    
    // states:
    const value = controllableValue;
    
    
    
    // handlers:
    const handleValueChange               = onControllableValueChange  as (ValueChangeEventHandler<TValue> & ValueChangeEventHandlerWithChangeEvent<TValue, TChangeEvent>|undefined);
    
    
    
    // stable callbacks:
    const scheduleTriggerEvent            = useScheduleTriggerEvent();
    const triggerValueChange              = useEvent<TriggerValueChangeCallback<TValue>|TriggerValueChangeCallbackWithChangeEvent<TValue, TChangeEvent>>((newValue: TValue, options?: TriggerValueChangeEventOptions|TriggerValueChangeEventOptionsWithChangeEvent<TChangeEvent>) => {
        // conditions:
        if (!handleValueChange) return; // no callback handler => nothing to trigger
        
        
        
        // actions:
        scheduleTriggerEvent(() => {
            // fire `onControllableValueChange` react event:
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
