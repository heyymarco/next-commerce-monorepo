// react:
import { 
// hooks:
useState, } from 'react';
// reusable-ui core:
import { 
// react helper hooks:
useEvent, useMergeEvents, } from '@reusable-ui/hooks'; // react helper hooks
// internals:
import { 
// hooks:
useScheduleTriggerEvent, } from './hooks.js';
export const useUncontrollable = (props) => {
    // props:
    const { 
    // values:
    defaultValue: defaultUncontrollableValue, onValueChange: onUncontrollableValueChange, } = props;
    // states:
    const [uncontrollableValue, setUncontrollableValue] = useState(defaultUncontrollableValue);
    const value = uncontrollableValue;
    // handlers:
    const handleUncontrollableValueChange = useEvent((newValue) => {
        // update value:
        setUncontrollableValue(newValue);
    });
    const handleValueChange = useMergeEvents(
    // preserves the original `onUncontrollableValueChange` from `props`:
    onUncontrollableValueChange, 
    // actions:
    handleUncontrollableValueChange);
    // stable callbacks:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    const triggerValueChange = useEvent((newValue, options) => {
        // conditions:
        if (!handleValueChange)
            return; // no callback handler => nothing to trigger
        // actions:
        scheduleTriggerEvent(() => {
            // fire `onUncontrollableValueChange` react event:
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
