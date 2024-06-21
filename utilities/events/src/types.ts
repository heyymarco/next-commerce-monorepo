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



export interface TriggerValueChangeEventOptions<out TChangeEvent extends unknown = unknown>
    extends
        // bases:
        ScheduleTriggerEventOptions
{
    event ?: TChangeEvent
}
export type TriggerValueChangeCallback<in TValue extends unknown, in TChangeEvent extends unknown = unknown> = (value: TValue, options?: TriggerValueChangeEventOptions<TChangeEvent>) => void
export type ValueChangeEventHandler<in TValue extends unknown, in TChangeEvent extends unknown = unknown> = (value: TValue, event: TChangeEvent|undefined) => void
