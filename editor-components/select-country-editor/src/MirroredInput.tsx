// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useMergeRefs,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    type DropdownListExpandedChangeEvent,
}                           from '@reusable-ui/dropdown-list'           // overlays a list element (menu)
import {
    // styles:
    useVisuallyHiddenStyleSheet,
}                           from '@reusable-ui/visually-hidden'         // a generic element that is visually invisible while still allowing it to be exposed to screen readers

// heymarco components:
import {
    // react components:
    type SelectDropdownEditorProps,
}                           from '@heymarco/select-dropdown-editor'



// react components:
export interface MirroredInputProps
    extends
        // bases:
        React.InputHTMLAttributes<HTMLInputElement>,
        
        // values:
        Pick<SelectDropdownEditorProps<Element, React.ChangeEvent<HTMLInputElement>, string, DropdownListExpandedChangeEvent<string>>,
            // values:
            |'valueToUi'
        >
{
    value ?: string // disallow number as value
}
const MirroredInput = React.forwardRef((props: MirroredInputProps, ref: React.ForwardedRef<HTMLInputElement>): JSX.Element|null => {
    // props:
    const {
        // accessibilities:
        tabIndex = 0, // moved to <Mirror>
        
        
        
        // values:
        valueToUi,
        
        
        
        // formats:
        placeholder,
        
        
        
        // other props:
        ...restInputProps
    } = props;
    const value = props.value;
    
    
    
    // styles:
    const visuallyHiddenstyleSheet = useVisuallyHiddenStyleSheet();
    
    
    
    // refs:
    const inputRefInternal = useRef<HTMLInputElement|null>(null);
    const mergedInputRef   = useMergeRefs(
        // preserves the original `elmRef` from `props`:
        ref,
        
        
        
        // internals:
        inputRefInternal,
    );
    const mirrorRefInternal = useRef<HTMLSpanElement|null>(null);
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const inputElm  = inputRefInternal.current;
        const mirrorElm = mirrorRefInternal.current;
        if (!inputElm) return;
        if (!mirrorElm) return;
        
        
        
        // setups:
        inputElm.focus = (options?: FocusOptions) => {
            const dummyFocus = (mirrorElm as unknown as HTMLElement)?.focus;
            if (!dummyFocus) return;
            dummyFocus.call(/* this: */mirrorElm, options);
            console.log('focused on: ', mirrorElm);
        };
    }, []);
    
    
    
    // jsx:
    return (
        <>
            {/* <Mirror> */}
            {/* the <Mirror>  must be the :first-child in order to be styled like native <input> */}
            <span
                // refs:
                ref={mirrorRefInternal}
                
                
                
                // accessibilities:
                tabIndex={tabIndex}
            >
                {!!value && (valueToUi ? valueToUi(value) : value)}
                { !value && !!placeholder && <span className='placeholder'>{placeholder}</span>}
            </span>
            
            
            
            {/* the visuallyHidden <input> */}
            <input
                // other props:
                {...restInputProps}
                
                
                
                // refs:
                ref={mergedInputRef}
                
                
                
                // classes:
                className={visuallyHiddenstyleSheet.main}
            />
        </>
    );
});
export {
    MirroredInput,            // named export for readibility
    MirroredInput as default, // default export to support React.lazy
}
