// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useTriggerRender,
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// utilities:
const isExistingChildren = (children: React.ReactNode): children is Exclude<typeof children, undefined|null|true|false> => {
    if (children === undefined)  return false; // ignores undefined
    if (children === null     )  return false; // ignores null
    if (children === false    )  return false; // ignores boolean
    if (children === true     )  return false; // ignores boolean
    
    if (Array.isArray(children)) return children.some(isExistingChildren); // at least one existing child exist
    
    return true; // all checks passed => treat as existing children
};



// hooks:
export const useLastExistingChildren = (children: React.ReactNode): readonly [boolean, React.ReactNode, React.DispatchWithoutAction] => {
    // states:
    const lastExistingChildrenRef = useRef<React.ReactNode>(undefined);
    const hasChildren = isExistingChildren(children);
    if (hasChildren) lastExistingChildrenRef.current = children;
    
    const [triggerRender] = useTriggerRender();
    
    
    
    // stable callbacks:
    const clearChildren = useEvent<React.DispatchWithoutAction>(() => {
        // conditions:
        if (lastExistingChildrenRef.current === undefined) return; // already cleared => ignore
        
        
        
        // force React to *forget* the children's state by setting children to `undefined` and re-render the <parent> component:
        lastExistingChildrenRef.current = children; // the <parent> component should re-render the children to `undefined` in order to destroy the children's state.
        triggerRender();
    });
    
    
    
    // children:
    return [hasChildren, lastExistingChildrenRef.current, clearChildren];
};
