// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // a set of React node utility functions:
    flattenChildren,
    
    
    
    // react helper hooks:
    useEvent,
    useMergeClasses,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'
import {
    // types:
    type DraggedEvent,
}                           from '@heymarco/draggable'

// reusable-ui components:
import {
    // react components:
    ListItemProps,
    
    ListProps,
    List,
    
    ListComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content

// internals:
import type {
    // types:
    OrderableListOrderMode,
}                           from './types.js'
import {
    useOrderableListStyleSheet,
}                           from './styles/loader.js'
import {
    // types:
    OrderableListDragMoveEvent,
    OrderableListDroppedEvent,
    
    
    
    // react components:
    OrderableListStateProvider,
}                           from './states/orderableListState.js'
import {
    // react components:
    ListItemWithOrderableProps,
    ListItemWithOrderable,
}                           from './ListItemWithOrderable.js'
import type {
    // react components:
    OrderableListItemProps,
}                           from './OrderableListItem.js'
import {
    calculateWillToIndex,
}                           from './utilities.js'



// types:
/*
    We use HTMLElement instead of Element because HTMLElement supports drag-and-drop, while Element does not.
*/
export type ChildrenChangeEventHandler<TData extends unknown = unknown> = (children: React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, TData>>[], event: DraggedEvent<HTMLElement>) => void



// react components:
export interface OrderableListProps<TElement extends Element = HTMLElement, TData extends unknown = unknown>
    extends
        // bases:
        Omit<ListProps<TElement>,
            // children:
            |'children' // we redefined `children` prop as controllable children
        >,
        
        // components:
        Omit<ListComponentProps<TElement>,
            // we don't need these extra properties because the <OrderableList> is sub <List>
            |'listRef'
            |'listOrientation'
            |'listStyle'
            
            
            
            // children:
            |'listItems' // we redefined `children` prop as <ListItem>(s)
        >
{
    // behaviors:
    orderable        ?: boolean
    orderMode        ?: OrderableListOrderMode
    
    
    
    // children:
    /*
        We use HTMLElement instead of Element because HTMLElement supports drag-and-drop, while Element does not.
    */
    defaultChildren  ?: React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, TData>>[]|React.ReactNode
    children         ?: React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, TData>>[]|React.ReactNode
    onChildrenChange ?: ChildrenChangeEventHandler<TData>
}
const OrderableList = <TElement extends Element = HTMLElement, TData extends unknown = unknown>(props: OrderableListProps<TElement, TData>): JSX.Element|null => {
    // styles:
    const styleSheet = useOrderableListStyleSheet();
    
    
    
    // rest props:
    const {
        // behaviors:
        orderable : parentOrderable = true,
        orderMode = 'shift',
        
        
        
        // components:
        listComponent = (<List<TElement> /> as React.ReactComponentElement<any, ListProps<TElement>>),
        
        
        
        // children:
        defaultChildren  : defaultUncontrollableChildren,
        children         : controllableChildren,
        onChildrenChange : onControllableChildrenChange,
    ...restListProps} = props;
    
    
    
    // states:
    const {
        value              : children,
        triggerValueChange : triggerChildrenChange,
    } = useControllableAndUncontrollable<React.ReactNode[], DraggedEvent<HTMLElement>>({
        defaultValue       : (defaultUncontrollableChildren !== undefined) ? flattenChildren(defaultUncontrollableChildren) : [],
        value              : (controllableChildren          !== undefined) ? flattenChildren(controllableChildren         ) : undefined,
        onValueChange      : onControllableChildrenChange as ((children: React.ReactNode, event: DraggedEvent<HTMLElement>) => void),
    });
    
    const [draftChildren, setDraftChildren] = useState<{ children: React.ReactNode[], appliedTo: number }|undefined>(undefined);
    
    
    
    // handlers:
    const handleDragStartEnd   = useEvent((): void => {
        setDraftChildren(undefined); // if dragging is completed|canceled => resets draftChildren
    });
    
    const handleMutateChildren = useEvent((mutatedChildren: React.ReactNode[], fromChildIndex: number, toChildIndex: number): void => {
        if (orderMode === 'swap') {
            [mutatedChildren[fromChildIndex], mutatedChildren[toChildIndex]] = [mutatedChildren[toChildIndex], mutatedChildren[fromChildIndex]];
        }
        else {
            const movedItems = mutatedChildren.splice(fromChildIndex, /*just one child to remove: */1); // remove <SelectedChild> from children
            mutatedChildren.splice(toChildIndex, /*no deleted child: */0, ...movedItems);               // then insert <SelectedChild> to children
        } // if
    });
    const handleDragMove       = useEvent(({from: fromRaw, to: toRaw}: OrderableListDragMoveEvent): void => {
        const hasMoved = (toRaw < 0) || Object.is(toRaw, -0); // if negative value (including negative zero) => the item has moved from its original location to a new location
        const from     = Math.abs(fromRaw); // remove negative sign (if any)
        const to       = Math.abs(toRaw);   // remove negative sign (if any)
        
        
        
        // conditions:
        if (to === from) return; // useless move => ignore
        
        
        
        const fromLogicIndex = from;
        const toLogicIndex   = calculateWillToIndex(orderMode, fromLogicIndex, draftChildren?.appliedTo, to);
        
        
        
        // mutate:
        const fromChildIndex            = listMap.get(fromLogicIndex) ?? fromLogicIndex; // convert listIndex => childIndex
        const toChildIndex              = listMap.get(toLogicIndex)   ?? toLogicIndex;   // convert listIndex => childIndex
        const mutatedChildren           = wrappedChildren.slice(0);                      // copy
        
        // the dragging item:
        mutatedChildren[fromChildIndex] = React.cloneElement<ListItemWithOrderableProps<HTMLElement, TData>>(mutatedChildren[fromChildIndex] as React.ReactComponentElement<any, ListItemWithOrderableProps<HTMLElement, TData>>,
            // props:
            {
                refresh : {}, // declarative way to refresh()
                // theme   : 'danger', // for *visual* debugging purpose
            },
        );
        
        if (!hasMoved) { // the item is still on its original location
            const toElementIndex = listMap.get(to) ?? to;
            // convert to negative value, indicating a backup location:
            mutatedChildren[toElementIndex] = React.cloneElement<ListItemWithOrderableProps<HTMLElement, TData>>(mutatedChildren[toElementIndex] as React.ReactComponentElement<any, ListItemWithOrderableProps<HTMLElement, TData>>,
                // props:
                {
                    // *backup* the listIndex to negative value (including negative zero), so we can *restore* the draft to original placement:
                    listIndex : -to,
                    // theme     : 'success', // for *visual* debugging purpose
                },
            );
        } // if
        // else {
        //     // no need to restore, because we're re-copy from unmodified `wrappedChildren`
        //     // const toElementIndex = listMap.get(to) ?? to;
        //     // // the restored item (may the same index as the dragging item above):
        //     // mutatedChildren[toElementIndex] = React.cloneElement<ListItemWithOrderableProps<HTMLElement, TData>>(mutatedChildren[toElementIndex] as React.ReactComponentElement<any, ListItemWithOrderableProps<HTMLElement, TData>>,
        //     //     // props:
        //     //     {
        //     //         // *restore* the draft to original placement:
        //     //         listIndex : to,
        //     //         theme     : 'warning', // for *visual* debugging purpose
        //     //     },
        //     // );
        // } // if
        
        handleMutateChildren(mutatedChildren, fromChildIndex, toChildIndex);
        setDraftChildren({
            children  : mutatedChildren,
            appliedTo : toLogicIndex,
        });
    });
    const handleDropped        = useEvent(({from: fromRaw, to: toRaw}: OrderableListDroppedEvent, draggedEvent: DraggedEvent<HTMLElement>): void => {
        const from     = Math.abs(fromRaw); // remove negative sign (if any)
        const to       = (
            draftChildren?.appliedTo        // cancel out effect of moved draftChildren (if any)
            ??
            Math.abs(toRaw)                 // remove negative sign (if any)
        );
        
        
        
        // conditions:
        if (to === from) return; // useless move => ignore
        
        
        
        const fromLogicIndex = from;
        const toLogicIndex   = to;
        
        
        
        // mutate:
        const fromChildIndex            = listMap.get(fromLogicIndex) ?? fromLogicIndex; // convert listIndex => childIndex
        const toChildIndex              = listMap.get(toLogicIndex)   ?? toLogicIndex;   // convert listIndex => childIndex
        const mutatedChildren           = children.slice(0);                             // copy
        
        handleMutateChildren(mutatedChildren, fromChildIndex, toChildIndex);
        triggerChildrenChange(mutatedChildren, { triggerAt: 'immediately', event: draggedEvent });
    });
    
    
    
    // children:
    const listComponentChildren = listComponent.props.children;
    const [wrappedChildren, listMap] = useMemo<readonly [React.ReactNode[], Map<number, number>]>(() => {
        let listIndex = -1;
        const listMap = new Map<number, number>();
        const wrappedChildren = (
            listComponentChildren
            ? flattenChildren(listComponentChildren)
            : flattenChildren(children)
            .map<React.ReactNode>((listItem, childIndex) => {
                // conditions:
                if (!React.isValidElement<Omit<ListItemProps<HTMLElement>, 'draggable'>>(listItem)) return listItem; // not a <ListItem> => place it anyway
                
                
                
                // a valid listItem counter:
                listIndex++; // only count of <ListItem>s, ignores of foreign nodes
                
                
                
                // mapping listIndex => childIndex:
                listMap.set(listIndex, childIndex);
                
                
                
                // props:
                const listItemProps = listItem.props;
                
                
                
                // jsx:
                return (
                    /* wrap child with <ListItemWithOrderable> */
                    <ListItemWithOrderable<HTMLElement, TData>
                        // other props:
                        {...listItemProps} // steals all listItem's props, so the <Owner> can recognize the <ListItemWithOrderable> as <TheirChild>
                        
                        
                        
                        // identifiers:
                        key={listItem.key ?? childIndex}
                        
                        
                        
                        // positions:
                        listIndex={listIndex}
                        
                        
                        
                        // behaviors:
                        parentOrderable={parentOrderable}
                        
                        
                        
                        // components:
                        listItemComponent={
                            // clone listItem element with (almost) blank props:
                            <listItem.type
                                // identifiers:
                                key={listItem.key}
                                
                                
                                
                                //#region restore conflicting props
                                {...{
                                    ...(('listIndex'         in listItemProps) ? { listIndex         : listItemProps.listIndex         } : undefined),
                                    ...(('parentOrderable'   in listItemProps) ? { parentOrderable   : listItemProps.parentOrderable   } : undefined),
                                    ...(('listItemComponent' in listItemProps) ? { listItemComponent : listItemProps.listItemComponent } : undefined),
                                }}
                                //#endregion restore conflicting props
                            />
                        }
                    />
                );
            })
        );
        return [wrappedChildren, listMap];
    }, [listComponentChildren, children, parentOrderable]);
    
    
    
    // classes:
    const mergedClasses = useMergeClasses(
        // preserves the original `classes` from `listComponent`:
        listComponent.props.classes,
        
        
        
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // layouts:
        styleSheet.orderableList,
    );
    
    
    
    // jsx:
    return (
        <OrderableListStateProvider
            // behaviors:
            orderMode={orderMode}
            
            
            
            // states:
            appliedTo={draftChildren?.appliedTo}
            
            
            
            // handlers:
            onDragStart={handleDragStartEnd}
            onDragEnd={handleDragStartEnd}
            onDragMove={handleDragMove}
            onDropped={handleDropped}
        >
            {/* <List> */}
            {React.cloneElement<ListProps<TElement>>(listComponent,
                // props:
                {
                    // other props:
                    ...restListProps,
                    ...listComponent.props, // overwrites restListProps (if any conflics)
                    
                    
                    
                    // classes:
                    classes : mergedClasses,
                },
                
                
                
                // children:
                ((draftChildren?.children !== undefined) ? draftChildren.children : wrappedChildren),
            )}
        </OrderableListStateProvider>
    );
};
export {
    OrderableList,
    OrderableList as default,
}



export interface OrderableListComponentProps<TElement extends Element = HTMLElement, TData extends unknown = unknown>
{
    // components:
    orderableListComponent ?: React.ReactComponentElement<any, OrderableListProps<TElement, TData>>
}
