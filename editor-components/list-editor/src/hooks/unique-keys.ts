// react:
import {
    // hooks:
    useMemo,
    useRef,
}                           from 'react'



export interface UniqueKeysProps<TValue extends unknown = string> {
    // values:
    value      : TValue[]
}
export interface UniqueKeysApi {
    // identifiers:
    uniqueKeys : number[]
}
export const useUniqueKeys = <TValue extends unknown = string>(props: UniqueKeysProps<TValue>) => {
    // props:
    const {
        value,
    } = props;
    
    
    
    // states:
    const uniqueValueCounterRef = useRef<number>(0);
    
    const existingRegisteredKeyMapRef = useRef<Map<TValue, number[]>|undefined>(undefined);
    const uniqueKeys = useMemo<number[]>(() => {
        // deep clone the `existingRegisteredKeyMap` to ``availableRegisteredKeyMap` because we need to mutate the data:
        const availableRegisteredKeyMap = (
            existingRegisteredKeyMapRef.current
            ? new Map<TValue, number[]>(
                existingRegisteredKeyMapRef.current
                .entries()
                .map(([key, list]) =>
                    [key, [...list]]
                )
            )
            : new Map<TValue, number[]>()
        );
        
        
        
        const renewRegisteredKeyMap = new Map<TValue, number[]>();
        const renewUniqueKeys : number[] = [];
        
        
        
        for (const val of value) {
            const availableRegisteredKeysOfValue = availableRegisteredKeyMap.get(val) ?? (() => {
                const newRegisteredKeysOfValue : number[] = [];
                availableRegisteredKeyMap.set(val, newRegisteredKeysOfValue);
                return newRegisteredKeysOfValue;
            })();
            const renewRegisteredKeysOfValue = renewRegisteredKeyMap.get(val) ?? (() => {
                const newRegisteredKeysOfValue : number[] = [];
                renewRegisteredKeyMap.set(val, newRegisteredKeysOfValue);
                return newRegisteredKeysOfValue;
            })();
            const key = (
                availableRegisteredKeysOfValue.shift() // take existing key (if any)
                ??
                uniqueValueCounterRef.current++        // create new key
            );
            renewRegisteredKeysOfValue.push(key);
            renewUniqueKeys.push(key);
        } // for
        
        
        
        existingRegisteredKeyMapRef.current = renewRegisteredKeyMap;
        return renewUniqueKeys;
    }, [value]);
    
    
    
    // api:
    return {
        uniqueKeys,
    } satisfies UniqueKeysApi
};