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
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import type {
    // types:
    OrderableListOrderMode,
}                           from '../types.js'



// hooks:

// states:

//#region orderableListState

// contexts:
export const enum RestoreOnce {
    NEVER,
    PLANNED,
    PERFORMED,
}
export interface IgnoreArea {
    /**
     * The known last DOM reference of target_item element.
     */
    lastElement : Element
    
    /**
     * The known last `hasMoved` status.
     */
    lastMoved   : boolean
    
    /**
     * The known last area of target_item.
     */
    lastRect    : DOMRect
    
    
    
    /**
     * The area of target_item BEFORE switching.
     */
    beforeRect  : DOMRect
    
    /**
     * The current switching state.
     */
    restoreOnce : RestoreOnce
}
export interface OrderableListDragStartEvent {
    from : number
}
export interface OrderableListDragMoveEvent {
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
    dragNDropId     : symbol
    
    
    
    // behaviors:
    orderMode       : OrderableListOrderMode
    
    
    
    // states:
    appliedTo       : number|undefined
    ignoreAreaRef   : React.MutableRefObject<IgnoreArea|undefined>
    
    
    
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
    
    
    
    // behaviors:
    orderMode       : 'shift',
    
    
    
    // states:
    appliedTo       : undefined,
    ignoreAreaRef   : { current: undefined },
    
    
    
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
    extends
        Pick<OrderableListState,
            // behaviors:
            |'orderMode'
            
            // states:
            |'appliedTo'
        >
{
    // handlers:
    onDragStart : OrderableListState['handleDragStart']
    onDragEnd   : OrderableListState['handleDragEnd']
    onDragMove  : OrderableListState['handleDragMove']
    onDropped   : OrderableListState['handleDropped']
}
const OrderableListStateProvider = (props: React.PropsWithChildren<OrderableListStateProps>): JSX.Element|null => {
    // props:
    const {
        // behaviors:
        orderMode,
        
        
        
        // states:
        appliedTo,
        
        
        
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
    const ignoreAreaRef      = useRef<IgnoreArea|undefined>(undefined);
    const orderableListState = useMemo<OrderableListState>(() => ({
        // identifiers:
        dragNDropId,                   // stable ref
        
        
        
        // behaviors:
        orderMode,                     // mutable ref
        
        
        
        // states:
        appliedTo,                     // mutable ref
        ignoreAreaRef,                 // stable ref
        
        
        
        // handlers:
        handleDragStart : onDragStart, // stable ref
        handleDragEnd   : onDragEnd,   // stable ref
        handleDragMove  : onDragMove,  // stable ref
        handleDropped   : onDropped,   // stable ref
    }), [
        // identifiers:
        // dragNDropId,                // stable ref
        
        
        
        // behaviors:
        orderMode,                     // mutable ref
        
        
        
        // states:
        appliedTo,                     // mutable ref
        // ignoreAreaRef,              // stable ref
        
        
        
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
