export const calculateWillToIndex = (from: number, appliedTo: number|undefined, willTo: number): number => {
    /*
        Example of pulling from [6] and appliedTo index of 2.
        The element's indices between [2] to [6] are *shifted*, they are [3][4][5][6].
        The element's indices below   [2] are remain the same as the element's values, they are [0][1].
        The element's indices above   [6] are remain the same as the element's values, they are [7][8][9].
        
        wrappedChildren     visuallyRendered
        index:  0 [0]       index:  0 [0]
                1 [1]               1 [1]
                2 [2]          void 2   [6] <-- appliedTo
                3 [3]             x 3 [2] <-- shifted, to get the index: v + 1
                4 [4]             x 4 [3] <-- shifted, to get the index: v + 1
                5 [5]             x 5 [4] <-- shifted, to get the index: v + 1
                6   [6] --> from  x 6 [5] <-- shifted, to get the index: v + 1
                7 [7]               7 [7]
                8 [8]               8 [8]
                9 [9]               9 [9]
    */
    /*
        Example of pulling from [2] and appliedTo index of 6.
        The element's indices between [2] to [6] are *shifted*, they are [3][4][5][6].
        The element's indices below   [2] are remain the same as the element's values, they are [0][1].
        The element's indices above   [6] are remain the same as the element's values, they are [7][8][9].
        
        wrappedChildren     visuallyRendered
        index:  0 [0]       index:  0 [0]
                1 [1]               1 [1]
                2   [2] --> from  x 2 [3] <-- shifted, to get the index: v - 1
                3 [3]             x 3 [4] <-- shifted, to get the index: v - 1
                4 [4]             x 4 [5] <-- shifted, to get the index: v - 1
                5 [5]             x 5 [6] <-- shifted, to get the index: v - 1
                6 [6]               6   [2] <-- appliedTo
                7 [7]               7 [7]
                8 [8]               8 [8]
                9 [9]               9 [9]
    */
    
    
    
    // conditions:
    if (appliedTo === undefined)            return willTo; // there is NO *already moved* element => still the same as original
    if (from === appliedTo)                 return willTo; // no shifted indices                  => still the same as original
    if (willTo < Math.min(from, appliedTo)) return willTo; // below the shifted indices           => still the same as original
    if (willTo > Math.max(from, appliedTo)) return willTo; // above the shifted indices           => still the same as original
    
    
    
    // normalize:
    return willTo + ((from > appliedTo) ? 1 : -1);
}
