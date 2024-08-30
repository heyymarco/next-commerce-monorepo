// reusable-ui core:
import {
    // react helper hooks:
    useMountedFlag,
}                           from '@reusable-ui/hooks'           // react helper hooks

// internals:
import {
    type ScheduleTriggerEventFunction,
}                           from './types.js'



export const useScheduleTriggerEvent = (): ScheduleTriggerEventFunction => {
    // states:
    const isMounted = useMountedFlag();
    
    
    
    return (scheduledTriggerEventCallback, options) => {
        // conditions:
        if (!scheduledTriggerEventCallback) return; // no event_delegator_callback => nothing to trigger
        
        // do NOT check `isMounted.current` before running `setTimeout()`|`queueMicrotask()`, causes detected WRONG UNMOUNT by React's strict mode (double re-render)
        // if (!isMounted.current) return; // the component was unloaded before the scheduler is called => do nothing
        
        
        
        // options:
        const {
            triggerAt = 'immediately',
        } = options ?? {};
        
        
        
        switch (triggerAt) {
            case 'macrotask':
                setTimeout(() => {
                    // conditions:
                    if (!isMounted.current) return; // the component was unloaded before macrotask is executed => do nothing
                    
                    
                    
                    // fire the event_delegator_callback:
                    scheduledTriggerEventCallback();
                }, 0); // runs the event_delegator_callback *next after* current macrotask completed
                break;
            
            case 'microtask':
                queueMicrotask(() => {
                    // conditions:
                    if (!isMounted.current) return; // the component was unloaded before microtask is executed => do nothing
                    
                    
                    
                    // fire the event_delegator_callback:
                    scheduledTriggerEventCallback();
                }); // runs the event_delegator_callback *next after* current microtask completed
                break;
            
            default:
                // fire the event_delegator_callback:
                scheduledTriggerEventCallback();
                break;
        } // switch
    };
};
