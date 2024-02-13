// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
import './styles'; // TODO: remove this on production
export const useDragOverlayStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles')
, { specificityWeight: 0, id: 'lst0fs6z6y' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
