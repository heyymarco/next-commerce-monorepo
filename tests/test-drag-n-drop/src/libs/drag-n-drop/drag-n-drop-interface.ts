// internals:
import type {
    // data:
    DragNDropData,
    
    
    
    // events:
    DragHandshakeEvent,
    DropHandshakeEvent,
    DroppedEvent,
}                           from './types'



export class DroppableHook {
    enabled          : boolean
    dropData         : DragNDropData
    onDropHandshake  : (event: DropHandshakeEvent) => void|Promise<void>
    onDropped        : ((event: DroppedEvent) => void)|undefined
    setIsDropping    : (newIsDropping: undefined|null|boolean) => void
    
    constructor({
        enabled,
        dropData,
        onDropHandshake,
        onDropped,
        setIsDropping,
    } : {
        enabled          : boolean,
        dropData         : DragNDropData,
        onDropHandshake  : (event: DropHandshakeEvent) => void|Promise<void>,
        onDropped        : ((event: DroppedEvent) => void)|undefined,
        setIsDropping    : (newIsDropping: undefined|null|boolean) => void
    }) {
        this.enabled         = enabled;
        this.dropData        = dropData;
        this.onDropHandshake = onDropHandshake;
        this.onDropped       = onDropped;
        this.setIsDropping   = setIsDropping;
    }
}



const droppableMap      = new Map<Element, DroppableHook>();
let activeDroppableHook : null|DroppableHook = null;

export interface AttachedDroppableHookResult {
    response : null|boolean
    dropData : undefined|DragNDropData
}
export const attachDroppableHook = async (event: MouseEvent, onDragHandshake: (event: DragHandshakeEvent) => void|Promise<void>, dragData: DragNDropData): Promise<AttachedDroppableHookResult> => {
    let response       : null|boolean       = null; // firstly mark as NOT_YET having handshake (null: has dragging activity but outside all dropping targets)
    let interactedHook : null|DroppableHook = null;
    
    
    
    for (const element of document.elementsFromPoint(event.clientX, event.clientY)) {
        // conditions:
        // test for valid droppable hook:
        const droppableHook = droppableMap.get(element);
        if (!droppableHook)         continue; // not having droppable hook => see other droppables
        if (!droppableHook.enabled) continue; // disabled => noop          => see other droppables
        
        
        
        // conditions:
        // handshake interacted as NO_RESPONSE:
        const [dragResponse, dropResponse] = await Promise.all([
            (async (): Promise<undefined|boolean> => {
                const dragHandshakeEvent = Object.defineProperties<DragHandshakeEvent>(new MouseEvent('draghandshake', event) as any, {
                    dropData : { value : droppableHook.dropData     },
                    response : { value : undefined, writable : true },
                });
                await onDragHandshake(dragHandshakeEvent);
                return dragHandshakeEvent.response;
            })(),
            (async (): Promise<undefined|boolean> => {
                const dropHandshakeEvent = Object.defineProperties<DropHandshakeEvent>(new MouseEvent('drophandshake', event) as any, {
                    dragData : { value : dragData                   },
                    response : { value : undefined, writable : true },
                });
                await droppableHook.onDropHandshake(dropHandshakeEvent);
                return dropHandshakeEvent.response;
            })(),
        ]);
        if (!droppableHook.enabled    ) continue; // disabled => noop         => see other droppables
        if (dragResponse === undefined) continue; // undefined => NO_RESPONSE => see other draggables
        if (dropResponse === undefined) continue; // undefined => NO_RESPONSE => see other droppables
        
        
        
        // handshake interacted as REFUSED|ACCEPTED:
        interactedHook = droppableHook;
        
        
        
        // handshake interacted as REFUSED:
        if (!dragResponse || !dropResponse) { // false => refuses to be dragged|dropped
            response = false;                 // handshake REFUSED by drop target and/or drag source
            break;                            // no need to scan other droppables
        } // if
        
        
        
        // handshake interacted as ACCEPTED:
        response = true;                      // handshake ACCEPTED by both drop target and drag source
        break;                                // no need to scan other droppables
    } // for
    
    
    
    activeDroppableHook = response ? interactedHook : null; // true => set -or- null|false => release
    
    
    
    for (const droppableHook of droppableMap.values()) {
        // actions:
        if (droppableHook === interactedHook) {
            /*
             * undefined : NEVER HERE.  
             * null      : NEVER HERE.  
             * false     : has dropping activity on this dropping target but the source/target refuses to be dragged/dropped.  
             * true      : has dropping activity on this dropping target and the source/target wants   to be dragged/dropped.  
             */
            droppableHook.setIsDropping(!!response);
        }
        else {
            /*
             * undefined : NEVER HERE.  
             * null      : has dropping activity but outside this dropping target.  
             * false     : NEVER HERE.  
             * true      : NEVER HERE.  
             */
            droppableHook.setIsDropping(null);
        } // if
    } // for
    
    
    
    return {
        response,
        dropData : interactedHook?.dropData,
    };
};
export const detachDroppableHook = (): void => {
    activeDroppableHook = null; // release
    
    
    
    for (const droppableHook of droppableMap.values()) {
        // actions:
        droppableHook.setIsDropping(undefined); // no  dropping activity
    } // for
};
export const getActiveDroppableHook = (): null|DroppableHook => {
    return activeDroppableHook;
};



export const registerDroppableHook   = (element: Element, droppableHook: DroppableHook): void => {
    droppableHook.enabled = true; // mount
    droppableMap.set(element, droppableHook);
};
export const unregisterDroppableHook = (element: Element): null|DroppableHook => {
    const droppableHook = droppableMap.get(element); // backup
    if (droppableHook) droppableHook.enabled = false; // unmount
    droppableMap.delete(element);
    
    
    
    if (droppableHook && (droppableHook === activeDroppableHook)) {
        activeDroppableHook = null; // release
    } // if
    
    
    
    return droppableHook ?? null; // found | not found
};
