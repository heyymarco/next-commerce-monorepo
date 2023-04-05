'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    ProgressProps,
    Progress,
    ProgressBarProps,
    ProgressBar,
}                           from '@reusable-ui/components'



export interface LoadingBarProps
    extends
        Omit<ProgressProps, 'children'>,
        Pick<ProgressBarProps, 'running'>
{
}
const LoadingBar = (props: LoadingBarProps) => {
    // rest props:
    const {
        // states:
        running = true,
    ...restProgressProps} = props;
    
    
    
    // jsx:
    return (
        <Progress
            // other props:
            {...restProgressProps}
            
            
            
            // semantics:
            semanticRole='status'
            aria-label='Loading...'
        >
            <ProgressBar
                // variants:
                progressBarStyle='striped'
                
                
                
                // states:
                running={running}
                
                
                
                // values:
                value={100}
            />
        </Progress>
    );
}
export {
    LoadingBar,
    LoadingBar as default,
}
