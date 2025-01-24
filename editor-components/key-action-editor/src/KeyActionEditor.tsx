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
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    // react components:
    type ActionEditorProps,
}                           from '@heymarco/action-editor'
import {
    // react components:
    type InputEditorProps,
    InputEditor,
    type InputEditorComponentProps,
}                           from '@heymarco/input-editor'

// internals:
import {
    defaultSaveKeys,
    defaultCancelKeys,
    defaultDeleteKeys,
}                           from './default-keys.js'
import {
    isMatchingComboKeys,
}                           from './utilities.js'
import {
    useKeyLogger,
}                           from './key-logger.js'



// react components:
export interface KeyActionEditorProps</*out*/ TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string>
    extends
        // bases:
        Omit<ActionEditorProps<TElement, TChangeEvent, TValue, React.KeyboardEvent<TElement>>,
            // refs:
            |'elmRef'   // moved to <input>
            
            // children:
            |'children' // no nested children
        >,
        Pick<InputEditorProps<TElement, TChangeEvent, TValue>,
            // refs:
            |'elmRef'   // moved to <input>
        >,
        
        // components:
        InputEditorComponentProps<TElement, TChangeEvent, TValue>
{
    // accessibilities:
    /**
     * An array of key codes that trigger the save action.
     */
    saveKeys   ?: string[]
    
    /**
     * An array of key codes that trigger the cancel action.
     */
    cancelKeys ?: string[]
    
    /**
     * An array of key codes that trigger the delete action.
     */
    deleteKeys ?: string[]
}
const KeyActionEditor = <TElement extends Element = HTMLSpanElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string>(props: KeyActionEditorProps<TElement, TChangeEvent, TValue>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,
        
        
        
        // accessibilities:
        saveKeys             = defaultSaveKeys,
        cancelKeys           = defaultCancelKeys,
        deleteKeys           = defaultDeleteKeys,
        
        
        
        // components:
        inputEditorComponent = (<InputEditor<TElement, TChangeEvent, TValue> /> as React.ReactElement<InputEditorProps<TElement, TChangeEvent, TValue>>),
        
        
        
        // handlers:
        onSave,
        onCancel,
        onDelete,
        
        onKeyDown,
        onBlur,
        
        
        
        // other props:
        ...restInputEditorProps
    } = props;
    
    
    
    // refs:
    const mergedInputRef = useMergeRefs(
        // preserves the original `elmRef` from `inputEditorComponent`:
        inputEditorComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        elmRef,
    );
    
    
    
    // states:
    const keyLoggerRef = useKeyLogger<TElement>();
    
    
    
    // handlers:
    const handleKeyDownInternal = useEvent<React.KeyboardEventHandler<TElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event already handled by user => nothing to do
        
        
        
        // logs:
        keyLoggerRef.handleKeyDown(event);
        
        
        
        // actions:
        const testKeys = Array.from(keyLoggerRef.pressedKeys);
        if (isMatchingComboKeys(testKeys, saveKeys)) {
            // Special handling for Enter key:
            if ((testKeys.length === 1) && (testKeys[0] === 'enter')) {
                onSave?.(event);
                event.preventDefault(); // prevents default browser behavior
            }
            else {
                onSave?.(event);
                event.preventDefault(); // prevents default browser behavior
            } // if
        }
        else if (isMatchingComboKeys(testKeys, cancelKeys)) {
            onCancel?.(event);
            event.preventDefault(); // prevents default browser behavior
        }
        else if (isMatchingComboKeys(testKeys, deleteKeys)) {
            // Special handling for Delete key:
            if ((testKeys.length === 1) && (testKeys[0] === 'delete')) {
                const target         = event.target as HTMLInputElement|HTMLTextAreaElement;
                const text           = target.value;
                const selectionStart = target.selectionStart;
                const selectionEnd   = target.selectionEnd;
                
                if (
                    (text.length === 0) // the text is empty
                    ||
                    ((selectionStart === 0) && (selectionEnd === text.length)) // the whole text is selected
                ) {
                    onDelete?.(event);
                    event.preventDefault(); // prevents default browser behavior
                }
                // else {
                //     // Do not fire onDelete if there is text to delete
                // } // if
            }
            else {
                onDelete?.(event);
                event.preventDefault(); // prevents default browser behavior
            } // if
        } // if
    });
    const handleKeyDown         = useMergeEvents(
        // preserves the original `onKeyDown` from `inputEditorComponent`:
        inputEditorComponent.props.onKeyDown,
        
        
        
        // preserves the original `onKeyDown` from `props`:
        onKeyDown,
        
        
        
        // actions:
        handleKeyDownInternal,
    );
    
    const handleBlur            = useMergeEvents(
        // preserves the original `onBlur` from `inputEditorComponent`:
        inputEditorComponent.props.onBlur,
        
        
        
        // preserves the original `onBlur` from `props`:
        onBlur,
        
        
        
        // actions:
        keyLoggerRef.handleBlur,
    );
    
    
    
    // jsx:
    /* <InputEditor> */
    return React.cloneElement<InputEditorProps<TElement, TChangeEvent, TValue>>(inputEditorComponent,
        // props:
        {
            // other props:
            ...restInputEditorProps satisfies NoForeignProps<typeof restInputEditorProps, InputEditorProps<TElement, TChangeEvent, TValue>>,
            ...inputEditorComponent.props, // overwrites restInputEditorProps (if any conflics)
            
            
            
            // refs:
            elmRef    : mergedInputRef,
            
            
            
            // handlers:
            onKeyDown : handleKeyDown,
            onBlur    : handleBlur,
        },
    );
};
export {
    KeyActionEditor,            // named export for readibility
    KeyActionEditor as default, // default export to support React.lazy
}
