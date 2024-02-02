// data:
export type DragNDropData = Map<unknown, unknown>



// events:
export interface DragMoveEvent extends MouseEvent {
    readonly dropData : undefined|DragNDropData
    readonly response : undefined|boolean
}
export interface DragHandshakeEvent extends MouseEvent {
    dropData : DragNDropData
    response : undefined|boolean
}
export interface DropHandshakeEvent extends MouseEvent {
    dragData : DragNDropData
    response : undefined|boolean
}
export interface DraggedEvent {
    dropData : DragNDropData
}
export interface DroppedEvent {
    dragData : DragNDropData
}
