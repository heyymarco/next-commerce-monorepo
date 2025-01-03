// types:
export type OrderableListOrderMode =
    |'swap'
    |'shift'



// events:
export interface OrderableListItemDragStartEvent<TElement extends Element = HTMLElement> extends React.MouseEvent<TElement, MouseEvent> {
    /*mutable*/ response   : boolean
}
export interface OrderableListItemDropHandshakeEvent<TElement extends Element = HTMLElement, TData extends unknown = unknown> extends React.MouseEvent<TElement, MouseEvent> {
    readonly    ownListIndex  : number
    readonly    pairListIndex : number|undefined
    
    readonly    ownData       : TData|undefined
    readonly    pairData      : TData|undefined
    
    readonly    isDragging    : boolean
    /*mutable*/ response      : boolean
}
