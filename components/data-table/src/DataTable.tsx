// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useMergeEvents,
    useMergeClasses,
    
    
    
    // a semantic management system for react web components:
    SemanticTag,
    SemanticRole,
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

// internals:
import {
    // variants:
    DataTableVariant,
    useDataTableVariant,
}                           from './variants/DataTableVariant.js'



// defaults:
const _defaultSemanticTag        : SemanticTag  = 'table'    // uses <table>           as the default semantic tag
const _defaultSemanticRole       : SemanticRole = 'table'    // uses [role="table"]    as the default semantic role

const _defaultHeaderSemanticTag  : SemanticTag  = 'thead'    // uses <thead>           as the default semantic tag
const _defaultHeaderSemanticRole : SemanticRole = 'rowgroup' // uses [role="rowgroup"] as the default semantic role

const _defaultFooterSemanticTag  : SemanticTag  = 'tfoot'    // uses <tfoot>           as the default semantic tag
const _defaultFooterSemanticRole : SemanticRole = 'rowgroup' // uses [role="rowgroup"] as the default semantic role

const _defaultBodySemanticTag    : SemanticTag  = 'tbody'    // uses <tbody>           as the default semantic tag
const _defaultBodySemanticRole   : SemanticRole = 'rowgroup' // uses [role="rowgroup"] as the default semantic role



// styles:
export const useDataTableStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles.js')
, { id: 'gdc4frgwbi' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// handlers:
export const handleAnimationEndForward : React.AnimationEventHandler<Element> = (event) => {
    /**
     * because the `usesDataTableLayout` is neither inherit from `usesIndicatorLayout` nor applies `anim: ...`,
     * so the `onAnimationEnd` will __never__ triggered directly (non_bubbled).
     * 
     * the `useDisableable() => handleAnimationEnd` only perform non_bubbled `onAnimationEnd`.
     * 
     * thus we need to trigger `onAnimationEnd` at <DataTable> level by forwarding `onAnimationEnd` bubbled from <DataTableHeader>|<DataTableBody>|<DataTableFooter>.
     * 
     * <DataTable>
     *     <DataTable(Header|Body|Footer) onAnimationEnd={...} />
     * </DataTable>
     */
    if ((event.target as Element)?.parentElement === event.currentTarget) {
        event.currentTarget.dispatchEvent(new AnimationEvent('animationend', { animationName: event.animationName, bubbles: true, composed: true }));
    } // if
};



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
    // children:
    children ?: React.ReactNode
}
export interface DataTableCaptionProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        DataTableGroupProps<TElement>
{
}
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
export interface DataTableBodyProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        DataTableGroupProps<TElement>
{
}
export const DataTableHeader = <TElement extends Element = HTMLElement>(props: DataTableHeaderProps<TElement>): JSX.Element|null => {
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
export const DataTableFooter = <TElement extends Element = HTMLElement>(props: DataTableFooterProps<TElement>): JSX.Element|null => {
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
export const DataTableBody   = <TElement extends Element = HTMLElement>(props: DataTableBodyProps<TElement>): JSX.Element|null => {
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



export interface DataTableProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<IndicatorProps<TElement>,
            // variants:
            |'nude' // <DataTable> cannot be [nude]
        >,
        
        // <div>:
        Omit<React.HTMLAttributes<TElement>,
            // semantics:
            |'role' // we redefined [role] in <Generic>
        >,
        
        // variants:
        DataTableVariant
{
    // children:
    children ?: React.ReactNode
}
const DataTable = <TElement extends Element = HTMLElement>(props: DataTableProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet       = useDataTableStyleSheet();
    
    
    
    // variants:
    const dataTableVariant = useDataTableVariant(props);
    
    
    
    // rest props:
    const {
        // variants:
        dataTableStyle : _dataTableStyle, // remove
    ...restIndicatorProps} = props;
    
    
    
    // classes:
    const variantClasses = useMergeClasses(
        // preserves the original `variantClasses`:
        props.variantClasses,
        
        
        
        // variants:
        dataTableVariant.class,
    );
    
    
    
    // handlers:
    const handleAnimationEnd = useMergeEvents(
        // preserves the original `onAnimationEnd`:
        props.onAnimationEnd,
        
        
        
        // hack:
        handleAnimationEndForward,
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
            
            
            
            // handlers:
            onAnimationEnd={handleAnimationEnd}
        />
    );
};
export {
    DataTable,
    DataTable as default,
}



export interface DataTableComponentProps<TElement extends Element = HTMLElement>
{
    // refs:
    dataTableRef         ?: React.Ref<TElement> // setter ref
    
    
    
    // variants:
    dataTableStyle       ?: DataTableProps<TElement>['dataTableStyle']
    
    
    
    // components:
    dataTableComponent   ?: React.ReactComponentElement<any, DataTableProps<TElement>>
    dataTableChildren    ?: DataTableProps<TElement>['children']
}
