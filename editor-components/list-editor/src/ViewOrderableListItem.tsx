// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
    type EventHandler,
    useMergeEvents,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    // react components:
    type OrderableListItemProps,
    OrderableListItem,
    type OrderableListItemComponentProps,
}                           from '@heymarco/orderable-list'             // represents a series of content that the order can be rearranged

// internals:
import {
    defaultValueToUi,
}                           from './utilities.js'
import {
    type EditActionEditorProps,
}                           from './hooks/edit-action-editor.js'



// react components:
/*
    We use HTMLElement instead of Element because HTMLElement supports drag-and-drop, while Element does not.
*/
export interface ViewOrderableListItemProps</*out*/ TElement extends HTMLElement = HTMLElement, TValue extends unknown = string>
    extends
        // bases:
        Omit<OrderableListItemProps<TElement, number>,
            // values:
            |'defaultValue'
        >,
        Pick<EditActionEditorProps<TElement, TValue, React.SyntheticEvent<unknown, Event>>,
            // values:
            |'defaultValue'
        >,
        
        // components:
        OrderableListItemComponentProps<TElement, number>
{
    // values:
    valueToUi ?: (value: TValue) => React.ReactNode
    
    
    
    // handlers:
    onEdit    ?: EventHandler<void>
}
const ViewOrderableListItem = <TElement extends HTMLElement = HTMLElement, TValue extends unknown = string>(props: ViewOrderableListItemProps<TElement, TValue>): JSX.Element|null => {
    // props:
    const {
        // values:
        valueToUi                  = defaultValueToUi,
        
        defaultValue,
        
        
        
        // components:
        orderableListItemComponent = (<OrderableListItem<TElement, unknown> /> as React.ReactElement<OrderableListItemProps<TElement, number>>),
        
        
        
        // handlers:
        onEdit,
        onDoubleClick,
        
        
        
        // other props:
        ...restViewOrderableListItemProps
    } = props;
    
    
    
    // handlers:
    const handleDoubleClickInternal = useEvent(() => {
        onEdit?.();
    });
    const handleDoubleClick         = useMergeEvents(
        // preserves the original `onDoubleClick` from `orderableListItemComponent`:
        orderableListItemComponent.props.onDoubleClick,
        
        
        
        // preserves the original `onDoubleClick` from `props`:
        onDoubleClick,
        
        
        
        // actions:
        handleDoubleClickInternal,
    );
    
    
    
    // default props:
    const {
        // children:
        children  = valueToUi(defaultValue!),
        
        
        
        // other props:
        ...restOrderableListItemProps
    } = restViewOrderableListItemProps satisfies NoForeignProps<typeof restViewOrderableListItemProps, OrderableListItemProps<TElement, number>>;
    
    const {
        // children:
        children  : orderableListItemComponentChildren  = children,
        
        
        
        // other props:
        ...restOrderableListItemComponentProps
    } = orderableListItemComponent.props;
    
    
    
    // jsx:
    /* <OrderableListItem> */
    return React.cloneElement<OrderableListItemProps<TElement, number>>(orderableListItemComponent,
        // props:
        {
            // other props:
            ...restOrderableListItemProps,
            ...restOrderableListItemComponentProps, // overwrites restOrderableListItemProps (if any conflics)
            
            
            
            // handlers:
            onDoubleClick : handleDoubleClick,
        },
        
        
        
        // children:
        orderableListItemComponentChildren,
    );
};
export {
    ViewOrderableListItem,            // named export for readibility
    ViewOrderableListItem as default, // default export to support React.lazy
}
