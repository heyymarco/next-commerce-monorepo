'use client'

import {useState} from 'react'
import {useEvent} from '@reusable-ui/core'
import { NumberUpDownEditor } from '@heymarco/number-updown-editor'
import styles from './page.module.css'

export default function Home() {
    const [value, setValue] = useState<number>(0);
    const handleDecrease = useEvent(() => {
        setValue((current) => current - 1)
    });
    const handleIncrease = useEvent(() => {
        setValue((current) => current + 1)
    });
    return (
        <main className={styles.main}>
            <div className={styles.test}>
                <p>
                    Value: {value}
                </p>
                <p>
                    <button type='button' onClick={handleDecrease}>-</button>
                    <button type='button' onClick={handleIncrease}>+</button>
                </p>
                <NumberUpDownEditor theme='primary' value={value} onChange={setValue} />
            </div>
        </main>
    )
}
