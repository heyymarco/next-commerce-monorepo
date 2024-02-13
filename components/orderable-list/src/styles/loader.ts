// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
export const useOrderableListStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles.js')
, { id: 'r04l1lsujh' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
