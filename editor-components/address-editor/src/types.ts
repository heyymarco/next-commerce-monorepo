export interface Address {
    country   : string
    state     : string
    city      : string
    zip       : string
    address   : string
    
    company   : string
    firstName : string
    lastName  : string
    phone     : string
}

export type AddressType = 'shipping'|'billing'|(string & {})
