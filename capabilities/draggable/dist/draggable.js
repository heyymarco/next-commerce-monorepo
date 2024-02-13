// react:
import { 
// react:
default as React, 
// hooks:
useState, useRef, useMemo, } from 'react';
import { createPortal, } from 'react-dom';
// reusable-ui core:
import { 
// hooks:
useIsomorphicLayoutEffect, useEvent, useMountedFlag, } from '@reusable-ui/hooks'; // react helper hooks
import { useGlobalStackable, } from '@reusable-ui/global-stackable'; // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context
import { 
// capabilities:
usePointerCapturable, } from '@reusable-ui/pointer-capturable'; // a capability of UI to capture the mouse/touch event inside & outside the UI itself
// heymarco:
import { 
// utilities:
createSyntheticMouseEvent, } from '@heymarco/events';
import { 
// draggable sides:
enterDroppableHook, attachDroppableHook, leaveDroppableHook, getActiveDroppableHook, getActiveDroppableTarget, } from '@heymarco/drag-n-drop'; // a shared interface for enabling drag and drop operations
// internals:
import { useDragOverlayStyleSheet, } from './styles/loader.js';
export const useDraggable = (props) => {
    // styles:
    const styleSheet = useDragOverlayStyleSheet();
    // props:
    const { 
    // data:
    dragData, 
    // refs:
    dragRef, ignoreDropElements, 
    // states:
    enabled = true, 
    // global stackable:
    viewport: _viewport, // remove
    // components:
    dragComponent, 
    // handlers:
    onDragMove, onDragHandshake, onDragged, } = props;
    // states:
    const isMounted = useMountedFlag();
    let [isDragging, setIsDragging] = useState(undefined);
    let [dropData, setDropData] = useState(undefined);
    // handlers:
    const handleDragHandshake = useEvent(async (event) => {
        try {
            await onDragHandshake(event);
        }
        finally {
            const newDropData = event.dropData;
            if (!Object.is(dropData, newDropData))
                setDropData(dropData = newDropData);
        } // try
    });
    // refs:
    const overlayRef = useRef(null);
    const mergedIgnoreDropElements = useMemo(() => [
        ...(ignoreDropElements ?? []),
        overlayRef,
    ], [ignoreDropElements, overlayRef]);
    // capabilities:
    const { portalElm, ensureTopMost } = useGlobalStackable(props);
    const pointerCapturable = usePointerCapturable({
        enabled,
        onPointerCaptureStart() {
            enterDroppableHook(dragData); // has  dragging activity
        },
        onPointerCaptureEnd(event) {
            if (isDragging === true) { // if was a valid dragging => now is dragged/dropped
                const activeDroppableHook = getActiveDroppableHook();
                if (activeDroppableHook?.enabled) {
                    const dragElm = (dragRef instanceof Element) ? dragRef : dragRef?.current;
                    const dropRef = activeDroppableHook.dropRef;
                    const dropElm = (dropRef instanceof Element) ? dropRef : dropRef?.current;
                    const activeDroppableTarget = getActiveDroppableTarget();
                    if (onDragged) {
                        onDragged({
                            // bases:
                            ...createSyntheticMouseEvent({
                                nativeEvent: event,
                                type: 'dragged',
                                currentTarget: dragElm ?? undefined, // point to <DragElm> itself
                                target: activeDroppableTarget ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
                                relatedTarget: dropElm ?? undefined, // the opposite side <DropElm> as related/paired element
                            }),
                            // data:
                            dropData: activeDroppableHook.dropData,
                        });
                    } // if
                    const onDropped = activeDroppableHook.onDropped;
                    if (onDropped) {
                        onDropped({
                            // bases:
                            ...createSyntheticMouseEvent({
                                nativeEvent: event,
                                type: 'dropped',
                                currentTarget: dropElm ?? undefined, // point to <DropElm> itself
                                target: activeDroppableTarget ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
                                relatedTarget: dragElm ?? undefined, // the opposite side <DragElm> as related/paired element
                            }),
                            // data:
                            dragData: dragData,
                        });
                    } // if
                } // if
            } // if
            leaveDroppableHook(); // no  dropping activity
            if (isDragging !== undefined)
                setIsDragging(isDragging = undefined); // no  dragging activity
            if (dropData !== undefined)
                setDropData(dropData = undefined); // no  dragging activity
            prevFloatingPos.current = undefined; // cleanup floating pos
        },
        onPointerCaptureCancel: () => {
            leaveDroppableHook(); // no  dropping activity
            if (isDragging !== undefined)
                setIsDragging(isDragging = undefined); // no  dragging activity
            if (dropData !== undefined)
                setDropData(dropData = undefined); // no  dragging activity
            prevFloatingPos.current = undefined; // cleanup floating pos
        },
        async onPointerCaptureMove(event) {
            let attachedDroppableHookResult = undefined;
            try {
                // update pointer pos:
                handleUpdateFloatingPos(event);
                // update drag & drop states:
                attachedDroppableHookResult = await attachDroppableHook(event, {
                    dragRef: dragRef,
                    onDragHandshake: handleDragHandshake,
                    ignoreDropElements: mergedIgnoreDropElements,
                });
                if (!isMounted.current)
                    return; // the component was unloaded before awaiting returned => do nothing
                /*
                * undefined : NEVER HERE.
                * null      : has dragging activity but outside all dropping targets.
                * false     : has dragging activity on a dropping target but the source/target refuses to be dragged/dropped.
                * true      : has dragging activity on a dropping target and the source/target wants   to be dragged/dropped.
                */
                const response = attachedDroppableHookResult.response;
                if (isDragging !== response)
                    setIsDragging(isDragging = response);
                if ((response === null) && (dropData !== undefined))
                    setDropData(dropData = undefined); // outside of dropping area
            }
            finally {
                if (onDragMove) {
                    const dragElm = (dragRef instanceof Element) ? dragRef : dragRef?.current;
                    onDragMove({
                        // bases:
                        ...createSyntheticMouseEvent({
                            nativeEvent: event,
                            type: 'dragmove',
                            currentTarget: dragElm ?? undefined, // point to <DragElm> itself
                            target: attachedDroppableHookResult?.pointedElement ?? undefined, // point to <AnyElement> below the cursor, excepts <OverlayElm>
                            relatedTarget: null, // no related/paired element
                        }),
                        // data:
                        dropData: attachedDroppableHookResult?.dropData,
                        response: attachedDroppableHookResult?.response ?? undefined,
                    });
                } // if
            } // try
        },
    });
    // handlers:
    const handleMouseDown = useEvent((event) => {
        // conditions:
        if (event.defaultPrevented)
            return; // already handled => ignore
        event.preventDefault(); // now we handled the event
        pointerCapturable.handleMouseDown(event);
    });
    const handleTouchStart = useEvent((event) => {
        // conditions:
        if (event.defaultPrevented)
            return; // already handled => ignore
        event.preventDefault(); // now we handled the event
        pointerCapturable.handleTouchStart(event);
    });
    const prevFloatingPos = useRef(undefined);
    const handleUpdateFloatingPos = useEvent((event) => {
        // conditions:
        const recentPos = event ?? prevFloatingPos.current;
        if (!recentPos)
            return;
        // calculate & memorize floating pos:
        const { clientX, clientY } = recentPos;
        prevFloatingPos.current = { clientX, clientY };
        // conditions:
        const overlayInlineStyle = overlayRef.current?.style;
        if (!overlayInlineStyle)
            return;
        // live update for first rerender of <DragOverlay>, vanilla way, without causing busy re-render:
        overlayInlineStyle.left = `${clientX}px`;
        overlayInlineStyle.top = `${clientY}px`;
    });
    const handleSetOverlayRef = useEvent((newRef) => {
        overlayRef.current = newRef;
        if (newRef)
            handleUpdateFloatingPos();
    });
    // effects:
    // make sure the <DragOverlay> is top_most (if there is multiple <Overlay>s shown at the same time):
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (isDragging === undefined)
            return; // not in dragging activity => ignore
        if (dragComponent === undefined)
            return; // not having dragComponent => ignore
        // actions:
        ensureTopMost();
    }, [isDragging, dragComponent]);
    // api:
    return {
        // data:
        dropData,
        // states:
        isDragging,
        // components:
        DragOverlay: () => {
            // conditions:
            if (isDragging === undefined)
                return null; // not in dragging activity => nothing to show
            if (dragComponent === undefined)
                return null; // not having dragComponent => nothing to show
            // jsx:
            if (!portalElm)
                return null; // server side -or- client side but not already hydrated => nothing to render
            return createPortal(React.createElement("div", { 
                // refs:
                ref: handleSetOverlayRef, 
                // classes:
                className: styleSheet.main }, (typeof (dragComponent) === 'function') ? dragComponent() : dragComponent), portalElm);
        },
        // handlers:
        handleMouseDown,
        handleTouchStart,
    };
};
