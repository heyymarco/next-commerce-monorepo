// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useCallback,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
    BreakpointName,
    
    
    
    // react helper hooks:
    useMergeClasses,
    
    
    
    // a semantic management system for react web components:
    SemanticTag,
    SemanticRole,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ExpandedChangeEvent,
    CollapsibleProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    GenericProps,
    Generic,
}                           from '@reusable-ui/generic'         // a base component
import {
    // react components:
    IndicatorProps,
    Indicator,
}                           from '@reusable-ui/indicator'       // a base component
import {
    // react components:
    Fallbacks,
    ResponsiveChildrenHandler,
    ResponsiveProvider,
}                           from '@reusable-ui/responsives'     // a responsive management system for react web components
import {
    // react components:
    WindowResponsive,
}                           from '@reusable-ui/dimensions'      // a set of React helper for fetching the dimension of elements

// internals:
import {
    // variants:
    DataTableVariant,
    useDataTableVariant,
}                           from './variants/DataTableVariant.js'



// defaults:
const _defaultSemanticTag         : SemanticTag  = 'table'        // uses <table>               as the default semantic tag
const _defaultSemanticRole        : SemanticRole = 'table'        // uses [role="table"]        as the default semantic role

const _defaultHeaderSemanticTag   : SemanticTag  = 'thead'        // uses <thead>               as the default semantic tag
const _defaultHeaderSemanticRole  : SemanticRole = 'rowgroup'     // uses [role="rowgroup"]     as the default semantic role

const _defaultFooterSemanticTag   : SemanticTag  = 'tfoot'        // uses <tfoot>               as the default semantic tag
const _defaultFooterSemanticRole  : SemanticRole = 'rowgroup'     // uses [role="rowgroup"]     as the default semantic role

const _defaultBodySemanticTag     : SemanticTag  = 'tbody'        // uses <tbody>               as the default semantic tag
const _defaultBodySemanticRole    : SemanticRole = 'rowgroup'     // uses [role="rowgroup"]     as the default semantic role

const _defaultRowSemanticTag      : SemanticTag  = 'tr'           // uses <tr>                  as the default semantic tag
const _defaultRowSemanticRole     : SemanticRole = 'row'          // uses [role="row"]          as the default semantic role

const _defaultLabelSemanticTag    : SemanticTag  = 'th'           // uses <th>                  as the default semantic tag
const _defaultLabelSemanticRole   : SemanticRole = 'rowheader'    // uses [role="rowheader"]    as the default semantic role

const _defaultDataSemanticTag     : SemanticTag  = 'td'           // uses <td>                  as the default semantic tag
const _defaultDataSemanticRole    : SemanticRole = 'cell'         // uses [role="cell"]         as the default semantic role

const _defaultActionSemanticTag   : SemanticTag  = 'td'           // uses <td>                  as the default semantic tag
const _defaultActionSemanticRole  : SemanticRole = 'cell'         // uses [role="cell"]         as the default semantic role

const _defaultTitleSemanticTag    : SemanticTag  = 'th'           // uses <th>                  as the default semantic tag
const _defaultTitleSemanticRole   : SemanticRole = 'columnheader' // uses [role="columnheader"] as the default semantic role

const _defaultResponsiveFallbacks : Fallbacks<boolean> = [true, false]



