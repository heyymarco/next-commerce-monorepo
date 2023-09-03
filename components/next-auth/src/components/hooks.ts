'use client'

// react:
import {
    // hooks:
    useState,
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



export type FieldHandlers<TElement extends HTMLInputElement = HTMLInputElement> = Required<Pick<React.InputHTMLAttributes<TElement>, 'onChange'>>
export const useFieldState = <TElement extends HTMLInputElement = HTMLInputElement>(): readonly [string, React.Dispatch<React.SetStateAction<string>>, boolean, FieldHandlers<TElement>] => {
    // states:
    const [field  , setField  ] = useState<string>('');
    const [isFocus, setIsFocus] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleFieldChange = useEvent<React.ChangeEventHandler<TElement>>(({target: {value}}) => {
        setField(value);
    });
    const handleFocus       = useEvent<React.FocusEventHandler<TElement>>(() => {
        setIsFocus(true);
    });
    const handleBlur        = useEvent<React.FocusEventHandler<TElement>>(() => {
        setIsFocus(false);
    });
    
    
    
    // api:
    return [
        field,
        setField,
        isFocus,
        useMemo(() => ({ // make a stable ref object
            onChange : handleFieldChange,
            onFocus  : handleFocus,
            onBlur   : handleBlur,
        }), []),
    ];
};
