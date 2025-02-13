'use client'

// import Image from 'next/image'
import { Image } from '@heymarco/image'
import styles from './page.module.css'

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.test}>
                <Image src='/lorem.jpg' alt='' />
                <br />
                <br />
                <br />
                <Image src='/lorem.jpg' alt='' width={225*1} height={160*1} />
                <br />
                <br />
                <br />
                <Image src={'/lorem.jpg'} alt='' width={225*1.5} height={160*1.5} />
                <br />
                <br />
                <br />
                <Image src='/lorem.jpg' alt='' width={225*1} height={160*1} style={{ width: '113px', height: '80px', background: 'pink' }} />
                <br />
                <br />
                <br />
                <Image src='/lorem.jpg' alt='' width={225*2} height={160*1} style={{ background: 'pink' }} />
            </div>
        </main>
    )
}
