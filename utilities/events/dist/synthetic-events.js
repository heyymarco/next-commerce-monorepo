function functionThatReturnsTrue() {
    return true;
}
function functionThatReturnsFalse() {
    return false;
}
function functionThatNoop() {
    /* noop */
}
export const createSyntheticEvent = (options) => {
    // options:
    const { 
    // standards:
    nativeEvent, type = nativeEvent.type, currentTarget = nativeEvent.currentTarget, target = nativeEvent.target, ...restOptions } = options;
    // tests:
    const isDefaultPrevented = ((typeof (nativeEvent.defaultPrevented) === 'boolean')
        ? nativeEvent.defaultPrevented
        // @ts-ignore
        : (nativeEvent.returnValue === false));
    // synthetic event:
    const syntheticEvent = {
        // standards:
        ...restOptions,
        nativeEvent,
        type,
        currentTarget,
        target,
        // event phases:
        eventPhase: nativeEvent.eventPhase,
        bubbles: nativeEvent.bubbles,
        cancelable: nativeEvent.cancelable,
        // moments:
        isTrusted: nativeEvent.isTrusted,
        timeStamp: nativeEvent.timeStamp,
        // behaviors:
        defaultPrevented: isDefaultPrevented,
        isDefaultPrevented: isDefaultPrevented ? functionThatReturnsTrue : functionThatReturnsFalse,
        preventDefault: () => {
            // actions:
            if (nativeEvent.preventDefault) {
                nativeEvent.preventDefault();
            }
            // @ts-ignore
            else if (typeof (nativeEvent.returnValue) !== 'unknown') {
                // @ts-ignore
                nativeEvent.returnValue = false;
            } // if
            // mutates:
            syntheticEvent.defaultPrevented = true;
            syntheticEvent.isDefaultPrevented = functionThatReturnsTrue;
            syntheticEvent.preventDefault = functionThatNoop;
        },
        isPropagationStopped: functionThatReturnsFalse,
        stopPropagation: () => {
            // actions:
            if (nativeEvent.stopPropagation) {
                nativeEvent.stopPropagation();
            }
            // @ts-ignore
            else if (typeof (nativeEvent.cancelBubble) !== 'unknown') {
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
            syntheticEvent.stopPropagation = functionThatNoop;
        },
        persist: functionThatNoop,
    };
    return syntheticEvent;
};
export const createSyntheticUIEvent = (options) => {
    const { 
    // UIs:
    detail, view, } = options.nativeEvent;
    // synthetic UI event:
    return {
        // bases:
        ...createSyntheticEvent(options),
        // UIs:
        detail,
        view: view,
    };
};
export const createSyntheticMouseEvent = (options) => {
    const { 
    // standards:
    relatedTarget: nativeRelatedTarget, 
    // pointers:
    clientX, clientY, screenX, screenY, pageX, pageY, movementX, movementY, 
    // buttons:
    button, buttons, ctrlKey, shiftKey, altKey, metaKey, getModifierState, } = options.nativeEvent;
    // options:
    const { 
    // standards:
    relatedTarget = nativeRelatedTarget, ...restOptions } = options;
    // synthetic mouse event:
    return {
        // bases:
        ...createSyntheticUIEvent(restOptions),
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
    };
};
