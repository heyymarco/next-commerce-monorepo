// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import type {
    // types:
    FieldErrorList,
}                           from './types.js'



// utilities:
export const paragraphify = (text: string): React.ReactElement => {
    // jsx:
    return (
        <>
            {
                text
                .split(/(?:\r?\n){2,}/) // double/triple/many new_line(s)
                .map((para, index) => <p key={index}>{para}</p>)
            }
        </>
    );
};

export const isTypeError = (error: any): boolean => {
    return (
        (error instanceof TypeError)
        ||
        (
            (typeof(error) === 'string')
            &&
            error.startsWith('TypeError:')
        )
    );
};

export const isReactNode = <TDialogMessage extends {}>(dialogMessage : React.SetStateAction<TDialogMessage|false> | React.ReactNode, uniqueProp: keyof TDialogMessage): dialogMessage is Exclude<React.ReactNode, false|Function> => {
    return (
        (dialogMessage             !==  false      ) // not `false`                       /* `false`         is used for closing     <ModalStatus> */
        &&
        (typeof(dialogMessage)     !== 'function'  ) // not a Function                    /* Function        is used for dispatching <ModalStatus> */
        &&
        (
            (typeof(dialogMessage) !== 'object'    ) // not object
            ||
            (dialogMessage         ===  null       ) // is  object of `null`
            ||
            !(uniqueProp           in dialogMessage) // is  object of not_TDialogMessage  /* `TDialogMessage` is used for opening    <ModalStatus> */
        )
    );
};
export const isFieldErrorList = <TDialogMessage extends {}>(dialogMessage : React.SetStateAction<TDialogMessage|false> | FieldErrorList, uniqueProp: keyof TDialogMessage): dialogMessage is FieldErrorList => {
    return (
        (dialogMessage             !==  false      ) // not `false`                       /* `false`         is used for closing     <ModalStatus> */
        &&
        (typeof(dialogMessage)     !== 'function'  ) // not a Function                    /* Function        is used for dispatching <ModalStatus> */
        &&
        (
            (typeof(dialogMessage) !== 'object'    ) // not object
            ||
            (dialogMessage         ===  null       ) // is  object of `null`
            ||
            !(uniqueProp           in dialogMessage) // is  object of not_TDialogMessage  /* `TDialogMessage` is used for opening    <ModalStatus> */
        )
    );
};
