// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
export const useAlternateSeparatorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles.js')
, { id: 'a9gqql8cfi' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
