// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
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
export interface NumberEditorProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        Omit<InputEditorProps<TElement, TChangeEvent, number|null>,
            // validations:
            |'minLength'|'maxLength' // text length constraint is not supported
            |'pattern'               // text regex is not supported
            
            // formats:
            |'type'                  // only supports number
            |'autoCapitalize'        // nothing to capitalize of number
            |'inputMode'             // always 'numeric'
        >
{
    // validations:
    min  ?: number // only supports numeric value
    max  ?: number // only supports numeric value
    step ?: number // only supports numeric value
}
const NumberEditor = <TElement extends Element = HTMLSpanElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: NumberEditorProps<TElement, TChangeEvent>): JSX.Element|null => {
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
        onChange?.((value ? Number.parseFloat(value) : null), event);
    });
    const handleChangeAsText         = useMergeEvents(
        // preserves the original `onChangeAsText` from `props`:
        onChangeAsText,
        
        
        
        // handlers:
        handleChangeAsTextInternal,
    );
    
    
    
    // jsx:
    return (
        <InputEditor<TElement, TChangeEvent, number|null>
            // other props:
            {...restNumberEditorProps}
            
            
            
            // values:
            onChangeAsText={handleChangeAsText}
            
            
            
            // formats:
            type='number'
        />
    );
};
export {
    NumberEditor,            // named export for readibility
    NumberEditor as default, // default export to support React.lazy
}



export interface NumberEditorComponentProps<out TElement extends Element = HTMLSpanElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
{
    // components:
    numberEditorComponent ?: React.ReactElement<NumberEditorProps<TElement, TChangeEvent>>
}
