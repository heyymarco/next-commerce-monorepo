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
    typos,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    basics,
}                           from '@reusable-ui/basic'           // a base component
import {
    // configs:
    cards,
}                           from '@reusable-ui/card'            // a flexible and extensible content container, with optional header and footer



// configs:
export const [dataTables, dataTableValues, cssDataTableConfig] = cssConfig(() => {
    const bases = {
        // layouts:
        // center     the label horizontally:
        labelJustifyContentCollapse : 'center'                                          as CssKnownProps['justifyContent'],
        // right_most the label horizontally:
        labelJustifyContentExpand   : 'end'                                             as CssKnownProps['justifyContent'],
        // center     the label vertically:
        labelAlignContent           : 'center'                                          as CssKnownProps['alignContent'  ],
        // center     the data horizontally:
        dataJustifyContentCollapse  : 'center'                                          as CssKnownProps['justifyContent'],
        // left_most the data horizontally:
        dataJustifyContentExpand    : 'start'                                           as CssKnownProps['justifyContent'],
        // center     the data vertically:
        dataAlignContent            : 'center'                                          as CssKnownProps['alignContent'  ],
        
        
        
        // borders:
        borderStyle                 : basics.borderStyle                                as CssKnownProps['borderStyle'   ],
        borderWidth                 : basics.borderWidth                                as CssKnownProps['borderWidth'   ],
        borderColor                 : basics.borderColor                                as CssKnownProps['borderColor'   ],
        
        borderRadiusSm              : basics.borderRadiusSm                             as CssKnownProps['borderRadius'  ],
        borderRadiusMd              : basics.borderRadiusMd                             as CssKnownProps['borderRadius'  ],
        borderRadiusLg              : basics.borderRadiusLg                             as CssKnownProps['borderRadius'  ],
        
        
        
        // animations:
        transition                  : basics.transition                                 as CssKnownProps['transition'    ],
        groupTransition             : basics.transition                                 as CssKnownProps['transition'    ],
        rowTransition               : basics.transition                                 as CssKnownProps['transition'    ],
        cellTransition              : basics.transition                                 as CssKnownProps['transition'    ],
        
        
        
        // spacings:
        cellPaddingInlineSm         : spacers.sm                                        as CssKnownProps['paddingInline' ],
        cellPaddingBlockSm          : spacers.sm                                        as CssKnownProps['paddingBlock'  ],
        cellPaddingInlineMd         : [['calc((', spacers.sm, '+', spacers.md, ')/2)']] as CssKnownProps['paddingInline' ],
        cellPaddingBlockMd          : [['calc((', spacers.sm, '+', spacers.md, ')/2)']] as CssKnownProps['paddingBlock'  ],
        cellPaddingInlineLg         : spacers.md                                        as CssKnownProps['paddingInline' ],
        cellPaddingBlockLg          : spacers.md                                        as CssKnownProps['paddingBlock'  ],
        cellColumnGap               : spacers.default                                   as CssKnownProps['columnGap'     ],
        cellRowGap                  : spacers.default                                   as CssKnownProps['rowGap'        ],
        
        
        
        // typos:
        cellOverflowWrap            : 'break-word'                                      as CssKnownProps['overflowWrap'  ], // prevents a long word from breaking DataTable layout
        titleFontWeight             : typos.fontWeightSemibold                          as CssKnownProps['fontWeight'    ],
        titleJustifyContent         : 'center'                                          as CssKnownProps['justifyContent'],
        labelFontWeight             : typos.fontWeightSemibold                          as CssKnownProps['fontWeight'    ],
        
        
        
        // captions:
        captionFilter               : cards.captionFilter                               as CssKnownProps['filter'        ],
    };
    
    
    
    const defaults = {
        // layouts:
        labelJustifyContent         : bases.labelJustifyContentCollapse                 as CssKnownProps['justifyContent'],
        dataJustifyContent          : bases.dataJustifyContentCollapse                  as CssKnownProps['justifyContent'],
        
        
        
        // borders:
        borderRadius                : bases.borderRadiusMd                              as CssKnownProps['borderRadius'  ],
        
        
        
        // spacings:
        cellPaddingInline           : bases.cellPaddingInlineMd                         as CssKnownProps['paddingInline' ],
        cellPaddingBlock            : bases.cellPaddingBlockMd                          as CssKnownProps['paddingBlock'  ],
    };
    
    
    
    return {
        ...bases,
        ...defaults,
    };
}, { prefix: 'dtTb' });
