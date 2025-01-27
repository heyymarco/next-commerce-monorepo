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
    useMergeEvents,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// heymarco core:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'
import {
    // types:
    type DraggedEvent,
}                           from '@heymarco/draggable'

// heymarco components:
import {
    // types:
    type EditorChangeEventHandler,
    
    
    
    // react components:
    type EditorProps,
}                           from '@heymarco/editor'
import {
    // types:
    ChildrenChangeEventHandler,
    
    
    
    // react components:
    type OrderableListProps,
    OrderableList,
    type OrderableListComponentProps,
    
    type OrderableListItemComponentProps,
}                           from '@heymarco/orderable-list'             // represents a series of content that the order can be rearranged

// internal components:
import {
    // react components:
    type InsertOrderableListItemProps,
    InsertOrderableListItem,
}                           from './InsertOrderableListItem.js'
import {
    // react components:
    type EditableOrderableListItemProps,
    EditableOrderableListItem,
}                           from './EditableOrderableListItem.js'

// internals:
import {
    extractElementsByOrder,
}                           from './utilities.js'
import {
    useUniqueKeys,
}                           from './hooks/unique-keys.js'
import {
    // types:
    type SaveEntity,
    type DeleteEntity,
}                           from './hooks/edit-action-editor.js'



// react components:
export type EditorPosition = 'start'|'end'|'both'|'none'
export interface ListEditorProps<out TElement extends Element = HTMLElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>>
    extends
        // bases:
        Pick<EditorProps<TElement, TValue[], TChangeEvent>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            
            |'notifyValueChange'
        >,
        Omit<OrderableListProps<TElement, number>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            
            
            
            // children:
            |'defaultChildren'  // not supported
            |'children'         // not supported
            |'onChildrenChange' // not supported
        >,
        
        // components:
        OrderableListComponentProps<TElement, number>,
        OrderableListItemComponentProps<HTMLElement, number>,
        Pick<EditableOrderableListItemProps<HTMLElement, TValue, TChangeEvent>,
            // accessibilities:
            |'placeholder'
            
            // values:
            |'valueToUi'
            
            // behaviors:
            |'autoFocusOnEdit'
            |'cancelEditOnBlur'
            
            // components:
            |'orderableListItemComponent'
            |'actionEditorComponent'
        >,
        Pick<InsertOrderableListItemProps<HTMLElement, TValue, TChangeEvent>,
            // accessibilities:
            |'placeholder'
            
            // values:
            |'emptyValue'
            
            // components:
            |'insertOrderableListItemComponent'
            |'actionEditorComponent'
        >
{
    // positions:
    editorPosition ?: EditorPosition
}
const ListEditor = <TElement extends Element = HTMLElement, TValue extends unknown = string, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>>(props: ListEditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // positions:
        editorPosition                    = 'end',
        
        
        
        // accessibilities:
        placeholder,                      // take, to be handled by `<InsertOrderableListItem>` and `<EditableOrderableListItem>`
        
        
        
        // values:
        valueToUi,                        // take, to be handled by                                 `<EditableOrderableListItem>`
        emptyValue,                       // take, to be handled by `<InsertOrderableListItem>`
        
        defaultValue                      : defaultUncontrollableValue = [],
        value                             : controllableValue,
        onChange                          : onValueChange,
        
        
        
        // behaviors:
        autoFocusOnEdit,                  // take, to be handled by                                 `<EditableOrderableListItem>`
        cancelEditOnBlur,                 // take, to be handled by                                 `<EditableOrderableListItem>`
        
        
        
        // components:
        orderableListComponent            = (<OrderableList<TElement, number> /> as React.ReactElement<OrderableListProps<TElement, number>>),
        orderableListItemComponent,       // take, to be handled by                                 `<EditableOrderableListItem>`
        insertOrderableListItemComponent, // take, to be handled by `<InsertOrderableListItem>`
        actionEditorComponent,            // take, to be handled by `<InsertOrderableListItem>` and `<EditableOrderableListItem>`
        
        
        
        // other props:
        ...restPreListEditorProps
    } = props;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue[], TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onValueChange,
    });
    
    const {
        uniqueKeys,
    } = useUniqueKeys({
        value,
    });
    
    
    
    // handlers:
    const handleChildrenChangeInternal = useEvent<ChildrenChangeEventHandler<number>>((children, event): void => {
        triggerValueChange(
            extractElementsByOrder(value,        
                children
                .filter(({props}) => 'data' in props) // filter out <InsertOrderableListItem>
                .map(({props: {data}}) =>
                    data!
                )
            ),
            { triggerAt: 'immediately', event: event satisfies React.SyntheticEvent<unknown, Event> as React.SyntheticEvent<unknown, Event> as TChangeEvent }
        );
    });
    const handleChildrenChange         = useMergeEvents(
        // preserves the original `onChildrenChange` from `orderableListComponent`:
        orderableListComponent.props.onChildrenChange,
        
        
        
        // actions:
        handleChildrenChangeInternal,
    );
    
    const handleSave                   = useEvent<EditorChangeEventHandler<SaveEntity<TValue>, TChangeEvent>>(({index, mutatedValue}, event) => {
        const valueCopy = value.slice(0);
        valueCopy[index] = mutatedValue;
        triggerValueChange(
            valueCopy,
            { triggerAt: 'immediately', event }
        );
    });
    const handleDelete                 = useEvent<EditorChangeEventHandler<DeleteEntity, TChangeEvent>>(({index}, event) => {
        const valueCopy = value.slice(0);
        valueCopy.splice(index, 1);
        triggerValueChange(
            valueCopy,
            { triggerAt: 'immediately', event }
        );
    });
    
    const handleInsertStart            = useEvent<EditorChangeEventHandler<TValue, TChangeEvent>>((newItem, event) => {
        triggerValueChange(
            [
                newItem,
                ...value,
            ],
            { triggerAt: 'immediately', event }
        );
    });
    const handleInsertEnd              = useEvent<EditorChangeEventHandler<TValue, TChangeEvent>>((newItem, event) => {
        triggerValueChange(
            [
                ...value,
                newItem,
            ],
            { triggerAt: 'immediately', event }
        );
    });
    
    
    
    // props:
    const {
        // values:
        notifyValueChange       = value, // take, to be handled by `<EditableButton>`
        
        
        
        // other props:
        ...restListEditorProps
    } = restPreListEditorProps;
    
    
    
    // default props:
    const {
        // other props:
        ...restOrderableListProps
    } = restListEditorProps satisfies NoForeignProps<typeof restListEditorProps, OrderableListProps<TElement, number>>;
    
    const {
        // children:
        children : orderableListComponentChildren = <>
            {((editorPosition === 'start') || (editorPosition === 'both')) && <InsertOrderableListItem<HTMLElement, TValue, TChangeEvent>
                // accessibilities:
                placeholder={placeholder}
                
                
                
                // values:
                emptyValue={emptyValue}
                
                
                
                // components:
                insertOrderableListItemComponent={insertOrderableListItemComponent}
                actionEditorComponent={actionEditorComponent}
                
                
                
                // handlers:
                onInsert={handleInsertStart}
            />}
            
            {/* <EditableOrderableListItem> */}
            {value.map((val, listIndex) =>
                <EditableOrderableListItem<HTMLElement, TValue, TChangeEvent>
                    // identifiers:
                    key={uniqueKeys[listIndex]}
                    
                    
                    
                    // data:
                    data={listIndex}
                    
                    
                    
                    // accessibilities:
                    placeholder={placeholder}
                    
                    
                    
                    // values:
                    valueToUi={valueToUi}
                    
                    defaultValue={val}
                    
                    
                    
                    // behaviors:
                    autoFocusOnEdit={autoFocusOnEdit}
                    cancelEditOnBlur={cancelEditOnBlur}
                    
                    
                    
                    // components:
                    orderableListItemComponent={orderableListItemComponent}
                    actionEditorComponent={actionEditorComponent}
                    
                    
                    
                    // handlers:
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
            
            {((editorPosition === 'end') || (editorPosition === 'both')) && <InsertOrderableListItem<HTMLElement, TValue, TChangeEvent>
                // accessibilities:
                placeholder={placeholder}
                
                
                
                // values:
                emptyValue={emptyValue}
                
                
                
                // components:
                insertOrderableListItemComponent={insertOrderableListItemComponent}
                actionEditorComponent={actionEditorComponent}
                
                
                
                // handlers:
                onInsert={handleInsertEnd}
            />}
        </>,
        
        
        
        // other props:
        ...restOrderableListComponentProps
    } = orderableListComponent.props;
    
    
    
    // jsx:
    /* <OrderableList> */
    return React.cloneElement<OrderableListProps<TElement, number>>(orderableListComponent,
        // props:
        {
            // other props:
            ...restOrderableListProps,
            ...restOrderableListComponentProps, // overwrites restOrderableListProps (if any conflics)
            
            
            
            // handlers:
            onChildrenChange : handleChildrenChange,
        },
        
        
        
        // children:
        orderableListComponentChildren,
    );
};
export {
    ListEditor,            // named export for readibility
    ListEditor as default, // default export to support React.lazy
}



export interface ListEditorComponentProps<out TElement extends Element = HTMLElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>>
{
    // components:
    listEditorComponent ?: React.ReactElement<ListEditorProps<TElement, TValue, TChangeEvent>>
}
