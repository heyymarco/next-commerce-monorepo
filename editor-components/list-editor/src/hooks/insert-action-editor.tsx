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
export interface InsertActionEditorProps<out TElement extends HTMLElement = HTMLElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>>
    extends
        // components:
        ActionEditorComponentProps<Element, TValue, TChangeEvent, TChangeEvent>,
        Pick<React.InputHTMLAttributes<TElement>,
            // accessibilities:
            |'placeholder'
        >
{
    // values:
    emptyValue ?: TValue
    
    
    
    // handlers:
    onInsert   ?: EditorChangeEventHandler<TValue, TChangeEvent>
}
export interface InsertActionEditorApi<TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>>
    extends
        // components:
        Required<ActionEditorComponentProps<Element, TValue, TChangeEvent, TChangeEvent>>
{
}
export const useInsertActionEditor = <TElement extends HTMLElement = HTMLElement, TValue extends unknown = string, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.KeyboardEvent<Element>|DraggedEvent<HTMLElement>>(props: InsertActionEditorProps<TElement, TValue, TChangeEvent>): InsertActionEditorApi<TValue, TChangeEvent> => {
    // props:
    const {
        // accessibilities:
        placeholder           = 'Add new',
        
        
        
        // values:
        emptyValue            = '' as TValue,
        
        
        
        // components:
        actionEditorComponent = (<KeyActionEditor<Element, TValue, TChangeEvent> inputEditorComponent={<InputEditor<Element, TValue, TChangeEvent> placeholder={placeholder} />} /> as React.ReactElement<ActionEditorProps<Element, TValue, TChangeEvent, TChangeEvent>>),
        
        
        
        // handlers:
        onInsert,
    } = props;
    
    
    
    // states:
    const [editorValue, setEditorValue] = useState<TValue>(emptyValue);
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<TValue, TChangeEvent>>((value, event) => {
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
        actionEditorComponent : React.cloneElement<ActionEditorProps<Element, TValue, TChangeEvent, TChangeEvent>>(actionEditorComponent,
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
    } satisfies InsertActionEditorApi<TValue, TChangeEvent>;
}
