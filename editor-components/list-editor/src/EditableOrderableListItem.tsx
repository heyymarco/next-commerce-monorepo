// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
    type EventHandler,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// heymarco core:
import {
    // types:
    type DraggedEvent,
}                           from '@heymarco/draggable'

// heymarco components:
import {
    // types:
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'

// internals components:
import {
    type ViewOrderableListItemProps,
    ViewOrderableListItem,
}                           from './ViewOrderableListItem.js'
import {
    type EditOrderableListItemProps,
    EditOrderableListItem,
}                           from './EditOrderableListItem.js'

// internals:
import {
    // types:
    type SaveEntity,
}                           from './hooks/edit-action-editor.js'



// react components:
/*
    We use HTMLElement instead of Element because HTMLElement supports drag-and-drop, while Element does not.
*/
export interface EditableOrderableListItemProps</*out*/ TElement extends HTMLElement = HTMLElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>, TValue extends unknown = string>
    extends
        // bases:
        Omit<ViewOrderableListItemProps<TElement, TValue>,
            // handlers:
            |'onEdit'
        >,
        Omit<EditOrderableListItemProps<TElement, TChangeEvent, TValue>,
            // handlers:
            |'onCancel'
        >
{
}
const EditableOrderableListItem = <TElement extends HTMLElement = HTMLElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>, TValue extends unknown = string>(props: EditableOrderableListItemProps<TElement, TChangeEvent, TValue>): JSX.Element|null => {
    // props:
    const {
        // accessibilities:
        placeholder,
        
        
        
        // values:
        valueToUi,
        
        defaultValue,
        
        
        
        // behaviors:
        autoFocusOnEdit,
        cancelEditOnBlur,
        
        
        
        // components:
        orderableListItemComponent,
        actionEditorComponent,
        
        
        
        // handlers:
        onSave,
        onDelete,
        
        
        
        // other props:
        ...restOrderableListItemProps
    } = props;
    
    
    
    // states:
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleSave = useEvent<EditorChangeEventHandler<TChangeEvent, SaveEntity<TValue>>>((saveEntity, event) => {
        setIsEditMode(false);
        onSave?.(saveEntity, event);
    });
    const handleEdit = useEvent<EventHandler<void>>(() => {
        setIsEditMode(true);
    });
    const handleCancel = useEvent<EventHandler<void>>(() => {
        setIsEditMode(false);
    });
    
    
    
    // jsx:
    if (!isEditMode) {
        /* <ViewOrderableListItem> */
        return (
            <ViewOrderableListItem<TElement, TValue>
                // other props:
                {...restOrderableListItemProps satisfies NoForeignProps<typeof restOrderableListItemProps, ViewOrderableListItemProps<TElement, TValue>>}
                
                
                
                // values:
                valueToUi={valueToUi}
                
                defaultValue={defaultValue}
                
                
                
                // components:
                orderableListItemComponent={orderableListItemComponent}
                
                
                
                // handlers:
                onEdit={handleEdit}
            />
        );
    }
    else {
        /* <EditOrderableListItem> */
        return (
            <EditOrderableListItem<TElement, TChangeEvent, TValue>
                // other props:
                {...restOrderableListItemProps satisfies NoForeignProps<typeof restOrderableListItemProps, EditOrderableListItemProps<TElement, TChangeEvent, TValue>>}
                
                
                
                // accessibilities:
                placeholder={placeholder}
                
                
                
                // values:
                defaultValue={defaultValue}
                
                
                
                // behaviors:
                autoFocusOnEdit={autoFocusOnEdit}
                cancelEditOnBlur={cancelEditOnBlur}
                
                
                
                // components:
                orderableListItemComponent={orderableListItemComponent}
                actionEditorComponent={actionEditorComponent}
                
                
                
                // handlers:
                onSave={handleSave}
                onDelete={onDelete}
                onCancel={handleCancel}
            />
        );
    } // if
};
export {
    EditableOrderableListItem,            // named export for readibility
    EditableOrderableListItem as default, // default export to support React.lazy
}
