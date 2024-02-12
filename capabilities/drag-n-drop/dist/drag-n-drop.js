// heymarco:
import { 
// utilities:
createSyntheticMouseEvent, } from '@heymarco/events';
// utilities:
const selfAndAncestors = (element) => {
    const results = [element];
    for (let parent = element.parentElement; !!parent; parent = parent.parentElement) {
        results.push(parent);
    } // for
    return results;
};
export class DroppableHook {
    enabled;
    dropData;
    dropRef; // getter ref
    onDropHandshake;
    onDropped;
    setIsDropping;
    setDragData;
    constructor({ enabled, dropData, dropRef, onDropHandshake, onDropped, setIsDropping, setDragData, }) {
        this.enabled = enabled;
        this.dropData = dropData;
        this.dropRef = dropRef;
        this.onDropHandshake = onDropHandshake;
        this.onDropped = onDropped;
        this.setIsDropping = setIsDropping;
        this.setDragData = setDragData;
    }
}
// states:
const registeredDroppableHook = new Map();
let activeDroppableHook = null;
let activeDroppableTarget = null;
let registeredDragData = undefined;
// draggable sides:
export const enterDroppableHook = (dragData) => {
    registeredDragData = dragData; // has  related drag data
    for (const droppableHook of registeredDroppableHook.values()) {
        droppableHook.setDragData(dragData); // has  related drag data
    } // for
};
export const attachDroppableHook = async (event, options) => {
    const { dragRef, onDragHandshake, ignoreDropElements, } = options ?? {};
    const pointedElement = (
    // get all elements below the cursor, from top_most to bottom_most:
    document.elementsFromPoint(event.clientX, event.clientY)
        // get the top_most element below the cursor:
        .find((element) => {
        // conditions:
        if (!ignoreDropElements?.length)
            return true; // empty blacklist => always match
        // test for blacklist:
        for (const ignoreDropElement of ignoreDropElements) {
            // conditions:
            if (!ignoreDropElement)
                continue; // ignore nullish
            const ignoreDropElementElm = (ignoreDropElement instanceof Element) ? ignoreDropElement : ignoreDropElement?.current;
            if (!ignoreDropElementElm)
                continue; // ignore nullish
            // tests:
            if (ignoreDropElementElm.contains(element))
                return false; // blacklisted => false
        } // for
        return true; // passed => true
    })
        ??
            null // null if not found (instead of undefined)
    );
    if (!pointedElement)
        return {
            response: null,
            dropData: undefined,
            pointedElement: null,
        };
    let response = null; // firstly mark as NOT_YET having handshake (null: has dragging activity but outside all dropping targets)
    let interactedHook = null;
    let interactedElement = null;
    // search for *nearest* droppable hook in self & ancestors:
    for (const inspectElement of selfAndAncestors(pointedElement)) {
        // conditions:
        // test for valid droppable hook:
        const droppableHook = registeredDroppableHook.get(inspectElement);
        if (!droppableHook)
            continue; // not having droppable hook => see other droppables
        if (!droppableHook.enabled)
            continue; // disabled => noop          => see other droppables
        // getting responses:
        const dragElm = (dragRef instanceof Element) ? dragRef : dragRef?.current;
        const dropRef = droppableHook.dropRef;
        const dropElm = (dropRef instanceof Element) ? dropRef : dropRef?.current;
        const [dragResponse, dropResponse] = await Promise.all([
            (async () => {
                // conditions:
                if (onDragHandshake === undefined)
                    return true; // if no `onDragHandshake` => assumes always approved
                const dragHandshakeEvent = {
                    // bases:
                    ...createSyntheticMouseEvent({
                        nativeEvent: event,
                        type: 'draghandshake',
                        currentTarget: dragElm ?? undefined, // point to <DragElm> itself
                        target: pointedElement ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
                        relatedTarget: dropElm ?? undefined, // the opposite side <DropElm> as related/paired element
                    }),
                    // data:
                    dropData: droppableHook.dropData,
                    response: undefined, // initially no response
                };
                await onDragHandshake(dragHandshakeEvent);
                return dragHandshakeEvent.response; // get the modified response
            })(),
            (async () => {
                // conditions:
                if (registeredDragData === undefined)
                    return undefined; // already `leaveDroppableHook()` => no need to response
                const dropHandshakeEvent = {
                    // bases:
                    ...createSyntheticMouseEvent({
                        nativeEvent: event,
                        type: 'drophandshake',
                        currentTarget: dropElm ?? undefined, // point to <DropElm> itself
                        target: pointedElement ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
                        relatedTarget: dragElm ?? undefined, // the opposite side <DragElm> as related/paired element
                    }),
                    // data:
                    dragData: registeredDragData,
                    response: undefined, // initially no response
                };
                await droppableHook.onDropHandshake(dropHandshakeEvent);
                return dropHandshakeEvent.response; // get the modified response
            })(),
        ]);
        // handshake interacted as NO_RESPONSE:
        if (!droppableHook.enabled)
            continue; // disabled => noop         => see other droppables
        if (dragResponse === undefined)
            continue; // undefined => NO_RESPONSE => see other draggables
        if (dropResponse === undefined)
            continue; // undefined => NO_RESPONSE => see other droppables
        // handshake interacted as REFUSED|ACCEPTED:
        interactedHook = droppableHook;
        interactedElement = pointedElement;
        // handshake interacted as REFUSED:
        if (!dragResponse || !dropResponse) { // false => refuses to be dragged|dropped
            response = false; // handshake REFUSED by drop target and/or drag source
            break; // no need to scan other droppables
        } // if
        // handshake interacted as ACCEPTED:
        response = true; // handshake ACCEPTED by both drop target and drag source
        break; // no need to scan other droppables
    } // for
    activeDroppableHook = response ? interactedHook : null; // true => set -or- null|false => release
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
        dropData: interactedHook?.dropData,
        pointedElement,
    };
};
export const leaveDroppableHook = () => {
    activeDroppableHook = null; // release
    activeDroppableTarget = null; // release
    registeredDragData = undefined; // no  related drag data
    for (const droppableHook of registeredDroppableHook.values()) {
        // actions:
        droppableHook.setIsDropping(undefined); // no  dropping activity
        droppableHook.setDragData(undefined); // no  related drag data
    } // for
};
export const getActiveDroppableHook = () => {
    return activeDroppableHook;
};
export const getActiveDroppableTarget = () => {
    return activeDroppableTarget;
};
// droppable sides:
export const registerDroppableHook = (element, droppableHook) => {
    droppableHook.enabled = true; // mount
    registeredDroppableHook.set(element, droppableHook);
};
export const unregisterDroppableHook = (element) => {
    const droppableHook = registeredDroppableHook.get(element); // backup
    if (droppableHook)
        droppableHook.enabled = false; // unmount
    registeredDroppableHook.delete(element);
    if (droppableHook && (droppableHook === activeDroppableHook)) {
        activeDroppableHook = null; // release
        activeDroppableTarget = null; // release
    } // if
    return (droppableHook ?? null); // found | not found
};
// draggable files:
if ((typeof (window) !== 'undefined') && (typeof (document) !== 'undefined')) {
    // states:
    let globalNestedDragEnterCounter = 0;
    // utilities:
    const createDragData = (dataTransfer, hasAccess = false) => {
        const items = dataTransfer?.items;
        if (!items?.length)
            return null; // empty data => nothing to transform
        const dragData = new Map();
        let fileIndexCounter = 0;
        let stringIndexCounter = 0;
        for (const item of items) {
            if (item.kind === 'file') { // File
                dragData.set(`file/${fileIndexCounter}`, (hasAccess
                    ? (item.getAsFile() ?? undefined)
                    : undefined));
                fileIndexCounter++;
            }
            else { // string
                dragData.set(`${item.kind}/${stringIndexCounter}`, (hasAccess
                    ? new Promise((resolved) => {
                        item.getAsString((aString) => resolved(aString));
                    })
                    : undefined));
                stringIndexCounter++;
            } // if
        } // for
        if (!dragData.size)
            return null;
        return dragData;
    };
    // global handlers:
    const handleGlobalDragEnter = (event) => {
        // conditions:
        globalNestedDragEnterCounter++; // count bubbling from nested elements
        if (globalNestedDragEnterCounter !== 1)
            return; // ignores bubbling from nested elements (0: main dragLeave, 1: main dragEnter, 2+: nested dragEnter)
        const dragData = createDragData(event.dataTransfer, /*hasAccess: */ false);
        if (!dragData)
            return; // ignores if no data to drop
        // actions:
        enterDroppableHook(dragData); // has  dragging activity // calling `leaveDroppableHook()` *more* than calling `enterDroppableHook()` is ok
    };
    const handleGlobalDragLeave = () => {
        // conditions:
        if (globalNestedDragEnterCounter === 0)
            return; // protect from making negative value
        globalNestedDragEnterCounter--; // uncount bubbling from nested elements
        if (globalNestedDragEnterCounter !== 0)
            return; // ignores bubbling from nested elements (0: main dragLeave, 1+: main|nested dragEnter)
        // actions:
        leaveDroppableHook(); // no  dropping activity  // calling `leaveDroppableHook()` *more* than calling `enterDroppableHook()` is ok
    };
    const handleGlobalDragOver = async (event) => {
        // conditions:
        if (event.defaultPrevented)
            return; // already handled => ignore
        event.preventDefault(); // now handled
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
    const handleGlobalDrop = (event) => {
        // conditions:
        if (event.defaultPrevented)
            return; // already handled => ignore
        event.preventDefault(); // now handled
        if (globalNestedDragEnterCounter <= 0)
            return; // not our drop => ignore
        // actions:
        const activeDroppableHook = getActiveDroppableHook();
        if (activeDroppableHook?.enabled) {
            const dragData = createDragData(event.dataTransfer, /*hasAccess: */ true);
            if (dragData) {
                const onDropped = activeDroppableHook.onDropped;
                if (onDropped) {
                    const dropRef = activeDroppableHook.dropRef;
                    const dropElm = (dropRef instanceof Element) ? dropRef : dropRef?.current;
                    onDropped({
                        // bases:
                        ...createSyntheticMouseEvent({
                            nativeEvent: event,
                            type: 'dropped',
                            currentTarget: dropElm ?? undefined, // point to <DropElm> itself
                            target: activeDroppableTarget ?? undefined, // point to <DropElm>'s descendant (if any) -or- <DropElm> itself, excepts <OverlayElm>
                            relatedTarget: null, // no related/paired element
                        }),
                        // data:
                        dragData: dragData,
                    });
                } // if
            } // if
        } // if
        leaveDroppableHook(); // no  dropping activity  // calling `leaveDroppableHook()` *more* than calling `enterDroppableHook()` is ok
        globalNestedDragEnterCounter = 0; // reset counter
    };
    // side effects:
    // but marked as `"sideEffects": false` on package.json:
    document.addEventListener('dragenter', handleGlobalDragEnter);
    document.addEventListener('dragleave', handleGlobalDragLeave);
    document.addEventListener('dragover', handleGlobalDragOver);
    document.addEventListener('drop', handleGlobalDrop);
} // if
