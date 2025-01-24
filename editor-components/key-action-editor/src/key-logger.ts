// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



class KeyLogger {
    // states:
    #pressedKeys : Set<string>
    
    
    
    // constructors:
    constructor() {
        this.#pressedKeys = new Set<string>();
    }
    
    // destructors:
    dispose(): void {
        this.unlogAll(); // clear all logged keys and deactivate the unlogger
    }
    
    
    
    // states:
    get pressedKeys(): ReadonlySet<string> {
        return this.#pressedKeys;
    }
    
    
    
    // methods:
    log(keyCode: string|undefined): void {
        // conditions:
        /* note: the `code` may be `undefined` on autoComplete */
        keyCode = keyCode?.toLowerCase();
        if (!keyCode) return; // ignores [unidentified] key
        
        
        
        // logs:
        if (!this.#pressedKeys.size) this.#activateUnlogger(); // activate the unlogger if there are no logged keys
        this.#pressedKeys.add(keyCode);                        // now there are one or more logged keys; calling this `log` multiple times will not cause the unlogger to activate multiple times
    }
    #unlog(keyCode: string|undefined): void {
        // conditions:
        /* note: the `code` may be `undefined` on autoComplete */
        keyCode = keyCode?.toLowerCase();
        if (!keyCode) return; // ignores [unidentified] key
        
        
        
        // logs:
        this.#pressedKeys.delete(keyCode);                       // remove the key from the set (if it was logged)
        if (!this.#pressedKeys.size) this.#deactivateUnlogger(); // deactivate the unlogger if there are no logged keys left
    }
    unlogAll(): void {
        // logs:
        this.#pressedKeys.clear();  // clear all logged keys
        this.#deactivateUnlogger(); // deactivate the unlogger since there are no logged keys left
    }
    
    #activateUnlogger(): void {
        window.addEventListener('keyup'             , this.#handleKeyUpGlobal);
        window.addEventListener('blur'              , this.#handleWindowBlur);
        window.addEventListener('pagehide'          , this.#handlePageHide);
        document.addEventListener('visibilitychange', this.#handleVisibilityChange);
    }
    #deactivateUnlogger(): void {
        window.removeEventListener('keyup'             , this.#handleKeyUpGlobal);
        window.removeEventListener('blur'              , this.#handleWindowBlur);
        window.removeEventListener('pagehide'          , this.#handlePageHide);
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
    }
    
    
    
    // handlers:
    #handleKeyUpGlobal = (event: KeyboardEvent): void => {
        this.#unlog(event.code);
    }
    #handleWindowBlur = (): void => {
        this.unlogAll();     // reset pressed keys when the browser's window loses focus
    }
    #handlePageHide = (): void => {
        this.unlogAll();     // reset pressed keys when the browser's page is being hidden or unloaded
    }
    #handleVisibilityChange = (): void => {
        if (document.visibilityState === 'hidden') {
            this.unlogAll(); // reset pressed keys when the browser's tab is hidden
        } // if
    }
}

export interface KeyLoggerApi<TElement extends Element = HTMLSpanElement> {
    // states:
    pressedKeys   : ReadonlySet<string>
    
    
    
    // handlers:
    handleKeyDown : React.KeyboardEventHandler<TElement>
    handleBlur    : React.FocusEventHandler<TElement>
}
export const useKeyLogger = <TElement extends Element = HTMLSpanElement>(): KeyLoggerApi<TElement> => {
    // states:
    const keyLoggerRef = useRef<KeyLogger|null>(null);
    
    
    
    // handlers:
    const handleKeyDown = useEvent<React.KeyboardEventHandler<TElement>>((event) => {
        // logs:
        keyLoggerRef.current?.log(event.code);
    });
    const handleBlur    = useEvent<React.FocusEventHandler<TElement>>((event) => {
        keyLoggerRef.current?.unlogAll(); // reset pressed keys when the editor loses focus
    });
    
    
    
    // states:
    /*
        We need a stable reference to the `KeyLoggerApi` object so that the consumer of `useKeyLogger` can access the *latest* assigned `pressedKeys` on a stable `KeyLoggerApi` object.
    */
    const keyLoggerApiRef = useRef<KeyLoggerApi<TElement>>({
        // states:
        pressedKeys : keyLoggerRef.current?.pressedKeys ?? new Set<string>(), // mutable ref
        
        
        
        // handlers:
        handleKeyDown, // stable ref
        handleBlur,    // stable ref
    });
    
    
    
    // effects:
    useEffect(() => {
        // setups:
        const newKeyLogger                  = new KeyLogger();
        keyLoggerRef.current                = newKeyLogger;
        
        keyLoggerApiRef.current.pressedKeys = newKeyLogger.pressedKeys; // assign the latest `pressedKeys`.
        
        
        
        // cleanups:
        return () => {
            keyLoggerRef.current?.dispose();
            keyLoggerRef.current                = null;
            
            keyLoggerApiRef.current.pressedKeys = new Set<string>();
        };
    }, []);
    
    
    
    // api:
    return keyLoggerApiRef.current;
}