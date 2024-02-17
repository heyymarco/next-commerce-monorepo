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
export interface OrderableListItemProps<TElement extends Element = HTMLElement, TData extends unknown = unknown>
    extends
        // bases:
        ListItemProps<TElement>,
        
        // components:
        ListItemComponentProps<TElement>
{
    // data:
    data             ?: TData
    
    
    
    // handlers:
    onOrderStart     ?: (event: OrderableListItemDragStartEvent<TElement>    ) => void|Promise<void>
    onOrderHandshake ?: (event: OrderableListItemDropHandshakeEvent<TElement>) => void|Promise<void>
}
export const OrderableListItem       = <TElement extends Element = HTMLElement, TData extends unknown = unknown>(props: OrderableListItemProps<TElement, TData>): JSX.Element|null => {
    // rest props:
    const {
        // data:
        data             : _data, // remove
        
        
        
        // components:
        listItemComponent = (<ListItem<TElement> /> as React.ReactComponentElement<any, ListItemProps<TElement>>),
        
        
        
        // handlers:
        onOrderStart,             // take
        onOrderHandshake,         // take
    ...restListItemProps} = props;
    
    
    
    // states:
    const {
        // registrations:
        registerOrderableListItem,
        unregisterOrderableListItem,
    } = useOrderableListItemState<TElement>();
    
    
    
    // effects:
    useEffect(() => {
        // setups:
        registerOrderableListItem({
            // handlers:
            onOrderStart,
            onOrderHandshake,
        });
        
        
        
        // cleanups:
        return () => {
            unregisterOrderableListItem({
                // handlers:
                onOrderStart,
                onOrderHandshake,
            });
        };
    }, [onOrderStart, onOrderHandshake]);
    
    
    
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
