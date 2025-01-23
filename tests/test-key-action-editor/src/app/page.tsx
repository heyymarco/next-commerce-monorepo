'use client'

import styles from "./page.module.css";
import { KeyActionEditor } from "@heymarco/key-action-editor";
import { useEvent } from "@reusable-ui/core";
import { Container } from "@reusable-ui/components";

export default function Home() {
    const handleSave = useEvent(() => {
        console.log('save');
    });
    const handleCancel = useEvent(() => {
        console.log('cancel');
    });
    const handleDelete = useEvent(() => {
        console.log('delete');
    });
    return (
        <Container tag='main' theme='primary' className={styles.main}>
            <KeyActionEditor
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
            />
        </Container>
    );
}
