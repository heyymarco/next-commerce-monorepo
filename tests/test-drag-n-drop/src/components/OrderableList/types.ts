// types:
export type OrderMode =
    |'swap'
    |'shift'



// events:
export interface OrderableListItemDragStartEvent<TElement extends Element = HTMLElement> extends React.MouseEvent<TElement, MouseEvent> {
    /*mutable*/ response   : boolean
}
export interface OrderableListItemDropHandshakeEvent<TElement extends Element = HTMLElement> extends React.MouseEvent<TElement, MouseEvent> {
    readonly    isDragging : boolean
    /*mutable*/ response   : boolean
}
