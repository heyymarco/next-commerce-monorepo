'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { AddressEditor } from "@heymarco/address-editor";
import { Container } from "@reusable-ui/components";

export default function Home() {
  return (
    <Container tag='main' theme='primary' className={styles.main}>
      <p>
        test
      </p>
      <AddressEditor />
      <p>
        test
      </p>
    </Container>
  );
}
