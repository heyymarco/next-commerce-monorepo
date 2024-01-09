import type {
    CredentialsConfigServer,
}                           from '@heymarco/next-auth'
import {
    // types:
    credentialsConfigClient,
}                           from './credentials.config.client.js'



export const credentialsConfigServer : CredentialsConfigServer = {
    name     : credentialsConfigClient.name,
    email    : credentialsConfigClient.email,
    username : {
        ...credentialsConfigClient.username,
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
        ...credentialsConfigClient.password,
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
