// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    type EventHandler,
    useMergeEvents,
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
import {
    // react components:
    type ActionEditorProps,
    type ActionEditorComponentProps,
}                           from '@heymarco/action-editor'
import {
    // react components:
    KeyActionEditor,
}                           from '@heymarco/key-action-editor'
import {
    // react components:
    InputEditor,
}                           from '@heymarco/input-editor'



/*
    We use HTMLElement instead of Element because HTMLElement supports drag-and-drop, while Element does not.
*/
export interface InsertActionEditorProps<out TElement extends HTMLElement = HTMLElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>, TValue extends unknown = string>
    extends
        // components:
        ActionEditorComponentProps<Element, TChangeEvent, TValue, TChangeEvent>,
        Pick<React.InputHTMLAttributes<TElement>,
            // accessibilities:
            |'placeholder'
        >
{
    // values:
    emptyValue ?: TValue
    
    
    
    // handlers:
    onInsert   ?: EditorChangeEventHandler<TChangeEvent, TValue>
}
export interface InsertActionEditorApi<in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>, TValue extends unknown = string>
    extends
        // components:
        Required<ActionEditorComponentProps<Element, TChangeEvent, TValue, TChangeEvent>>
{
}
export const useInsertActionEditor = <TElement extends HTMLElement = HTMLElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>, TValue extends unknown = string>(props: InsertActionEditorProps<TElement, TChangeEvent, TValue>): InsertActionEditorApi<TChangeEvent, TValue> => {
    // props:
    const {
        // accessibilities:
        placeholder           = 'Add new',
        
        
        
        // values:
        emptyValue            = '' as TValue,
        
        
        
        // components:
        actionEditorComponent = (<KeyActionEditor<Element, TChangeEvent, TValue> inputEditorComponent={<InputEditor<Element, TChangeEvent, TValue> placeholder={placeholder} />} /> as React.ReactElement<ActionEditorProps<Element, TChangeEvent, TValue, TChangeEvent>>),
        
        
        
        // handlers:
        onInsert,
    } = props;
    
    
    
    // states:
    const [editorValue, setEditorValue] = useState<TValue>(emptyValue);
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<TChangeEvent, TValue>>((value, event) => {
        setEditorValue(value);
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `actionEditorComponent`:
        actionEditorComponent.props.onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    const handleClearInternal  = useEvent(() => {
        setEditorValue(emptyValue);
    });
    const handleCancel         = useMergeEvents(
        // preserves the original `onCancel` from `actionEditorComponent`:
        actionEditorComponent.props.onCancel,
        
        
        
        // actions:
        handleClearInternal,
    );
    const handleDelete         = useMergeEvents(
        // preserves the original `onDelete` from `actionEditorComponent`:
        actionEditorComponent.props.onDelete,
        
        
        
        // actions:
        handleClearInternal,
    );
    
    const handleSaveInternal   = useEvent<EventHandler<TChangeEvent>>((event) => {
        onInsert?.(editorValue, event);
        handleClearInternal();
    });
    const handleSave           = useMergeEvents(
        // preserves the original `onSave` from `actionEditorComponent`:
        actionEditorComponent.props.onSave,
        
        
        
        // actions:
        handleSaveInternal,
    );
    
    
    
    // default props:
    const {
        // variants:
        nude  : actionEditorComponentNude  = true,
        
        
        
        // values:
        value : actionEditorComponentValue = editorValue, // controllable
        
        
        
        // other props:
        ...restActionEditorComponentProps
    } = actionEditorComponent.props;
    
    
    
    // api:
    return {
        // components:
        actionEditorComponent : React.cloneElement<ActionEditorProps<Element, TChangeEvent, TValue, TChangeEvent>>(actionEditorComponent,
            // props:
            {
                // other props:
                ...restActionEditorComponentProps,
                
                
                
                // variants:
                nude     : actionEditorComponentNude,
                
                
                
                // values:
                value    : actionEditorComponentValue,
                onChange : handleChange,
                
                
                
                // handlers:
                onCancel : handleCancel,
                onDelete : handleDelete,
                onSave   : handleSave,
            },
        ),
    } satisfies InsertActionEditorApi<TChangeEvent, TValue>;
}
