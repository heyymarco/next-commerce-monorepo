'use client'

import { SignIn } from '@heymarco/next-auth'
// import Image from 'next/image'
// import styles from './page.module.css'

import { Container } from '@reusable-ui/components'
import { credentialsConfig } from '@/../credentials.config'
import { loginProviders } from './loginProviders'



export default function Home() {
    return (
        <Container tag='main' theme='primary'>
            <p>
                Sign in goes here...
            </p>
            <SignIn
                credentialsConfig={credentialsConfig}
                providers={loginProviders}
            />
        </Container>
    )
}
