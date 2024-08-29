// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    GenericProps,
    Generic,
}                           from '@reusable-ui/generic'         // a base component

// styles:
import {
    useAlternateSeparatorStyleSheet,
}                           from './styles/loader.js'



// react components:
export interface AlternateSeparatorProps<TElement extends Element = HTMLDivElement>
    extends
        // bases:
        GenericProps<TElement>
{
}
const AlternateSeparator = <TElement extends Element = HTMLDivElement>(props: AlternateSeparatorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // children:
        children = 'or',
        
        
        
        // other props:
        ...restAlternateSeparatorProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useAlternateSeparatorStyleSheet();
    
    
    
    // default props:
    const {
        // semantics:
        role      = 'separator',
        
        
        
        // classes:
        mainClass = styleSheet.main, // defaults to internal styleSheet
        
        
        
        // other props:
        ...restGenericProps
    } = restAlternateSeparatorProps;
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // semantics:
            role={role}
            
            
            
            // classes:
            mainClass={mainClass}
        >
            <hr className='horz1' />
            <span className='text'>
                {children}
            </span>
            <hr className='horz2' />
        </Generic>
    );
};
export {
    AlternateSeparator,            // named export for readibility
    AlternateSeparator as default, // default export to support React.lazy
}
