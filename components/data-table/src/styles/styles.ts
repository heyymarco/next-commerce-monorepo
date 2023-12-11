// cssfn:
import {
    // writes css in javascript:
    rule,
    variants,
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    usesPrefixedProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a responsive management system:
    ifScreenWidthAtLeast,
    
    
    
    // background stuff of UI:
    usesBackground,
    
    
    
    // foreground (text color) stuff of UI:
    usesForeground,
    
    
    
    
    usesBorder,
    
    
    
    // animation stuff of UI:
    usesAnimation,
    
    
    
    // groups a list of UIs into a single UI:
    usesGroupable,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // configs:
    basics,
}                           from '@reusable-ui/basic'           // a base component
import {
    // styles:
    onIndicatorStylesChange,
    usesIndicatorLayout,
    usesIndicatorVariants,
    usesIndicatorStates,
}                           from '@reusable-ui/indicator'       // a base component

// internals:
import {
    // elements:
    theadElm,
    tfootElm,
    tbodyElm,
    
    trElm,
    tdElm,
    thElm,
}                           from './elements.js'
import {
    // configs:
    dataTables,
    cssDataTableConfig,
}                           from './config.js'



// utility styles:
const inheritBorderFromParent = () => {
    // dependencies:
    
    // features:
    const {borderVars} = usesBorder();
    
    
    
    // makes <DataTableGroup>'s border & borderRadius inherit from <DataTable>:
    return style({
        // borders:
        // undef border stroke:
        [borderVars.borderStyle           ] : null, // always same as <DataTable>
        [borderVars.borderWidth           ] : null, // always same as <DataTable>
        /*
        [borderVars.borderColorFn] // independent for each <DataTableGroup>
        [borderVars.borderColor  ] // independent for each <DataTableGroup>
        [borderVars.border       ] // independent for each <DataTableGroup>
        */
        
        // undef border radius:
        [borderVars.borderStartStartRadius] : null, // always same as <DataTable>
        [borderVars.borderStartEndRadius  ] : null, // always same as <DataTable>
        [borderVars.borderEndStartRadius  ] : null, // always same as <DataTable>
        [borderVars.borderEndEndRadius    ] : null, // always same as <DataTable>
        /*
        [borderVars.borderRadius ] // independent for each <DataTableGroup>
        */
    });
};