// styles:
export const useDataTableStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles.js')
, { id: 'gdc4frgwbi' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:

export interface DataTableGroupProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        GenericProps<TElement>,
        
        // <div>:
        Omit<React.HTMLAttributes<TElement>,
            // semantics:
            |'role' // we redefined [role] in <Generic>
        >
{
    // components:
    tableGroupComponent  ?: React.ReactComponentElement<any, GenericProps<TElement>>
    
    
    
    // children:
    children             ?: React.ReactNode
}



export interface DataTableCaptionProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        DataTableGroupProps<TElement>
{
    // components:
    tableRowComponent    ?: React.ReactComponentElement<any, GenericProps<Element>>
    tableTitleComponent  ?: React.ReactComponentElement<any, GenericProps<Element >>
}
const DataTableCaption = <TElement extends Element = HTMLElement>(props: DataTableCaptionProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        tableGroupComponent  = (<Generic<TElement> /> as React.ReactComponentElement<any, GenericProps<TElement>>),
        tableRowComponent    = (<Generic<TElement> /> as React.ReactComponentElement<any, GenericProps<TElement>>),
        tableTitleComponent  = (<Generic<Element > /> as React.ReactComponentElement<any, GenericProps<Element >>),
        
        
        
        // children:
        children,
    ...restGenericProps} = props;
    
    
    
    // classes:
    const groupClasses  = useMergeClasses(
        // preserves the original `classes` from `props`:
        props.classes,
        // preserves the original `classes` from `tableGroupComponent`:
        tableGroupComponent.props.classes,
    );
    const rowClasses    = useMergeClasses(
        // preserves the original `classes` from `tableRowComponent`:
        tableRowComponent.props.classes,
        
        
        
        // classes:
        'tr',
    );
    const titleClasses  = useMergeClasses(
        // preserves the original `classes` from `tableTitleComponent`:
        tableTitleComponent.props.classes,
        
        
        
        // classes:
        'th',
    );
    
    
    
    // jsx:
    return React.cloneElement<GenericProps<TElement>>(tableGroupComponent,
        // props:
        {
            // other props:
            ...restGenericProps,
            ...tableGroupComponent.props, // overwrites restGenericProps (if any conflics)
            
            
            
            // semantics:
            semanticTag  : tableGroupComponent.props.semanticTag  ?? props.semanticTag,
            semanticRole : tableGroupComponent.props.semanticRole ?? props.semanticRole,
            
            
            
            // classes:
            classes      : groupClasses,
        },
        
        
        
        // children:
        tableGroupComponent.props.children ?? React.cloneElement<GenericProps<Element>>(tableRowComponent,
            // props:
            {
                // semantics:
                semanticTag  : tableRowComponent.props.semanticTag  ?? _defaultRowSemanticTag,
                semanticRole : tableRowComponent.props.semanticRole ?? _defaultRowSemanticRole,
                
                
                
                // classes:
                classes      : rowClasses,
            },
            
            
            
            // children:
            tableRowComponent.props.children ?? <>
                {React.cloneElement<GenericProps<Element>>(tableTitleComponent,
                    // props:
                    {
                        // semantics:
                        semanticTag  : tableTitleComponent.props.semanticTag  ?? _defaultTitleSemanticTag,
                        semanticRole : tableTitleComponent.props.semanticRole ?? _defaultTitleSemanticRole,
                        
                        
                        
                        // classes:
                        classes      : titleClasses,
                        
                        
                        
                        // miscs:
                        // @ts-ignore
                        colSpan      : tableTitleComponent.props.colSpan      ?? 3,
                    },
                    
                    
                    
                    // children:
                    tableTitleComponent.props.children ?? children,
                )}
            </>,
        ),
    );
};
export interface DataTableHeaderProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        DataTableCaptionProps<TElement>
{
}
export interface DataTableFooterProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        DataTableCaptionProps<TElement>
{
}
export const DataTableHeader = <TElement extends Element = HTMLElement>(props: DataTableHeaderProps<TElement>): JSX.Element|null => {
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        'thead',
    );
    
    
    
    // jsx:
    return (
        <DataTableCaption<TElement>
            // other props:
            {...props}
            
            
            
            // semantics:
            semanticTag  = {props.semanticTag  ?? _defaultHeaderSemanticTag}
            semanticRole = {props.semanticRole ?? _defaultHeaderSemanticRole}
            
            
            
            // classes:
            classes={classes}
        />
    );
};
export const DataTableFooter = <TElement extends Element = HTMLElement>(props: DataTableFooterProps<TElement>): JSX.Element|null => {
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        'tfoot',
    );
    
    
    
    // jsx:
    return (
        <DataTableCaption<TElement>
            // other props:
            {...props}
            
            
            
            // semantics:
            semanticTag  = {props.semanticTag  ?? _defaultFooterSemanticTag}
            semanticRole = {props.semanticRole ?? _defaultFooterSemanticRole}
            
            
            
            // classes:
            classes={classes}
        />
    );
};



export interface DataTableBodyProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        DataTableGroupProps<TElement>
{
}
export const DataTableBody   = <TElement extends Element = HTMLElement>(props: DataTableBodyProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        tableGroupComponent  = (<Generic<TElement> /> as React.ReactComponentElement<any, GenericProps<TElement>>),
        
        
        
        // children:
        children,
    ...restGenericProps} = props;
    
    
    
    // classes:
    const groupClasses  = useMergeClasses(
        // preserves the original `classes` from `props`:
        props.classes,
        // preserves the original `classes` from `tableGroupComponent`:
        tableGroupComponent.props.classes,
        
        
        
        // classes:
        'tbody',
    );
    
    
    
    // jsx:
    return React.cloneElement<GenericProps<TElement>>(tableGroupComponent,
        // props:
        {
            // other props:
            ...restGenericProps,
            ...tableGroupComponent.props, // overwrites restGenericProps (if any conflics)
            
            
            
            // semantics:
            semanticTag  : tableGroupComponent.props.semanticTag  ?? props.semanticTag  ?? _defaultBodySemanticTag ,
            semanticRole : tableGroupComponent.props.semanticRole ?? props.semanticRole ?? _defaultBodySemanticRole,
            
            
            
            // classes:
            classes      : groupClasses,
        },
        
        
        
        // children:
        tableGroupComponent.props.children ?? props.children,
    );
};



