// reusable-ui core:
import { 
// react helper hooks:
useEvent, } from '@reusable-ui/hooks'; // react helper hooks
// internals:
import { 
// hooks:
useScheduleTriggerEvent, } from './hooks.js';
export const useControllable = (props) => {
    // props:
    const { 
    // values:
    value: controllableValue, onValueChange: onControllableValueChange, } = props;
    // states:
    const value = controllableValue;
    // handlers:
    const handleValueChange = onControllableValueChange;
    // stable callbacks:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    const triggerValueChange = useEvent((newValue, options) => {
        // conditions:
        if (!handleValueChange)
            return; // no callback handler => nothing to trigger
        // actions:
        scheduleTriggerEvent(() => {
            // fire `onControllableValueChange` react event:
            handleValueChange(newValue);
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
