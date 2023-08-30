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
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



export interface LoadingBarProps<TElement extends Element = HTMLElement>
    extends
        Omit<ProgressProps<TElement>, 'children'>,
        Pick<ProgressBarProps<Element>, 'running'>
{
}
const LoadingBar = <TElement extends Element = HTMLElement>(props: LoadingBarProps<TElement>) => {
    // rest props:
    const {
        // states:
        running = true,
    ...restProgressProps} = props;
    
    
    
    // jsx:
    return (
        <Progress<TElement>
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
