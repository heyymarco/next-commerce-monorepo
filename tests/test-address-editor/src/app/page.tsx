'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { Address, AddressEditor } from "@heymarco/address-editor";
import { Container } from "@reusable-ui/components";
import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState<Address|null>(null);
  return (
    <Container tag='main' theme='primary' className={styles.main}>
      <p>
        test
      </p>
      <AddressEditor value={address} onChange={setAddress} />
      <hr />
      <p>
        country : {address?.country}<br />
        state : {address?.state}<br />
        city : {address?.city}<br />
        zip : {address?.zip}<br />
        address : {address?.address}<br />
        firstName : {address?.firstName}<br />
        lastName : {address?.lastName}<br />
        phone : {address?.phone}<br />
      </p>
    </Container>
  );
}