export interface DataTableItemProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        GenericProps<TElement>,
        
        // <div>:
        Omit<React.HTMLAttributes<TElement>,
            // semantics:
            |'role' // we redefined [role] in <Generic>
        >
{
    // accessibilities:
    label                ?: React.ReactNode
    
    
    
    // components:
    tableRowComponent    ?: React.ReactComponentElement<any, GenericProps<TElement>>
    tableLabelComponent  ?: React.ReactComponentElement<any, GenericProps<Element >>
    tableDataComponent   ?: React.ReactComponentElement<any, GenericProps<Element >>
    tableActionComponent ?: React.ReactComponentElement<any, GenericProps<Element >>
    
    
    
    // children:
    actionChildren       ?: React.ReactNode
    children             ?: React.ReactNode
}
export const DataTableItem = <TElement extends Element = HTMLElement>(props: DataTableItemProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        label,
        
        
        
        // components:
        tableRowComponent    = (<Generic<TElement> /> as React.ReactComponentElement<any, GenericProps<TElement>>),
        tableLabelComponent  = (<Generic<Element > /> as React.ReactComponentElement<any, GenericProps<Element >>),
        tableDataComponent   = (<Generic<Element > /> as React.ReactComponentElement<any, GenericProps<Element >>),
        tableActionComponent = (<Generic<Element > /> as React.ReactComponentElement<any, GenericProps<Element >>),
        
        
        
        // children:
        actionChildren,
        children,
    ...restGenericProps} = props;
    
    
    
    // classes:
    const rowClasses    = useMergeClasses(
        // preserves the original `classes` from `props`:
        props.classes,
        // preserves the original `classes` from `tableRowComponent`:
        tableRowComponent.props.classes,
        
        
        
        // classes:
        'tr',
    );
    const labelClasses  = useMergeClasses(
        // preserves the original `classes` from `tableLabelComponent`:
        tableLabelComponent.props.classes,
        
        
        
        // classes:
        'th',
    );
    const dataClasses   = useMergeClasses(
        // preserves the original `classes` from `tableDataComponent`:
        tableDataComponent.props.classes,
        
        
        
        // classes:
        'td',
    );
    const actionClasses = useMergeClasses(
        // preserves the original `classes` from `tableActionComponent`:
        tableActionComponent.props.classes,
        
        
        
        // classes:
        'td',
    );
    
    
    
    // jsx:
    return React.cloneElement<GenericProps<TElement>>(tableRowComponent,
        // props:
        {
            // other props:
            ...restGenericProps,
            ...tableRowComponent.props, // overwrites restGenericProps (if any conflics)
            
            
            
            // semantics:
            semanticTag  : tableRowComponent.props.semanticTag  ?? props.semanticTag  ?? _defaultRowSemanticTag,
            semanticRole : tableRowComponent.props.semanticRole ?? props.semanticRole ?? _defaultRowSemanticRole,
            
            
            
            // classes:
            classes      : rowClasses,
        },
        
        
        
        // children:
        tableRowComponent.props.children ?? <>
            {React.cloneElement<GenericProps<Element>>(tableLabelComponent,
                // props:
                {
                    // semantics:
                    semanticTag  : tableLabelComponent.props.semanticTag  ?? _defaultLabelSemanticTag,
                    semanticRole : tableLabelComponent.props.semanticRole ?? _defaultLabelSemanticRole,
                    
                    
                    
                    // classes:
                    classes      : labelClasses,
                },
                
                
                
                // children:
                tableLabelComponent.props.children ?? label,
            )}
            {React.cloneElement<GenericProps<Element>>(tableDataComponent,
                // props:
                {
                    // semantics:
                    semanticTag  : tableDataComponent.props.semanticTag  ?? _defaultDataSemanticTag,
                    semanticRole : tableDataComponent.props.semanticRole ?? _defaultDataSemanticRole,
                    
                    
                    
                    // classes:
                    classes      : dataClasses,
                    
                    
                    
                    // miscs:
                    // @ts-ignore
                    colSpan      : tableDataComponent.props.colSpan      ?? (!actionChildren ? 2 : tableDataComponent.props.colSpan),
                },
                
                
                
                // children:
                tableDataComponent.props.children ?? children,
            )}
            {!!actionChildren && React.cloneElement<GenericProps<Element>>(tableActionComponent,
                // props:
                {
                    // semantics:
                    semanticTag  : tableActionComponent.props.semanticTag  ?? _defaultActionSemanticTag,
                    semanticRole : tableActionComponent.props.semanticRole ?? _defaultActionSemanticRole,
                    
                    
                    
                    // classes:
                    classes      : actionClasses,
                },
                
                
                
                // children:
                tableActionComponent.props.children ?? actionChildren,
            )}
        </>,
    );
};



