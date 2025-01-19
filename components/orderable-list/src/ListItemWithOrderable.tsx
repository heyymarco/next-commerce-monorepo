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
    type DragHandshakeEvent,
    
    
    
    // hooks:
    useDraggable,
}                           from '@heymarco/draggable'
import {
    // types:
    type DropHandshakeEvent,
    
    
    
    // hooks:
    useDroppable,
}                           from '@heymarco/droppable'

// reusable-ui components:
import {
    // react components:
    type ListItemComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content

// internals:
import {
    // types:
    type OrderableListDragNDropData,
    
    
    
    // events:
    type OrderableListItemDragStartEvent,
    type OrderableListItemDropHandshakeEvent,
}                           from './types.js'
import {
    useOrderableListStyleSheet,
}                           from './styles/loader.js'
import {
    // types:
    RestoreOnce,
    type IgnoreArea,
    
    
    
    // states:
    useOrderableListState,
}                           from './states/orderableListState.js'
import {
    // types:
    type OrderableListItemRegistration,
    
    
    
    // react components:
    OrderableListItemStateProvider,
}                           from './states/orderableListItemState.js'
import {
    // react components:
    type OrderableListItemProps,
}                           from './OrderableListItem.js'
import {
    calculateWillToIndex,
    getElementRoundedRect,
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
        
        
        
        // behaviors:
        orderMode,
        
        
        
        // states:
        appliedTo,
        ignoreAreaRef,
        lastSwitchingIndexRef,
        touchedPositionRef,
        cachedFloatingPos,
        
        
        
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
    
    
    
    // capabilities:
    const {
        // states:
        isDragging,
    ...draggable} = useDraggable<TElement>({
        // data:
        dragData           : new Map<symbol, OrderableListDragNDropData<TElement, TData>>([
            [dragNDropId, {listIndex, listRef: listItemRef, data: props.data}],
        ]),
        
        
        
        // refs:
        dragRef            : listItemRef,
        ignoreDropElements : [listItemRef],
        
        
        
        // states:
        enabled            : true,
        
        
        
        // handlers:
        async onDragHandshake(event) {
            // console.log('onDragHandshake', event.timeStamp);
            if (!event.dropData.has(dragNDropId)) { // wrong drop target
                event.response = false;
                return;
            } // if
            
            
            
            const ignoreArea = ignoreAreaRef.current;
            if (ignoreArea) { // having an ignore area
                const pairListElm = (event.dropData?.get(dragNDropId) as OrderableListDragNDropData<TElement, TData>|undefined)?.listRef?.current;
                if (pairListElm && (pairListElm === ignoreArea.lastElement)) { // matches the ignoring target
                    // get pointer coordinate:
                    const {
                        clientX,
                        clientY,
                    } = event;
                    
                    // get ignoring coordinate:
                    const {
                        left,
                        right,
                        top,
                        bottom,
                    } = ignoreArea.beforeRect;
                    
                    // ensures the pointer coordinate is NOT in ignore coordinate:
                    if (
                        (clientX >= left) && (clientX <= right ) // the x coordinate is between left and right
                        &&
                        (clientY >= top ) && (clientY <= bottom) // the y coordinate is between top and bottom
                    ) {
                        if (ignoreArea.restoreOnce === RestoreOnce.PLANNED) { // the cursor is re-entering *back* from self_dragging_item to target_item => restore target_item to its original placement
                            ignoreArea.restoreOnce = RestoreOnce.PERFORMED; // when the cursor re-enters *back* from target_item (and has restored to its original placement) to self_dragging_item
                            console.log('PERFORMED', { pair: pairListElm.textContent });
                            
                            
                            
                            // the code below `... handleOrderHandshake ...` restores target_item to its original placement
                        }
                        else {
                            event.response = false; // abort this event handler
                            return; // no further action, exit earlier
                        } // if
                    } // if
                } // if
            } // if
            
            
            
            if (!(await handleOrderHandshake(event, {
                ownListIndex  : listIndex,
                pairListIndex : (event.dropData.get(dragNDropId) as OrderableListDragNDropData<TElement, TData>|undefined)?.listIndex as number,
                
                ownData       : props.data,
                pairData      : (event.dropData.get(dragNDropId) as OrderableListDragNDropData<TElement, TData>|undefined)?.data as TData|undefined,
                
                isDragging    : true, 
            }))) {
                event.response = false; // abort this event handler
                return;
            } // if
            
            
            
            event.response = true; // yes drop there (drop to self source|target is allowed)
            
            
            
            // remember the listIndex of the last switching, so we can simulate *dropped* event when the user dragged on the `ignoreArea`:
            lastSwitchingIndexRef.current = (event.dropData?.get(dragNDropId) as OrderableListDragNDropData<TElement, TData>|undefined)?.listIndex;
        },
        onDragMove(event) {
            // console.log('onDragMove', event.timeStamp);
            if (event.response) {
                handleDragMove({
                    from : listIndex,
                    to   : (event.dropData?.get(dragNDropId) as OrderableListDragNDropData<TElement, TData>|undefined)?.listIndex as number,
                });
            } // if
            
            
            
            const fromRaw = listIndex;
            const toRaw   = (event.dropData?.get(dragNDropId) as OrderableListDragNDropData<TElement, TData>|undefined)?.listIndex as number;
            const from    = Math.abs(fromRaw);
            const to      = Math.abs(toRaw);
            if (from !== to) { // the cursor is dragging over target_item
                // console.log('measuring', {fromRaw, toRaw}, event.timeStamp);
                const pairListRef = (event.dropData?.get(dragNDropId) as OrderableListDragNDropData<TElement, TData>|undefined)?.listRef;
                const pairListElm = pairListRef?.current;
                if (!pairListElm) {
                    // the element was unmounted => nothing to ignore:
                    ignoreAreaRef.current = undefined;
                    console.log('nothing to ignore');
                }
                else {
                    // get a rounded snapshot area of current location:
                    const roundedRect = getElementRoundedRect(pairListElm);
                    const hasMoved    = (toRaw < 0) || Object.is(toRaw, -0); // if negative value (including negative zero) => the item has moved from its original location to a new location
                    if (
                        !ignoreAreaRef.current // not having prev state => initial state
                        ||
                        (pairListElm !== ignoreAreaRef.current.lastElement) // different element => initial state
                        ||
                        (hasMoved !== ignoreAreaRef.current.lastMoved) // a switching movement is detected
                    ) { // an initial or switching movement is detected => take a snapshot of the previous rect for an ignore area
                        const isSelfElement = (pairListElm === ignoreAreaRef.current?.lastElement);
                        
                        // set an ignore area, so the ambiguous area (the intersection between the current area and the moved area) won't cause a flickering effect:
                        ignoreAreaRef.current = {
                            lastElement : pairListElm,
                            lastMoved   : hasMoved,    // take a snapshot of the current movement state, so we can detect the switching movement later
                            lastRect    : roundedRect, // take a snapshot of the current rect, so we can use the previous rect before movement later
                            
                            beforeRect  : isSelfElement ? (ignoreAreaRef.current?.lastRect ?? roundedRect) : roundedRect, // take a snapshot of the previous rect for an ignore area
                            restoreOnce : (
                                (isSelfElement && (ignoreAreaRef.current?.restoreOnce === RestoreOnce.PERFORMED)) // if has performed flag
                                ? RestoreOnce.PERFORMED // preserves the performed flag to avoid DOUBLE performing
                                : RestoreOnce.NEVER     // initially as never having performed restore
                            ),
                        } satisfies IgnoreArea;
                        // console.log('SET', { pair: pairListElm.textContent, hasMoved, rect: ignoreAreaRef.current.beforeRect.top });
                    }
                    else {
                        // just update the log:
                        ignoreAreaRef.current.lastElement = pairListElm;
                        ignoreAreaRef.current.lastMoved   = hasMoved;
                        ignoreAreaRef.current.lastRect    = roundedRect;
                        // console.log('UPDATE');
                    } // if
                    
                    
                    
                    // visual debugger:
                    if (process.env.NODE_ENV === 'development') {
                        const debugElm = (((window as any).__debugElm) as HTMLDivElement) ?? (() => {
                            const newDebugElm = document.createElement('div');
                            const style = newDebugElm.style;
                            style.pointerEvents = 'none';
                            style.zIndex = '999';
                            style.position = 'absolute';
                            style.border = 'solid 1px red';
                            window.document.body.append(newDebugElm);
                            (window as any).__debugElm = newDebugElm;
                            return newDebugElm;
                        })();
                        const debugRect = ignoreAreaRef.current.beforeRect;
                        const style = debugElm.style;
                        style.left = `${debugRect.left}px`;
                        style.top = `${debugRect.top}px`;
                        style.width = `${debugRect.width}px`;
                        style.height = `${debugRect.height}px`;
                    } // if
                } // if
            }
            else /* if (from === to) */ { // the cursor is dragging over self_dragging_item
                // if (ignoreAreaRef.current?.restoreOnce === RestoreOnce.NEVER) { // the cursor is re-entering *back* from target_item to self_dragging_item
                //     ignoreAreaRef.current.restoreOnce = RestoreOnce.PLANNED;    // when the cursor re-enters *back* from self_dragging_item to target_item => restore target_item to its original placement
                //     console.log('PLANNED');
                // }
                // else if (ignoreAreaRef.current?.restoreOnce === RestoreOnce.PERFORMED) { // the cursor is re-entering *back* from target_item (and has restored to its original placement) to self_dragging_item
                //     ignoreAreaRef.current = undefined;                                   // when the cursor re-enters *back* from self_dragging_item to target_item => the cursor should NOT be ignored and performs usual behavior
                //     // ignoreAreaRef.current.restoreOnce = RestoreOnce.PLANNED;
                //     console.log('CLEAR');
                // } // if
                
                if (ignoreAreaRef.current && (ignoreAreaRef.current.restoreOnce !== RestoreOnce.PLANNED)) { // the cursor is re-entering *back* from target_item (and MAY restored to its original placement) to self_dragging_item
                    ignoreAreaRef.current.restoreOnce = RestoreOnce.PLANNED; // when the cursor re-enters *back* from self_dragging_item to target_item => performs usual behavior (including restoring to its original placement)
                    console.log('PLANNED');
                } // if
            } // if
            
            
            
            handleUpdateFloatingPos(event.nativeEvent);
        },
        onDragged(event) {
            console.log('onDragged', event.timeStamp);
            
            lastSwitchingIndexRef.current = undefined; // prevents from simulating *dropped* event from happening
            
            
            
            handleDropped({
                from : listIndex,
                to   : (event.dropData.get(dragNDropId) as OrderableListDragNDropData<TElement, TData>|undefined)?.listIndex as number,
            });
        },
    });
    useDroppable<TElement>({
        // data:
        dropData : new Map<symbol, OrderableListDragNDropData<TElement, TData>>([
            [dragNDropId, {listIndex, listRef: listItemRef, data: props.data}],
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
                pairListIndex : (event.dragData.get(dragNDropId) as OrderableListDragNDropData<TElement, TData>|undefined)?.listIndex as number,
                
                ownData       : props.data,
                pairData      : (event.dragData.get(dragNDropId) as OrderableListDragNDropData<TElement, TData>|undefined)?.data as TData|undefined,
                
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
            onOrderStart     : handleOrderStart,
            onOrderHandshake : handleOrderHandshake,
        } = registration;
        
        
        
        // registrations:
        const draggableKey = Symbol();
        draggableSubscribers.set(draggableKey, draggable);
        draggableSubscribersCache.current = !Array.from(draggableSubscribers.values()).some((draggable) => !draggable); // if contains a/some `draggable={false}` => not draggable
        
        const droppableKey = Symbol();
        droppableSubscribers.set(droppableKey, droppable);
        droppableSubscribersCache.current = !Array.from(droppableSubscribers.values()).some((droppable) => !droppable); // if contains a/some `droppable={false}` => not droppable
        
        if (handleOrderStart)     onOrderStartSubscribers.add(handleOrderStart);
        if (handleOrderHandshake) onOrderHandshakeSubscribers.add(handleOrderHandshake);
        
        
        
        // unregistrations:
        return () => {
            draggableSubscribers.delete(draggableKey);
            draggableSubscribersCache.current = !Array.from(draggableSubscribers.values()).some((draggable) => !draggable); // if contains a/some `draggable={false}` => not draggable
            
            droppableSubscribers.delete(droppableKey);
            droppableSubscribersCache.current = !Array.from(droppableSubscribers.values()).some((droppable) => !droppable); // if contains a/some `droppable={false}` => not droppable
            
            if (handleOrderStart)     onOrderStartSubscribers.delete(handleOrderStart);
            if (handleOrderHandshake) onOrderHandshakeSubscribers.delete(handleOrderHandshake);
        };
    });
    
    
    
    // event emmiters:
    const triggerOrderStart     = useEvent<Exclude<OrderableListItemProps<TElement, TData>['onOrderStart'], undefined>>(async (event) => {
        // actions:
        await Promise.all(Array.from(onOrderStartSubscribers).map((subscriber) => subscriber(event)));
    });
    const triggerOrderHandshake = useEvent<Exclude<OrderableListItemProps<TElement, TData>['onOrderHandshake'], undefined>>(async (event) => {
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
                !isDragging /* === isDropping */                                                                                                                           // if the dropping_side
                &&                                                                                                                                                         // AND
                (('dragData' in event) && ((event.dragData.get(dragNDropId) as OrderableListDragNDropData<TElement, TData>|undefined)?.listIndex as number !== listIndex)) // not_dropped_by_itself
            ) {
                return false; // `droppable={false}` => not droppable => prevents to be dropped
            } // if
        } // if
        if (!onOrderHandshakeSubscribers.size)  return true;  // if no `onOrderHandshake` provided, assumes as allowed
        
        
        
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
                
                
                
                to = calculateWillToIndex(orderMode, from, appliedTo, to);
                
                
                
                return to;
            })(),
            pairListIndex      : isOnItself ? undefined : (!isDragging ? appliedTo : undefined) ?? ((): number => {
                const from = Math.abs(ownListIndexRaw);  // remove negative sign (if any)
                let   to   = Math.abs(pairListIndexRaw); // remove negative sign (if any)
                
                
                
                to = calculateWillToIndex(orderMode, from, appliedTo, to);
                
                
                
                return to;
            })(),
            
            ownData            : ownData,
            pairData           : isOnItself ? undefined : pairData,
            
            isDragging         : isDragging,
            response           : true, // initial response status
        };
        await triggerOrderHandshake(orderableListItemDropHandshakeEvent);
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
            await triggerOrderStart(orderableListItemDragStartEvent);
            if (!orderableListItemDragStartEvent.response) return false; // abort this event handler
        } // if
        
        
        
        // calculate & memorize touched pos:
        const {left: baseLeft, top: baseTop} = listItemParentElm.getBoundingClientRect();
        const touchedLeft = event.clientX - baseLeft;
        const touchedTop  = event.clientY - baseTop;
        touchedPositionRef.current = { left: touchedLeft, top: touchedTop };
        
        
        
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
        
        
        
        // simulates the TouchStart as MouseDown:
        const touch = event?.touches?.[0];
        const simulateMousedownEvent = new MouseEvent("mousedown sim", {
            bubbles          : true,
            cancelable       : true,
            clientX          : touch.clientX,
            clientY          : touch.clientY,
            screenX          : touch.screenX,
            screenY          : touch.screenY,
            // pageX         : touch.pageX,
            // pageY         : touch.pageY,
            button           : 0,  // primary button (usually the left button)
            buttons          : 1, // primary button (usually the left button)
            // relatedTarget : event.relatedTarget,
            ctrlKey          : event.ctrlKey,
            shiftKey         : event.shiftKey,
            altKey           : event.altKey,
            metaKey          : event.metaKey,
        });
        // optionally copy non-enumerable properties if needed:
        // Object.defineProperties(simulateMousedownEvent, Object.getOwnPropertyDescriptors(event.nativeEvent)); // copy non enumerable props from `nativeEvent`
        if (!(await handlePointerStart(simulateMousedownEvent))) return; // abort if returned false
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
    
    const handleUpdateFloatingPos  = useEvent((event?: MouseEvent): void => {
        // conditions:
        const recentPos = event ?? cachedFloatingPos.current;
        if (!recentPos) return;
        
        
        
        // calculate & memorize floating pos:
        const { clientX, clientY } = recentPos;
        cachedFloatingPos.current  = { clientX, clientY };
        
        
        
        // conditions:
        const listItemInlineStyle = listItemRef.current?.style;
        if (!listItemInlineStyle) return;
        const listItemParentElm   = listItemParentRef.current;
        if (!listItemParentElm  ) return;
        
        
        
        // live update for first rerender of <ListItemWithOrderable>, vanilla way, without causing busy re-render:
        const { left: baseLeft   , top: baseTop    } = listItemParentElm.getBoundingClientRect();
        const { left: touchedLeft, top: touchedTop } = touchedPositionRef.current ?? {left: 0, top: 0};
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
            
            
            
            const lastSwitchingIndex = lastSwitchingIndexRef.current; // take
            lastSwitchingIndexRef.current = undefined;                // clear
            if (lastSwitchingIndex !== undefined) {
                // simulate *dropped* event when dragged on `ignoreArea`:
                console.log('simulate onDragged => handleDropped');
                handleDropped({
                    from : listIndex,
                    to   : lastSwitchingIndex,
                });
            } // if
            
            
            
            /**
             * Clears the ignore area to avoid unnecessary `PLANNED` states (which cause flickering) and prevents a memory leak from referencing the `lastElement` DOM.
             * 
             * Case of flickering effect:
             * [A (small)]
             * [B (big)  ]
             * [C (small)]
             * 
             * When dropping [A] into [B] and then moving back to [A], it sets the `ignoreAreaRef` of [B] to `PLANNED`.
             * Then, when dropping [C] into [B], the existing `PLANNED` state of [B] causes a SUDDEN `PERFORMED` state, switching [C] to [B].
             * Because the `lastRect` is a snapshot of when [B] moved into [A], a second SUDDEN switch from [B] to [C] occurs.
             * This back-and-forth switching causes a flickering effect.
             */
            ignoreAreaRef.current = undefined;
            // visual debugger:
            if (process.env.NODE_ENV === 'development') {
                const debugElm = (window as any).__debugElm as HTMLDivElement|undefined;
                debugElm?.parentElement?.removeChild(debugElm);
                delete (window as any).__debugElm;
            } // if
        } // if
        
        
        
        if (!isDraggingActive) {
            cachedFloatingPos.current  = undefined; // cleanup floating pos
            touchedPositionRef.current = undefined; // cleanup touched pos
            
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
