// cssfn:
import {
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript



// configs:
export const [signIns, signInValues, cssSignInConfig] = cssConfig(() => {
    return {
        /* no config props yet */
        
        // tabs:
        
        // signInTabs:
        
        // recoverTabs:
        
        // resetTabs:
    };
}, { prefix: 'signin' });
