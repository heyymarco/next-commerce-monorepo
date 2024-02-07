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
    /**
     * The underlying original native event.  
     * Required.
     */
    nativeEvent       : TEvent
    
    /**
     * The event type.  
     * Optional: If omitted => internally use `nativeEvent.type`.
     */
    type             ?: string
    
    /**
     * The DOM reference whose event listener's callback is currently being invoked (the triggering element).  
     * Optional: If omitted => internally use `nativeEvent.currentTarget`.
     */
    currentTarget    ?: TElement
    /**
     * The DOM reference which event is dispatched (the affected element).  
     * Optional: If omitted => internally use `nativeEvent.target`.
     */
    target           ?: EventTarget
}
export const createSyntheticEvent      = <TElement extends Element, TEvent extends Event>(options: CreateSyntheticEventOptions<TElement, TEvent>): React.SyntheticEvent<TElement, TEvent> => {
    // options:
    const {
        // standards:
        nativeEvent,
        
        type          = nativeEvent.type,
        
        currentTarget = (nativeEvent.currentTarget as TElement|null)!,
        target        = nativeEvent.target!,
    ...restOptions} = options;
    
    
    
    // tests:
    const isDefaultPrevented : boolean = (
        (typeof(nativeEvent.defaultPrevented) === 'boolean')
        ? nativeEvent.defaultPrevented
        // @ts-ignore
        : (nativeEvent.returnValue === false)
    );
    
    
    
    // synthetic event:
    const syntheticEvent : React.SyntheticEvent<TElement, TEvent> = {
        // standards:
        ...restOptions,
        
        nativeEvent,
        
        type,
        
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

export interface CreateSyntheticUIEventOptions<TElement extends Element, TEvent extends UIEvent>
    extends
        // bases:
        CreateSyntheticEventOptions<TElement, TEvent>
{
}
export const createSyntheticUIEvent    = <TElement extends Element, TEvent extends UIEvent>(options: CreateSyntheticUIEventOptions<TElement, TEvent>): React.UIEvent<TElement, TEvent> => {
    const {
        // UIs:
        detail,
        view,
    } = options.nativeEvent;
    
    
    
    // synthetic UI event:
    return {
        // bases:
        ...createSyntheticEvent<TElement, TEvent>(options),
        
        
        
        // UIs:
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
