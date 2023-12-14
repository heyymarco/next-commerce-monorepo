// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // hooks:
    WindowResizeCallback,
    useWindowResizeObserver,
}                           from '@reusable-ui/dimensions'      // a set of React helper for fetching the dimension of elements



// react components:
export interface WindowResponsiveProps {
    // behaviors:
    mediaMinWidth : number
    
    
    
    // children:
    children      : React.ReactNode | ((expanded: boolean) => React.ReactNode);
}
export const WindowResponsive = ({mediaMinWidth, children: childrenFn}: WindowResponsiveProps): JSX.Element|null => {
    // states:
    const [expanded, setExpanded] = useState<boolean>(mediaMinWidth === 0); // initially expanded if (mediaMinWidth === 0); otherwise initially collapsed
    
    
    
    // dom effects:
    const handleWindowResize = useEvent<WindowResizeCallback>(({inlineSize: mediaCurrentWidth}) => {
        const newExpanded = (mediaCurrentWidth >= mediaMinWidth);
        if (expanded === newExpanded) return;
        setExpanded(newExpanded);
    });
    useWindowResizeObserver(handleWindowResize);
    
    
    
    // jsx:
    return (
        <>{
            (typeof(childrenFn) !== 'function')
            ?
            childrenFn
            :
            childrenFn(expanded)
        }</>
    );
};
