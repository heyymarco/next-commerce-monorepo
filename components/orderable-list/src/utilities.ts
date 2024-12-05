export const calculateSyncIndex = (from: number, to: number, appliedTo: number|undefined): 0|1 => {
    /*
        example of pulling [6] and temporary applied to index of 2
        
        wrappedChildren     visuallyRendered
        index:  0 [0]       index:  0 [0]
                1 [1]               1 [1]
                2 [2]          void 2 [ ] <-- apply [6]
                3 [3]             x 3 [2] <-- out_of_index_sync    elements with data from [2] to [5] are out_of_index_sync with the indices
                4 [4]             x 4 [3] <-- out_of_index_sync
                5 [5]             x 5 [4] <-- out_of_index_sync
                6 [6] --> pull    x 6 [5] <-- out_of_index_sync
                7 [7]               7 [7]
                8 [8]               8 [8]
                9 [9]               9 [9]
    */
    if (
        /*
            from > to >= appliedTo
        */
        (to < from)               // to_index is less_than pulled_index
        &&
        (appliedTo !== undefined) // has an applied_index
        &&
        (to >= appliedTo)         // to_index is greater_than_equal applied_index
    )
    {
        return 1; // increase the to_index to compensate the out_of_index_sync
    } // if
    
    
    
    return 0;
}
