// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    type EventHandler,
    useMergeEvents,
    useMergeRefs,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

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



export interface EditEntity {
    index : number
}
export interface SaveEntity<TValue extends unknown = string> extends EditEntity {
    mutatedValue : TValue
}
export interface DeleteEntity extends EditEntity {
}

export interface EditActionEditorProps<out TElement extends Element = HTMLButtonElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>, TValue extends unknown = string>
    extends
        // components:
        ActionEditorComponentProps<Element, TChangeEvent, TValue, TChangeEvent>,
        Pick<React.InputHTMLAttributes<TElement>,
            // accessibilities:
            |'placeholder'
        >
{
    // identifiers:
    listIndex         : number
    
    
    
    // values:
    defaultValue     ?: TValue
    
    
    
    // behaviors:
    autoFocusOnEdit  ?: boolean
    cancelEditOnBlur ?: boolean
    
    
    
    // handlers:
    onSave           ?: EditorChangeEventHandler<TChangeEvent, SaveEntity<TValue>>
    onDelete         ?: EditorChangeEventHandler<TChangeEvent, DeleteEntity>
    onCancel         ?: EventHandler<void>
}
export interface EditActionEditorApi<in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>, TValue extends unknown = string>
    extends
        // components:
        Required<ActionEditorComponentProps<Element, TChangeEvent, TValue, TChangeEvent>>
{
}
export const useEditActionEditor = <TElement extends Element = HTMLButtonElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>, TValue extends unknown = string>(props: EditActionEditorProps<TElement, TChangeEvent, TValue>): EditActionEditorApi<TChangeEvent, TValue> => {
    // props:
    const {
        // identifiers:
        listIndex,
        
        
        
        // accessibilities:
        placeholder           = 'Add new',
        
        
        
        // values:
        defaultValue          = '' as TValue,
        
        
        
        // behaviors:
        autoFocusOnEdit       = true,
        cancelEditOnBlur      = true,
        
        
        
        // components:
        actionEditorComponent = (<KeyActionEditor<Element, TChangeEvent, TValue> inputEditorComponent={<InputEditor<Element, TChangeEvent, TValue> placeholder={placeholder} />} /> as React.ReactElement<ActionEditorProps<Element, TChangeEvent, TValue, TChangeEvent>>),
        
        
        
        // handlers:
        onSave,
        onDelete,
        onCancel,
    } = props;
    
    
    
    // refs:
    const editorRef    = useRef<TElement|null>(null);
    const mergedElmRef = useMergeRefs(
        // preserves the original `elmRef` from `actionEditorComponent`:
        actionEditorComponent.props.elmRef,
        
        
        
        editorRef,
    );
    
    
    
    // states:
    const [editorValue, setEditorValue] = useState<TValue>(defaultValue);
    
    
    
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
    
    const handleCancelInternal = useEvent((): void => {
        onCancel?.();
    });
    const handleCancel         = useMergeEvents(
        // preserves the original `onCancel` from `actionEditorComponent`:
        actionEditorComponent.props.onCancel,
        
        
        
        // actions:
        handleCancelInternal,
    );
    
    const handleDeleteInternal = useEvent<EventHandler<TChangeEvent>>((event) => {
        onDelete?.({ index: listIndex } satisfies DeleteEntity, event);
    });
    const handleDelete         = useMergeEvents(
        // preserves the original `onDelete` from `actionEditorComponent`:
        actionEditorComponent.props.onDelete,
        
        
        
        // actions:
        handleDeleteInternal,
    );
    
    const handleSaveInternal   = useEvent<EventHandler<TChangeEvent>>((event) => {
        onSave?.({ index: listIndex, mutatedValue: editorValue} satisfies SaveEntity<TValue>, event);
    });
    const handleSave           = useMergeEvents(
        // preserves the original `onSave` from `actionEditorComponent`:
        actionEditorComponent.props.onSave,
        
        
        
        // actions:
        handleSaveInternal,
    );
    
    const handleBlurInternal   = useEvent((): void => {
        // actions:
        if (cancelEditOnBlur) handleCancelInternal();
    });
    const handleBlur           = useMergeEvents(
        // preserves the original `onBlur` from `actionEditorComponent`:
        actionEditorComponent.props.onBlur,
        
        
        
        // actions:
        handleBlurInternal,
    );
    
    
    
    // effects:
    
    // focus the editor when the `autoFocusOnEdit` is activated:
    useEffect(() => {
        // conditions:
        if (!autoFocusOnEdit) return; // the `autoFocusOnEdit` is not activated => ignore
        const editorElm = editorRef.current;
        if (!editorElm) return; // the editor is not loaded => ignore
        if (!(editorElm instanceof HTMLElement)) return; // the editor is not a HTMLElement => ignore
        
        
        
        // actions:
        editorElm.focus();
    }, []);
    
    
    
    // default props:
    const {
        // variants:
        nude  : actionEditorComponentNude  = true,
        
        
        
        // values:
        value : actionEditorComponentValue = editorValue, // internally controllable
        
        
        
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
                
                
                
                // refs:
                elmRef   : mergedElmRef,
                
                
                
                // variants:
                nude     : actionEditorComponentNude,
                
                
                
                // values:
                value    : actionEditorComponentValue, // internally controllable
                onChange : handleChange,               // internally controllable
                
                
                
                // handlers:
                onCancel : handleCancel,
                onDelete : handleDelete,
                onSave   : handleSave,
                onBlur   : handleBlur,
            },
        ),
    } satisfies EditActionEditorApi<TChangeEvent, TValue>;
}
