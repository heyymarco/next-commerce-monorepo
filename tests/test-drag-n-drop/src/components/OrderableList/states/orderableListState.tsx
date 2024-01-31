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
        onDragStart,
        onDragEnd,
        onDragMove,
        onDropped,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // identifiers:
    const dragNDropId = useMemo(() => Symbol(), []);
    
    
    
    // states:
    const orderableListState = useMemo<OrderableListState>(() => ({
        // identifiers:
        dragNDropId, // stable ref
        
        
        
        // handlers:
        handleDragStart : onDragStart,
        handleDragEnd   : onDragEnd,
        handleDragMove  : onDragMove,
        handleDropped   : onDropped,
    }), [
        // handlers:
        onDragStart,
        onDragEnd,
        onDragMove,
        onDropped,
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
