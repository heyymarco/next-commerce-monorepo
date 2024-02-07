// data:
export type DragNDropData = Map<unknown, unknown>



// events:
export interface DragMoveEvent<TElement extends Element = HTMLElement> extends React.MouseEvent<TElement, MouseEvent> {
    readonly    dropData : undefined|DragNDropData
    readonly    response : undefined|boolean
}
export interface DragHandshakeEvent<TElement extends Element = HTMLElement> extends React.MouseEvent<TElement, MouseEvent> {
    readonly    dropData : DragNDropData
    /*mutable*/ response : undefined|boolean
}
export interface DropHandshakeEvent<TElement extends Element = HTMLElement> extends React.MouseEvent<TElement, MouseEvent> {
    readonly    dragData : DragNDropData
    /*mutable*/ response : undefined|boolean
}
export interface DraggedEvent<TElement extends Element = HTMLElement> extends React.MouseEvent<TElement, MouseEvent> {
    readonly    dropData : DragNDropData
}
export interface DroppedEvent<TElement extends Element = HTMLElement> extends React.MouseEvent<TElement, MouseEvent> {
    readonly    dragData : DragNDropData
}
