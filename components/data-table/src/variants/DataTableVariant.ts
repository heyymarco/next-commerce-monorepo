// defaults:
const _defaultDataTableStyle : DataTableStyle = 'regular'



// hooks:

// variants:

//#region DataTableVariant
export type DataTableStyle = 'regular'|'flat'|'flush'|'joined' // might be added more styles in the future
export interface DataTableVariant {
    dataTableStyle ?: DataTableStyle
}
export const useDataTableVariant = ({dataTableStyle = _defaultDataTableStyle}: DataTableVariant) => {
    return {
        class: (dataTableStyle === 'regular') ? null : dataTableStyle,
    };
};
//#endregion DataTableVariant
