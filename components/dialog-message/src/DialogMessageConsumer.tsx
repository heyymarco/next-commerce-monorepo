// react:
import {
    // contexts:
    useContext,
}                           from 'react'

// internals:
import {
    // contexts:
    DialogMessageApi,
    DialogMessageContext,
}                           from './DialogMessageContext.js'



// hooks:
export const useDialogMessage = (): DialogMessageApi => {
    return useContext(DialogMessageContext);
};
