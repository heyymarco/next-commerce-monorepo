// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
export const useSelectDropdownEditorItemStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles.js')
, { id: 'zs1i2xt4pm' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
