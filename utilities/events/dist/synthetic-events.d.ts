/// <reference types="react" />
export interface CreateSyntheticEventOptions<TElement extends Element, TEvent extends Event> {
    /**
     * The underlying original native event.
     * Required.
     */
    nativeEvent: TEvent;
    /**
     * The event type.
     * Optional: If omitted => internally use `nativeEvent.type`.
     */
    type?: string;
    /**
     * The DOM reference whose event listener's callback is currently being invoked (the triggering element).
     * Optional: If omitted => internally use `nativeEvent.currentTarget`.
     */
    currentTarget?: TElement;
    /**
     * The DOM reference which event is dispatched (the affected element).
     * Optional: If omitted => internally use `nativeEvent.target`.
     */
    target?: EventTarget;
}
export declare const createSyntheticEvent: <TElement extends Element, TEvent extends Event>(options: CreateSyntheticEventOptions<TElement, TEvent>) => import("react").SyntheticEvent<TElement, TEvent>;
export interface CreateSyntheticUIEventOptions<TElement extends Element, TEvent extends UIEvent> extends CreateSyntheticEventOptions<TElement, TEvent> {
}
export declare const createSyntheticUIEvent: <TElement extends Element, TEvent extends UIEvent>(options: CreateSyntheticUIEventOptions<TElement, TEvent>) => import("react").UIEvent<TElement, TEvent>;
export interface CreateSyntheticMouseEventOptions<TElement extends Element, TEvent extends MouseEvent> extends CreateSyntheticUIEventOptions<TElement, TEvent> {
    /**
     * The DOM reference of the secondary target for the mouse event, if there is one.
     * Optional: If omitted => internally use `nativeEvent.relatedTarget`.
     */
    relatedTarget?: EventTarget | null;
}
export declare const createSyntheticMouseEvent: <TElement extends Element, TEvent extends MouseEvent>(options: CreateSyntheticMouseEventOptions<TElement, TEvent>) => import("react").MouseEvent<TElement, TEvent>;
