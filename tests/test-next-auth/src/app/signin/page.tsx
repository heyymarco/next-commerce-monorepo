'use client'

import { SignIn } from '@heymarco/next-auth'
// import Image from 'next/image'
// import styles from './page.module.css'

import { Container } from '@reusable-ui/components'      // a set of official Reusable-UI components
import { authConfigClient } from '@/../auth.config.client'
import { credentialsConfigClient } from '@/../credentials.config.client'
import { loginProviders } from './loginProviders'



export default function Home() {
    return (
        <Container tag='main' theme='primary'>
            <SignIn
                authConfigClient={authConfigClient}
                credentialsConfigClient={credentialsConfigClient}
                providers={loginProviders}
                defaultCallbackUrl='/?welcome'
                gotoHomeButtonComponent={null}
            />
        </Container>
    )
}
