// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useMemo,
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



// react components:
export interface ListItemWithOrderableProps<TElement extends HTMLElement = HTMLElement, TData extends unknown = unknown>
    extends
        // bases:
        OrderableListItemProps<TElement, TData>,
        
        // components:
        Required<ListItemComponentProps<TElement>>
{
    // positions:
    listIndex         : number
    
    
    
    // appearances:
    refresh          ?: object // declarative way to refresh()
    
    
    
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
        
        
        
        // components:
        listItemComponent,
    ...restListItemProps} = props;
    
    
    
    // states:
    const {
        // identifiers:
        dragNDropId,
        
        
        
        // handlers:
        handleDragStart,
        handleDragEnd,
        handleDragMove,
        handleDropped,
    } = useOrderableListState();
    
    
    
    // refs:
    const listItemRef                = useRef<TElement|null>(null);
    const listItemParentRef          = useMemo<React.MutableRefObject<TElement|null>>(() => ({
        get current(): HTMLElement|null {
            return listItemRef.current?.parentElement ?? null;
        },
    }) as React.MutableRefObject<TElement|null>, []);
    const listItemTouchedPositionRef = useRef<{ left: number, top: number }|undefined>(undefined);
    
    
    
    // capabilities:
    const {
        // states:
        isDragging,
    ...draggable} = useDraggable<TElement>({
        // data:
        dragData           : new Map<symbol, number>([
            [dragNDropId, listIndex],
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
                    to   : event.dropData?.get(dragNDropId) as number,
                });
            } // if
            
            
            
            handleUpdateFloatingPos(event.nativeEvent);
        },
        async onDragHandshake(event) {
            if (!Array.from(event.dropData.keys()).includes(dragNDropId)) { // wrong drop target
                event.response = false;
                return;
            } // if
            
            
            
            if (!(await handleOrderHandshake(event, /*isDragging: */true))) {
                event.response = false; // abort this event handler
                return;
            } // if
            
            
            
            event.response = true; // yes drop there (drop to self source|target is allowed)
        },
        onDragged({dropData}) {
            handleDropped({
                from : listIndex,
                to   : dropData.get(dragNDropId) as number,
            });
        },
    });
    useDroppable<TElement>({
        // data:
        dropData : new Map<symbol, number>([
            [dragNDropId, listIndex],
        ]),
        
        
        
        // refs:
        dropRef  : listItemParentRef, // we use `listItemParentRef` instead of `listItemRef`, because the `listItemParentRef` doesn't moving while `onDragMove() => handleUpdateFloatingPos()` triggered
        
        
        
        // states:
        enabled  : true,
        
        
        
        // handlers:
        async onDropHandshake(event) {
            if (!Array.from(event.dragData.keys()).includes(dragNDropId)) { // wrong drag source
                event.response = false;
                return;
            } // if
            
            
            
            if (!(await handleOrderHandshake(event, /*isDragging: */false))) {
                event.response = false; // abort this event handler
                return;
            } // if
            
            
            
            event.response = true; // yes drop there (drop to self source|target is allowed)
        },
    });
    
    
    
    // registrations:
    const [orderableSubscribers       ] = useState<Map<symbol, boolean>>(() => new Map<symbol, boolean>());
    const orderableSubscribersCache     = useRef<boolean>(false);
    const [onOrderStartSubscribers    ] = useState<Set<Exclude<OrderableListItemProps<TElement, TData>['onOrderStart'], undefined>>>(() => new Set<Exclude<OrderableListItemProps<TElement, TData>['onOrderStart'], undefined>>());
    const [onOrderHandshakeSubscribers] = useState<Set<Exclude<OrderableListItemProps<TElement, TData>['onOrderHandshake'], undefined>>>(() => new Set<Exclude<OrderableListItemProps<TElement, TData>['onOrderHandshake'], undefined>>());
    const registerOrderableListItem     = useEvent((registration: OrderableListItemRegistration<TElement>): () => void => {
        const {
            // behaviors:
            orderable,
            
            
            
            // handlers:
            onOrderStart,
            onOrderHandshake,
        } = registration;
        
        
        
        // registrations:
        const orderableKey = Symbol();
        orderableSubscribers.set(orderableKey, orderable);
        
        orderableSubscribersCache.current = !Array.from(orderableSubscribers.values()).some((orderable) => !orderable); // if contains a/some `orderable={false}` => not orderable
        
        if (onOrderStart)     onOrderStartSubscribers.add(onOrderStart);
        if (onOrderHandshake) onOrderHandshakeSubscribers.add(onOrderHandshake);
        
        
        
        // unregistrations:
        return () => {
            orderableSubscribers.delete(orderableKey);
            
            orderableSubscribersCache.current = !Array.from(orderableSubscribers.values()).some((orderable) => !orderable); // if contains a/some `orderable={false}` => not orderable
            
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
    const handleOrderHandshake     = useEvent(async (event: DragHandshakeEvent<TElement>|DropHandshakeEvent<TElement>, isDragging: boolean): Promise<boolean> => {
        // conditions:
        if (!orderableSubscribersCache.current) return false; // `orderable={false}` => not orderable => prevents to be dropped
        if (!onOrderHandshakeSubscribers.size)  return true;  // if no `onOrderHandshake` defined, assumes as allowed
        
        
        
        const orderableListItemDropHandshakeEvent : OrderableListItemDropHandshakeEvent<TElement> = {
            // bases:
            ...createSyntheticMouseEvent<TElement, MouseEvent>({
                nativeEvent    : event.nativeEvent,
                
                type           : 'orderablelistitemdrophandshake',
                
                currentTarget  : listItemRef.current ?? undefined, // point to <OrderableListItem> itself
                target         : event.target,                     // point to <OrderableListItem>'s descendant (if any) -or- <OrderableListItem> itself, excepts <OverlayElm>
                relatedTarget  : event.relatedTarget,              // the opposite side <DragElm>|<DropElm> as related/paired element
            }),
            
            
            
            // data:
            isDragging         : isDragging,
            response           : true, // initial response status
        };
        await onOrderHandshake(orderableListItemDropHandshakeEvent);
        return orderableListItemDropHandshakeEvent.response;
    });
    
    const handlePointerStart       = useEvent(async (event: MouseEvent): Promise<boolean> => {
        // conditions:
        if (!orderableSubscribersCache.current) return false; // `orderable={false}` => not orderable => prevents from dragging
        
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
        <OrderableListItemStateProvider<TElement>
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
