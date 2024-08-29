// cssfn:
import {
    // cssfn css specific types:
    CssKnownProps,
    
    
    
    // reads/writes css variables configuration:
    cssConfig,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // a typography management system:
    horzRules,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// configs:
export const [alternateSeparators, alternateSeparatorValues, cssAlternateSeparatorConfig] = cssConfig(() => {
    return {
        // appearances:
        horzOpacity : horzRules.opacity as CssKnownProps['opacity'   ],
        textOpacity : 0.5               as CssKnownProps['opacity'   ],
        
        
        
        // foregrounds:
        foreg       : horzRules.foreg   as CssKnownProps['foreground'],
        
        
        
        // spacings:
        gapInline   : spacers.sm        as CssKnownProps['gapInline' ],
        gapBlock    : spacers.sm        as CssKnownProps['gapBlock'  ],
    };
}, { prefix: 'altSeparator' });
