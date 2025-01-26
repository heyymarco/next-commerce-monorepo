// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    ListItemProps,
    ListItem,
    
    ListSeparatorItemProps,
    ListSeparatorItem,
    
    ListItemComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content

// internals:
import type {
    // events:
    OrderableListItemDragStartEvent,
    OrderableListItemDropHandshakeEvent,
}                           from './types.js'
import {
    // states:
    useOrderableListItemState,
}                           from './states/orderableListItemState.js'



// react components:
/*
    We use HTMLElement instead of Element because HTMLElement supports drag-and-drop, while Element does not.
*/
export interface OrderableListItemProps<TElement extends HTMLElement = HTMLElement, TData extends unknown = unknown>
    extends
        // bases:
        ListItemProps<TElement>,
        
        // components:
        ListItemComponentProps<TElement>
{
    // data:
    data             ?: TData
    
    
    
    // behaviors:
    orderable        ?: boolean
    draggable        ?: boolean
    droppable        ?: boolean
    
    
    
    // handlers:
    onOrderStart     ?: (event: OrderableListItemDragStartEvent<TElement>           ) => void|Promise<void>
    onOrderHandshake ?: (event: OrderableListItemDropHandshakeEvent<TElement, TData>) => void|Promise<void>
}
export const OrderableListItem       = <TElement extends HTMLElement = HTMLElement, TData extends unknown = unknown>(props: OrderableListItemProps<TElement, TData>): JSX.Element|null => {
    // rest props:
    const {
        // data:
        data              : _data,     // remove
        
        
        
        // behaviors:
        orderable         = true,      // take
        draggable         = orderable,
        droppable         = orderable,
        
        
        
        // components:
        listItemComponent = (<ListItem<TElement> /> as React.ReactComponentElement<any, ListItemProps<TElement>>),
        
        
        
        // handlers:
        onOrderStart,                  // take
        onOrderHandshake,              // take
    ...restListItemProps} = props;
    
    
    
    // states:
    const {
        // registrations:
        registerOrderableListItem,
    } = useOrderableListItemState<TElement, TData>();
    
    
    
    // effects:
    useEffect(() => {
        // setups:
        const unregisterOrderableListItem = registerOrderableListItem({
            // behaviors:
            draggable,
            droppable,
            
            
            
            // handlers:
            onOrderStart,
            onOrderHandshake,
        });
        
        
        
        // cleanups:
        return () => {
            unregisterOrderableListItem();
        };
    }, [draggable, droppable, onOrderStart, onOrderHandshake]);
    
    
    
    // jsx:
    return (
        /* <ListItem> */
        React.cloneElement<ListItemProps<TElement>>(listItemComponent,
            // props:
            {
                // other props:
                ...restListItemProps,
                ...listItemComponent.props, // overwrites restListItemProps (if any conflics)
            },
            
            
            
            // children:
            listItemComponent.props.children ?? props.children,
        )
    );
};



export {
    type ListSeparatorItemProps,
    ListSeparatorItem,
}



export interface OrderableListItemComponentProps<TElement extends HTMLElement = HTMLElement, TData extends unknown = unknown>
{
    // components:
    orderableListItemComponent ?: React.ReactComponentElement<any, OrderableListItemProps<TElement, TData>>
}
