// internals:
import type {
    // data:
    DragNDropData,
    
    
    
    // events:
    DragHandshakeEvent,
    DropHandshakeEvent,
    DroppedEvent,
}                           from './types'

// utilities:
import {
    createSyntheticEvent,
}                           from '@/libs/hooks'



export class DroppableHook<TElement extends Element = HTMLElement> {
    enabled          : boolean
    dropData         : DragNDropData
    onDropHandshake  : (event: DropHandshakeEvent<TElement>) => void|Promise<void>
    onDropped        : ((event: DroppedEvent) => void)|undefined
    setIsDropping    : (newIsDropping: undefined|null|boolean) => void
    setDragData      : (newDragData: DragNDropData|undefined) => void
    
    constructor({
        enabled,
        dropData,
        onDropHandshake,
        onDropped,
        setIsDropping,
        setDragData,
    } : {
        enabled          : boolean
        dropData         : DragNDropData
        onDropHandshake  : (event: DropHandshakeEvent<TElement>) => void|Promise<void>
        onDropped        : ((event: DroppedEvent) => void)|undefined
        setIsDropping    : (newIsDropping: undefined|null|boolean) => void
        setDragData      : (newDragData: DragNDropData|undefined) => void
    }) {
        this.enabled         = enabled;
        this.dropData        = dropData;
        this.onDropHandshake = onDropHandshake;
        this.onDropped       = onDropped;
        this.setIsDropping   = setIsDropping;
        this.setDragData     = setDragData;
    }
}



// states:
const registeredDroppableHook = new Map<Element, DroppableHook<Element>>();
let activeDroppableHook       : null|DroppableHook<Element> = null;
let registeredDragData        : undefined|DragNDropData     = undefined;



// draggable sides:
export const registerDragData   = (dragData: DragNDropData) => {
    registeredDragData = dragData;
    
    
    
    for (const droppableHook of registeredDroppableHook.values()) {
        droppableHook.setDragData(dragData);
    } // for
};
export const unregisterDragData = () => {
    registeredDragData = undefined;
    
    
    
    for (const droppableHook of registeredDroppableHook.values()) {
        droppableHook.setDragData(undefined);
    } // for
};

