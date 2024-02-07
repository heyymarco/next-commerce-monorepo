// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useMemo,
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
}                           from './types'
import {
    useOrderableListStyleSheet,
}                           from './styles/loader'
import {
    // states:
    useOrderableListState,
}                           from './states/orderableListState'
import {
    // hooks:
    useDraggable,
    useDroppable,
}                           from '@/libs/drag-n-drop'
import type {
    // react components:
    OrderableListItemProps,
}                           from './OrderableListItem'

// utilities:
import {
    createSyntheticMouseEvent,
}                           from '@/libs/hooks'



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
        
        
        
        // handlers:
        onOrderStart,
        onOrderHandshake,
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
        enabled  : true,
        dragData : new Map<symbol, number>([
            [dragNDropId, listIndex],
        ]),
        onDragHandshake(event) {
            if (!Array.from(event.dropData.keys()).includes(dragNDropId)) { // wrong drop target
                event.response = false;
                return;
            } // if
            
            
            
            event.response = true; // yes drop there (drop to self source|target is allowed)
        },
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
        onDragged({dropData}) {
            handleDropped({
                from : listIndex,
                to   : dropData.get(dragNDropId) as number,
            });
        },
    });
    useDroppable<TElement>({
        enabled  : true,
        dropData : new Map<symbol, number>([
            [dragNDropId, listIndex],
        ]),
        dropRef  : listItemParentRef,
        async onDropHandshake(event) {
            if (!Array.from(event.dragData.keys()).includes(dragNDropId)) { // wrong drag source
                event.response = false;
                return;
            } // if
            
            
            
            if (onOrderHandshake) {
                const orderableListItemDropHandshakeEvent = createSyntheticMouseEvent<TElement, MouseEvent>({
                    type              : 'orderablelistitemdrophandshake',
                    
                    currentTarget     : listItemRef.current ?? undefined, // point to <OrderableListItem> itself
                    target            : undefined,                        // point to <OrderableListItem>'s descendant (if any) -or- <OrderableListItem> itself
                    
                    nativeEvent       : event.nativeEvent,
                }) as unknown as OrderableListItemDropHandshakeEvent<TElement>;
                orderableListItemDropHandshakeEvent.response = true;
                await onOrderHandshake(orderableListItemDropHandshakeEvent);
                if (!orderableListItemDropHandshakeEvent.response) {
                    event.response = false; // abort this event handler
                    return;
                } // if
            } // if
            
            
            
            event.response = true; // yes drop there (drop to self source|target is allowed)
        },
    });
    
    
    
    // handlers:
    const handlePointerStart       = useEvent(async (event: MouseEvent): Promise<boolean> => {
        // conditions:
        const listItemParentElm = listItemParentRef.current;
        if (!listItemParentElm) return false;
        
        if (onOrderStart) {
            const orderableListItemDragStartEvent = createSyntheticMouseEvent<TElement, MouseEvent>({
                type              : 'orderablelistitemdragstart',
                
                currentTarget     : listItemRef.current ?? undefined, // point to <OrderableListItem> itself
                target            : undefined,                        // point to <OrderableListItem>'s descendant (if any) -or- <OrderableListItem> itself
                
                nativeEvent       : event,
            }) as unknown as OrderableListItemDragStartEvent<TElement>;
            orderableListItemDragStartEvent.response = true;
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
        // simulates the TouchMove as MouseMove:
        if (!(await handlePointerStart({
            ...event,
            clientX : event.touches[0].clientX,
            clientY : event.touches[0].clientY,
            buttons : 1, // primary button (usually the left button)
        } as unknown as MouseEvent))) return; // abort if returned false
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
    /* <ListItem> */
    return React.cloneElement<OrderableListItemProps<TElement, TData>>(listItemComponent,
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
    );
};
