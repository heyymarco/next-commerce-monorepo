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
    createSyntheticMouseEvent,
}                           from '@/libs/hooks'



// utilities:
const selfAndAncestors = (element: Element): Element[] => {
    const results : Element[] = [element];
    for (let parent = element.parentElement; !!parent; parent = parent.parentElement) {
        results.push(parent);
    } // for
    return results;
};



export class DroppableHook<TElement extends Element = HTMLElement> {
    enabled          : boolean
    dropData         : DragNDropData
    dropRef          : React.RefObject<TElement>|TElement|null // getter ref
    onDropHandshake  : (event: DropHandshakeEvent<TElement>) => void|Promise<void>
    onDropped        : ((event: DroppedEvent<TElement>) => void)|undefined
    setIsDropping    : (newIsDropping: undefined|null|boolean) => void
    setDragData      : (newDragData: DragNDropData|undefined) => void
    
    constructor({
        enabled,
        dropData,
        dropRef,
        onDropHandshake,
        onDropped,
        setIsDropping,
        setDragData,
    } : {
        enabled          : boolean
        dropData         : DragNDropData
        dropRef          : React.RefObject<TElement>|TElement|null // getter ref
        onDropHandshake  : (event: DropHandshakeEvent<TElement>) => void|Promise<void>
        onDropped        : ((event: DroppedEvent<TElement>) => void)|undefined
        setIsDropping    : (newIsDropping: undefined|null|boolean) => void
        setDragData      : (newDragData: DragNDropData|undefined) => void
    }) {
        this.enabled         = enabled;
        this.dropData        = dropData;
        this.dropRef         = dropRef;
        this.onDropHandshake = onDropHandshake;
        this.onDropped       = onDropped;
        this.setIsDropping   = setIsDropping;
        this.setDragData     = setDragData;
    }
}



// states:
const registeredDroppableHook = new Map<Element, DroppableHook<Element>>();
let activeDroppableHook       : null|DroppableHook<Element> = null;
let activeDroppableTarget     : null|Element                = null;
let registeredDragData        : undefined|DragNDropData     = undefined;



