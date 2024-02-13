import { default as React } from 'react';
import { DragNDropData, DropHandshakeEvent, DroppedEvent } from '@heymarco/drag-n-drop';
export interface DroppableProps<TElement extends Element = HTMLElement> {
    dropData: DragNDropData;
    dropRef: React.RefObject<TElement> | TElement | null;
    enabled?: boolean;
    onDropHandshake: (event: DropHandshakeEvent<TElement>) => void | Promise<void>;
    onDropped?: (event: DroppedEvent<TElement>) => void;
}
export interface DroppableApi {
    dragData: DragNDropData | undefined;
    /**
     * undefined : no  dropping activity.
     * null      : has dropping activity but outside this dropping target.
     * false     : has dropping activity on this dropping target but the source/target refuses to be dragged/dropped.
     * true      : has dropping activity on this dropping target and the source/target wants   to be dragged/dropped.
     */
    isDropping: undefined | null | boolean;
}
export declare const useDroppable: <TElement extends Element = HTMLElement>(props: DroppableProps<TElement>) => DroppableApi;
