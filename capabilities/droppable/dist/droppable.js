// react:
import { 
// hooks:
useState, useMemo, useEffect, } from 'react';
// reusable-ui core:
import { 
// hooks:
useEvent, } from '@reusable-ui/hooks'; // react helper hooks
// heymarco:
import { 
// hooks:
DroppableHook, 
// droppable sides:
registerDroppableHook, unregisterDroppableHook, } from '@heymarco/drag-n-drop'; // a shared interface for enabling drag and drop operations
export const useDroppable = (props) => {
    // props:
    const { 
    // data:
    dropData, 
    // refs:
    dropRef, 
    // states:
    enabled = true, 
    // handlers:
    onDropHandshake, onDropped, } = props;
    // states:
    let [isDropping, setIsDropping] = useState(undefined);
    let [dragData, setDragData] = useState(undefined);
    // handlers:
    const handleDropHandshake = useEvent(async (event) => {
        try {
            await onDropHandshake(event);
        }
        finally {
            const newDragData = event.dragData;
            if (!Object.is(dragData, newDragData))
                setDragData(dragData = newDragData);
        } // try
    });
    const handleSetIsDropping = useEvent((newIsDropping) => {
        // conditions:
        if (isDropping === newIsDropping)
            return; // already the same => nothing to update
        // actions:
        setIsDropping(isDropping = newIsDropping);
    });
    const handleSetDragData = useEvent((newDragData) => {
        // conditions:
        if (Object.is(dragData, newDragData))
            return; // already the same => nothing to update
        // actions:
        setDragData(dragData = newDragData);
    });
    // stable droppableHook:
    const droppableHook = useMemo(() => new DroppableHook({
        enabled: enabled,
        dropData: dropData,
        dropRef: dropRef,
        onDropHandshake: handleDropHandshake, // stable ref
        onDropped: onDropped,
        setIsDropping: handleSetIsDropping, // stable ref
        setDragData: handleSetDragData, // stable ref
    }), []);
    droppableHook.enabled = enabled;
    droppableHook.dropData = dropData;
    droppableHook.dropRef = dropRef;
    // droppableHook.onDropHandshake = handleDropHandshake; // stable ref
    droppableHook.onDropped = onDropped;
    // droppableHook.setIsDropping = handleSetIsDropping;   // stable ref
    // droppableHook.setDragData = handleSetDragData;       // stable ref
    // effects:
    // register/unregister DroppableHook:
    useEffect(() => {
        // conditions:
        const dropElm = (dropRef instanceof Element) ? dropRef : dropRef?.current;
        if (!dropElm)
            return; // no element for droppable => ignore
        // setups:
        registerDroppableHook(dropElm, droppableHook);
        // cleanups:
        return () => {
            unregisterDroppableHook(dropElm);
        };
    }, [dropRef, droppableHook]);
    // api:
    return {
        // data:
        dragData,
        // states:
        isDropping,
    };
};
