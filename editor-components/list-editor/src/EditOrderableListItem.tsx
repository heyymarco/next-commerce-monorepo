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
    type OrderableListItemComponentProps,
}                           from '@heymarco/orderable-list'             // represents a series of content that the order can be rearranged

// internals:
import {
    type EditActionEditorProps,
    useEditActionEditor,
}                           from './hooks/edit-action-editor.js'



// react components:
export interface EditOrderableListItemProps<out TElement extends Element = HTMLButtonElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>, TValue extends unknown = string>
    extends
        // bases:
        Omit<OrderableListItemProps<Element, number>,
            // values:
            |'defaultValue'
        >,
        Omit<EditActionEditorProps<TElement, TChangeEvent, TValue>,
            // identifiers:
            |'listIndex'
        >,
        
        // components:
        OrderableListItemComponentProps<Element, number>
{
}
const EditOrderableListItem = <TElement extends Element = HTMLButtonElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>, TValue extends unknown = string>(props: EditOrderableListItemProps<TElement, TChangeEvent, TValue>): JSX.Element|null => {
    // props:
    const {
        // accessibilities:
        placeholder,
        
        
        
        // values:
        defaultValue,
        
        
        
        // behaviors:
        autoFocusOnEdit,
        cancelEditOnBlur,
        
        
        
        // components:
        orderableListItemComponent = (<OrderableListItem<Element, unknown> /> as React.ReactElement<OrderableListItemProps<Element, number>>),
        actionEditorComponent,
        
        
        
        // handlers:
        onSave,
        onDelete,
        onCancel,
        
        
        
        // other props:
        ...restEditOrderableListItemProps
    } = props;
    
    
    
    // states:
    const {
        // components:
        actionEditorComponent : editActionEditorComponent,
    } = useEditActionEditor<TElement, TChangeEvent, TValue>({
        // identifiers:
        listIndex : props.data!,
        
        
        
        // accessibilities:
        placeholder,
        
        
        
        // values:
        defaultValue,
        
        
        
        // behaviors:
        autoFocusOnEdit,
        cancelEditOnBlur,
        
        
        
        // components:
        actionEditorComponent,
        
        
        
        // handlers:
        onSave,
        onDelete,
        onCancel,
    });
    
    
    
    // default props:
    const {
        // behaviors:
        orderable = false,
        
        
        
        // children:
        children  = editActionEditorComponent,
        
        
        
        // other props:
        ...restOrderableListItemProps
    } = restEditOrderableListItemProps satisfies NoForeignProps<typeof restEditOrderableListItemProps, OrderableListItemProps<Element, number>>;
    
    const {
        // behaviors:
        orderable : orderableListItemComponentOrderable = orderable,
        
        
        
        // children:
        children  : orderableListItemComponentChildren  = children,
        
        
        
        // other props:
        ...restOrderableListItemComponentProps
    } = orderableListItemComponent.props;
    
    
    
    // jsx:
    /* <OrderableListItem> */
    return React.cloneElement<OrderableListItemProps<Element, number>>(orderableListItemComponent,
        // props:
        {
            // other props:
            ...restOrderableListItemProps,
            ...restOrderableListItemComponentProps, // overwrites restOrderableListItemProps (if any conflics)
            
            
            
            // behaviors:
            orderable : orderableListItemComponentOrderable,
        },
        
        
        
        // children:
        orderableListItemComponentChildren,
    );
};
export {
    EditOrderableListItem,            // named export for readibility
    EditOrderableListItem as default, // default export to support React.lazy
}
