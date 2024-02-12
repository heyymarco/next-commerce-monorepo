// types:
export type TriggerAt =
    |'immediately'
    |'microtask'
    |'macrotask'
export interface TriggerValueChangeOptions {
    triggerAt ?: TriggerAt
}
