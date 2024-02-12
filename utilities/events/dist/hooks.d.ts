export type TriggerAt = 'immediately' | 'microtask' | 'macrotask';
export interface ScheduleTriggerEventOptions {
    triggerAt?: TriggerAt;
}
export type ScheduledTriggerEventCallback = () => void;
export type ScheduleTriggerEventFunction = (scheduledTriggerEventCallback: ScheduledTriggerEventCallback | null | undefined, options?: ScheduleTriggerEventOptions) => void;
export declare const useScheduleTriggerEvent: () => ScheduleTriggerEventFunction;
