// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
    useMergeRefs,
    useMergeClasses,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    createSyntheticMouseEvent,
}                           from '@heymarco/events'
import {
    // types:
    DragHandshakeEvent,
    
    
    
    // hooks:
    useDraggable,
}                           from '@heymarco/draggable'
import {
    // types:
    DropHandshakeEvent,
    
    
    
    // hooks:
    useDroppable,
}                           from '@heymarco/droppable'

// reusable-ui components:
import type {
    // react components:
    ListItemComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content

// internals:
import type {
    // events:
    OrderableListItemDragStartEvent,
    OrderableListItemDropHandshakeEvent,
}                           from './types.js'
import {
    useOrderableListStyleSheet,
}                           from './styles/loader.js'
import {
    // states:
    useOrderableListState,
}                           from './states/orderableListState.js'
import {
    // types:
    OrderableListItemRegistration,
    
    
    
    // react components:
    OrderableListItemStateProvider,
}                           from './states/orderableListItemState.js'
import type {
    // react components:
    OrderableListItemProps,
}                           from './OrderableListItem.js'
import {
    calculateSyncIndex,
}                           from './utilities.js'



// react components:
export interface ListItemWithOrderableProps<TElement extends HTMLElement = HTMLElement, TData extends unknown = unknown>
    extends
        // bases:
        OrderableListItemProps<TElement, TData>,
        
        // components:
        Required<ListItemComponentProps<TElement>>
{
    // positions:
    /**
     * Positive value (including negative zero) => original listIndex.  
     * Negative value (including negative zero) => backup listIndex.
     */
    listIndex         : number
    
    
    
    // appearances:
    refresh          ?: object // declarative way to refresh()
    
    
    
    // behaviors:
    parentOrderable   : boolean
    
    
    
    // components:
    // a more specific of <ListItem> is needed:
    listItemComponent : React.ReactComponentElement<any, OrderableListItemProps<TElement, TData>>
}
export const ListItemWithOrderable = <TElement extends HTMLElement = HTMLElement, TData extends unknown = unknown>(props: ListItemWithOrderableProps<TElement, TData>): JSX.Element|null => {
    // styles:
    const styleSheet = useOrderableListStyleSheet();
    
    
    
    // rest props:
    const {
        // positions:
        listIndex,
        
        
        
        // appearances:
        refresh,
        
        
        
        // behaviors:
        parentOrderable,
        
        
        
        // components:
        listItemComponent,
    ...restListItemProps} = props;
    
    
    
    // states:
    const {
        // identifiers:
        dragNDropId,
        
        
        
        // states:
        appliedTo,
        
        
        
        // handlers:
        handleDragStart,
        handleDragEnd,
        handleDragMove,
        handleDropped,
    } = useOrderableListState();
    
    
    
    // refs:
    const listItemRef                = useRef<TElement|null>(null);
    const [listItemParentRef]        = useState<React.MutableRefObject<TElement|null>>(() => ({
        get current(): HTMLElement|null {
            return listItemRef.current?.parentElement ?? null;
        },
    }) as React.MutableRefObject<TElement|null>);
    const listItemTouchedPositionRef = useRef<{ left: number, top: number }|undefined>(undefined);
    
    
    
    // capabilities:
    const {
        // states:
        isDragging,
    ...draggable} = useDraggable<TElement>({
        // data:
        dragData           : new Map<symbol, [number, TData|undefined]>([
            [dragNDropId, [listIndex, props.data]],
        ]),
        
        
        
        // refs:
        dragRef            : listItemRef,
        ignoreDropElements : [listItemRef],
        
        
        
        // states:
        enabled            : true,
        
        
        
        // handlers:
        onDragMove(event) {
            if (event.response) {
                handleDragMove({
                    ...event.nativeEvent,
                    from : listIndex,
                    to   : (event.dropData?.get(dragNDropId) as [number, TData|undefined]|undefined)?.[0] as number,
                });
            } // if
            
            
            
            handleUpdateFloatingPos(event.nativeEvent);
        },
        async onDragHandshake(event) {
            if (!event.dropData.has(dragNDropId)) { // wrong drop target
                event.response = false;
                return;
            } // if
            
            
            
            if (!(await handleOrderHandshake(event, {
                ownListIndex  : listIndex,
                pairListIndex : (event.dropData.get(dragNDropId) as [number, TData|undefined]|undefined)?.[0] as number,
                
                ownData       : props.data,
                pairData      : (event.dropData.get(dragNDropId) as [number, TData|undefined]|undefined)?.[1] as TData|undefined,
                
                isDragging    : true, 
            }))) {
                event.response = false; // abort this event handler
                return;
            } // if
            
            
            
            event.response = true; // yes drop there (drop to self source|target is allowed)
        },
        onDragged(event) {
            handleDropped({
                from : listIndex,
                to   : (event.dropData.get(dragNDropId) as [number, TData|undefined]|undefined)?.[0] as number,
            });
        },
    });
    useDroppable<TElement>({
        // data:
        dropData : new Map<symbol, [number, TData|undefined]>([
            [dragNDropId, [listIndex, props.data]],
        ]),
        
        
        
        // refs:
        dropRef  : listItemParentRef, // we use `listItemParentRef` instead of `listItemRef`, because the `listItemParentRef` doesn't moving while `onDragMove() => handleUpdateFloatingPos()` triggered
        
        
        
        // states:
        enabled  : true,
        
        
        
        // handlers:
        async onDropHandshake(event) {
            if (!event.dragData.has(dragNDropId)) { // wrong drag source
                event.response = false;
                return;
            } // if
            
            
            
            if (!(await handleOrderHandshake(event, {
                ownListIndex  : listIndex,
                pairListIndex : (event.dragData.get(dragNDropId) as [number, TData|undefined]|undefined)?.[0] as number,
                
                ownData       : props.data,
                pairData      : (event.dragData.get(dragNDropId) as [number, TData|undefined]|undefined)?.[1] as TData|undefined,
                
                isDragging    : false,
            }))) {
                event.response = false; // abort this event handler
                return;
            } // if
            
            
            
            event.response = true; // yes drop there (drop to self source|target is allowed)
        },
    });
    
    
    
    // registrations:
    const [draggableSubscribers       ] = useState<Map<symbol, boolean>>(() => new Map<symbol, boolean>());
    const draggableSubscribersCache     = useRef<boolean>(false);
    
    const [droppableSubscribers       ] = useState<Map<symbol, boolean>>(() => new Map<symbol, boolean>());
    const droppableSubscribersCache     = useRef<boolean>(false);
    
    const [onOrderStartSubscribers    ] = useState<Set<Exclude<OrderableListItemProps<TElement, TData>['onOrderStart'], undefined>>>(() => new Set<Exclude<OrderableListItemProps<TElement, TData>['onOrderStart'], undefined>>());
    const [onOrderHandshakeSubscribers] = useState<Set<Exclude<OrderableListItemProps<TElement, TData>['onOrderHandshake'], undefined>>>(() => new Set<Exclude<OrderableListItemProps<TElement, TData>['onOrderHandshake'], undefined>>());
    const registerOrderableListItem     = useEvent((registration: OrderableListItemRegistration<TElement, TData>): () => void => {
        const {
            // behaviors:
            draggable,
            droppable,
            
            
            
            // handlers:
            onOrderStart,
            onOrderHandshake,
        } = registration;
        
        
        
        // registrations:
        const draggableKey = Symbol();
        draggableSubscribers.set(draggableKey, draggable);
        draggableSubscribersCache.current = !Array.from(draggableSubscribers.values()).some((draggable) => !draggable); // if contains a/some `draggable={false}` => not draggable
        
        const droppableKey = Symbol();
        droppableSubscribers.set(droppableKey, droppable);
        droppableSubscribersCache.current = !Array.from(droppableSubscribers.values()).some((droppable) => !droppable); // if contains a/some `droppable={false}` => not droppable
        
        if (onOrderStart)     onOrderStartSubscribers.add(onOrderStart);
        if (onOrderHandshake) onOrderHandshakeSubscribers.add(onOrderHandshake);
        
        
        
        // unregistrations:
        return () => {
            draggableSubscribers.delete(draggableKey);
            draggableSubscribersCache.current = !Array.from(draggableSubscribers.values()).some((draggable) => !draggable); // if contains a/some `draggable={false}` => not draggable
            
            droppableSubscribers.delete(droppableKey);
            droppableSubscribersCache.current = !Array.from(droppableSubscribers.values()).some((droppable) => !droppable); // if contains a/some `droppable={false}` => not droppable
            
            if (onOrderStart)     onOrderStartSubscribers.delete(onOrderStart);
            if (onOrderHandshake) onOrderHandshakeSubscribers.delete(onOrderHandshake);
        };
    });
    
    
    
    // event emmiters:
    const onOrderStart     = useEvent<Exclude<OrderableListItemProps<TElement, TData>['onOrderStart'], undefined>>(async (event) => {
        // actions:
        await Promise.all(Array.from(onOrderStartSubscribers).map((subscriber) => subscriber(event)));
    });
    const onOrderHandshake = useEvent<Exclude<OrderableListItemProps<TElement, TData>['onOrderHandshake'], undefined>>(async (event) => {
        // actions:
        await Promise.all(Array.from(onOrderHandshakeSubscribers).map((subscriber) => subscriber(event)));
    });
    
    
    
    // handlers:
    const handleOrderHandshake     = useEvent(async (event: DragHandshakeEvent<TElement>|DropHandshakeEvent<TElement>, props: Pick<OrderableListItemDropHandshakeEvent<TElement, TData>, 'ownListIndex'|'pairListIndex'|'ownData'|'pairData'|'isDragging'> & { pairListIndex: number }): Promise<boolean> => {
        // props:
        const {
            ownListIndex  : ownListIndexRaw,
            pairListIndex : pairListIndexRaw,
            
            ownData,
            pairData,
            
            isDragging,
            
            ...restOrderableListItemDropHandshakeEvent
        } = props;
        
        
        
        // conditions:
        if (!parentOrderable)                   return false; // `<OrderableList orderable={false}>` => not orderable => prevents to be dropped
        if (!droppableSubscribersCache.current) {
            if (
                !isDragging /* === isDropping */                                                                                                    // if the dropping_side
                &&                                                                                                                                  // AND
                (('dragData' in event) && ((event.dragData.get(dragNDropId) as [number, TData|undefined]|undefined)?.[0] as number !== listIndex))  // not_dropped_by_itself
            ) {
                // console.log(Date.now(), 'prevent from dropping', event);
                return false; // `droppable={false}` => not droppable => prevents to be dropped
            } // if
        } // if
        if (!onOrderHandshakeSubscribers.size)  return true;  // if no `onOrderHandshake` defined, assumes as allowed
        
        
        
        const isOnItself = Object.is(pairListIndexRaw, ownListIndexRaw); // compares both the value and positive|negative sign, if equals => it's on itself
        const orderableListItemDropHandshakeEvent : OrderableListItemDropHandshakeEvent<TElement, TData> = {
            // bases:
            ...createSyntheticMouseEvent<TElement, MouseEvent>({
                nativeEvent    : event.nativeEvent,
                
                type           : 'orderablelistitemdrophandshake',
                
                currentTarget  : listItemRef.current ?? undefined, // point to <OrderableListItem> itself
                target         : event.target,                     // point to <OrderableListItem>'s descendant (if any) -or- <OrderableListItem> itself, excepts <OverlayElm>
                relatedTarget  : event.relatedTarget,              // the opposite side <DragElm>|<DropElm> as related/paired element
            }),
            
            
            
            // data:
            ...restOrderableListItemDropHandshakeEvent,
            
            ownListIndex       : (isDragging ? appliedTo : undefined) ?? ((): number => {
                const from = Math.abs(pairListIndexRaw); // remove negative sign (if any)
                let   to   = Math.abs(ownListIndexRaw);  // remove negative sign (if any)
                
                
                
                // #region patch the hole
                /*
                    example of pulling [6] and temporary applied to index of 2
                    
                    wrappedChildren     visuallyRendered
                    index:  0 [0]       index:  0 [0]
                            1 [1]               1 [1]
                            2 [2]          void 2 [ ] <-- apply [6]
                            3 [3]             x 3 [2] <-- out_of_index_sync    elements with data from [2] to [5] are out_of_index_sync with the indices
                            4 [4]             x 4 [3] <-- out_of_index_sync
                            5 [5]             x 5 [4] <-- out_of_index_sync
                            6 [6] --> pull    x 6 [5] <-- out_of_index_sync
                            7 [7]               7 [7]
                            8 [8]               8 [8]
                            9 [9]               9 [9]
                */
                to += calculateSyncIndex(from, to, appliedTo);
                // #endregion patch the hole
                
                
                
                return to;
            })(),
            pairListIndex      : isOnItself ? undefined : (!isDragging ? appliedTo : undefined) ?? ((): number => {
                const from = Math.abs(ownListIndexRaw);  // remove negative sign (if any)
                let   to   = Math.abs(pairListIndexRaw); // remove negative sign (if any)
                
                
                
                // #region patch the hole
                /*
                    example of pulling [6] and temporary applied to index of 2
                    
                    wrappedChildren     visuallyRendered
                    index:  0 [0]       index:  0 [0]
                            1 [1]               1 [1]
                            2 [2]          void 2 [ ] <-- apply [6]
                            3 [3]             x 3 [2] <-- out_of_index_sync    elements with data from [2] to [5] are out_of_index_sync with the indices
                            4 [4]             x 4 [3] <-- out_of_index_sync
                            5 [5]             x 5 [4] <-- out_of_index_sync
                            6 [6] --> pull    x 6 [5] <-- out_of_index_sync
                            7 [7]               7 [7]
                            8 [8]               8 [8]
                            9 [9]               9 [9]
                */
                to += calculateSyncIndex(from, to, appliedTo);
                // #endregion patch the hole
                
                
                
                return to;
            })(),
            
            ownData            : ownData,
            pairData           : isOnItself ? undefined : pairData,
            
            isDragging         : isDragging,
            response           : true, // initial response status
        };
        await onOrderHandshake(orderableListItemDropHandshakeEvent);
        return orderableListItemDropHandshakeEvent.response;
    });
    
    const handlePointerStart       = useEvent(async (event: MouseEvent): Promise<boolean> => {
        // conditions:
        if (!parentOrderable)                   return false; // `<OrderableList orderable={false}>` => not orderable => prevents from dragging
        if (!draggableSubscribersCache.current) return false; // `draggable={false}` => not draggable => prevents from dragging
        
        const listItemParentElm = listItemParentRef.current;
        if (!listItemParentElm) return false;
        
        if (onOrderStartSubscribers.size) {
            const orderableListItemDragStartEvent : OrderableListItemDragStartEvent<TElement> = {
                // bases:
                ...createSyntheticMouseEvent<TElement, MouseEvent>({
                    nativeEvent    : event,
                    
                    type           : 'orderablelistitemdragstart',
                    
                    currentTarget  : listItemRef.current ?? undefined, // point to <OrderableListItem> itself
                    target         : event.target ?? undefined,        // point to <OrderableListItem>'s descendant (if any) -or- <OrderableListItem> itself
                    relatedTarget  : null,                             // no related/paired element
                }),
                
                
                
                // data:
                response           : true, // initial response status
            };
            await onOrderStart(orderableListItemDragStartEvent);
            if (!orderableListItemDragStartEvent.response) return false; // abort this event handler
        } // if
        
        
        
        // calculate & memorize touched pos:
        const {left: baseLeft, top: baseTop} = listItemParentElm.getBoundingClientRect();
        const touchedLeft = event.clientX - baseLeft;
        const touchedTop  = event.clientY - baseTop;
        listItemTouchedPositionRef.current = {left: touchedLeft, top: touchedTop};
        
        
        
        // done:
        return true;
    });
    const handleMouseDownInternal  = useEvent<React.MouseEventHandler<TElement>>(async (event) => {
        if (!(await handlePointerStart(event.nativeEvent))) return; // abort if returned false
        draggable.handleMouseDown(event);
    });
    const handleMouseDown          = useMergeEvents(
        // preserves the original `onMouseDown` from `listItemComponent`:
        listItemComponent.props.onMouseDown,
        
        
        
        // preserves the original `onMouseDown` from `props`:
        props.onMouseDown,
        
        
        
        // actions:
        handleMouseDownInternal,
    );
    const handleTouchStartInternal = useEvent<React.TouchEventHandler<TElement>>(async (event) => {
        // conditions:
        if (event.touches.length !== 1) return; // only single touch
        
        
        
        // simulates the TouchMove as MouseMove:
        if (!(await handlePointerStart(new MouseEvent('mousemove', {
            // simulates for `onOrderStart(event)`:
            ...event.nativeEvent,
            ...(() => {
                const touch = event?.touches?.[0];
                return {
                    clientX : touch?.clientX ?? 0,
                    clientY : touch?.clientY ?? 0,
                    
                    screenX : touch?.screenX ?? 0,
                    screenY : touch?.screenY ?? 0,
                    
                    pageX   : touch?.pageX   ?? 0,
                    pageY   : touch?.pageY   ?? 0,
                    
                    button  : 1, // primary button (usually the left button)
                    buttons : 1, // primary button (usually the left button)
                };
            })(),
        })))) return; // abort if returned false
        draggable.handleTouchStart(event);
    });
    const handleTouchStart         = useMergeEvents(
        // preserves the original `onTouchStart` from `listItemComponent`:
        listItemComponent.props.onTouchStart,
        
        
        
        // preserves the original `onTouchStart` from `props`:
        props.onTouchStart,
        
        
        
        // actions:
        handleTouchStartInternal,
    );
    
    const prevFloatingPos          = useRef<Pick<MouseEvent, 'clientX'|'clientY'>|undefined>(undefined);
    const handleUpdateFloatingPos  = useEvent((event?: MouseEvent): void => {
        // conditions:
        const recentPos = event ?? prevFloatingPos.current;
        if (!recentPos) return;
        
        
        
        // calculate & memorize floating pos:
        const {clientX, clientY} = recentPos;
        prevFloatingPos.current  = {clientX, clientY};
        
        
        
        // conditions:
        const listItemInlineStyle = listItemRef.current?.style;
        if (!listItemInlineStyle) return;
        const listItemParentElm   = listItemParentRef.current;
        if (!listItemParentElm  ) return;
        
        
        
        // live update for first rerender of <ListItemWithOrderable>, vanilla way, without causing busy re-render:
        const {left: baseLeft   , top: baseTop   } = listItemParentElm.getBoundingClientRect();
        const {left: touchedLeft, top: touchedTop} = listItemTouchedPositionRef.current ?? {left: 0, top: 0};
        listItemInlineStyle.left = `${clientX - baseLeft - touchedLeft}px`;
        listItemInlineStyle.top  = `${clientY - baseTop  - touchedTop }px`;
    });
    
    const handleSetListItemRef     = useEvent((newRef: TElement|null): void => {
        listItemRef.current = newRef;
        if (newRef) handleUpdateFloatingPos();
    });
    
    
    
    // effects:
    /*
        undefined : inactive
        null      : active (outside drop targets)
        false     : active (inside wrong drop target)
        true      : active (inside right drop target)
    */
    const isDraggingActive    = (isDragging !== undefined);
    const isDraggingActiveRef = useRef<boolean>(isDraggingActive);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (isDraggingActiveRef.current === isDraggingActive) return; // already the same => ignore
        isDraggingActiveRef.current = isDraggingActive;               // sync
        
        
        // actions:
        if (isDraggingActive) {
            handleDragStart?.({
                from : listIndex,
            });
        }
        else {
            handleDragEnd?.();
        } // if
        
        
        
        if (!isDraggingActive) {
            prevFloatingPos.current            = undefined; // cleanup floating pos
            listItemTouchedPositionRef.current = undefined; // cleanup touched pos
            
            const listItemInlineStyle = listItemRef.current?.style;
            if (listItemInlineStyle) {
                listItemInlineStyle.left = '';
                listItemInlineStyle.top  = '';
            } // if
        }
    }, [isDraggingActive]);
    
    useIsomorphicLayoutEffect(() => {
        // update pos:
        handleUpdateFloatingPos();
    }, [refresh]);
    
    
    
    // refs:
    const mergedOuterRef = useMergeRefs(
        // preserves the original `outerRef` from `listItemComponent`:
        listItemComponent.props.outerRef,
        
        
        
        // preserves the original `outerRef` from `props`:
        props.outerRef,
        
        
        
        handleSetListItemRef,
    );
    
    
    
    // classes:
    const mergedStateClasses = useMergeClasses(
        // preserves the original `stateClasses` from `listItemComponent`:
        listItemComponent.props.stateClasses,
        
        
        
        // preserves the original `stateClasses` from `props`:
        props.stateClasses,
        
        
        
        // states:
        ((isDraggingActive || null) && styleSheet.orderableListItem),
    );
    
    
    
    // jsx:
    return (
        <OrderableListItemStateProvider<TElement, TData>
            // registrations:
            registerOrderableListItem={registerOrderableListItem}
        >
            {/* <ListItem> */}
            {React.cloneElement<OrderableListItemProps<TElement, TData>>(listItemComponent,
                // props:
                {
                    // other props:
                    ...restListItemProps,
                    ...listItemComponent.props, // overwrites restListItemProps (if any conflics)
                    
                    
                    
                    // refs:
                    outerRef     : mergedOuterRef,
                    
                    
                    
                    // classes:
                    stateClasses : mergedStateClasses,
                    
                    
                    
                    // handlers:
                    onMouseDown  : handleMouseDown,
                    onTouchStart : handleTouchStart,
                },
                
                
                
                // children:
                listItemComponent.props.children ?? props.children,
            )}
        </OrderableListItemStateProvider>
    );
};
