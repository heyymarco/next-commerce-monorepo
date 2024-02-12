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
export const useControllableAndUncontrollable = (props) => {
    // props:
    const { 
    // values:
    defaultValue: defaultUncontrollableValue, value: controllableValue, onValueChange: onControllableValueChange, } = props;
    // states:
    const [uncontrollableValue, setUncontrollableValue] = useState(defaultUncontrollableValue);
    const isControllableValue = (controllableValue !== undefined);
    const value = isControllableValue ? controllableValue : uncontrollableValue;
    // handlers:
    const handleUncontrollableValueChange = useEvent((newValue) => {
        // update value if uncontrollable:
        if (!isControllableValue)
            setUncontrollableValue(newValue);
    });
    const handleValueChange = useMergeEvents(
    // preserves the original `onControllableValueChange` from `props`:
    onControllableValueChange, 
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
            // fire `on(Controllable|Uncontrollable)ValueChange` react event:
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
