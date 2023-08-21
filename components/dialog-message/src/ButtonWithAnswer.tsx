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
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
}                           from '@reusable-ui/components'



// react components:
export interface ButtonWithAnswerProps<TAnswer extends any>
    extends
        // bases:
        ButtonProps,
        
        // components:
        Required<Pick<ButtonComponentProps,
            'buttonComponent' // a required underlying <Button>
        >>
{
    // contents:
    answer   : TAnswer
    
    
    
    // handlers:
    onAnswer : (answer: TAnswer) => void
}
const ButtonWithAnswer = <TAnswer extends any>(props: ButtonWithAnswerProps<TAnswer>): JSX.Element|null => {
    // rest props:
    const {
        // contents:
        answer,
        
        
        
        // components:
        buttonComponent,
        
        
        
        // handlers:
        onAnswer,
    ...restButtonProps} = props;
    
    
    
    // handlers:
    const handleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // already handled => ignore
        event.preventDefault(); // handled
        
        
        
        // actions:
        onAnswer(answer);
    });
    const handleClick          = useMergeEvents(
        // preserves the original `onClick` from `buttonComponent`:
        buttonComponent.props.onClick,
        
        
        
        // preserves the original `onClick` from `props`:
        props.onClick,
        
        
        
        // actions:
        handleClickInternal,
    );
    
    
    
    // jsx:
    /* <Button> */
    return React.cloneElement<ButtonProps>(buttonComponent,
        // props:
        {
            // other props:
            ...restButtonProps,
            ...buttonComponent.props, // overwrites restButtonProps (if any conflics)
            
            
            
            // handlers:
            onClick : handleClick,
        },
    );
};
export {
    ButtonWithAnswer,
    ButtonWithAnswer as default,
};
