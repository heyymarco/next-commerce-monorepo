'use client'

import { SignIn } from '@heymarco/next-auth'
// import Image from 'next/image'
// import styles from './page.module.css'

import { Container } from '@reusable-ui/components'      // a set of official Reusable-UI components
import { credentialsConfig } from '@/../credentials.config'
import { loginProviders } from './loginProviders'



export default function Home() {
    return (
        <Container tag='main' theme='primary'>
            <SignIn
                credentialsConfig={credentialsConfig}
                providers={loginProviders}
                signUpEnable={true}
            />
        </Container>
    )
}
