// reusable-ui core:
import {
    // react helper hooks:
    useMountedFlag,
}                           from '@reusable-ui/hooks'           // react helper hooks



// types:
export type TriggerAt =
    |'immediately'
    |'microtask'
    |'macrotask'
export interface ScheduleTriggerEventOptions {
    triggerAt ?: TriggerAt
}



export type ScheduledTriggerEventCallback = () => void
export type ScheduleTriggerEventFunction  = (scheduledTriggerEventCallback: ScheduledTriggerEventCallback|null|undefined, options?: ScheduleTriggerEventOptions) => void
export const useScheduleTriggerEvent = (): ScheduleTriggerEventFunction => {
    // states:
    const isMounted = useMountedFlag();
    
    
    
    return (scheduledTriggerEventCallback, options) => {
        // conditions:
        if (!scheduledTriggerEventCallback) return; // no event_delegator_callback => nothing to trigger
        
        
        
        // options:
        const {
            triggerAt = 'macrotask',
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
