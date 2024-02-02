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
    ListItemProps,
    
    ListItemComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content

// internals:
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



// react components:
export interface ListItemWithOrderableProps<TElement extends HTMLElement = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>,
        
        // components:
        Required<ListItemComponentProps<TElement>>
{
    // positions:
    listIndex  : number
    
    
    
    // appearances:
    refresh   ?: object // declarative way to refresh()
}
export const ListItemWithOrderable = <TElement extends HTMLElement = HTMLElement>(props: ListItemWithOrderableProps<TElement>): JSX.Element|null => {
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
    const listItemTouchedPositionRef = useRef<{ left: number, top: number }>({ left: 0, top: 0 });
    
    
    
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
                    ...event,
                    from : listIndex,
                    to   : event.dropData?.get(dragNDropId) as number,
                });
            } // if
            
            
            
            handleUpdateFloatingPos(event);
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
        onDropHandshake(event) {
            if (!Array.from(event.dragData.keys()).includes(dragNDropId)) { // wrong drag source
                event.response = false;
                return;
            } // if
            
            
            
            event.response = true; // yes drop there (drop to self source|target is allowed)
        },
    });
    
    
    
    // handlers:
    const handlePointerStart       = useEvent(({clientX, clientY}: MouseEvent) => {
        // conditions:
        const listItemParentElm = listItemParentRef.current;
        if (!listItemParentElm) return;
        
        
        
        // update:
        const {left: baseLeft, top: baseTop} = listItemParentElm.getBoundingClientRect();
        const touchedLeft = clientX - baseLeft;
        const touchedTop  = clientY - baseTop;
        listItemTouchedPositionRef.current = {
            left : touchedLeft,
            top  : touchedTop,
        };
    });
    const handleMouseDownInternal  = useEvent<React.MouseEventHandler<TElement>>((event) => {
        handlePointerStart(event.nativeEvent);
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
    const handleTouchStartInternal = useEvent<React.TouchEventHandler<TElement>>((event) => {
        // simulates the TouchMove as MouseMove:
        handlePointerStart({
            ...event,
            clientX : event.touches[0].clientX,
            clientY : event.touches[0].clientY,
            buttons : 1, // primary button (usually the left button)
        } as unknown as MouseEvent);
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
        const listItemInlineStyle = listItemRef.current?.style;
        if (!listItemInlineStyle) return;
        const listItemParentElm   = listItemParentRef.current;
        if (!listItemParentElm) return;
        
        
        
        // calculate pos:
        const {clientX          , clientY        } = event ?? prevFloatingPos.current ?? { clientX: 0, clientY: 0 };
        prevFloatingPos.current                    = { clientX, clientY };
        const {left: baseLeft   , top: baseTop   } = listItemParentElm.getBoundingClientRect();
        const {left: touchedLeft, top: touchedTop} = listItemTouchedPositionRef.current;
        
        
        
        // live update for first rerender of <ListItemWithOrderable>, vanilla way, without causing busy re-render:
        listItemInlineStyle.left = `${clientX - baseLeft - touchedLeft}px`;
        listItemInlineStyle.top  = `${clientY - baseTop  - touchedTop }px`;
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
            prevFloatingPos.current   = undefined;
            
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
        
        
        
        listItemRef,
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
    return React.cloneElement<ListItemProps<TElement>>(listItemComponent,
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
