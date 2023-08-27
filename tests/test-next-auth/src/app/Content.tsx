'use client'

import { Button } from "@reusable-ui/components";
import Link from 'next/link'

export default function Content() {
    return (
        <>
            <Button theme='primary'>
                <Link href='/signin'>
                    Login
                </Link>
            </Button>
        </>
    )
}