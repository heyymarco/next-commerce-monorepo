'use client'

import NextImage from 'next/image'
import { Image } from '@heymarco/image'
import styles from './page.module.css'

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.test}>
                <div>NextJs Image</div>
                <div>225 x 160</div>
                <NextImage src='/lorem.jpg' alt='' width={225} height={160} />
                <br />
                <br />
                <br />
                <div>unknown size</div>
                <Image src='/lorem.jpg' alt='' />
                <br />
                <br />
                <br />
                <div>unknown size =&gt; 225 x auto</div>
                <Image src='/lorem.jpg' alt='' style={{ width: '225px', background: 'pink' }} />
                <br />
                <br />
                <br />
                <div>unknown size =&gt; auto x 160</div>
                <Image src='/lorem.jpg' alt='' style={{ height: '160px', background: 'pink' }} />
                <br />
                <br />
                <br />
                <div>unknown size =&gt; 300 x 200</div>
                <Image src='/lorem.jpg' alt='' style={{ width: '300px', height: '200px', background: 'pink' }} />
                <br />
                <br />
                <br />
                <div>unknown size =&gt; 200 x 300</div>
                <Image src='/lorem.jpg' alt='' style={{ width: '200px', height: '300px', background: 'pink' }} />
                <br />
                <br />
                <br />
                <div>225 x 160</div>
                <Image src='/lorem.jpg' alt='' width={225} height={160} />
                <br />
                <br />
                <br />
                <div>225 x 160 =&gt; 450 x 320</div>
                <Image src='/lorem.jpg' alt='' width={225} height={160} style={{ width: '450px', height: '320px', background: 'pink' }} />
                <br />
                <br />
                <br />
                <div>225 x 160 =&gt; 112.5 x 80</div>
                <Image src='/lorem.jpg' alt='' width={225} height={160} style={{ width: '112.5px', height: '80px', background: 'pink' }} />
                <br />
                <br />
                <br />
                <div>225 x 160 =&gt; 300 x 200</div>
                <Image src='/lorem.jpg' alt='' width={225} height={160} style={{ width: '300px', height: '200px', background: 'pink' }} />
                <br />
                <br />
                <br />
                <div>225 x 160 =&gt; 200 x 300</div>
                <Image src='/lorem.jpg' alt='' width={225} height={160} style={{ width: '200px', height: '300px', background: 'pink' }} />
            </div>
        </main>
    )
}
