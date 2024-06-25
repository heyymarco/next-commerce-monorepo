export interface Address {
    country   : string
    state     : string
    city      : string
    address   : string
    zip       : string
    
    firstName : string
    lastName  : string
    phone     : string
}

export type AddressType = 'shipping'|'billing'|(string & {})