// child styles:
export const usesDataTableGroupLayout   = () => {
    return style({
        // positions:
        gridColumn          : '1 / -1', // span the entire columns
        
        
        
        // layouts:
        display             : 'grid',
        gridTemplateColumns : 'subgrid',
        
        
        
        // customize:
        ...usesCssProps(usesPrefixedProps(dataTables, 'group')), // apply config's cssProps starting with group***
    });
};
export const usesDataTableCaptionLayout = () => {
    return style({
        // customize:
        ...usesCssProps(usesPrefixedProps(dataTables, 'caption')), // apply config's cssProps starting with caption***
    });
};
export const usesDataTableHeaderLayout  = () => {
    return style({
        // customize:
        ...usesCssProps(usesPrefixedProps(dataTables, 'header')), // apply config's cssProps starting with header***
    });
};
export const usesDataTableFooterLayout  = () => {
    return style({
        // customize:
        ...usesCssProps(usesPrefixedProps(dataTables, 'footer')), // apply config's cssProps starting with footer***
    });
};
export const usesDataTableBodyLayout    = () => {
    return style({
        // customize:
        ...usesCssProps(usesPrefixedProps(dataTables, 'body')), // apply config's cssProps starting with body***
    });
};
export const usesDataTableRowLayout     = () => {
    return style({
        // positions:
        gridColumn          : '1 / -1', // span the entire columns
        
        
        
        // layouts:
        display             : 'grid',
        gridTemplateColumns : 'subgrid',
        
        
        
        // customize:
        ...usesCssProps(usesPrefixedProps(dataTables, 'row')), // apply config's cssProps starting with row***
        ...style({
            rowGap : undefined, // exclusion for rowGap
        }),
    });
};
export const usesDataTableCellLayout    = () => {
    // dependencies:
    
    // features:
    const {backgroundRule, backgroundVars} = usesBackground(basics);
    const {foregroundRule, foregroundVars} = usesForeground(basics);
    
    
    
    return style({
        // layouts:
        // ...usesIndicatorLayout(),
        
        
        
        // borders:
        // ...inheritBorderFromParent(),
        
        
        
        // layouts:
        ...style({
            // layouts:
            display          : 'grid',
            gridTemplateRows : 'auto', // only 1 row
            gridAutoFlow     : 'column',
            
            
            
            // sizes:
            ...rule('[colspan="2"]', {
                gridColumnEnd : 'span 2',
            }),
            ...rule('[colspan="3"]', {
                gridColumnEnd : 'span 3',
            }),
            ...ifScreenWidthAtLeast('sm', { // auto fix for multi column : missing column of <EditButton>
                ...rule(':last-child', {
                    ...rule(':nth-child(1)', {
                        gridColumnEnd : 'span 3',
                    }),
                    ...rule(':nth-child(2)', {
                        gridColumnEnd : 'span 2',
                    }),
                }),
            }),
            
            
            
            // accessibilities:
            ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
                // backgrounds:
                backg : backgroundVars.altBackgColor,
                
                
                
                // foregrounds:
                foreg : foregroundVars.altForeg,
            }),
            
            
            
            // backgrounds:
            backg     : backgroundVars.backgColor,
            
            
            
            // foregrounds:
            foreg     : foregroundVars.foreg,
            
            
            
            // customize:
            ...usesCssProps(usesPrefixedProps(dataTables, 'cell')), // apply config's cssProps starting with cell***
        }),
        
        
        
        // features:
        ...backgroundRule(), // must be placed at the last
        ...foregroundRule(), // must be placed at the last
    });
};
export const usesDataTableDataLayout    = () => {
    return style({
        // special layouts:
        ...rule(':nth-child(1)', { // <td> as <Label>
            // layouts:
            justifyContent     : 'center',  // center     the items horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifyContent : 'end',     // right_most the items horizontally
            }),
        }),
        ...rule(':nth-child(2)', { // <td> as <Data>
            // layouts:
            justifyContent     : 'center',  // center    the items horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifyContent : 'start',   // left_most the items horizontally
            }),
        }),
        ...rule(':nth-child(3)', { // <td> as <EditButton>
            // layouts:
            justifyContent : 'center', // center the items vertically
        }),
        
        
        
        // customize:
        ...usesCssProps(usesPrefixedProps(dataTables, 'data')), // apply config's cssProps starting with data***
    });
};
export const usesDataTableTitleLayout   = () => {
    // dependencies:
    
    // features:
    const {backgroundVars} = usesBackground();
    const {foregroundVars} = usesForeground();
    
    
    
    return style({
        // accessibilities:
        ...rule(['&::selection', '& ::selection'], { // ::selection on self and descendants
            // backgrounds:
            backg : backgroundVars.backgColor,
            
            
            
            // foregrounds:
            foreg : foregroundVars.foreg,
        }),
        
        
        
        // backgrounds:
        backg     : backgroundVars.altBackgColor,
        
        
        
        // foregrounds:
        foreg     : foregroundVars.altForeg,
        
        
        
        // customize:
        ...usesCssProps(usesPrefixedProps(dataTables, 'title')), // apply config's cssProps starting with title***
    });
};
export const usesDataTableLabelLayout   = () => {
    return style({
        ...rule(':nth-child(1)', { // <th> as <Label>
            // layouts:
            justifyContent     : 'center',  // center     the items horizontally
            ...ifScreenWidthAtLeast('sm', {
                justifyContent : 'end',     // right_most the items horizontally
            }),
            
            alignContent       : 'center',  // center     the items vertically
        }),
        
        
        
        // customize:
        ...usesCssProps(usesPrefixedProps(dataTables, 'label')), // apply config's cssProps starting with label***
    });
};



// styles:
export const onDataTableStylesChange = watchChanges(onIndicatorStylesChange, cssDataTableConfig.onChange);

