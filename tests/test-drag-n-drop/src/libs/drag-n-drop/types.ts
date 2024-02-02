// data:
export type DragNDropData = Map<unknown, unknown>



// events:
export interface DragMoveEvent extends MouseEvent {
    readonly    dropData : undefined|DragNDropData
    readonly    response : undefined|boolean
}
export interface DragHandshakeEvent extends MouseEvent {
    readonly    dropData : DragNDropData
    /*mutable*/ response : undefined|boolean
}
export interface DropHandshakeEvent extends MouseEvent {
    readonly    dragData : DragNDropData
    /*mutable*/ response : undefined|boolean
}
export interface DraggedEvent {
    dropData : DragNDropData
}
export interface DroppedEvent {
    dragData : DragNDropData
}
