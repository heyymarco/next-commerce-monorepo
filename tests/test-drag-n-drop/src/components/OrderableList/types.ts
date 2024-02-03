// events:
export interface OrderableListItemDragStartEvent<TElement extends Element = HTMLElement> extends React.SyntheticEvent<TElement, MouseEvent> {
    /*mutable*/ response : boolean
}
export interface OrderableListItemDropHandshakeEvent<TElement extends Element = HTMLElement> extends React.SyntheticEvent<TElement, MouseEvent> {
    /*mutable*/ response : boolean
}
