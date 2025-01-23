// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
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
    type TextEditorProps,
    TextEditor,
    type TextEditorComponentProps,
}                           from '@heymarco/text-editor'

// internals:
import {
    defaultSaveKeys,
    defaultCancelKeys,
    defaultDeleteKeys,
}                           from './default-keys.js'
import {
    isMatchingComboKeys,
}                           from './utilities.js'



// react components:
export interface KeyActionEditorProps</*out*/ TElement extends Element = HTMLElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        Omit<ActionEditorProps<TElement, TChangeEvent, string, React.KeyboardEvent<TElement>>,
            // refs:
            |'elmRef'   // moved to <input>
            
            // children:
            |'children' // no nested children
        >,
        Pick<TextEditorProps<TElement, TChangeEvent>,
            // refs:
            |'elmRef'   // moved to <input>
        >,
        
        // components:
        TextEditorComponentProps<TElement, TChangeEvent>
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
const KeyActionEditor = <TElement extends Element = HTMLElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: KeyActionEditorProps<TElement, TChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,
        
        
        
        // accessibilities:
        saveKeys            = defaultSaveKeys,
        cancelKeys          = defaultCancelKeys,
        deleteKeys          = defaultDeleteKeys,
        
        
        
        // components:
        textEditorComponent = (<TextEditor /> as React.ReactElement<TextEditorProps<TElement, TChangeEvent>>),
        
        
        
        // handlers:
        onSave,
        onCancel,
        onDelete,
        
        onKeyDown,
        onBlur,
        
        
        
        // other props:
        ...restKeyActionEditorProps
    } = props;
    
    
    
    // refs:
    const mergedInputRef = useMergeRefs(
        // preserves the original `elmRef` from `textEditorComponent`:
        textEditorComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        elmRef,
    );
    
    
    
    // states:
    const [pressedKeys, setPressedKeys] = useState<Set<string>|null>(null);
    
    
    
    // handlers:
    const handleKeyDownInternal = useEvent<React.KeyboardEventHandler<TElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // the event already handled by user => nothing to do
        
        /* note: the `code` may be `undefined` on autoComplete */
        const keyCode = (event.code as string|undefined)?.toLowerCase();
        if (!keyCode) return; // ignores [unidentified] key
        
        
        
        // logs:
        let actionPerformed = false;
        setPressedKeys((currentPressedKeys) => {
            const updatedPressedKeys = currentPressedKeys ? currentPressedKeys /* prevents excess re-render */ : new Set<string>() /* re-render with existing key pressed */;
            updatedPressedKeys.add(keyCode);
            
            
            
            // actions:
            /*
                We invoke `onSave(event)`, `onCancel(event)`, or `onDelete(event)` within the `setPressedKeys`'s
                callback because we need `event.preventDefault()` to function properly.
                Running these functions within `useEffect` causes `event.preventDefault()` to be called too late
                since the event has already been processed by the browser.
            */
            if (!actionPerformed) {
                /*
                    This *side effect* doesn't cause the returning `updatedPressedKeys` to have a different value
                    for the same input `currentPressedKeys`.
                */
                actionPerformed = true; // mark as performed to avoid triggering the event twice due to React's strict mode
                
                
                
                const testKeys = Array.from(updatedPressedKeys);
                if (isMatchingComboKeys(testKeys, saveKeys)) {
                    // Special handling for Enter key:
                    if ((keyCode === 'enter') && (testKeys.length === 1)) {
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
                    if ((keyCode === 'delete') && (testKeys.length === 1)) {
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
            } // if
            
            
            
            return updatedPressedKeys;
        });
    });
    const handleKeyDown         = useMergeEvents(
        // preserves the original `onKeyDown` from `textEditorComponent`:
        textEditorComponent.props.onKeyDown,
        
        
        
        // preserves the original `onKeyDown` from `props`:
        onKeyDown,
        
        
        
        // actions:
        handleKeyDownInternal,
    );
    
    const handleBlurInternal    = useEvent<React.FocusEventHandler<TElement>>((event) => {
        setPressedKeys(null); // reset pressed keys when the editor loses focus
    });
    const handleBlur            = useMergeEvents(
        // preserves the original `onBlur` from `textEditorComponent`:
        textEditorComponent.props.onBlur,
        
        
        
        // preserves the original `onBlur` from `props`:
        onBlur,
        
        
        
        // actions:
        handleBlurInternal,
    );
    
    
    
    // effects:
    
    /*
        Handles global keyup events when one or more keys are pressed.
        Removes the global keyup listener when no keys are pressed.
    */
    useEffect(() => {
        // conditions:
        if (!pressedKeys) return; // no button pressed  => ignore
        
        
        
        // handlers:
        const handleKeyUpGlobal      = (event: KeyboardEvent) => {
            // conditions:
            /* note: the `code` may be `undefined` on autoComplete */
            const keyCode = (event.code as string|undefined)?.toLowerCase();
            if (!keyCode) return; // ignores [unidentified] key
            
            
            
            // logs:
            setPressedKeys((currentPressedKeys) => {
                const newPressedKeys = new Set<string>(currentPressedKeys);
                newPressedKeys.delete(keyCode);
                if (newPressedKeys.size) return newPressedKeys; // at least one key pressed => remember the state
                return null; // forget the state
            });
        };
        const handleWindowBlur       = () => {
            setPressedKeys(null);     // reset pressed keys when the window loses focus
        };
        const handlePageHide         = () => {
            setPressedKeys(null);     // reset pressed keys when the page is being hidden or unloaded
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setPressedKeys(null); // reset pressed keys when the tab is hidden
            } // if
        };
        
        
        
        // setups:
        window.addEventListener('keyup'             , handleKeyUpGlobal);
        window.addEventListener('blur'              , handleWindowBlur);
        window.addEventListener('pagehide'          , handlePageHide);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        
        
        // cleanups:
        return () => {
            window.removeEventListener('keyup'             , handleKeyUpGlobal);
            window.removeEventListener('blur'              , handleWindowBlur);
            window.removeEventListener('pagehide'          , handlePageHide);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [pressedKeys]);
    
    
    
    // default props:
    const {
        ...restTextEditorProps
    } = restKeyActionEditorProps satisfies NoForeignProps<typeof restKeyActionEditorProps, TextEditorProps<TElement, TChangeEvent>>;
    
    const {
        ...restTextEditorComponentProps
    } = textEditorComponent.props;
    
    
    
    // jsx:
    /* <TextEditor> */
    return React.cloneElement<TextEditorProps<TElement, TChangeEvent>>(textEditorComponent,
        // props:
        {
            // other props:
            ...restTextEditorProps,
            ...restTextEditorComponentProps, // overwrites restTextEditorProps (if any conflics)
            
            
            
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
