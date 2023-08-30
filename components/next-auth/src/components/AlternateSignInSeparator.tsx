// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui components:
import {
    // base-components:
    GenericProps,
    Generic,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



// styles:
export const useAlternateSignInSeparatorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/alternateSignInSeparatorStyles.js')
, { id: 'yh0eajvd8b' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:
export interface AlternateSignInSeparatorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        GenericProps<TElement>
{
    // accessibilities:
    alternateSignInText ?: string
}
const AlternateSignInSeparator = <TElement extends Element = HTMLElement>(props: AlternateSignInSeparatorProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet = useAlternateSignInSeparatorStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        alternateSignInText = 'or',
        
        
        
        // children:
        children,
    ...restGenericProps} = props;
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            {children ?? <>
                <hr />
                <span className='text'>
                    {alternateSignInText}
                </span>
                <hr />
            </>}
        </Generic>
    );
};
export {
    AlternateSignInSeparator,
    AlternateSignInSeparator as default,
};