export interface DataTableProps<TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>
    extends
        // bases:
        Omit<IndicatorProps<TElement>,
            // variants:
            |'nude' // <DataTable> cannot be [nude]
        >,
        
        // <div>:
        Omit<React.TableHTMLAttributes<TElement>,
            // semantics:
            |'role' // we redefined [role] in <Generic>
        >,
        
        // variants:
        DataTableVariant,
        
        // states:
        CollapsibleProps<TExpandedChangeEvent>
{
    // behaviors:
    breakpoint ?: BreakpointName
    
    
    
    // children:
    children   ?: React.ReactNode
}
const DataTable                       = <TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: DataTableProps<TElement, TExpandedChangeEvent>): JSX.Element|null => {
    // fn props:
    const breakpoint    = props.breakpoint;
    const mediaMinWidth = breakpoint ? breakpoints[breakpoint] : undefined;
    
    const expanded      = props.expanded;
    
    
    
    // jsx:
    
    // controllable [expanded]:
    if (expanded !== undefined) return (
        <DataTableImplementation {...props} expanded={expanded} />
    );
    
    // internal controllable [expanded] using provided [breakpoint]:
    if (mediaMinWidth || (mediaMinWidth === 0)) return (
        <DataTableWithWindowResponsive {...props} mediaMinWidth={mediaMinWidth} />
    );
    
    // internal controllable [expanded] using overflow detection:
    return (
        <DataTableWithResponsiveProvider {...props} />
    );
};
const DataTableWithWindowResponsive   = <TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: DataTableProps<TElement, TExpandedChangeEvent> & { mediaMinWidth : number }): JSX.Element|null => {
    // rest props:
    const {
        mediaMinWidth,
    ...restDataTableProps} = props;
    
    
    
    // handlers:
    const handleResponsiveChildren = useCallback((expanded: boolean) =>
        <DataTableImplementation {...restDataTableProps} expanded={expanded} />
    , [props]); // re-create (and re-render) the callback if the `props` changed
    
    
    
    // jsx:
    return (
        <WindowResponsive mediaMinWidth={mediaMinWidth}>
            {handleResponsiveChildren}
        </WindowResponsive>
    );
};
const DataTableWithResponsiveProvider = <TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: DataTableProps<TElement, TExpandedChangeEvent>): JSX.Element|null => {
    // handlers:
    const handleResponsiveChildren = useCallback<ResponsiveChildrenHandler<boolean>>((currentFallback) =>
        <DataTableImplementation {...props} expanded={currentFallback} />
    , [props]); // re-create (and re-render) the callback if the `props` changed
    
    
    
    // jsx:
    return (
        <ResponsiveProvider fallbacks={_defaultResponsiveFallbacks}>
            {handleResponsiveChildren}
        </ResponsiveProvider>
    );
};
const DataTableImplementation         = <TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: DataTableProps<TElement, TExpandedChangeEvent>): JSX.Element|null => {
    // styles:
    const styleSheet       = useDataTableStyleSheet();
    
    
    
    // variants:
    const dataTableVariant = useDataTableVariant(props);
    
    
    
    // rest props:
    const {
        // variants:
        dataTableStyle : _dataTableStyle,           // remove
        
        
        
        // behaviors:
        breakpoint     : _breakpoint,               // remove
        
        
        
        // states:
        expanded       : dataTableExpanded = false, // take
    ...restIndicatorProps} = props;
    
    
    
    // classes:
    const variantClasses = useMergeClasses(
        // preserves the original `variantClasses`:
        props.variantClasses,
        
        
        
        // variants:
        dataTableVariant.class,
    );
    const stateClasses   = useMergeClasses(
        // preserves the original `stateClasses`:
        props.stateClasses,
        
        
        
        // states:
        (dataTableExpanded || undefined) && 'expanded',
    );
    
    
    
    // jsx:
    return (
        <Indicator<TElement>
            // other props:
            {...restIndicatorProps}
            
            
            
            // semantics:
            semanticTag  = {props.semanticTag  ?? _defaultSemanticTag }
            semanticRole = {props.semanticRole ?? _defaultSemanticRole}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
        />
    );
};
export {
    DataTable,
    DataTable as default,
}



export interface DataTableComponentProps<TElement extends Element = HTMLElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>
{
    // refs:
    dataTableRef         ?: React.Ref<TElement> // setter ref
    
    
    
    // variants:
    dataTableStyle       ?: DataTableProps<TElement, TExpandedChangeEvent>['dataTableStyle']
    
    
    
    // components:
    dataTableComponent   ?: React.ReactComponentElement<any, DataTableProps<TElement, TExpandedChangeEvent>>
    dataTableChildren    ?: DataTableProps<TElement, TExpandedChangeEvent>['children']
}
