// internals:
import {
    defaultCountryCodeToNameMap,
    defaultCountryNameToCodeMap,
}                           from './defaultCountryMap.js'



// utilities:
export const getNormalizedCountryName = (countryName: string|null|undefined): string|null => {
    // conditions:
    if (!countryName) return null; // no input => null
    
    
    
    // converts:
    const countryNameLowercase = countryName.trim().toLocaleLowerCase();
    const countryCode = defaultCountryNameToCodeMap.get(countryNameLowercase);
    if (!countryCode) return null; // not found => null
    return defaultCountryCodeToNameMap.get(countryCode) ?? null;
}
export const getCountryCodeByName     = (countryName: string|null|undefined): string|null => {
    // conditions:
    if (!countryName) return null; // no input => null
    
    
    
    // converts:
    const countryNameLowercase = countryName.trim().toLocaleLowerCase();
    return defaultCountryNameToCodeMap.get(countryNameLowercase) ?? null;
}
export const getCountryNameByCode     = (countryCode: string|null|undefined): string|null => {
    // conditions:
    if (!countryCode) return null; // no input => null
    
    
    
    // converts:
    return defaultCountryCodeToNameMap.get(countryCode) ?? null;
}
export const defaultCountryList       = Array.from(defaultCountryCodeToNameMap.values());
