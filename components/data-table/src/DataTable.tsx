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
const _defaultSemanticTag         : SemanticTag  = 'table'    // uses <table>           as the default semantic tag
const _defaultSemanticRole        : SemanticRole = 'table'    // uses [role="table"]    as the default semantic role

const _defaultHeaderSemanticTag   : SemanticTag  = 'thead'    // uses <thead>           as the default semantic tag
const _defaultHeaderSemanticRole  : SemanticRole = 'rowgroup' // uses [role="rowgroup"] as the default semantic role

const _defaultFooterSemanticTag   : SemanticTag  = 'tfoot'    // uses <tfoot>           as the default semantic tag
const _defaultFooterSemanticRole  : SemanticRole = 'rowgroup' // uses [role="rowgroup"] as the default semantic role

const _defaultBodySemanticTag     : SemanticTag  = 'tbody'    // uses <tbody>           as the default semantic tag
const _defaultBodySemanticRole    : SemanticRole = 'rowgroup' // uses [role="rowgroup"] as the default semantic role

const _defaultResponsiveFallbacks : Fallbacks<boolean> = [true, false]



// styles:
export const useDataTableStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles.js')
, { id: 'gdc4frgwbi' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:
export interface DataTableGroupProps<TElement extends Element = HTMLTableSectionElement>
    extends
        // bases:
        GenericProps<TElement>,
        
        // <div>:
        Omit<React.HTMLAttributes<TElement>,
            // semantics:
            |'role' // we redefined [role] in <Generic>
        >
{
    // children:
    children ?: React.ReactNode
}
export interface DataTableCaptionProps<TElement extends Element = HTMLTableSectionElement>
    extends
        // bases:
        DataTableGroupProps<TElement>
{
}
export interface DataTableHeaderProps<TElement extends Element = HTMLTableSectionElement>
    extends
        // bases:
        DataTableCaptionProps<TElement>
{
}
export interface DataTableFooterProps<TElement extends Element = HTMLTableSectionElement>
    extends
        // bases:
        DataTableCaptionProps<TElement>
{
}
export interface DataTableBodyProps<TElement extends Element = HTMLTableSectionElement>
    extends
        // bases:
        DataTableGroupProps<TElement>
{
}
export const DataTableHeader = <TElement extends Element = HTMLTableSectionElement>(props: DataTableHeaderProps<TElement>): JSX.Element|null => {
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes`:
        props.classes,
        
        
        
        // classes:
        'thead',
    );
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...props}
            
            
            
            // semantics:
            semanticTag  = {props.semanticTag  ?? _defaultHeaderSemanticTag }
            semanticRole = {props.semanticRole ?? _defaultHeaderSemanticRole}
            
            
            
            // classes:
            classes={classes}
        />
    );
};
export const DataTableFooter = <TElement extends Element = HTMLTableSectionElement>(props: DataTableFooterProps<TElement>): JSX.Element|null => {
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes`:
        props.classes,
        
        
        
        // classes:
        'tfoot',
    );
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...props}
            
            
            
            // semantics:
            semanticTag  = {props.semanticTag  ?? _defaultFooterSemanticTag }
            semanticRole = {props.semanticRole ?? _defaultFooterSemanticRole}
            
            
            
            // classes:
            classes={classes}
        />
    );
};
export const DataTableBody   = <TElement extends Element = HTMLTableSectionElement>(props: DataTableBodyProps<TElement>): JSX.Element|null => {
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes`:
        props.classes,
        
        
        
        // classes:
        'tbody',
    );
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...props}
            
            
            
            // semantics:
            semanticTag  = {props.semanticTag  ?? _defaultBodySemanticTag }
            semanticRole = {props.semanticRole ?? _defaultBodySemanticRole}
            
            
            
            // classes:
            classes={classes}
        />
    );
};



export interface DataTableProps<TElement extends Element = HTMLTableElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>
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
const DataTable                       = <TElement extends Element = HTMLTableElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: DataTableProps<TElement, TExpandedChangeEvent>): JSX.Element|null => {
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
const DataTableWithWindowResponsive   = <TElement extends Element = HTMLTableElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: DataTableProps<TElement, TExpandedChangeEvent> & { mediaMinWidth : number }): JSX.Element|null => {
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
const DataTableWithResponsiveProvider = <TElement extends Element = HTMLTableElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: DataTableProps<TElement, TExpandedChangeEvent>): JSX.Element|null => {
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
const DataTableImplementation         = <TElement extends Element = HTMLTableElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>(props: DataTableProps<TElement, TExpandedChangeEvent>): JSX.Element|null => {
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



export interface DataTableComponentProps<TElement extends Element = HTMLTableElement, TExpandedChangeEvent extends ExpandedChangeEvent = ExpandedChangeEvent>
{
    // refs:
    dataTableRef         ?: React.Ref<TElement> // setter ref
    
    
    
    // variants:
    dataTableStyle       ?: DataTableProps<TElement, TExpandedChangeEvent>['dataTableStyle']
    
    
    
    // components:
    dataTableComponent   ?: React.ReactComponentElement<any, DataTableProps<TElement, TExpandedChangeEvent>>
    dataTableChildren    ?: DataTableProps<TElement, TExpandedChangeEvent>['children']
}
