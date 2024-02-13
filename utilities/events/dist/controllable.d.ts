import { ScheduleTriggerEventOptions } from './hooks.js';
export interface ControllableProps<TValue extends unknown> {
    value: TValue;
    onValueChange: ((newValue: TValue) => void) | undefined;
}
export interface ControllableApi<TValue extends unknown> {
    value: TValue;
    triggerValueChange: (newValue: TValue, options?: ScheduleTriggerEventOptions) => void;
}
export declare const useControllable: <TValue extends unknown>(props: ControllableProps<TValue>) => ControllableApi<TValue>;
