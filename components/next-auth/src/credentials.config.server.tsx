// internals:
import type {
    // types:
    CredentialsConfigServer,
}                           from './types.js'
import {
    // types:
    defaultCredentialsConfigClient,
}                           from './credentials.config.client.js'



export const defaultCredentialsConfigServer : CredentialsConfigServer = {
    name     : defaultCredentialsConfigClient.name,
    email    : defaultCredentialsConfigClient.email,
    username : {
        ...defaultCredentialsConfigClient.username,
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
        ...defaultCredentialsConfigClient.password,
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
