'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { Address, AddressEditor } from "@heymarco/address-editor";
import { Container } from "@reusable-ui/components";
import { useState } from "react";
import { SelectCountryEditor } from "@heymarco/select-country-editor";
import { SelectStateEditor } from "@heymarco/select-state-editor";
import { SelectCityEditor } from "@heymarco/select-city-editor";

export default function Home() {
  const [address, setAddress] = useState<Address|null>(null);
  const [country, setCountry] = useState<string>('');
  return (
    <Container tag='main' theme='primary' className={styles.main}>
      <p>
        test
      </p>
      <AddressEditor
        countryEditorComponent={
          <SelectCountryEditor enableValidation />
        }
        stateEditorComponent={
          <SelectStateEditor />
        }
        cityEditorComponent={
          <SelectCityEditor />
        }
        
        value={address}
        onChange={setAddress}
      />
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
      <hr />
      <SelectCountryEditor enableValidation />
      <hr />
      <SelectCountryEditor enableValidation value={country} onChange={setCountry} />
      <input type='text' value={country} onChange={(event) => setCountry(event.target.value)} />
      <p>
        country: {country}
      </p>
    </Container>
  );
}
