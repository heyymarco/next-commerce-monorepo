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
    ProgressBar,
}                           from '@reusable-ui/components'



const LoadingBar = (props: ProgressProps) => <Progress {...props} semanticRole='status' aria-label='Loading...'>
    <ProgressBar value={100} progressBarStyle='striped' running />
</Progress>
export {
    LoadingBar,
    LoadingBar as default,
}
