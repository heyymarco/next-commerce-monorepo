// types:

export type TriggerAt =
    |'immediately'
    |'microtask'
    |'macrotask'
export interface ScheduleTriggerEventOptions {
    triggerAt ?: TriggerAt
}

export type ScheduledTriggerEventCallback = () => void
export type ScheduleTriggerEventFunction  = (scheduledTriggerEventCallback: ScheduledTriggerEventCallback|null|undefined, options?: ScheduleTriggerEventOptions) => void



export interface TriggerValueChangeEventOptions
    extends
        // bases:
        ScheduleTriggerEventOptions
{
}
export interface TriggerValueChangeEventOptionsWithChangeEvent<out TChangeEvent extends unknown = unknown>
    extends
        // bases:
        TriggerValueChangeEventOptions
{
    event : TChangeEvent // a required event object
}

export type TriggerValueChangeCallback<in TValue extends unknown> = (value: TValue, options?: TriggerValueChangeEventOptions) => void
export type TriggerValueChangeCallbackWithChangeEvent<in TValue extends unknown, in TChangeEvent extends unknown = unknown> = (value: TValue, options: TriggerValueChangeEventOptionsWithChangeEvent<TChangeEvent> /* a required options for passing event object */) => void

export type ValueChangeEventHandler<in TValue extends unknown> = (value: TValue) => void
export type ValueChangeEventHandlerWithChangeEvent<in TValue extends unknown, in TChangeEvent extends unknown = unknown> = (value: TValue, event: TChangeEvent /* a required event object passed from the options */) => void
