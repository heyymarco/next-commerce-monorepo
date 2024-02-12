/// <reference types="react" />
import type { DragNDropData, DragHandshakeEvent, DropHandshakeEvent, DroppedEvent } from './types.js';
export declare class DroppableHook<TElement extends Element = HTMLElement> {
    enabled: boolean;
    dropData: DragNDropData;
    dropRef: React.RefObject<TElement> | TElement | null;
    onDropHandshake: (event: DropHandshakeEvent<TElement>) => void | Promise<void>;
    onDropped: ((event: DroppedEvent<TElement>) => void) | undefined;
    setIsDropping: (newIsDropping: undefined | null | boolean) => void;
    setDragData: (newDragData: DragNDropData | undefined) => void;
    constructor({ enabled, dropData, dropRef, onDropHandshake, onDropped, setIsDropping, setDragData, }: {
        enabled: boolean;
        dropData: DragNDropData;
        dropRef: React.RefObject<TElement> | TElement | null;
        onDropHandshake: (event: DropHandshakeEvent<TElement>) => void | Promise<void>;
        onDropped: ((event: DroppedEvent<TElement>) => void) | undefined;
        setIsDropping: (newIsDropping: undefined | null | boolean) => void;
        setDragData: (newDragData: DragNDropData | undefined) => void;
    });
}
export declare const enterDroppableHook: (dragData: DragNDropData) => void;
export interface AttachedDroppableHookOptions<TElement extends Element = HTMLElement> {
    dragRef?: React.RefObject<TElement> | TElement | null;
    onDragHandshake?: (event: DragHandshakeEvent<TElement>) => void | Promise<void>;
    ignoreDropElements?: (React.RefObject<Element> | Element | null | undefined)[];
}
export interface AttachedDroppableHookResult {
    response: null | boolean;
    dropData: undefined | DragNDropData;
    pointedElement: null | Element;
}
export declare const attachDroppableHook: <TElement extends Element = HTMLElement>(event: MouseEvent, options?: AttachedDroppableHookOptions<TElement> | undefined) => Promise<AttachedDroppableHookResult>;
export declare const leaveDroppableHook: () => void;
export declare const getActiveDroppableHook: () => null | DroppableHook<Element>;
export declare const getActiveDroppableTarget: () => null | Element;
export declare const registerDroppableHook: <TElement extends Element = HTMLElement>(element: Element, droppableHook: DroppableHook<TElement>) => void;
export declare const unregisterDroppableHook: <TElement extends Element = HTMLElement>(element: Element) => DroppableHook<TElement> | null;
