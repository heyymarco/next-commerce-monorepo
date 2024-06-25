// cssfn:
import {
    // cssfn css specific types:
    type CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// configs:
export const [addressEditorEditors, addressEditorEditorValues, cssAddressEditorEditorConfig] = cssConfig(() => {
    const bases = {
        // spacings:
        gapInlineSm       : spacers.sm          as CssKnownProps['gapInline'    ],
        gapBlockSm        : spacers.sm          as CssKnownProps['gapBlock'     ],
        gapInlineMd       : spacers.md          as CssKnownProps['gapInline'    ],
        gapBlockMd        : spacers.md          as CssKnownProps['gapBlock'     ],
        gapInlineLg       : spacers.lg          as CssKnownProps['gapInline'    ],
        gapBlockLg        : spacers.lg          as CssKnownProps['gapBlock'     ],
    };
    
    
    
    const defaults = {
        // spacings:
        gapInline         : bases.gapInlineMd   as CssKnownProps['gapInline'    ],
        gapBlock          : bases.gapBlockMd    as CssKnownProps['gapBlock'     ],
    };
    
    
    
    return {
        ...bases,
        ...defaults,
    };
}, { prefix: 'addredit' });
