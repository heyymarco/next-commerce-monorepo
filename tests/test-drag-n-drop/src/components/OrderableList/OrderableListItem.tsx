// react:
import {
    // react:
    default as React,
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



// events:
export interface OrderableListItemDragStartEvent extends MouseEvent {
    /*mutable*/ response : boolean
}
export interface OrderableListItemDropHandshakeEvent extends MouseEvent {
    /*mutable*/ response : boolean
}



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
    onOrderStart     ?: (event: OrderableListItemDragStartEvent    ) => void|Promise<void>
    onOrderHandshake ?: (event: OrderableListItemDropHandshakeEvent) => void|Promise<void>
}
export const OrderableListItem       = <TElement extends Element = HTMLElement, TData extends unknown = unknown>(props: OrderableListItemProps<TElement, TData>): JSX.Element|null => {
    // rest props:
    const {
        // data:
        data             : _data,             // remove
        
        
        
        // components:
        listItemComponent = (<ListItem<TElement> /> as React.ReactComponentElement<any, ListItemProps<TElement>>),
        
        
        
        // handlers:
        onOrderStart     : _onOrderStart,     // remove
        onOrderHandshake : _onOrderHandshake, // remove
    ...restListItemProps} = props;
    
    
    
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
