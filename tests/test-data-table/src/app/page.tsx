'use client'

import { useState } from 'react'
// import Image from 'next/image'
import { DataTable, DataTableBody, DataTableHeader, DataTableItem } from '@heymarco/data-table'
import styles from './page.module.css'

export default function Home() {
    const [enabled, setEnabled] = useState<boolean>(true);
    const [active , setActive ] = useState<boolean>(false);
    return (
        <main className={styles.main}>
            <div className={styles.test}>
                <DataTable theme='success' enabled={enabled} active={active}>
                    <DataTableHeader>
                        <tr className="tr">
                            <th className="th">
                                Test Table
                            </th>
                        </tr>
                    </DataTableHeader>
                    <DataTableBody>
                        <DataTableItem label={<>hello</>}>
                            world
                        </DataTableItem>
                        <DataTableItem label={<>hellohaa</>}>
                            world world
                        </DataTableItem>
                        <DataTableItem label={<>hey</>}>
                            wd
                        </DataTableItem>
                        <DataTableItem label={<>hola hello</>} actionChildren={<>X</>}>
                            world world world
                        </DataTableItem>
                    </DataTableBody>
                </DataTable>
                
                <hr />
                
                <label htmlFor='chkEnb'><input id='chkEnb' type='checkbox' checked={enabled} onChange={({target: {checked}}) => setEnabled(checked)} /> enabled</label>
                <label htmlFor='chkAct'><input id='chkAct' type='checkbox' checked={active } onChange={({target: {checked}}) =>  setActive(checked)} /> active</label>
                
                <hr />
                
                <DataTable theme='primary'>
                    <DataTableHeader>
                        <tr className="tr">
                            <th className="th hidden">
                                Test Table
                            </th>
                        </tr>
                    </DataTableHeader>
                    <DataTableBody>
                        <tr className="tr">
                            <th className="th hidden">
                                hello
                            </th>
                            <td className="td hidden">
                                world
                            </td>
                        </tr>
                        <tr className="tr">
                            <th className="th hidden">
                                hello
                            </th>
                            <td className="td hidden">
                                world
                            </td>
                        </tr>
                        <tr className="tr">
                            <td className="td hidden">
                                hello
                            </td>
                            <td className="td hidden">
                                world
                            </td>
                        </tr>
                        <tr className="tr">
                            <td className="td hidden">
                                hello
                            </td>
                            <td className="td hidden">
                                world
                            </td>
                            <td className="td hidden">
                                X
                            </td>
                        </tr>
                    </DataTableBody>
                </DataTable>
                
                <hr />
                
                <DataTable theme='primary'>
                    <DataTableHeader>
                        <tr className="tr hidden">
                            <th className="th hidden">
                                Test Table
                            </th>
                        </tr>
                    </DataTableHeader>
                    <DataTableBody>
                        <tr className="tr hidden">
                            <th className="th hidden">
                                hello
                            </th>
                            <td className="td hidden">
                                world
                            </td>
                        </tr>
                        <tr className="tr hidden">
                            <th className="th hidden">
                                hello
                            </th>
                            <td className="td hidden">
                                world
                            </td>
                        </tr>
                        <tr className="tr hidden">
                            <td className="td hidden">
                                hello
                            </td>
                            <td className="td hidden">
                                world
                            </td>
                        </tr>
                        <tr className="tr hidden">
                            <td className="td hidden">
                                hello
                            </td>
                            <td className="td hidden">
                                world
                            </td>
                            <td className="td hidden">
                                X
                            </td>
                        </tr>
                    </DataTableBody>
                </DataTable>
            </div>
        </main>
    )
}
