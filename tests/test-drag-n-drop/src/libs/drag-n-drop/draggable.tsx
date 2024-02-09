// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
}                           from 'react'
import {
    createPortal,
}                           from 'react-dom'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMountedFlag,
    
    
    
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    GlobalStackableProps,
    useGlobalStackable,
    
    
    
    // a capability of UI to capture the mouse/touch event inside & outside the UI itself:
    usePointerCapturable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // react components:
    GenericProps,
}                           from '@reusable-ui/generic'         // a base component

// internals:
import {
    useDragOverlayStyleSheet,
}                           from './styles/loader'
import type {
    // data:
    DragNDropData,
    
    
    
    // events:
    DragMoveEvent,
    DragHandshakeEvent,
    DraggedEvent,
    DroppedEvent,
}                           from './types'
import {
    AttachedDroppableHookResult,
    enterDroppableHook,
    attachDroppableHook,
    leaveDroppableHook,
    
    getActiveDroppableHook,
    getActiveDroppableTarget,
}                           from './drag-n-drop-interface'

// utilities:
import {
    createSyntheticMouseEvent,
}                           from '@/libs/hooks'



// types:
export type PointerPositionRef = React.RefObject<{ clientX: number, clientY: number }>



// react components:
export interface DraggableProps<TElement extends Element = HTMLElement>
    extends
        // capabilities:
        GlobalStackableProps
{
    // data:
    dragData         : DragNDropData
    
    
    
    // refs:
    dragRef         ?: React.RefObject<TElement>|TElement|null // getter ref
    
    
    
    // states:
    enabled         ?: boolean
    
    
    
    // components:
    dragComponent   ?: React.ReactComponentElement<any, GenericProps<TElement>>|(() => React.ReactComponentElement<any, GenericProps<TElement>>)
    
    
    
    // handlers:
    onDragMove      ?: (event: DragMoveEvent<TElement>) => void
    onDragHandshake  : (event: DragHandshakeEvent<TElement>) => void|Promise<void>
    onDragged       ?: (event: DraggedEvent<TElement>) => void
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
    
    const overlayRef                  = useRef<HTMLDivElement|null>(null);
    
    
    
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
                    const activeDroppableTarget = getActiveDroppableTarget();
                    
                    if (onDragged) {
                        const dragElm = (dragRef instanceof Element) ? dragRef : dragRef?.current;
                        onDragged({
                            // bases:
                            ...createSyntheticMouseEvent<TElement, MouseEvent>({
                                nativeEvent    : event,
                                
                                type           : 'dragged',
                                
                                currentTarget  : dragElm ?? undefined,               // point to <DragElm> itself
                                target         : activeDroppableTarget ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
                            }),
                            
                            
                            
                            // data:
                            dropData           : activeDroppableHook.dropData,
                        } satisfies DraggedEvent<TElement>);
                    } // if
                    
                    const onDropped = activeDroppableHook.onDropped;
                    if (onDropped) {
                        const dropRef = activeDroppableHook.dropRef;
                        const dropElm = (dropRef instanceof Element) ? dropRef : dropRef?.current;
                        onDropped({
                            // bases:
                            ...createSyntheticMouseEvent<Element, MouseEvent>({
                                nativeEvent    : event,
                                
                                type           : 'dropped',
                                
                                currentTarget  : dropElm ?? undefined,               // point to <DropElm> itself
                                target         : activeDroppableTarget ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
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
                    ignoreDropElements : [overlayRef.current],
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
                    const dragElm = (dragRef instanceof Element) ? dragRef : dragRef?.current;
                    onDragMove({
                        // bases:
                        ...createSyntheticMouseEvent<TElement, MouseEvent>({
                            nativeEvent    : event,
                            
                            type           : 'dragmove',
                            
                            currentTarget  : dragElm ?? undefined, // point to <DragElm> itself
                            target         : undefined,            // point to <AnyElement> below the pointer
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
        event.preventDefault(); // now we handled the event
        
        
        
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
