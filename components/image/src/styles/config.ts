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
        objectFit : 'fill'      as CssKnownProps['objectFit'],
    };
}, { prefix: 'img' });
