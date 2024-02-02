// data:
export type DragNDropData = Map<unknown, unknown>



// events:
export interface DragMoveEvent extends MouseEvent {}
export interface DragHandshakeEvent extends MouseEvent {
    dropData : DragNDropData
    response : undefined|boolean|Promise<undefined|boolean>
}
