// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
import './styles'; // TODO: remove this on production
export const useListItemWithOrderableStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles')
, { specificityWeight: 3, id: 'r04l1lsujh' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
