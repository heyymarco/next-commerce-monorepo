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
export interface OrderableListItemRegistration<TElement extends Element = HTMLElement> {
    // behaviors:
    draggable         : boolean
    droppable         : boolean
    
    
    
    // handlers:
    onOrderStart     ?: (event: OrderableListItemDragStartEvent<TElement>    ) => void|Promise<void>
    onOrderHandshake ?: (event: OrderableListItemDropHandshakeEvent<TElement>) => void|Promise<void>
}
export interface OrderableListItemState<TElement extends Element = HTMLElement>
{
    // registrations:
    registerOrderableListItem(registration: OrderableListItemRegistration<TElement>): () => void
}

const noopHandler = () => { throw Error('not inside <OrderableList>'); }; // actually 'not inside <ListItemWithOrderable>'
const OrderableListItemStateContext = createContext<OrderableListItemState<Element>>({
    // registrations:
    registerOrderableListItem : noopHandler,
});
OrderableListItemStateContext.displayName  = 'OrderableListItemState';

export const useOrderableListItemState = <TElement extends Element = HTMLElement>(): OrderableListItemState<TElement> => {
    return useContext(OrderableListItemStateContext);
}



// react components:
export interface OrderableListItemStateProps<TElement extends Element = HTMLElement>
{
    // registrations:
    registerOrderableListItem(registration: OrderableListItemRegistration<TElement>): () => void
}
const OrderableListItemStateProvider = <TElement extends Element = HTMLElement>(props: React.PropsWithChildren<OrderableListItemStateProps<TElement>>): JSX.Element|null => {
    // props:
    const {
        // registrations:
        registerOrderableListItem,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // states:
    const orderableListItemState = useMemo<OrderableListItemState<TElement>>(() => ({
        // handlers:
        registerOrderableListItem, // stable ref
    }), []);
    
    
    
    // jsx:
    return (
        <OrderableListItemStateContext.Provider value={orderableListItemState as OrderableListItemState<Element>}>
            {children}
        </OrderableListItemStateContext.Provider>
    );
};
export {
    OrderableListItemStateProvider,
    OrderableListItemStateProvider as default,
}
//#endregion orderableListItemState
