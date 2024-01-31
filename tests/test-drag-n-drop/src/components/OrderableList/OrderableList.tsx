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
    OrderableListDragStartEvent,
    OrderableListDragMoveEvent,
    OrderableListDroppedEvent,
    
    
    
    // react components:
    OrderableListStateProvider,
}                           from './states/orderableListState'
import {
    // react components:
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
    // const draggingFromRef = useRef<number>(0);
    const lastDropTo      = useRef<number|undefined>(undefined);
    const handleDragStart = useEvent(({from}: OrderableListDragStartEvent): void => {
        // draggingFromRef.current = from;
        lastDropTo.current      = undefined;
    });
    const handleDragEnd   = useEvent(() => {
        // if dragging is completed|canceled|out_of_drop => resets draftChildren:
        setDraftChildren(undefined);
    });
    const handleDragMove  = useEvent(({from, to}: OrderableListDragMoveEvent): void => {
        // conditions:
        console.log({from, to, date: Date.now()});
        if (to === from) {
            return;
        }
        else if (to === lastDropTo.current) {
            console.log('back', {from, to, date: Date.now()});
            // lastDropTo.current = from;
            // if (draftChildren !== undefined) setDraftChildren(undefined); // reset to original place
            // const backup = from;
            // from = to;
            // to = backup;
            // from = to;
            return;
        } // if
        
        
        
        lastDropTo.current = to;
        
        
        
        const mutatedChildren = wrappedChildren.slice(0); // copy
        [mutatedChildren[from], mutatedChildren[to]] = [mutatedChildren[to], mutatedChildren[from]];
        setDraftChildren(mutatedChildren);
    });
    const handleDropped   = useEvent(({from, to}: OrderableListDroppedEvent): void => {
        to = lastDropTo.current ?? to; // cancel out effect of moved draftChildren (if any)
        const mutatedChildren = children.slice(0); // copy
        [mutatedChildren[from], mutatedChildren[to]] = [mutatedChildren[to], mutatedChildren[from]];
        triggerChildrenChange(mutatedChildren);
    });
    
    
    
    // children:
    const listComponentChildren = listComponent.props.children;
    const wrappedChildren = useMemo<React.ReactNode[]>(() => {
        let listIndex = -1;
        return (
            listComponentChildren
            ? flattenChildren(listComponentChildren)
            : flattenChildren(children)
            .map<React.ReactNode>((listItem, childIndex) => {
                // conditions:
                if (!React.isValidElement<ListItemProps<HTMLElement>>(listItem)) return <>{listItem}</>; // not an <ListItem> => place it anyway
                
                
                
                // a valid listItem counter:
                listIndex++; // only count of <ListItem>s, ignores of foreign nodes
                
                
                
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
                    >
                        key: {listItem.key} | {listItem.props.children}
                    </ListItemWithOrderable>
                );
            })
        );
    }, [listComponentChildren, children]);
    
    
    
    const [draftChildren, setDraftChildren] = useState<React.ReactNode[]|undefined>(undefined);
    
    
    
    // jsx:
    return (
        <OrderableListStateProvider
            // handlers:
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
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
                ((draftChildren !== undefined) ? draftChildren : wrappedChildren),
            )}
        </OrderableListStateProvider>
    );
};
export {
    OrderableList,
    OrderableList as default,
}

export type { ListStyle, ListVariant }
