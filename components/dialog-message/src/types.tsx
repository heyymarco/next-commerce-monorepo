// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import type {
    // simple-components:
    IconProps,
    ButtonComponentProps,
}                           from '@reusable-ui/components'

// heymarco components:
import type {
    // dialog-components:
    ModalBaseProps,
}                           from '@heymarco/modal-status'



// types:
export type FieldErrorList                               = ArrayLike<Element>|null|undefined
export type AnswerOptionList<TAnswer extends any = 'ok'> = Map<TAnswer, ButtonComponentProps['buttonComponent']>|Record<Extract<TAnswer, string|number|symbol>, ButtonComponentProps['buttonComponent']>



// args:
export interface FieldErrorInfo {
    // data:
    fieldErrors    : Exclude<FieldErrorList, null|undefined>
    
    
    
    // contexts:
    context        : any
}
export interface FetchErrorInfo {
    // data:
    isRequestError : boolean
    isClientError  : boolean
    isServerError  : boolean
    
    errorCode      : number
    error          : any
    
    
    
    // contexts:
    context        : any
}



// dynamic data:
export type FieldErrorTitle   = React.ReactNode | ((errorInfo: FieldErrorInfo) => React.ReactNode)
export type FieldErrorMessage = React.ReactNode | ((errorInfo: FieldErrorInfo) => React.ReactNode)

export type FetchErrorTitle   = React.ReactNode | ((errorInfo: FetchErrorInfo) => React.ReactNode)
export type FetchErrorMessage = React.ReactNode | ((errorInfo: FetchErrorInfo) => React.ReactNode)



// options:
export interface ShowMessageOptions<TAnswer extends any = 'ok'>
    extends
        Omit<ModalBaseProps<Element>,
            // contents:
            |'title'   // we redefined `title`   prop
            |'message' // we redefined `message` prop
        >
{
    // contents:
    options             ?: AnswerOptionList<TAnswer>
}



// states:
export interface DialogMessage<TAnswer extends any = 'ok'>
    extends
        ShowMessageOptions<TAnswer>
{
    // contents:
    title               ?: React.ReactNode
    message              : React.ReactNode
}
export interface DialogMessageError<TAnswer extends any = 'ok'>
    extends
        ShowMessageOptions<TAnswer>
{
    // contents:
    title               ?: React.ReactNode
    error                : React.ReactNode
}
export interface DialogMessageFieldError<TAnswer extends any = 'ok'>
    extends
        ShowMessageOptions<TAnswer>
{
    // contents:
    fieldErrorTitle     ?: FieldErrorTitle
    
    fieldErrors          : FieldErrorList
    fieldErrorMessage   ?: FieldErrorMessage
    fieldErrorIconFind  ?: (fieldError: Element) => string|null|undefined
    fieldErrorIcon      ?: IconProps<Element>['icon']
    fieldErrorLabelFind ?: (fieldError: Element) => string|null|undefined
    fieldErrorFocus     ?: boolean
    
    
    
    // contexts:
    context             ?: any
}
export interface DialogMessageFetchError<TAnswer extends any = 'ok'>
    extends
        ShowMessageOptions<TAnswer>
{
    // contents:
    fetchErrorTitle     ?: FetchErrorTitle
    
    fetchError           : any
    fetchErrorMessage   ?: FetchErrorMessage
    
    
    
    // contexts:
    context             ?: any
}
export interface DialogMessageSuccess<TAnswer extends any = 'ok'>
    extends
        ShowMessageOptions<TAnswer>
{
    // contents:
    title               ?: React.ReactNode
    success              : React.ReactNode
}
export interface DialogMessageNotification<TAnswer extends any = 'ok'>
    extends
        ShowMessageOptions<TAnswer>
{
    // contents:
    title               ?: React.ReactNode
    notification         : React.ReactNode
}
