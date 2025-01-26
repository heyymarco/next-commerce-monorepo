// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
}                           from 'react'

// internals:
import type {
    // events:
    OrderableListItemDragStartEvent,
    OrderableListItemDropHandshakeEvent,
}                           from '../types.js'



// hooks:

// states:

//#region orderableListItemState

/*
    We use HTMLElement instead of Element because HTMLElement supports drag-and-drop, while Element does not.
*/

// contexts:
export interface OrderableListItemRegistration<TElement extends HTMLElement = HTMLElement, TData extends unknown = unknown> {
    // behaviors:
    draggable         : boolean
    droppable         : boolean
    
    
    
    // handlers:
    onOrderStart     ?: (event: OrderableListItemDragStartEvent<TElement>           ) => void|Promise<void>
    onOrderHandshake ?: (event: OrderableListItemDropHandshakeEvent<TElement, TData>) => void|Promise<void>
}
export interface OrderableListItemState<TElement extends HTMLElement = HTMLElement, TData extends unknown = unknown>
{
    // registrations:
    registerOrderableListItem(registration: OrderableListItemRegistration<TElement, TData>): () => void
}

const noopHandler = () => { throw Error('not inside <OrderableList>'); }; // actually 'not inside <ListItemWithOrderable>'
const OrderableListItemStateContext = createContext<OrderableListItemState<HTMLElement, unknown>>({
    // registrations:
    registerOrderableListItem : noopHandler,
});
OrderableListItemStateContext.displayName  = 'OrderableListItemState';

export const useOrderableListItemState = <TElement extends HTMLElement = HTMLElement, TData extends unknown = unknown>(): OrderableListItemState<TElement, TData> => {
    return useContext(OrderableListItemStateContext);
}



// react components:
export interface OrderableListItemStateProps<TElement extends HTMLElement = HTMLElement, TData extends unknown = unknown>
{
    // registrations:
    registerOrderableListItem(registration: OrderableListItemRegistration<TElement, TData>): () => void
}
const OrderableListItemStateProvider = <TElement extends HTMLElement = HTMLElement, TData extends unknown = unknown>(props: React.PropsWithChildren<OrderableListItemStateProps<TElement, TData>>): JSX.Element|null => {
    // props:
    const {
        // registrations:
        registerOrderableListItem,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // states:
    const orderableListItemState = useMemo<OrderableListItemState<TElement, TData>>(() => ({
        // handlers:
        registerOrderableListItem, // stable ref
    }), []);
    
    
    
    // jsx:
    return (
        <OrderableListItemStateContext.Provider value={orderableListItemState as OrderableListItemState<HTMLElement, TData>}>
            {children}
        </OrderableListItemStateContext.Provider>
    );
};
export {
    OrderableListItemStateProvider,
    OrderableListItemStateProvider as default,
}
//#endregion orderableListItemState
