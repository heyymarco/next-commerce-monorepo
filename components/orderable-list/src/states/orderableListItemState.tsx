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

// contexts:
export interface OrderableListItemRegistration<TElement extends Element = HTMLElement, TData extends unknown = unknown> {
    // behaviors:
    draggable         : boolean
    droppable         : boolean
    
    
    
    // handlers:
    onOrderStart     ?: (event: OrderableListItemDragStartEvent<TElement>           ) => void|Promise<void>
    onOrderHandshake ?: (event: OrderableListItemDropHandshakeEvent<TElement, TData>) => void|Promise<void>
}
export interface OrderableListItemState<TElement extends Element = HTMLElement, TData extends unknown = unknown>
{
    // registrations:
    registerOrderableListItem(registration: OrderableListItemRegistration<TElement, TData>): () => void
}

const noopHandler = () => { throw Error('not inside <OrderableList>'); }; // actually 'not inside <ListItemWithOrderable>'
const OrderableListItemStateContext = createContext<OrderableListItemState<Element, unknown>>({
    // registrations:
    registerOrderableListItem : noopHandler,
});
OrderableListItemStateContext.displayName  = 'OrderableListItemState';

export const useOrderableListItemState = <TElement extends Element = HTMLElement, TData extends unknown = unknown>(): OrderableListItemState<TElement, TData> => {
    return useContext(OrderableListItemStateContext);
}



// react components:
export interface OrderableListItemStateProps<TElement extends Element = HTMLElement, TData extends unknown = unknown>
{
    // registrations:
    registerOrderableListItem(registration: OrderableListItemRegistration<TElement, TData>): () => void
}
const OrderableListItemStateProvider = <TElement extends Element = HTMLElement, TData extends unknown = unknown>(props: React.PropsWithChildren<OrderableListItemStateProps<TElement, TData>>): JSX.Element|null => {
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
        <OrderableListItemStateContext.Provider value={orderableListItemState as OrderableListItemState<Element, TData>}>
            {children}
        </OrderableListItemStateContext.Provider>
    );
};
export {
    OrderableListItemStateProvider,
    OrderableListItemStateProvider as default,
}
//#endregion orderableListItemState
