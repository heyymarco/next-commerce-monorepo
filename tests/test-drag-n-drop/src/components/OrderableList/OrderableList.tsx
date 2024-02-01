// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    useState,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // a set of React node utility functions:
    flattenChildren,
    
    
    
    // react helper hooks:
    useEvent,
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



// react components:
export interface OrderableListProps<TElement extends Element = HTMLElement>
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
    // children:
    defaultChildren  ?: React.ReactNode
    children         ?: React.ReactNode
    onChildrenChange ?: (children: React.ReactNode[]) => void
}
const OrderableList = <TElement extends Element = HTMLElement>(props: OrderableListProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
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
        onValueChange      : onControllableChildrenChange,
    });
    
    
    
    // handlers:
    const [draftChildren, setDraftChildren] = useState<{ children: React.ReactNode[], to: number }|undefined>(undefined);
    const handleDragStartEnd = useEvent((): void => {
        setDraftChildren(undefined); // if dragging is completed|canceled|out_of_drop => resets draftChildren
    });
    const handleDragMove     = useEvent(({from, to}: OrderableListDragMoveEvent): void => {
        // conditions:
        if (to === from) {
            return; // useless move => ignore
        }
        else if (to < 0) {
            // restore to original place;
            setDraftChildren(undefined);
            return;
        } // if
        
        
        
        // mutate:
        const fromIndex       = listMap.get(from) ?? from;
        const toIndex         = listMap.get(to)   ?? to;
        const mutatedChildren = wrappedChildren.slice(0); // copy
        [mutatedChildren[fromIndex], mutatedChildren[toIndex]] = [
            React.cloneElement<ListItemWithOrderableProps<HTMLElement>>(mutatedChildren[toIndex] as React.ReactComponentElement<any, ListItemWithOrderableProps<HTMLElement>>,
                // props:
                {
                    listIndex : -1,
                    // theme: 'danger', // for *visual* debugging purpose
                },
            ),
            mutatedChildren[fromIndex],
        ];
        setDraftChildren({
            children : mutatedChildren,
            to       : to,
        });
    });
    const handleDropped      = useEvent(({from, to}: OrderableListDroppedEvent): void => {
        to = draftChildren?.to ?? to; // cancel out effect of moved draftChildren (if any)
        if (from === to) return; // useless move => ignore
        
        
        
        // mutate:
        const fromIndex       = listMap.get(from) ?? from;
        const toIndex         = listMap.get(to)   ?? to;
        const mutatedChildren = children.slice(0); // copy
        [mutatedChildren[fromIndex], mutatedChildren[toIndex]] = [mutatedChildren[toIndex], mutatedChildren[fromIndex]];
        triggerChildrenChange(mutatedChildren);
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
                    <ListItemWithOrderable<HTMLElement>
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
