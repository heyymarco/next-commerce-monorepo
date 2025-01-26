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

// heymarco components:
import {
    // types:
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
import {
    // react components:
    type InputEditorProps,
    InputEditor,
}                           from '@heymarco/input-editor'



// react components:
export interface NumberEditorProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends number|null = number|null>
    extends
        // bases:
        Omit<InputEditorProps<TElement, TChangeEvent, TValue>,
            // validations:
            |'minLength'|'maxLength' // text length constraint is not supported
            // these props may be used in <HexNumberEditor>, so keep it supported:
            // |'pattern'               // text regex is not supported
            
            // formats:
            // these props may be used in <HexNumberEditor>, so keep it supported:
            // |'type'                  // only supports number
            // |'autoCapitalize'        // nothing to capitalize of number
            // |'inputMode'             // always 'numeric'
        >
{
    // validations:
    min  ?: number // only supports numeric value
    max  ?: number // only supports numeric value
    step ?: number // only supports numeric value
}
const NumberEditor = <TElement extends Element = HTMLSpanElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends number|null = number|null>(props: NumberEditorProps<TElement, TChangeEvent, TValue>): JSX.Element|null => {
    // props:
    const {
        // values:
        onChange,
        onChangeAsText,
        
        
        
        // other props:
        ...restNumberEditorProps
    } = props;
    
    
    
    // handlers:
    const handleChangeAsTextInternal = useEvent<EditorChangeEventHandler<TChangeEvent, string>>((value, event) => {
        onChange?.((value ? Number.parseFloat(value) : null) as TValue, event);
    });
    const handleChangeAsText         = useMergeEvents(
        // preserves the original `onChangeAsText` from `props`:
        onChangeAsText,
        
        
        
        // handlers:
        handleChangeAsTextInternal,
    );
    
    
    
    // default props:
    const {
        // formats:
        type = 'number',
        
        
        
        // other props:
        ...restInputEditorProps
    } = restNumberEditorProps satisfies NoForeignProps<typeof restNumberEditorProps, InputEditorProps<TElement, TChangeEvent, TValue>>;
    
    
    
    // jsx:
    return (
        <InputEditor<TElement, TChangeEvent, TValue>
            // other props:
            {...restInputEditorProps}
            
            
            
            // values:
            onChangeAsText={handleChangeAsText}
            
            
            
            // formats:
            type={type}
        />
    );
};
export {
    NumberEditor,            // named export for readibility
    NumberEditor as default, // default export to support React.lazy
}



export interface NumberEditorComponentProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends number|null = number|null>
{
    // components:
    numberEditorComponent ?: React.ReactElement<NumberEditorProps<TElement, TChangeEvent, TValue>>
}
