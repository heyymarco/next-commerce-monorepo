// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useMemo,
}                           from 'react'
import {
    createPortal,
}                           from 'react-dom'

// reusable-ui core:
import {
    // hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMountedFlag,
}                           from '@reusable-ui/hooks'               // react helper hooks

import {
    // capabilities:
    GlobalStackableProps,
    useGlobalStackable,
}                           from '@reusable-ui/global-stackable'    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context

import {
    // capabilities:
    usePointerCapturable,
}                           from '@reusable-ui/pointer-capturable'  // a capability of UI to capture the mouse/touch event inside & outside the UI itself

// heymarco:
import {
    // utilities:
    createSyntheticMouseEvent,
}                           from '@heymarco/events'
import {
    // data:
    DragNDropData,
    
    
    
    // events:
    DragMoveEvent,
    DragHandshakeEvent,
    DraggedEvent,
    DroppedEvent,
    
    
    
    // draggable sides:
    enterDroppableHook,
    AttachedDroppableHookResult,
    attachDroppableHook,
    leaveDroppableHook,
    
    getActiveDroppableHook,
    getActiveDroppableTarget,
}                           from '@heymarco/drag-n-drop'            // a shared interface for enabling drag and drop operations

// reusable-ui components:
import type {
    // react components:
    GenericProps,
}                           from '@reusable-ui/generic'             // a base component

// internals:
import {
    useDragOverlayStyleSheet,
}                           from './styles/loader.js'



// react components:
export interface DraggableProps<TElement extends Element = HTMLElement>
    extends
        // capabilities:
        GlobalStackableProps
{
    // data:
    dragData            : DragNDropData
    
    
    
    // refs:
    dragRef            ?: React.RefObject<TElement|null>|TElement|null // getter ref
    ignoreDropElements ?: (React.RefObject<Element|null>|Element|null|undefined)[]
    
    
    
    // states:
    enabled            ?: boolean
    
    
    
    // components:
    dragComponent      ?: React.ReactComponentElement<any, GenericProps<TElement>>|(() => React.ReactComponentElement<any, GenericProps<TElement>>)
    
    
    
    // handlers:
    onDragMove         ?: (event: DragMoveEvent<TElement>) => void
    onDragHandshake     : (event: DragHandshakeEvent<TElement>) => void|Promise<void>
    onDragged          ?: (event: DraggedEvent<TElement>) => void
}
export interface DraggableApi<TElement extends Element = HTMLElement> {
    // data:
    dropData         : DragNDropData|undefined
    
    
    
    // states:
    /**
     * undefined : no  dragging activity.  
     * null      : has dragging activity but outside all dropping targets.  
     * false     : has dragging activity on a dropping target but the source/target refuses to be dragged/dropped.  
     * true      : has dragging activity on a dropping target and the source/target wants   to be dragged/dropped.  
     */
    isDragging       : undefined|null|boolean
    
    
    
    // components:
    DragOverlay      : () => React.ReactPortal|null
    
    
    
