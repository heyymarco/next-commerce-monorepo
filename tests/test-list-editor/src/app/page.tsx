'use client'

import styles from "./page.module.css";
import { ListEditor } from "@heymarco/list-editor";
import { Container } from "@reusable-ui/components";

export default function Home() {
    return (
        <Container tag='main' theme='primary' className={styles.main}>
            <ListEditor theme='primary' defaultValue={[
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
            ]} />
        </Container>
    );
}
