// data:
export type DragNDropData = Map<unknown, unknown>



// events:
export interface DragMoveEvent<TElement extends Element = HTMLElement> extends React.SyntheticEvent<TElement, MouseEvent> {
    readonly    dropData : undefined|DragNDropData
    readonly    response : undefined|boolean
}
export interface DragHandshakeEvent<TElement extends Element = HTMLElement> extends React.SyntheticEvent<TElement, MouseEvent> {
    readonly    dropData : DragNDropData
    /*mutable*/ response : undefined|boolean
}
export interface DropHandshakeEvent<TElement extends Element = HTMLElement> extends React.SyntheticEvent<TElement, MouseEvent> {
    readonly    dragData : DragNDropData
    /*mutable*/ response : undefined|boolean
}
export interface DraggedEvent {
    readonly    dropData : DragNDropData
}
export interface DroppedEvent {
    readonly    dragData : DragNDropData
}
