// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
export const useImageStyleSheets = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles.js')
, { id: 'm91zb0019e' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
