import { default as React } from 'react';
import { GlobalStackableProps } from '@reusable-ui/global-stackable';
import { DragNDropData, DragMoveEvent, DragHandshakeEvent, DraggedEvent } from '@heymarco/drag-n-drop';
import type { GenericProps } from '@reusable-ui/generic';
export interface DraggableProps<TElement extends Element = HTMLElement> extends GlobalStackableProps {
    dragData: DragNDropData;
    dragRef?: React.RefObject<TElement> | TElement | null;
    ignoreDropElements?: (React.RefObject<Element> | Element | null | undefined)[];
    enabled?: boolean;
    dragComponent?: React.ReactComponentElement<any, GenericProps<TElement>> | (() => React.ReactComponentElement<any, GenericProps<TElement>>);
    onDragMove?: (event: DragMoveEvent<TElement>) => void;
    onDragHandshake: (event: DragHandshakeEvent<TElement>) => void | Promise<void>;
    onDragged?: (event: DraggedEvent<TElement>) => void;
}
export interface DraggableApi<TElement extends Element = HTMLElement> {
    dropData: DragNDropData | undefined;
    /**
     * undefined : no  dragging activity.
     * null      : has dragging activity but outside all dropping targets.
     * false     : has dragging activity on a dropping target but the source/target refuses to be dragged/dropped.
     * true      : has dragging activity on a dropping target and the source/target wants   to be dragged/dropped.
     */
    isDragging: undefined | null | boolean;
    DragOverlay: () => React.ReactPortal | null;
    handleMouseDown: React.MouseEventHandler<TElement>;
    handleTouchStart: React.TouchEventHandler<TElement>;
}
export declare const useDraggable: <TElement extends Element = HTMLElement>(props: DraggableProps<TElement>) => DraggableApi<TElement>;
