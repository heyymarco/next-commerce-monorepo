// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    // react components:
    type OrderableListItemProps,
    OrderableListItem,
}                           from '@heymarco/orderable-list'             // represents a series of content that the order can be rearranged

// internals:
import {
    type InsertActionEditorProps,
    useInsertActionEditor,
}                           from './hooks/insert-action-editor.js'



// react components:
export interface InsertOrderableListItemProps<out TElement extends Element = HTMLButtonElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>, TValue extends unknown = string>
    extends
        // bases:
        OrderableListItemProps<Element, never>,
        InsertActionEditorProps<TElement, TChangeEvent, TValue>
{
    // components:
    insertOrderableListItemComponent ?: React.ReactComponentElement<any, OrderableListItemProps<Element, never>>
}
const InsertOrderableListItem = <TElement extends Element = HTMLButtonElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>, TValue extends unknown = string>(props: InsertOrderableListItemProps<TElement, TChangeEvent, TValue>): JSX.Element|null => {
    // props:
    const {
        // accessibilities:
        placeholder,
        
        
        
        // values:
        emptyValue,
        
        
        
        // components:
        insertOrderableListItemComponent = (<OrderableListItem<Element, unknown> /> as React.ReactElement<OrderableListItemProps<Element, never>>),
        actionEditorComponent,
        
        
        
        // handlers:
        onInsert,
        
        
        
        // other props:
        ...restInsertOrderableListItemProps
    } = props;
    
    
    
    // states:
    const {
        // components:
        actionEditorComponent : insertActionEditorComponent,
    } = useInsertActionEditor<TElement, TChangeEvent, TValue>({
        // accessibilities:
        placeholder,
        
        
        
        // values:
        emptyValue,
        
        
        
        // components:
        actionEditorComponent,
        
        
        
        // handlers:
        onInsert,
    });
    
    
    
    // default props:
    const {
        // behaviors:
        orderable = false,
        
        
        
        // children:
        children  = insertActionEditorComponent,
        
        
        
        // other props:
        ...restOrderableListItemProps
    } = restInsertOrderableListItemProps satisfies NoForeignProps<typeof restInsertOrderableListItemProps, OrderableListItemProps<Element, never>>;
    
    const {
        // behaviors:
        orderable : insertOrderableListItemComponentOrderable = orderable,
        
        
        
        // children:
        children  : insertOrderableListItemComponentChildren  = children,
        
        
        
        // other props:
        ...restInsertOrderableListItemComponentProps
    } = insertOrderableListItemComponent.props;
    
    
    
    // jsx:
    /* <OrderableListItem> */
    return React.cloneElement<OrderableListItemProps<Element, never>>(insertOrderableListItemComponent,
        // props:
        {
            // other props:
            ...restOrderableListItemProps,
            ...restInsertOrderableListItemComponentProps, // overwrites restOrderableListItemProps (if any conflics)
            
            
            
            // behaviors:
            orderable : insertOrderableListItemComponentOrderable,
        },
        
        
        
        // children:
        insertOrderableListItemComponentChildren,
    );
};
export {
    InsertOrderableListItem,            // named export for readibility
    InsertOrderableListItem as default, // default export to support React.lazy
}
