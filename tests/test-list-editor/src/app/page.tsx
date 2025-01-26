'use client'

import styles from "./page.module.css";
import { ListEditor } from "@heymarco/list-editor";
import { Container } from "@reusable-ui/components";
import { useState } from "react";

export default function Home() {
    const [items, setItems] = useState<string[]>(() => [
        'Zero',
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Three',
        'Three',
        'Three',
    ]);
    return (
        <Container tag='main' theme='primary' className={styles.main}>
            <ListEditor theme='primary' editorPosition='both' value={items} onChange={(newValue, event) => {
                setItems(newValue);
                console.log(event);
            }} />
            <p>
                {items.join(', ')}
            </p>
        </Container>
    );
}
