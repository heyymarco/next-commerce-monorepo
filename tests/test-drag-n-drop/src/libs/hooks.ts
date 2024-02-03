const deprecatedPersist = () => {};

export const createSyntheticEvent = <TElement extends Element, TEvent extends Event>(event: TEvent): React.SyntheticEvent<TElement, TEvent> => {
    // states:
    let stateIsDefaultPrevented   = false;
    let stateIsPropagationStopped = false;
    
    
    
    // callbacks:
    const preventDefault       = () => {
        stateIsDefaultPrevented = true;
        event.preventDefault();
    };
    const isDefaultPrevented   = () => {
        return stateIsDefaultPrevented;
    };
    
    const stopPropagation      = () => {
        stateIsPropagationStopped = true;
        event.stopPropagation();
    };
    const isPropagationStopped = () => {
        return stateIsPropagationStopped;
    };
    
    
    
    // synthetic event:
    return {
        nativeEvent      : event,
        type             : event.type,
        timeStamp        : event.timeStamp,
        
        currentTarget    : event.currentTarget as EventTarget & TElement,
        target           : event.target        as EventTarget,
        
        bubbles          : event.bubbles,
        cancelable       : event.cancelable,
        defaultPrevented : event.defaultPrevented,
        eventPhase       : event.eventPhase,
        isTrusted        : event.isTrusted,
        
        preventDefault,
        isDefaultPrevented,
        
        stopPropagation,
        isPropagationStopped,
        
        persist          : deprecatedPersist,
    };
}