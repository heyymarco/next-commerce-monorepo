// internals:
import {
    defaultCountryNameToCodeMap,
}                           from './defaultCountryMap.js'



// utilities:
export const getNormalizedCountryName = (countryName: string|null|undefined): string|null => {
    if (!countryName) return null; // no input => no output
    if (defaultCountryNameToCodeMap.has(countryName)) return countryName; // found exact
    
    const countryNameLowercase = countryName.trim().toLocaleLowerCase();
    return (
        Array.from(defaultCountryNameToCodeMap.keys())
        .find((countryNameItem) => (countryNameItem.trim().toLowerCase() === countryNameLowercase))
        ??
        null
    );
}
export const getCountryCodeByName     = (countryName: string|null|undefined): string|null => {
    if (!countryName) return null; // no input => no output
    const normalizedCountryName = getNormalizedCountryName(countryName);
    if (!normalizedCountryName) return null; // no input => no output
    return (
        defaultCountryNameToCodeMap
        .get(normalizedCountryName)
        ??
        null
    );
}
export const getCountryNameByCode     = (countryName: string|null|undefined): string => {
    return getNormalizedCountryName(countryName) ?? '';
}
export const defaultCountryList       = Array.from(defaultCountryNameToCodeMap.keys());
