// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript



// configs:
export const [images, imageValues, cssImageConfig] = cssConfig(() => {
    return {
        // appearances:
        // default to contain (no image part is loss):
        objectFit : 'contain'   as CssKnownProps['objectFit'],
    };
}, { prefix: 'img' });