    // handlers:
    handleMouseDown  : React.MouseEventHandler<TElement>
    handleTouchStart : React.TouchEventHandler<TElement>
}
export const useDraggable = <TElement extends Element = HTMLElement>(props: DraggableProps<TElement>): DraggableApi<TElement> => {
    // styles:
    const styleSheet = useDragOverlayStyleSheet();
    
    
    
    // props:
    const {
        // data:
        dragData,
        
        
        
        // refs:
        dragRef,
        ignoreDropElements,
        
        
        
        // states:
        enabled = true,
        
        
        
        // global stackable:
        viewport : _viewport, // remove
        
        
        
        // components:
        dragComponent,
        
        
        
        // handlers:
        onDragMove,
        onDragHandshake,
        onDragged,
    } = props;
    
    
    
    // states:
    const isMounted = useMountedFlag();
    let   [isDragging, setIsDragging] = useState<undefined|null|boolean>(undefined);
    let   [dropData  , setDropData  ] = useState<DragNDropData|undefined>(undefined);
    
    
    
    // handlers:
    const handleDragHandshake = useEvent(async (event: DragHandshakeEvent<TElement>): Promise<void> => {
        try {
            await onDragHandshake(event);
        }
        finally {
            const newDropData = event.dropData;
            if (!Object.is(dropData, newDropData)) setDropData(dropData = newDropData);
        } // try
    });
    
    
    
    // refs:
    const overlayRef               = useRef<HTMLDivElement|null>(null);
    const mergedIgnoreDropElements = useMemo<(React.RefObject<Element|null>|Element|null|undefined)[]>(() => [
        ...(ignoreDropElements ?? []),
        overlayRef,
        
        
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [...(ignoreDropElements ?? [])]);
    
    
    
    // capabilities:
    const {portalElm, ensureTopMost} = useGlobalStackable(props);
    const pointerCapturable          = usePointerCapturable<TElement>({
        enabled,
        onPointerCaptureStart() {
            enterDroppableHook(dragData); // has  dragging activity
        },
        onPointerCaptureEnd(event) {
            if (isDragging === true) { // if was a valid dragging => now is dragged/dropped
                const activeDroppableHook = getActiveDroppableHook();
                if (activeDroppableHook?.enabled) {
                    const dragElm = (dragRef && ('current' in dragRef)) ? dragRef.current : dragRef;
                    
                    const dropRef = activeDroppableHook.dropRef;
                    const dropElm = (dropRef && ('current' in dropRef)) ? dropRef.current : dropRef;
                    
                    const activeDroppableTarget = getActiveDroppableTarget();
                    
                    
                    
                    if (onDragged) {
                        onDragged({
                            // bases:
                            ...createSyntheticMouseEvent<TElement, MouseEvent>({
                                nativeEvent    : event,
                                
                                type           : 'dragged',
                                
                                currentTarget  : dragElm ?? undefined,               // point to <DragElm> itself
                                target         : activeDroppableTarget ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
                                relatedTarget  : dropElm ?? undefined,               // the opposite side <DropElm> as related/paired element
                            }),
                            
                            
                            
                            // data:
                            dropData           : activeDroppableHook.dropData,
                        } satisfies DraggedEvent<TElement>);
                    } // if
                    
                    const onDropped = activeDroppableHook.onDropped;
                    if (onDropped) {
                        onDropped({
                            // bases:
                            ...createSyntheticMouseEvent<Element, MouseEvent>({
                                nativeEvent    : event,
                                
                                type           : 'dropped',
                                
                                currentTarget  : dropElm ?? undefined,               // point to <DropElm> itself
                                target         : activeDroppableTarget ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
                                relatedTarget  : dragElm ?? undefined,               // the opposite side <DragElm> as related/paired element
                            }),
                            
                            
                            
                            // data:
                            dragData           : dragData,
                        } satisfies DroppedEvent<Element>);
                    } // if
                } // if
            } // if
            
            
            
            leaveDroppableHook();                                                // no  dropping activity
            if (isDragging !== undefined) setIsDragging(isDragging = undefined); // no  dragging activity
            if (dropData   !== undefined) setDropData(dropData     = undefined); // no  dragging activity
            prevFloatingPos.current = undefined;                                 // cleanup floating pos
        },
        onPointerCaptureCancel : () => {
            leaveDroppableHook();                                                // no  dropping activity
            if (isDragging !== undefined) setIsDragging(isDragging = undefined); // no  dragging activity
            if (dropData   !== undefined) setDropData(dropData     = undefined); // no  dragging activity
            prevFloatingPos.current = undefined;                                 // cleanup floating pos
        },
        async onPointerCaptureMove(event) {
            let attachedDroppableHookResult: AttachedDroppableHookResult|undefined = undefined;
            try {
                // update pointer pos:
                handleUpdateFloatingPos(event);
                
                
                
                // update drag & drop states:
                attachedDroppableHookResult = await attachDroppableHook(event, {
                    dragRef            : dragRef,
                    onDragHandshake    : handleDragHandshake,
                    ignoreDropElements : mergedIgnoreDropElements,
                });
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
                /*
                * undefined : NEVER HERE.  
                * null      : has dragging activity but outside all dropping targets.  
                * false     : has dragging activity on a dropping target but the source/target refuses to be dragged/dropped.  
                * true      : has dragging activity on a dropping target and the source/target wants   to be dragged/dropped.  
                */
                const response = attachedDroppableHookResult.response;
                if (isDragging !== response) setIsDragging(isDragging = response);
                if ((response === null) && (dropData !== undefined)) setDropData(dropData = undefined); // outside of dropping area
            }
            finally {
                if (onDragMove) {
                    const dragElm = (dragRef && ('current' in dragRef)) ? dragRef.current : dragRef;
                    onDragMove({
                        // bases:
                        ...createSyntheticMouseEvent<TElement, MouseEvent>({
                            nativeEvent    : event,
                            
                            type           : 'dragmove',
                            
                            currentTarget  : dragElm ?? undefined,                                     // point to <DragElm> itself
                            target         : attachedDroppableHookResult?.pointedElement ?? undefined, // point to <AnyElement> below the cursor, excepts <OverlayElm>
                            relatedTarget  : null,                                                     // no related/paired element
                        }),
                        
                        
                        
                        // data:
                        dropData           : attachedDroppableHookResult?.dropData,
                        response           : attachedDroppableHookResult?.response ?? undefined,
                    } satisfies DragMoveEvent<TElement>);
                } // if
            } // try
        },
    });
    
    
    
    // handlers:
    const handleMouseDown         = useEvent<React.MouseEventHandler<TElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault(); // now we handled the event
        
        
        
        pointerCapturable.handleMouseDown(event);
    });
    const handleTouchStart        = useEvent<React.TouchEventHandler<TElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        // try {
        //     event.preventDefault(); // now we handled the event
        // }
        // catch {
        //     if (process.env?.NODE_ENV === 'production') {
        //         console.log('`useDraggable::handleTouchStart` must be pointed to passive listener.')
        //     } // if
        // } // if
        
        
        
        pointerCapturable.handleTouchStart(event);
    });
    
    const prevFloatingPos         = useRef<Pick<MouseEvent, 'clientX'|'clientY'>|undefined>(undefined);
    const handleUpdateFloatingPos = useEvent((event?: MouseEvent): void => {
        // conditions:
        const recentPos = event ?? prevFloatingPos.current;
        if (!recentPos) return;
        
        
        
        // calculate & memorize floating pos:
        const {clientX, clientY} = recentPos;
        prevFloatingPos.current  = {clientX, clientY};
        
        
        
        // conditions:
        const overlayInlineStyle = overlayRef.current?.style;
        if (!overlayInlineStyle) return;
        
        
        
        // live update for first rerender of <DragOverlay>, vanilla way, without causing busy re-render:
        overlayInlineStyle.left = `${clientX}px`;
        overlayInlineStyle.top  = `${clientY}px`;
    });
    
    const handleSetOverlayRef     = useEvent((newRef: HTMLDivElement|null): void => {
        overlayRef.current = newRef;
        if (newRef) handleUpdateFloatingPos();
    });
    
    
    
    // effects:
    
    // make sure the <DragOverlay> is top_most (if there is multiple <Overlay>s shown at the same time):
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (isDragging    === undefined) return; // not in dragging activity => ignore
        if (dragComponent === undefined) return; // not having dragComponent => ignore
        
        
        
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
        DragOverlay : () => {
            // conditions:
            if (isDragging    === undefined) return null; // not in dragging activity => nothing to show
            if (dragComponent === undefined) return null; // not having dragComponent => nothing to show
            
            
            
            // jsx:
            if (!portalElm) return null; // server side -or- client side but not already hydrated => nothing to render
            return createPortal(
                <div
                    // refs:
                    ref={handleSetOverlayRef}
                    
                    
                    
                    // classes:
                    className={styleSheet.main}
                >
                    {(typeof(dragComponent) === 'function') ? dragComponent() : dragComponent}
                </div>
            , portalElm)
        },
        
        
        
        // handlers:
        handleMouseDown,
        handleTouchStart,
    };
};
