'use client'

import { ControllableSignInSection, SignIn } from '@heymarco/next-auth'
// import Image from 'next/image'
// import styles from './page.module.css'

import {
    default as React,
    useState
} from 'react'
import { Container, List, ListItem } from '@reusable-ui/components'      // a set of official Reusable-UI components
import { authConfigClient } from '@/../auth.config.client'
import { credentialsConfigClient } from '@/../credentials.config.client'
import { loginProviders } from './loginProviders'



export default function Home() {
    const [section, setSection] = useState<ControllableSignInSection>('signUp');
    return (
        <Container tag='main' theme='primary'>
            <SignIn
                authConfigClient={authConfigClient}
                credentialsConfigClient={credentialsConfigClient}
                providers={loginProviders}
                defaultCallbackUrl='/?welcome'
                
                defaultSection='recover'
                section={section}
                onSectionChange={setSection}
                
                gotoHomeButtonComponent={null}
            />
            <List actionCtrl={true} orientation='inline' theme='primary'>
                {(['signUp', 'signIn', 'recover'] as ControllableSignInSection[]).map((option) =>
                    <ListItem
                        key={option}
                        active={(option === section)}
                        onClick={() => setSection(option)}
                    >
                        {option}
                    </ListItem>
                )}
            </List>
        </Container>
    )
}