export const usesDataTableLayout = () => {
    // dependencies:
    
    // features:
    const {borderRule   , borderVars   } = usesBorder(dataTables);
    const {animationRule, animationVars} = usesAnimation(dataTables as any);
    
    // capabilities:
    const {groupableRule: tableGroupableRule} = usesGroupable({
        orientationInlineSelector : null, // never  => the <table> is never  stacked in horizontal
        orientationBlockSelector  : '&',  // always => the <table> is always stacked in vertical
        itemsSelector             : ':nth-child(n)', // select <thead>, <tfoot>, <tbody>, and <foreign-elm>
    });
    const {separatorRule: groupSeparatorRule} = usesGroupable({
        orientationInlineSelector : null, // never  => the <table> is never  stacked in horizontal
        orientationBlockSelector  : '&',  // always => the <table> is always stacked in vertical
        itemsSelector             : ':nth-child(n)', // select <thead>, <tfoot>, <tbody>, and <foreign-elm>
        swapFirstItem             : true,
    });
    const {groupableRule: groupGroupableRule} = usesGroupable({
        orientationInlineSelector : null, // never  => the <thead>, <tbody>, <tfoot> are never  stacked in horizontal
        orientationBlockSelector  : '&',  // always => the <thead>, <tbody>, <tfoot> are always stacked in vertical
        itemsSelector             : ':nth-child(n)', // select <tr> and <foreign-elm>
    });
    const {separatorRule: rowSeparatorRule} = usesGroupable({
        orientationInlineSelector : null, // never  => the <thead>, <tbody>, <tfoot> are never  stacked in horizontal
        orientationBlockSelector  : '&',  // always => the <thead>, <tbody>, <tfoot> are always stacked in vertical
        itemsSelector             : ':nth-child(n)', // select <tr> and <foreign-elm>
    });
    const {groupableRule: rowGroupableRule} = usesGroupable({
        orientationInlineSelector : '&',  // always => the <tr> is always stacked in horizontal
        orientationBlockSelector  : null, // never  => the <tr> is never  stacked in vertical
        itemsSelector             : ':nth-child(n)', // select <td>, <th>, and <foreign-elm>
    });
    
    
    
    return style({
        // capabilities:
        ...tableGroupableRule(), // make a nicely rounded corners for <table>
        ...children([theadElm, tfootElm, tbodyElm], {
            ...groupGroupableRule(), // make a nicely rounded corners for <thead>, <tfoot>, <tbody>
            ...children(trElm, {
                ...rowGroupableRule(), // make a nicely rounded corners for <tr>
            }),
        }),
        
        
        
        // layouts:
        ...style({
            // layouts:
            display             : 'grid',
            gridTemplateColumns : 'auto',              // 1 column
            ...ifScreenWidthAtLeast('sm', {
                gridTemplateColumns : 'auto 1fr auto', // 3 columns : <Title>|<Label> + <Content> + <EditButton>
            }),
            
            
            
            // sizes:
            // See https://github.com/twbs/bootstrap/pull/22740#issuecomment-305868106
            minInlineSize     : 0,
            
            
            
            // children:
            ...children([theadElm, tfootElm, tbodyElm], {
                // layouts:
                ...usesDataTableGroupLayout(),
                
                
                
                // children:
                ...children(trElm, {
                    // layouts:
                    ...usesDataTableRowLayout(),
                    
                    
                    
                    // children:
                    ...children(['td', 'th'], {
                        // layouts:
                        ...usesDataTableCellLayout(),
                    }),
                    ...children('td', {
                        // layouts:
                        ...usesDataTableDataLayout(),
                    }),
                }),
            }),
            ...children([theadElm, tfootElm], {
                // layouts:
                ...usesDataTableCaptionLayout(),
                
                
                
                // children:
                ...children(trElm, {
                    // children:
                    ...children('th', {
                        // layouts:
                        ...usesDataTableTitleLayout(),
                    }),
                }),
            }),
            ...children(theadElm, {
                // layouts:
                ...usesDataTableHeaderLayout(),
            }),
            ...children(tfootElm, {
                // layouts:
                ...usesDataTableFooterLayout(),
            }),
            ...children(tbodyElm, {
                // layouts:
                ...usesDataTableBodyLayout(),
                
                
                
                // children:
                ...children(trElm, {
                    // children:
                    ...children('th', {
                        // layouts:
                        ...usesDataTableLabelLayout(),
                    }),
                }),
            }),
            
            
            
            // customize:
            ...usesCssProps(dataTables), // apply config's cssProps
            
            
            
            // borders:
            border                 : borderVars.border,
         // borderRadius           : borderVars.borderRadius,
            borderStartStartRadius : borderVars.borderStartStartRadius,
            borderStartEndRadius   : borderVars.borderStartEndRadius,
            borderEndStartRadius   : borderVars.borderEndStartRadius,
            borderEndEndRadius     : borderVars.borderEndEndRadius,
            ...children([theadElm, tfootElm, tbodyElm], {
                // borders:
                border                 : borderVars.border,
             // borderRadius           : borderVars.borderRadius,
                borderStartStartRadius : borderVars.borderStartStartRadius,
                borderStartEndRadius   : borderVars.borderStartEndRadius,
                borderEndStartRadius   : borderVars.borderEndStartRadius,
                borderEndEndRadius     : borderVars.borderEndEndRadius,
                ...children(trElm, {
                    // borders:
                    border                 : borderVars.border,
                 // borderRadius           : borderVars.borderRadius,
                    borderStartStartRadius : borderVars.borderStartStartRadius,
                    borderStartEndRadius   : borderVars.borderStartEndRadius,
                    borderEndStartRadius   : borderVars.borderEndStartRadius,
                    borderEndEndRadius     : borderVars.borderEndEndRadius,
                    ...children([tdElm, thElm], {
                        // borders:
                        // border                 : borderVars.border, // no border for cell(s)
                     // borderRadius           : borderVars.borderRadius,
                        borderStartStartRadius : borderVars.borderStartStartRadius,
                        borderStartEndRadius   : borderVars.borderStartEndRadius,
                        borderEndStartRadius   : borderVars.borderEndStartRadius,
                        borderEndEndRadius     : borderVars.borderEndEndRadius,
                    }),
                }),
            }),
            ...children([theadElm, tfootElm, tbodyElm], {
                // borders:
                ...groupSeparatorRule(), // turns the current border as separator between <DataTableGroup>(s)
                
                
                
                // children:
                ...children(trElm, {
                    // borders:
                    ...rowSeparatorRule(), // turns the current border as separator between <DataTableGroup>(s)
                }),
            }),
            ...children(['&', theadElm, tfootElm, tbodyElm], {
                // features:
                ...borderRule(), // must be placed at the last // dedicated border stroke for each <DataTable> & <DataTableGroup>(s), so each borderRule can be turn on/off indepenently, eg: `dataTableStyle='flush'`
            }),
            ...children([theadElm, tfootElm, tbodyElm], {
                ...children(trElm, {
                    // features:
                    ...borderRule(), // must be placed at the last // dedicated border stroke for each <DataTable> & <DataTableGroup>(s), so each borderRule can be turn on/off indepenently, eg: `dataTableStyle='flush'`
                }),
            }),
            
            
            
            // animations:
            boxShadow         : animationVars.boxShadow,
            filter            : animationVars.filter,
            anim              : animationVars.anim,
        }),
        
        
        
        // features:
        // borderRule(),    // moved out to dedicated border stroke for each <DataTable> & <DataTableGroup>(s)
        ...animationRule(), // must be placed at the last
    });
};
export const usesDataTableVariants = () => {
    // dependencies:
    
    // features:
    const {borderVars   } = usesBorder();
    
    // variants:
    const {resizableRule} = usesResizable(dataTables);
    
    
    
    return style({
        // variants:
        
        /* write specific dataTableStyle first, so it can be overriden by `.nude`, `.mild`, `.outlined`, etc */
        
        ...variants([
            rule(['.flat', '.flush'], {
                // borders:
                // kill borders surrounding DataTable:
                [borderVars.borderWidth           ] : '0px',
                
                // remove rounded corners on top:
                [borderVars.borderStartStartRadius] : '0px',
                [borderVars.borderStartEndRadius  ] : '0px',
                // remove rounded corners on bottom:
                [borderVars.borderEndStartRadius  ] : '0px',
                [borderVars.borderEndEndRadius    ] : '0px',
            }),
            rule(['.flat', '.joined'], {
                // children:
                ...children([theadElm, tfootElm, tbodyElm], {
                    // borders:
                    // kill separator between groups:
                    [borderVars.borderWidth] : '0px',
                    
                    
                    
                    // children:
                    ...children(trElm, {
                        // borders:
                        // kill separator between rows:
                        [borderVars.borderWidth] : '0px',
                    }),
                }),
            }),
        ]),
        
        ...usesIndicatorVariants(),
        ...resizableRule(),
    });
};
export const usesDataTableStates = usesIndicatorStates;

export default () => style({
    // layouts:
    ...usesDataTableLayout(),
    
    // variants:
    ...usesDataTableVariants(),
    
    // states:
    ...usesDataTableStates(),
});