// draggable sides:
export const enterDroppableHook  = (dragData: DragNDropData) => {
    registeredDragData = dragData; // has  related drag data
    
    
    
    for (const droppableHook of registeredDroppableHook.values()) {
        droppableHook.setDragData(dragData); // has  related drag data
    } // for
};
export interface AttachedDroppableHookOptions<TElement extends Element = HTMLElement> {
    dragRef            ?: React.RefObject<TElement>|TElement|null // getter ref
    onDragHandshake    ?: (event: DragHandshakeEvent<TElement>) => void|Promise<void>
    ignoreDropElements ?: (React.RefObject<Element>|Element|null|undefined)[]
}
export interface AttachedDroppableHookResult {
    response       : null|boolean
    dropData       : undefined|DragNDropData
    pointedElement : null|Element
}
export const attachDroppableHook = async <TElement extends Element = HTMLElement>(event: MouseEvent, options?: AttachedDroppableHookOptions<TElement>): Promise<AttachedDroppableHookResult> => {
    const {
        dragRef,
        onDragHandshake,
        ignoreDropElements,
    } = options ?? {};
    
    
    
    const pointedElement = (
        // get all elements below the cursor, from top_most to bottom_most:
        document.elementsFromPoint(event.clientX, event.clientY)
        
        // get the top_most element below the cursor:
        .find((element): boolean => {
            // conditions:
            if (!ignoreDropElements?.length) return true; // empty blacklist => always match
            
            
            
            // test for blacklist:
            for (const ignoreDropElement of ignoreDropElements) {
                // conditions:
                if (!ignoreDropElement) continue; // ignore nullish
                
                const ignoreDropElementElm = (ignoreDropElement instanceof Element) ? ignoreDropElement : ignoreDropElement?.current;
                if (!ignoreDropElementElm) continue; // ignore nullish
                
                
                
                // tests:
                if (ignoreDropElementElm.contains(element)) return false; // blacklisted => false
            } // for
            return true; // passed => true
        })
        
        ??
        null // null if not found (instead of undefined)
    );
    
    
    
    if (!pointedElement) return {
        response       : null,
        dropData       : undefined,
        pointedElement : null,
    };
    
    
    
    let response          : null|boolean                = null; // firstly mark as NOT_YET having handshake (null: has dragging activity but outside all dropping targets)
    let interactedHook    : null|DroppableHook<Element> = null;
    let interactedElement : null|Element                = null;
    
    
    
    // search for *nearest* droppable hook in self & ancestors:
    for (const inspectElement of selfAndAncestors(pointedElement)) {
        // conditions:
        // test for valid droppable hook:
        const droppableHook = registeredDroppableHook.get(inspectElement);
        if (!droppableHook)         continue; // not having droppable hook => see other droppables
        if (!droppableHook.enabled) continue; // disabled => noop          => see other droppables
        
        
        
        // conditions:
        // handshake interacted as NO_RESPONSE:
        const [dragResponse, dropResponse] = await Promise.all([
            (async (): Promise<undefined|boolean> => {
                // conditions:
                if (onDragHandshake === undefined) return true; // if no `onDragHandshake` => assumes always approved
                
                
                
                const dragElm = (dragRef instanceof Element) ? dragRef : dragRef?.current;
                const dragHandshakeEvent : DragHandshakeEvent<TElement> = {
                    // bases:
                    ...createSyntheticMouseEvent<TElement, MouseEvent>({
                        nativeEvent    : event,
                        
                        type           : 'draghandshake',
                        
                        currentTarget  : dragElm ?? undefined,               // point to <DragElm> itself
                        target         : activeDroppableTarget ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
                    }),
                    
                    
                    
                    // data:
                    dropData           : droppableHook.dropData,
                    response           : undefined, // initially no response
                };
                await onDragHandshake(dragHandshakeEvent);
                return dragHandshakeEvent.response; // get the modified response
            })(),
            (async (): Promise<undefined|boolean> => {
                // conditions:
                if (registeredDragData === undefined) return undefined; // already `leaveDroppableHook()` => no need to response
                
                
                
                const dropRef = droppableHook.dropRef;
                const dropElm = (dropRef instanceof Element) ? dropRef : dropRef?.current;
                const dropHandshakeEvent : DropHandshakeEvent<Element> = {
                    // bases:
                    ...createSyntheticMouseEvent<Element, MouseEvent>({
                        nativeEvent    : event,
                        
                        type           : 'drophandshake',
                        
                        currentTarget  : dropElm ?? undefined,               // point to <DropElm> itself
                        target         : activeDroppableTarget ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
                    }),
                    
                    
                    
                    // data:
                    dragData           : registeredDragData,
                    response           : undefined, // initially no response
                };
                await droppableHook.onDropHandshake(dropHandshakeEvent);
                return dropHandshakeEvent.response; // get the modified response
            })(),
        ]);
        if (!droppableHook.enabled    ) continue; // disabled => noop         => see other droppables
        if (dragResponse === undefined) continue; // undefined => NO_RESPONSE => see other draggables
        if (dropResponse === undefined) continue; // undefined => NO_RESPONSE => see other droppables
        
        
        
        // handshake interacted as REFUSED|ACCEPTED:
        interactedHook    = droppableHook;
        interactedElement = pointedElement;
        
        
        
        // handshake interacted as REFUSED:
        if (!dragResponse || !dropResponse) { // false => refuses to be dragged|dropped
            response = false;                 // handshake REFUSED by drop target and/or drag source
            break;                            // no need to scan other droppables
        } // if
        
        
        
        // handshake interacted as ACCEPTED:
        response = true;                      // handshake ACCEPTED by both drop target and drag source
        break;                                // no need to scan other droppables
    } // for
    
    
    
    activeDroppableHook   = response ? interactedHook    : null; // true => set -or- null|false => release
    activeDroppableTarget = response ? interactedElement : null; // true => set -or- null|false => release
    
    
    
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
        pointedElement,
    };
};
export const leaveDroppableHook  = (): void => {
    activeDroppableHook   = null;      // release
    activeDroppableTarget = null;      // release
    registeredDragData    = undefined; // no  related drag data
    
    
    
    for (const droppableHook of registeredDroppableHook.values()) {
        // actions:
        droppableHook.setIsDropping(undefined); // no  dropping activity
        droppableHook.setDragData(undefined);   // no  related drag data
    } // for
};

export const getActiveDroppableHook   = (): null|DroppableHook<Element> => {
    return activeDroppableHook;
};
export const getActiveDroppableTarget = (): null|Element => {
    return activeDroppableTarget;
};



// droppable sides:
export const registerDroppableHook   = <TElement extends Element = HTMLElement>(element: Element, droppableHook: DroppableHook<TElement>): void => {
    droppableHook.enabled = true; // mount
    registeredDroppableHook.set(element, droppableHook as unknown as DroppableHook<Element>);
};
export const unregisterDroppableHook = <TElement extends Element = HTMLElement>(element: Element): null|DroppableHook<TElement> => {
    const droppableHook = registeredDroppableHook.get(element); // backup
    if (droppableHook) droppableHook.enabled = false; // unmount
    registeredDroppableHook.delete(element);
    
    
    
    if (droppableHook && (droppableHook === activeDroppableHook)) {
        activeDroppableHook   = null; // release
        activeDroppableTarget = null; // release
    } // if
    
    
    
    return (droppableHook ?? null) as null|DroppableHook<TElement>; // found | not found
};



