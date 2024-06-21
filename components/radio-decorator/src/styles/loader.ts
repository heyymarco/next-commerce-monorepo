// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook



// styles:
export const useRadioDecoratorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles.js')
, { id: 'pv3m7dqopm' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
