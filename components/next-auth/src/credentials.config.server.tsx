// internals:
import type {
    // types:
    CredentialsConfigServer,
}                           from './types.js'
import {
    // types:
    defaultCredentialsConfigShared,
}                           from './credentials.config.shared.js'



export const defaultCredentialsConfigServer : CredentialsConfigServer = {
    name     : defaultCredentialsConfigShared.name,
    email    : defaultCredentialsConfigShared.email,
    username : {
        ...defaultCredentialsConfigShared.username,
        
        prohibited     : [
            /admin/i,
            /marketing/i,
            /billing/i,
            /sales/i,
            /payment/i,
            /account/i,
            /business/i,
            /contact/i,
            /invite/i,
            /mail/i,
            'bot',
            'bots',
            'info',
            'information',
            'log',
            'login',
            'www',
            'root',
        ],
    },
    password : {
        ...defaultCredentialsConfigShared.password,
        
        prohibited     : [
            'qweasd',
            'qweasdzxc',
            '123',
            '1234',
            '12345',
            'aaa',
        ]
    },
};