export interface AttachedDroppableHookResult {
    response : null|boolean
    dropData : undefined|DragNDropData
}
export const attachDroppableHook = async <TElement extends Element = HTMLElement>(event: MouseEvent, onDragHandshake: (event: DragHandshakeEvent<TElement>) => void|Promise<void>): Promise<AttachedDroppableHookResult> => {
    let response       : null|boolean                 = null; // firstly mark as NOT_YET having handshake (null: has dragging activity but outside all dropping targets)
    let interactedHook : null|DroppableHook<TElement> = null;
    
    
    
    for (const element of document.elementsFromPoint(event.clientX, event.clientY)) {
        // conditions:
        // test for valid droppable hook:
        const droppableHook = registeredDroppableHook.get(element) as DroppableHook<TElement>|undefined;
        if (!droppableHook)         continue; // not having droppable hook => see other droppables
        if (!droppableHook.enabled) continue; // disabled => noop          => see other droppables
        
        
        
        // conditions:
        // handshake interacted as NO_RESPONSE:
        const [dragResponse, dropResponse] = await Promise.all([
            (async (): Promise<undefined|boolean> => {
                const dragHandshakeEvent = createSyntheticEvent<TElement, MouseEvent>(event) as unknown as DragHandshakeEvent<TElement>;
                // @ts-ignore
                dragHandshakeEvent.type = 'draghandshake';
                // @ts-ignore
                dragHandshakeEvent.dropData = droppableHook.dropData;
                dragHandshakeEvent.response = undefined; // initially no response
                await onDragHandshake(dragHandshakeEvent);
                return dragHandshakeEvent.response;      // get the modified response
            })(),
            (async (): Promise<undefined|boolean> => {
                // conditions:
                if (registeredDragData === undefined) return undefined; // already `unregisterDragData()` => no need to response
                
                
                
                const dropHandshakeEvent = createSyntheticEvent<TElement, MouseEvent>(event) as unknown as DropHandshakeEvent<TElement>;
                // @ts-ignore
                dropHandshakeEvent.type = 'drophandshake';
                // @ts-ignore
                dropHandshakeEvent.dragData = registeredDragData;
                dropHandshakeEvent.response = undefined; // initially no response
                await droppableHook.onDropHandshake(dropHandshakeEvent);
                return dropHandshakeEvent.response;      // get the modified response
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
    
    
    
    activeDroppableHook = response ? (interactedHook as DroppableHook<Element>|null) : null; // true => set -or- null|false => release
    
    
    
    for (const droppableHook of registeredDroppableHook.values()) {
        // actions:
        if (droppableHook === interactedHook) {
            /*
             * undefined : NEVER HERE.  
             * null      : NEVER HERE.  
             * false     : has dropping activity on this dropping target but the source/target refuses to be dragged/dropped.  
             * true      : has dropping activity on this dropping target and the source/target wants   to be dragged/dropped.  
             */
            droppableHook.setIsDropping(!!response); // is dropping here (false|true)
        }
        else {
            /*
             * undefined : NEVER HERE.  
             * null      : has dropping activity but outside this dropping target.  
             * false     : NEVER HERE.  
             * true      : NEVER HERE.  
             */
            droppableHook.setIsDropping(null); // not dropping here
        } // if
    } // for
    
    
    
    return {
        response,
        dropData : interactedHook?.dropData,
    };
};
export const detachDroppableHook = (): void => {
    activeDroppableHook = null; // release
    
    
    
    for (const droppableHook of registeredDroppableHook.values()) {
        // actions:
        droppableHook.setIsDropping(undefined); // no  dropping activity
    } // for
};

export const getActiveDroppableHook = (): null|DroppableHook<Element> => {
    return activeDroppableHook;
};



// droppable sides:
export const registerDroppableHook   = <TElement extends Element = HTMLElement>(element: Element, droppableHook: DroppableHook<TElement>): void => {
    droppableHook.enabled = true; // mount
    registeredDroppableHook.set(element, droppableHook as DroppableHook<Element>);
};
export const unregisterDroppableHook = <TElement extends Element = HTMLElement>(element: Element): null|DroppableHook<TElement> => {
    const droppableHook = registeredDroppableHook.get(element); // backup
    if (droppableHook) droppableHook.enabled = false; // unmount
    registeredDroppableHook.delete(element);
    
    
    
    if (droppableHook && (droppableHook === activeDroppableHook)) {
        activeDroppableHook = null; // release
    } // if
    
    
    
    return droppableHook ?? null; // found | not found
};



// draggable files:
if ((typeof(window) !== 'undefined') && (typeof(document) !== 'undefined')) {
    let   globalDragEnterCounter = 0;
    const handleGlobalDragEnter = (event: DragEvent) => {
        // conditions:
        globalDragEnterCounter++; // count bubbling from nested elements
        if (globalDragEnterCounter !== 1) return; // ignore bubbling from nested elements
        
        const items = event.dataTransfer?.items;
        if (!items?.length) return;
        
        
        
        const dragData = new Map<string, any|File|string>();
        for (const item of items) {
            const isFile = (
                (item.kind === 'file')
                ? item.getAsFile()
                : false
            );
            if (isFile === false) {
                item.getAsString((value) => {
                    dragData.set(item.kind, value);
                });
            }
            else {
                dragData.set('file', isFile);
            } // if
        } // for
        if (!dragData.size) return;
        
        
        
        registerDragData(dragData);
    };
    const handleGlobalDragLeave = (event: DragEvent) => {
        // conditions:
        if (globalDragEnterCounter === 0) return; // protect from negative value
        globalDragEnterCounter--; // uncount bubbling from nested elements
        if (globalDragEnterCounter !== 0) return; // ignore bubbling from nested elements
        
        
        
        unregisterDragData();
    };
    
    
    
    document.addEventListener('dragenter', handleGlobalDragEnter);
    document.addEventListener('dragleave', handleGlobalDragLeave);
} // if
