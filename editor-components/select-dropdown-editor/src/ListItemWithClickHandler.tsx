// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    type ListItemProps,
    type ListItemComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content



// react components:
export interface ListItemWithClickHandlerProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>,
        
        // components:
        Required<ListItemComponentProps<TElement>>
{
}
const ListItemWithClickHandler = <TElement extends Element = HTMLElement>(props: ListItemWithClickHandlerProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // components:
        listItemComponent,
        
        
        
        // other props:
        ...restListItemWithClickHandlerProps
    } = props;
    
    
    
    // handlers:
    const handleClick = useMergeEvents(
        // preserves the original `onClick` from `listItemComponent`:
        listItemComponent.props.onClick,
        
        
        
        // preserves the original `onClick` from `props`:
        props.onClick,
    );
    
    
    
    // jsx:
    /* <ListItem> */
    return React.cloneElement<ListItemProps<TElement>>(listItemComponent,
        // props:
        {
            // other props:
            ...restListItemWithClickHandlerProps,
            
            
            
            // handlers:
            onClick : handleClick,
        },
    );
};
export {
    ListItemWithClickHandler,            // named export for readibility
    ListItemWithClickHandler as default, // default export to support React.lazy
}
