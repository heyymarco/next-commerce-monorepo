// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// hooks:

// states:

//#region orderableListState

// contexts:
export interface OrderableListDragStartEvent {
    from : number
}
export interface OrderableListDragMoveEvent extends MouseEvent {
    from : number
    to   : number
}
export interface OrderableListDroppedEvent {
    from : number
    to   : number
}
export interface OrderableListState
{
    // identifiers:
    dragNDropId     : symbol,
    
    
    
    // handlers:
    handleDragStart : (event: OrderableListDragStartEvent) => void
    handleDragEnd   : () => void
    handleDragMove  : (event: OrderableListDragMoveEvent) => void
    handleDropped   : (event: OrderableListDroppedEvent) => void
}

const noopHandler = () => { throw Error('not inside <OrderableList>'); };
const OrderableListStateContext = createContext<OrderableListState>({
    // identifiers:
    dragNDropId     : undefined as any,
    
    
    
    // handlers:
    handleDragStart : noopHandler,
    handleDragEnd   : noopHandler,
    handleDragMove  : noopHandler,
    handleDropped   : noopHandler,
});
OrderableListStateContext.displayName  = 'OrderableListState';

export const useOrderableListState = (): OrderableListState => {
    return useContext(OrderableListStateContext);
}



// react components:
export interface OrderableListStateProps
{
    // handlers:
    onDragStart : (event: OrderableListDragStartEvent) => void
    onDragEnd   : () => void
    onDragMove  : (event: OrderableListDragMoveEvent) => void
    onDropped   : (event: OrderableListDroppedEvent) => void
}
const OrderableListStateProvider = (props: React.PropsWithChildren<OrderableListStateProps>): JSX.Element|null => {
    // props:
    const {
        // handlers:
        onDragStart : handleDragStart,
        onDragEnd   : handleDragEnd,
        onDragMove  : handleDragMove,
        onDropped   : handleDropped,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // identifiers:
    const [dragNDropId] = useState(() => Symbol());
    
    
    
    // stable callbacks:
    const onDragStart = useEvent(handleDragStart);
    const onDragEnd   = useEvent(handleDragEnd);
    const onDragMove  = useEvent(handleDragMove);
    const onDropped   = useEvent(handleDropped);
    
    
    
    // states:
    const orderableListState = useMemo<OrderableListState>(() => ({
        // identifiers:
        dragNDropId,                   // stable ref
        
        
        
        // handlers:
        handleDragStart : onDragStart, // stable ref
        handleDragEnd   : onDragEnd,   // stable ref
        handleDragMove  : onDragMove,  // stable ref
        handleDropped   : onDropped,   // stable ref
    }), [
        // identifiers:
        // dragNDropId,                // stable ref
        
        
        
        // handlers:
        // onDragStart,                // stable ref
        // onDragEnd,                  // stable ref
        // onDragMove,                 // stable ref
        // onDropped,                  // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <OrderableListStateContext.Provider value={orderableListState}>
            {children}
        </OrderableListStateContext.Provider>
    );
};
export {
    OrderableListStateProvider,
    OrderableListStateProvider as default,
}
//#endregion orderableListState
