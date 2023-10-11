'use client'

import { QuantityInput } from '@heymarco/quantity-input'
import styles from './page.module.css'

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.test}>
                <QuantityInput theme='primary' />
                <br />
                <br />
                <QuantityInput theme='primary' defaultValue={5} enabled={false} />
                <br />
                <br />
                <QuantityInput theme='primary' defaultValue={5} readOnly={true} />
            </div>
        </main>
    )
}
