// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useMemo,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import type {
    DragNDropData,
}                           from './types'
import {
    DroppableHook,
    
    
    
    registerDroppableHook,
    unregisterDroppableHook,
}                           from './drag-n-drop-interface'



// react components:
export interface DroppableProps<TElement extends Element = HTMLElement> {
    // data:
    dropData         : DragNDropData
    
    
    
    // refs:
    dropRef          : React.RefObject<TElement>|TElement|null // getter ref
    
    
    
    // states:
    enabled         ?: boolean
    
    
    
    // handlers:
    onDropHandshake  : (dragData: DragNDropData) => undefined|boolean|Promise<undefined|boolean>
    onDropped       ?: (dragData: DragNDropData) => void
}
export interface DroppableApi {
    // data:
    dragData         : DragNDropData|undefined
    
    
    
    // states:
    /**
     * undefined : no  dropping activity.  
     * null      : has dropping activity but outside this dropping target.  
     * false     : has dropping activity on this dropping target but the source/target refuses to be dragged/dropped.  
     * true      : has dropping activity on this dropping target and the source/target wants   to be dragged/dropped.  
     */
    isDropping       : undefined|null|boolean
}
export const useDroppable = <TElement extends Element = HTMLElement>(props: DroppableProps<TElement>): DroppableApi => {
    // props:
    const {
        // data:
        dropData,
        
        
        
        // refs:
        dropRef,
        
        
        
        // states:
        enabled = true,
        
        
        
        // handlers:
        onDropHandshake,
        onDropped,
    } = props;
    
    
    
    // states:
    let [isDropping, setIsDropping] = useState<undefined|null|boolean>(undefined);
    let [dragData  , setDragData  ] = useState<DragNDropData|undefined>(undefined);
    
    
    
    // handlers:
    const handleDropHandshake = useEvent<typeof onDropHandshake>(async (newDragData) => {
        try {
            return await onDropHandshake(newDragData);
        }
        finally {
            if (!Object.is(dragData, newDragData)) setDragData(dragData = newDragData);
        } // try
    });
    const handleSetIsDropping = useEvent((newIsDropping: undefined|null|boolean): void => {
        // conditions:
        if (isDropping === newIsDropping) return; // already the same => nothing to update
        
        
        
        // actions:
        setIsDropping(isDropping = newIsDropping);
        if (((newIsDropping === undefined) || (newIsDropping === null)) && (dragData !== undefined)) setDragData(dragData = undefined); // clean up unused dragData after no_dropping_activity -or- outside_of_dropping_area
    });
    
    
    
    // stable droppableHook:
    const droppableHook = useMemo((): DroppableHook =>
        new DroppableHook({
            enabled         : enabled,
            dropData        : dropData,
            onDropHandshake : handleDropHandshake, // stable ref
            onDropped       : onDropped,
            setIsDropping   : handleSetIsDropping,
        })
    , []);
    droppableHook.enabled   = enabled;
    droppableHook.dropData  = dropData;
    // droppableHook.onDropHandshake = handleDropHandshake; // stable ref
    droppableHook.onDropped = onDropped;
    // droppableHook.setIsDropping = handleSetIsDropping; // stable ref
    
    
    
    // effects:
    
    // register/unregister DroppableHook:
    useEffect(() => {
        // conditions:
        const dropElm = (dropRef instanceof Element) ? dropRef : dropRef?.current;
        if (!dropElm) return; // no element for droppable => ignore
        
        
        
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
