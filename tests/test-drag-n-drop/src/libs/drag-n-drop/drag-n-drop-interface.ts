// internals:
import type {
    DragNDropData,
}                           from './types'



export class DroppableHook {
    enabled          : boolean
    dropData         : DragNDropData
    onDropHandshake  : (dragData: DragNDropData) => undefined|boolean|Promise<undefined|boolean>
    onDropped        : ((dragData: DragNDropData) => void)|undefined
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
        onDropHandshake  : (dragData: DragNDropData) => undefined|boolean|Promise<undefined|boolean>,
        onDropped        : ((dragData: DragNDropData) => void)|undefined,
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

export const attachDroppableHook = async (elements: Element[], onDragHandshake: (dropData: DragNDropData) => undefined|boolean|Promise<undefined|boolean>, dragData: DragNDropData): Promise<null|boolean> => {
    let handshakeResult : null|boolean       = null; // firstly mark as NOT_YET having handshake
    let interactedHook  : null|DroppableHook = null;
    
    
    
    for (const element of elements) {
        // conditions:
        // test for valid droppable hook:
        const droppableHook = droppableMap.get(element);
        if (!droppableHook)         continue; // not having droppable hook => see other droppables
        if (!droppableHook.enabled) continue; // disabled => noop         => see other droppables
        
        
        
        // conditions:
        // handshake interacted as NO_RESPONSE:
        const [dragNego, dropNego] = await Promise.all([
            onDragHandshake(droppableHook.dropData),
            droppableHook.onDropHandshake(dragData),
        ]);
        if (!droppableHook.enabled) continue; // disabled => noop         => see other droppables
        if (dragNego === undefined) continue; // undefined => NO_RESPONSE  => see other draggables
        if (dropNego === undefined) continue; // undefined => NO_RESPONSE  => see other droppables
        
        
        
        // handshake interacted as REFUSED|ACCEPTED:
        interactedHook = droppableHook;
        
        
        
        // handshake interacted as REFUSED:
        if (!dragNego || !dropNego) { // false => refuses to be dragged|dropped
            handshakeResult = false;  // handshake REFUSED by drop target and/or drag source
            break;                    // no need to scan other droppables
        } // if
        
        
        
        // handshake interacted as ACCEPTED:
        handshakeResult = true;       // handshake ACCEPTED by both drop target and drag source
        break;                        // no need to scan other droppables
    } // for
    
    
    
    activeDroppableHook = handshakeResult ? interactedHook : null; // set or release
    
    
    
    for (const droppableHook of droppableMap.values()) {
        // actions:
        if (droppableHook === interactedHook) {
            /*
             * undefined : NEVER HERE.  
             * null      : NEVER HERE.  
             * false     : has dropping activity on this dropping target but the source/target refuses to be dragged/dropped.  
             * true      : has dropping activity on this dropping target and the source/target wants   to be dragged/dropped.  
             */
            droppableHook.setIsDropping(!!handshakeResult);
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
    
    
    
    return handshakeResult;
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
