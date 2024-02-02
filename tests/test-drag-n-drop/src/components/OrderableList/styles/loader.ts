// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook



// styles:
import './styles'; // TODO: remove this on production
export const useOrderableListStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles')
, { id: 'r04l1lsujh' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
