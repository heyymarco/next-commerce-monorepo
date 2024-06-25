// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
export const useAddressEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles.js')
, { id: 'd5q26tcecj' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
