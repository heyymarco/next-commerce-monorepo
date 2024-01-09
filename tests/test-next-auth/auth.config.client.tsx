// heymarco:
import type {
    // types:
    AuthConfigClient,
}                               from '@heymarco/next-auth'

// internals:
import {
    authConfigShared,
}                               from './auth.config.shared.js'



export const authConfigClient : AuthConfigClient = authConfigShared;
