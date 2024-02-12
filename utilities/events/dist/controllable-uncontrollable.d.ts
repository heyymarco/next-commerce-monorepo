import { ScheduleTriggerEventOptions } from './hooks.js';
export interface ControllableAndUncontrollableProps<TValue extends any> {
    defaultValue: TValue;
    value: TValue | undefined;
    onValueChange: ((newValue: TValue) => void) | undefined;
}
export interface ControllableAndUncontrollableApi<TValue extends any> {
    value: TValue;
    triggerValueChange: (newValue: TValue, options?: ScheduleTriggerEventOptions) => void;
}
export declare const useControllableAndUncontrollable: <TValue extends unknown>(props: ControllableAndUncontrollableProps<TValue>) => ControllableAndUncontrollableApi<TValue>;
