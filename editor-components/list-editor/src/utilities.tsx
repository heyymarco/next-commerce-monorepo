// react:
import {
    // react:
    default as React,
}                           from 'react'



// utilities:
export const defaultValueToUi = <TValue extends any = string>(value: TValue): React.ReactNode => `${value ?? ''}`;

/**
 * Returns a new array containing elements from the original array
 * in the order specified by the sortOrder array.
 * 
 * @param {Array} originalArray - The array to extract elements from.
 * @param {Array<number>} sortOrder - An array of indices specifying the order of extraction.
 * @returns {Array} - A new array with elements in the specified order.
 */
export const extractElementsByOrder = <TValue extends any = string>(originalArray: TValue[], sortOrder: number[]): TValue[] => {
    const arrayLength = originalArray.length;
    return (
        sortOrder
        .filter((index) => (index >= 0) && (index < arrayLength)) // Filter out-of-range indices
        .map((index) => originalArray[index]) // Map to the corresponding elements
    );
};
