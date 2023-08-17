// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    ModalExpandedChangeEvent,
    
    ModalCardProps,
    ModalCard,
    
    ModalSideProps,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // hooks:
    useLastExistingChildren,
}                           from './hooks.js'



export interface ModalBaseProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>
    extends
        // bases:
        Omit<Partial<ModalCardProps<TElement, TModalExpandedChangeEvent>>,
            // components:
            |'modalComponent' // we redefined `modalComponent` prop
        >,
        Omit<Partial<ModalSideProps<TElement, TModalExpandedChangeEvent>>,
            // components:
            |'modalComponent' // we redefined `modalComponent` prop
        >
{
    /* empty */
}
export interface ModalStatusProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>
    extends
        // bases:
        ModalBaseProps<TElement, TModalExpandedChangeEvent>
{
    // components:
    modalComponent ?: React.ReactComponentElement<any, ModalBaseProps<TElement, TModalExpandedChangeEvent>>
}
const ModalStatus = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>(props: ModalStatusProps<TElement, TModalExpandedChangeEvent>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        modalComponent = (<ModalCard /> as React.ReactComponentElement<any, ModalBaseProps<TElement, TModalExpandedChangeEvent>>),
        
        
        
        // children:
        children,
    ...restModalProps} = props;
    
    
    
    const [hasChildren, lastExistingChildren, clearChildren] = useLastExistingChildren(children);
    
    
    
    // handlers:
    const handleCollapseEnd = useMergeEvents(
        // preserves the original `onCollapseEnd` from `modalComponent`:
        modalComponent.props.onCollapseEnd,
        
        
        
        // preserves the original `onCollapseEnd` from `props`:
        props.onCollapseEnd,
        
        
        
        // actions:
        clearChildren, // clear the children *after* the <Modal> is fully hidden
    );
    
    
    
    // jsx:
    return React.cloneElement<ModalBaseProps<TElement, TModalExpandedChangeEvent>>(modalComponent,
        // props:
        {
            // other props:
            ...restModalProps,
            ...modalComponent.props, // overwrites restModalProps (if any conflics)
            
            
            
            // states:
            expanded      : modalComponent.props.expanded ?? props.expanded ?? hasChildren,
            
            
            
            // handlers:
            onCollapseEnd : handleCollapseEnd,
        },
        
        
        
        // children:
        (modalComponent.props.children ?? lastExistingChildren),
    );
};
export {
    ModalStatus,
    ModalStatus as default,
}
