'use client'

import { SignIn } from '@heymarco/next-auth'
// import Image from 'next/image'
// import styles from './page.module.css'

import { Container } from '@reusable-ui/components'      // a set of official Reusable-UI components
import { credentialsConfigClient } from '@/../credentials.config.client'
import { loginProviders } from './loginProviders'



export default function Home() {
    return (
        <Container tag='main' theme='primary'>
            <SignIn
                credentialsConfig={credentialsConfigClient}
                providers={loginProviders}
                signUpEnable={false}
                defaultCallbackUrl='/?welcome'
                gotoHomeButtonComponent={null}
            />
        </Container>
    )
}
