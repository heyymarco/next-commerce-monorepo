import { ScheduleTriggerEventOptions } from './hooks.js';
export interface UncontrollableProps<TValue extends unknown> {
    defaultValue: TValue;
    onValueChange: ((newValue: TValue) => void) | undefined;
}
export interface UncontrollableApi<TValue extends unknown> {
    value: TValue;
    triggerValueChange: (newValue: TValue, options?: ScheduleTriggerEventOptions) => void;
}
export declare const useUncontrollable: <TValue extends unknown>(props: UncontrollableProps<TValue>) => UncontrollableApi<TValue>;
