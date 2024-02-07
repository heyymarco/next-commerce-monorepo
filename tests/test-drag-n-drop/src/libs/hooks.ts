function functionThatReturnsTrue() {
    return true;
}
function functionThatReturnsFalse() {
    return false;
}
function functionThatNoop() {
    /* noop */
}



export interface CreateSyntheticEventOptions<TElement extends Element, TEvent extends Event> {
    type              : string
    
    currentTarget    ?: TElement
    target           ?: EventTarget
    
    nativeEvent       : TEvent
}
export const createSyntheticEvent      = <TElement extends Element, TEvent extends Event>(options: CreateSyntheticEventOptions<TElement, TEvent>): React.SyntheticEvent<TElement, TEvent> => {
    // tests:
    const nativeEvent = options.nativeEvent;
    const isDefaultPrevented : boolean = (
        (nativeEvent.defaultPrevented != null)
        ? nativeEvent.defaultPrevented
        // @ts-ignore
        : (nativeEvent.returnValue === false)
    );
    
    
    
    // synthetic event:
    const {
        // standards:
        currentTarget = (nativeEvent.currentTarget as TElement|null)!,
        target        = nativeEvent.target!,
    } = options;
    const syntheticEvent : React.SyntheticEvent<TElement, TEvent> = {
        // standards:
        ...options,
        currentTarget,
        target,
        
        
        
        // event phases:
        eventPhase           : nativeEvent.eventPhase,
        bubbles              : nativeEvent.bubbles,
        cancelable           : nativeEvent.cancelable,
        
        
        
        // moments:
        isTrusted            : nativeEvent.isTrusted,
        timeStamp            : nativeEvent.timeStamp,
        
        
        
        // behaviors:
        defaultPrevented     : isDefaultPrevented,
        isDefaultPrevented   : isDefaultPrevented ? functionThatReturnsTrue : functionThatReturnsFalse,
        preventDefault       : () => {
            // actions:
            if (nativeEvent.preventDefault) {
                nativeEvent.preventDefault();
            }
            // @ts-ignore
            else if (typeof(nativeEvent.returnValue) !== 'unknown') {
                // @ts-ignore
                nativeEvent.returnValue = false;
            } // if
            
            
            
            // mutates:
            syntheticEvent.defaultPrevented     = true;
            syntheticEvent.isDefaultPrevented   = functionThatReturnsTrue;
            syntheticEvent.preventDefault       = functionThatNoop;
        },
        
        isPropagationStopped : functionThatReturnsFalse,
        stopPropagation      : () => {
            // actions:
            if (nativeEvent.stopPropagation) {
                nativeEvent.stopPropagation();
            }
            // @ts-ignore
            else if (typeof(nativeEvent.cancelBubble) !== 'unknown') {
                // The ChangeEventPlugin registers a "propertychange" event for
                // IE. This event does not support bubbling or cancelling, and
                // any references to cancelBubble throw "Member not found".  A
                // typeof check of "unknown" circumvents this issue (and is also
                // IE specific).
                
                // @ts-ignore
                nativeEvent.cancelBubble = true;
            } // if
            
            
            
            // mutates:
            syntheticEvent.isPropagationStopped = functionThatReturnsTrue;
            syntheticEvent.stopPropagation      = functionThatNoop;
        },
        
        persist              : functionThatNoop,
    };
    return syntheticEvent;
};

export interface CreateSyntheticUIEventOptions<TElement extends Element, TEvent extends UIEvent> {
    type              : string
    
    currentTarget    ?: TElement
    target           ?: EventTarget
    
    nativeEvent       : TEvent
}
export const createSyntheticUIEvent    = <TElement extends Element, TEvent extends UIEvent>(options: CreateSyntheticUIEventOptions<TElement, TEvent>): React.UIEvent<TElement, TEvent> => {
    const {
        // uis:
        detail,
        view,
    } = options.nativeEvent;
    
    
    
    // synthetic ui event:
    return {
        // bases:
        ...createSyntheticEvent<TElement, TEvent>(options),
        
        
        
        // uis:
        detail,
        view : view as unknown as React.AbstractView,
    } satisfies React.UIEvent<TElement, TEvent>;
};

export interface CreateSyntheticMouseEventOptions<TElement extends Element, TEvent extends MouseEvent> {
    type              : string,
    
    currentTarget    ?: TElement,
    target           ?: EventTarget,
    
    nativeEvent       : TEvent,
}
export const createSyntheticMouseEvent = <TElement extends Element, TEvent extends MouseEvent>(options: CreateSyntheticMouseEventOptions<TElement, TEvent>): React.MouseEvent<TElement, TEvent> => {
    const {
        // standards:
        relatedTarget,
        
        
        
        // pointers:
        clientX,
        clientY,
        screenX,
        screenY,
        pageX,
        pageY,
        movementX,
        movementY,
        
        
        
        // buttons:
        button,
        buttons,
        ctrlKey,
        shiftKey,
        altKey,
        metaKey,
        getModifierState,
    } = options.nativeEvent;
    
    
    
    // synthetic mouse event:
    return {
        // bases:
        ...createSyntheticUIEvent<TElement, TEvent>(options),
        
        
        
        // standards:
        relatedTarget,
        
        
        
        // pointers:
        clientX,
        clientY,
        screenX,
        screenY,
        pageX,
        pageY,
        movementX,
        movementY,
        
        
        
        // buttons:
        button,
        buttons,
        ctrlKey,
        shiftKey,
        altKey,
        metaKey,
        getModifierState,
    } satisfies React.MouseEvent<TElement, TEvent>;
};



/*
USELESS:
_reactName
_targetInst


TESTS:
    isDefaultPrevented
    defaultPrevented
    isPropagationStopped


STANDARD:
    type
    currentTarget
    target
    nativeEvent
                                    relatedTarget



clientX
clientY
screenX
screenY
pageX
pageY
movementX
movementY

button
buttons
ctrlKey
shiftKey
altKey
metaKey
getModifierState

    isTrusted
    timeStamp

    eventPhase
    bubbles
    cancelable

                                detail
                                view
*/