// draggable files:
if ((typeof(window) !== 'undefined') && (typeof(document) !== 'undefined')) {
    // states:
    let globalNestedDragEnterCounter = 0;
    
    
    
    // utilities:
    const createDragData = (dataTransfer: DataTransfer|null, hasAccess = false): Map<string, Promise<string>|File|undefined>|null => {
        const items = dataTransfer?.items;
        if (!items?.length) return null; // empty data => nothing to transform
        
        
        
        const dragData = new Map<string, Promise<string>|File|undefined>();
        let fileIndexCounter   = 0;
        let stringIndexCounter = 0;
        for (const item of items) {
            if (item.kind === 'file') { // File
                dragData.set(
                    `file/${fileIndexCounter}`,
                    (
                        hasAccess
                        ? (item.getAsFile() ?? undefined)
                        : undefined
                    )
                );
                fileIndexCounter++;
            }
            else { // string
                dragData.set(
                    `${item.kind}/${stringIndexCounter}`,
                    (
                        hasAccess
                        ? new Promise<string>((resolved) => {
                            item.getAsString((aString) => resolved(aString));
                        })
                        : undefined
                    )
                );
                stringIndexCounter++;
            } // if
        } // for
        if (!dragData.size) return null;
        return dragData;
    };
    
    
    
    // global handlers:
    const handleGlobalDragEnter = (event: DragEvent): void => {
        // conditions:
        globalNestedDragEnterCounter++;                 // count bubbling from nested elements
        if (globalNestedDragEnterCounter !== 1) return; // ignores bubbling from nested elements (0: main dragLeave, 1: main dragEnter, 2+: nested dragEnter)
        
        const dragData = createDragData(event.dataTransfer, /*hasAccess: */false);
        if (!dragData) return; // ignores if no data to drop
        
        
        
        // actions:
        enterDroppableHook(dragData);     // has  dragging activity // calling `leaveDroppableHook()` *more* than calling `enterDroppableHook()` is ok
    };
    const handleGlobalDragLeave = (): void => {
        // conditions:
        if (globalNestedDragEnterCounter === 0) return; // protect from making negative value
        globalNestedDragEnterCounter--;                 // uncount bubbling from nested elements
        if (globalNestedDragEnterCounter !== 0) return; // ignores bubbling from nested elements (0: main dragLeave, 1+: main|nested dragEnter)
        
        
        
        // actions:
        leaveDroppableHook();             // no  dropping activity  // calling `leaveDroppableHook()` *more* than calling `enterDroppableHook()` is ok
    };
    const handleGlobalDragOver  = async (event: DragEvent): Promise<void> => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault();             // now handled
        
        
        
        // actions:
        // always try to attach no matter the existance of `dataTransfer`:
        const attachedDroppableHookResult = await attachDroppableHook(event);
        
        const dataTransfer = event.dataTransfer;
        if (dataTransfer) {
            /*
            * undefined : NEVER HERE.  
            * null      : has dragging activity but outside all dropping targets.  
            * false     : has dragging activity on a dropping target but the source/target refuses to be dragged/dropped.  
            * true      : has dragging activity on a dropping target and the source/target wants   to be dragged/dropped.  
            */
            const response = attachedDroppableHookResult.response;
            dataTransfer.dropEffect = (response === true) ? 'copy' : 'none';
        } // if
    };
    const handleGlobalDrop      = (event: DragEvent): void => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault();             // now handled
        
        if (globalNestedDragEnterCounter <= 0) return; // not our drop => ignore
        
        
        
        // actions:
        const activeDroppableHook = getActiveDroppableHook();
        if (activeDroppableHook?.enabled) {
            const dragData = createDragData(event.dataTransfer, /*hasAccess: */true);
            if (dragData) {
                const onDropped = activeDroppableHook.onDropped;
                if (onDropped) {
                    const dropRef = activeDroppableHook.dropRef;
                    const dropElm = (dropRef instanceof Element) ? dropRef : dropRef?.current;
                    onDropped({
                        // bases:
                        ...createSyntheticMouseEvent<Element, MouseEvent>({
                            nativeEvent    : event,
                            
                            type           : 'dropped',
                            
                            currentTarget  : dropElm ?? undefined,               // point to <DropElm> itself
                            target         : activeDroppableTarget ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
                        }),
                        
                        
                        
                        // data:
                        dragData           : dragData,
                    } satisfies DroppedEvent<Element>);
                } // if
            } // if
        } // if
        
        leaveDroppableHook();             // no  dropping activity  // calling `leaveDroppableHook()` *more* than calling `enterDroppableHook()` is ok
        globalNestedDragEnterCounter = 0; // reset counter
    };
    
    
    
    // side effects:
    // but marked as `"sideEffects": false` on package.json:
    document.addEventListener('dragenter', handleGlobalDragEnter);
    document.addEventListener('dragleave', handleGlobalDragLeave);
    document.addEventListener('dragover' , handleGlobalDragOver );
    document.addEventListener('drop'     , handleGlobalDrop     );
} // if
