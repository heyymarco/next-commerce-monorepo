import { ScheduleTriggerEventOptions } from './hooks.js';
export interface ControllableAndUncontrollableProps<TValue extends unknown> {
    defaultValue: TValue;
    value: TValue | undefined;
    onValueChange: ((newValue: TValue) => void) | undefined;
}
export interface ControllableAndUncontrollableApi<TValue extends unknown> {
    value: TValue;
    triggerValueChange: (newValue: TValue, options?: ScheduleTriggerEventOptions) => void;
}
export declare const useControllableAndUncontrollable: <TValue extends unknown>(props: ControllableAndUncontrollableProps<TValue>) => ControllableAndUncontrollableApi<TValue>;
