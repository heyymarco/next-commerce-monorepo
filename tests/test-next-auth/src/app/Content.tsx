'use client'

import { Busy, Button } from '@reusable-ui/components'      // a set of official Reusable-UI components
import { signIn, signOut, useSession } from 'next-auth/react'



export default function Content() {
    const { data: session, status } = useSession();
    
    
    
    return (
        <article>
            {
                (status === 'loading')
                ? <Busy theme='primary' size='lg' />
                : <>
                    {
                        !!session
                        ? <span>Signed in as:</span>
                        : <span>You are not signed in</span>
                    }
                    
                    {!!session?.user?.image && <div style={{ backgroundImage: `url(${session.user.image})`, display: 'inline-block', width: '50px', height: '50px' }} />}
                    
                    {!!session && <>
                        <strong>{session.user?.name ?? session.user?.email}</strong>
                    </>}
                    
                    {!session && <Button theme='primary' onClick={() => signIn()}>
                        Sign In
                    </Button>}
                    {!!session && <Button theme='secondary' onClick={() => signOut()}>
                        Sign Out
                    </Button>}
                    {!!session && <div>
                        <p>
                            Credentials: {!!session.credentials && JSON.stringify(session.credentials)}
                        </p>
                        <p>
                            Role: {!!session.role && JSON.stringify(session.role)}
                        </p>
                    </div>}
                </>
            }
        </article>
    )
}