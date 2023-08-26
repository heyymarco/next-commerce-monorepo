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
}                           from '@reusable-ui/core'



export type FieldHandlers<TElement extends HTMLInputElement = HTMLInputElement> = Required<Pick<React.InputHTMLAttributes<TElement>, 'onChange'>>
export const useFieldState = <TElement extends HTMLInputElement = HTMLInputElement>(): readonly [string, React.Dispatch<React.SetStateAction<string>>, FieldHandlers<TElement>] => {
    // states:
    const [field, setField] = useState<string>('');
    
    
    
    // handlers:
    const handleFieldChange = useEvent<React.ChangeEventHandler<TElement>>(({target: {value}}) => {
        setField(value);
    });
    
    
    
    // api:
    return [
        field,
        setField,
        useMemo(() => ({ // make a stable ref object
            onChange : handleFieldChange,
        }), []),
    ];
};



export type FocusHandlers<TElement extends Element = HTMLElement> = Required<Pick<React.InputHTMLAttributes<TElement>, 'onFocus'|'onBlur'>>
export const useFocusState = <TElement extends Element = HTMLElement>() : readonly [boolean, FocusHandlers<TElement>] => {
    // states:
    const [isFocus, setIsFocus] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleFocus = useEvent<React.FocusEventHandler<TElement>>(() => {
        setIsFocus(true);
    });
    const handleBlur  = useEvent<React.FocusEventHandler<TElement>>(() => {
        setIsFocus(false);
    });
    
    
    
    // api:
    return [
        isFocus,
        useMemo(() => ({ // make a stable ref object
            onFocus : handleFocus,
            onBlur  : handleBlur,
        }), []),
    ];
};
