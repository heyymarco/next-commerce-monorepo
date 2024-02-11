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

// reusable-ui components:
import {
    // variants:
    ListStyle,
    ListVariant,
    
    
    
    // react components:
    ListItemProps,
    
    ListProps,
    List,
    
    ListComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content

// internals:
import type {
    // types:
    OrderMode,
}                           from './types'
import {
    useOrderableListStyleSheet,
}                           from './styles/loader'
import {
    // states:
    useControllableAndUncontrollable,
}                           from './states/hooks'
import {
    // types:
    OrderableListDragMoveEvent,
    OrderableListDroppedEvent,
    
    
    
    // react components:
    OrderableListStateProvider,
}                           from './states/orderableListState'
import {
    // react components:
    ListItemWithOrderableProps,
    ListItemWithOrderable,
}                           from './ListItemWithOrderable'
import type {
    // react components:
    OrderableListItemProps,
}                           from './OrderableListItem'



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
    orderMode        ?: OrderMode
    
    
    
    // children:
    defaultChildren  ?: React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, TData>>[]|React.ReactNode
    children         ?: React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, TData>>[]|React.ReactNode
    onChildrenChange ?: (children: React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, TData>>[]) => void
}
const OrderableList = <TElement extends Element = HTMLElement, TData extends unknown = unknown>(props: OrderableListProps<TElement, TData>): JSX.Element|null => {
    // styles:
    const styleSheet = useOrderableListStyleSheet();
    
    
    
    // rest props:
    const {
        // behaviors:
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
    } = useControllableAndUncontrollable<React.ReactNode[]>({
        defaultValue       : (defaultUncontrollableChildren !== undefined) ? flattenChildren(defaultUncontrollableChildren) : [],
        value              : (controllableChildren          !== undefined) ? flattenChildren(controllableChildren         ) : undefined,
        onValueChange      : onControllableChildrenChange as ((children: React.ReactNode) => void),
    });
    
    const [draftChildren, setDraftChildren] = useState<{ children: React.ReactNode[], to: number }|undefined>(undefined);
    
    
    
    // handlers:
    const handleDragStartEnd   = useEvent((): void => {
        setDraftChildren(undefined); // if dragging is completed|canceled => resets draftChildren
    });
    
    const handleMutateChildren = useEvent((mutatedChildren: React.ReactNode[], fromIndex: number, toIndex: number): void => {
        if (orderMode === 'swap') {
            [mutatedChildren[fromIndex], mutatedChildren[toIndex]] = [mutatedChildren[toIndex], mutatedChildren[fromIndex]];
        }
        else {
            const movedItems = mutatedChildren.splice(fromIndex, /*just one child to remove: */1); // remove <SelectedChild> from children
            mutatedChildren.splice(toIndex, /*no deleted child: */0, ...movedItems);               // then insert <SelectedChild> to children
        } // if
    });
    const handleDragMove       = useEvent(({from, to}: OrderableListDragMoveEvent): void => {
        // conditions:
        if (to === from) {
            return; // useless move => ignore
        }
        else if ((to < 0) || Object.is(to, -0)) { // if negative value (including negative zero) => *restore* the draft to original placement
            // conditions:
            const absTo = -to; // remove negative sign
            if (from === absTo) return; // useless move => ignore
            
            
            
            // mutate:
            const isFromBigger         = from < absTo;
            const backTo               = absTo + (isFromBigger ? -1 : 1);
            const fromIndex            = listMap.get(from)   ?? from;   // convert listIndex => childIndex
            const toIndex              = listMap.get(backTo) ?? backTo; // convert listIndex => childIndex
            const mutatedChildren      = wrappedChildren.slice(0);      // copy
            
            // the dragging item:
            mutatedChildren[fromIndex] = React.cloneElement<ListItemWithOrderableProps<HTMLElement, TData>>(mutatedChildren[fromIndex] as React.ReactComponentElement<any, ListItemWithOrderableProps<HTMLElement, TData>>,
                // props:
                {
                    refresh : {}, // declarative way to refresh()
                    // theme   : 'dark', // for *visual* debugging purpose
                },
            );
            
            // no need to restore, because we re-copy from unmodified `wrappedChildren`
            // // the restored item (may the same index as the dragging item above):
            // mutatedChildren[toIndex  ] = React.cloneElement<ListItemWithOrderableProps<HTMLElement, TData>>(mutatedChildren[toIndex  ] as React.ReactComponentElement<any, ListItemWithOrderableProps<HTMLElement, TData>>,
            //     // props:
            //     {
            //         // *restore* the draft to original placement:
            //         listIndex : backTo,
            //         theme     : 'warning', // for *visual* debugging purpose
            //     },
            // );
            
            handleMutateChildren(mutatedChildren, fromIndex, toIndex);
            setDraftChildren({
                children : mutatedChildren,
                to       : backTo,
            });
            
            
            
            return; // no further mutation
        } // if
        
        
        
        // mutate:
        const fromIndex            = listMap.get(from) ?? from; // convert listIndex => childIndex
        const toIndex              = listMap.get(to)   ?? to;   // convert listIndex => childIndex
        const mutatedChildren      = wrappedChildren.slice(0);  // copy
        
        // the dragging item:
        mutatedChildren[fromIndex] = React.cloneElement<ListItemWithOrderableProps<HTMLElement, TData>>(mutatedChildren[fromIndex] as React.ReactComponentElement<any, ListItemWithOrderableProps<HTMLElement, TData>>,
            // props:
            {
                refresh : {}, // declarative way to refresh()
                // theme   : 'danger', // for *visual* debugging purpose
            },
        );
        
        // the backup item:
        mutatedChildren[toIndex  ] = React.cloneElement<ListItemWithOrderableProps<HTMLElement, TData>>(mutatedChildren[toIndex  ] as React.ReactComponentElement<any, ListItemWithOrderableProps<HTMLElement, TData>>,
            // props:
            {
                // *backup* the listIndex to negative value (including negative zero), so we can *restore* the draft to original placement:
                listIndex : -to,
                // theme     : 'success', // for *visual* debugging purpose
            },
        );
        
        handleMutateChildren(mutatedChildren, fromIndex, toIndex);
        setDraftChildren({
            children : mutatedChildren,
            to       : to,
        });
    });
    const handleDropped        = useEvent(({from, to}: OrderableListDroppedEvent): void => {
        to = draftChildren?.to ?? to; // cancel out effect of moved draftChildren (if any)
        if (from === to) return; // useless move => ignore
        
        
        
        // mutate:
        const fromIndex            = listMap.get(from) ?? from; // convert listIndex => childIndex
        const toIndex              = listMap.get(to)   ?? to;   // convert listIndex => childIndex
        const mutatedChildren      = children.slice(0);         // copy
        
        handleMutateChildren(mutatedChildren, fromIndex, toIndex);
        triggerChildrenChange(mutatedChildren, { runsOnMacrotask: false });
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
                if (!React.isValidElement<ListItemProps<HTMLElement>>(listItem)) return listItem; // not a <ListItem> => place it anyway
                
                
                
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
                        
                        
                        
                        // components:
                        listItemComponent={
                            // clone listItem element with (almost) blank props:
                            <listItem.type
                                // identifiers:
                                key={listItem.key}
                                
                                
                                
                                //#region restore conflicting props
                                {...{
                                    ...(('listIndex'         in listItemProps) ? { listIndex         : listItemProps.listIndex         } : undefined),
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
    }, [listComponentChildren, children]);
    
    
    
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

export type { ListStyle, ListVariant }
