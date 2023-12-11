'use client'

// import Image from 'next/image'
import { DataTable, DataTableBody, DataTableHeader } from '@heymarco/data-table'
import styles from './page.module.css'

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.test}>
                <DataTable theme='primary'>
                    <DataTableHeader>
                        <tr className="tr">
                            <th className="th">
                                Test Table
                            </th>
                        </tr>
                    </DataTableHeader>
                    <DataTableBody>
                        <tr className="tr">
                            <th className="th">
                                hello
                            </th>
                            <td className="td">
                                world
                            </td>
                        </tr>
                        <tr className="tr">
                            <th className="th">
                                hello
                            </th>
                            <td className="td">
                                world
                            </td>
                        </tr>
                        <tr className="tr">
                            <td className="td">
                                hello
                            </td>
                            <td className="td">
                                world
                            </td>
                        </tr>
                        <tr className="tr">
                            <td className="td">
                                hello
                            </td>
                            <td className="td">
                                world
                            </td>
                            <td className="td">
                                X
                            </td>
                        </tr>
                    </DataTableBody>
                </DataTable>
                
                <hr />
                
                <DataTable theme='success' dataTableStyle='flush'>
                    <DataTableHeader>
                        <tr className="tr">
                            <th className="th">
                                Test Table
                            </th>
                        </tr>
                    </DataTableHeader>
                    <DataTableBody>
                        <tr className="tr">
                            <th className="th">
                                hello
                            </th>
                            <td className="td">
                                world
                            </td>
                        </tr>
                        <tr className="tr">
                            <th className="th">
                                hello
                            </th>
                            <td className="td">
                                world
                            </td>
                        </tr>
                        <tr className="tr">
                            <td className="td">
                                hello
                            </td>
                            <td className="td">
                                world
                            </td>
                        </tr>
                        <tr className="tr">
                            <td className="td">
                                hello
                            </td>
                            <td className="td">
                                world
                            </td>
                            <td className="td">
                                X
                            </td>
                        </tr>
                    </DataTableBody>
                </DataTable>
            </div>
        </main>
    )
}
