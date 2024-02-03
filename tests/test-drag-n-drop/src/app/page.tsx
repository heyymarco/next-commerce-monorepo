'use client'

import {useState} from 'react'
import { OrderableList, OrderableListItem, OrderableListItemProps } from '@/components/OrderableList'



export default function Home() {
    const [items, setItems] = useState<React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, number>>[]>([
        <OrderableListItem<HTMLElement, number> key='000' data={0}>000</OrderableListItem>,
        <OrderableListItem<HTMLElement, number> key='111' data={1}>111</OrderableListItem>,
        <OrderableListItem<HTMLElement, number> key='222' data={2}>222</OrderableListItem>,
        <OrderableListItem<HTMLElement, number> key='333' data={3}>333</OrderableListItem>,
        <OrderableListItem<HTMLElement, number> key='444' data={4}>444</OrderableListItem>,
    ]);
    return (
        <main>
            <OrderableList theme='primary' mild={false} defaultChildren={<>
                <OrderableListItem data={0}>000</OrderableListItem>
                <OrderableListItem data={1}>111</OrderableListItem>
                <OrderableListItem data={2}>222</OrderableListItem>
                <OrderableListItem data={3}>333</OrderableListItem>
                <OrderableListItem data={4}>444</OrderableListItem>
            </>} />
            
            <hr />
            
            <OrderableList<HTMLElement, number> theme='primary' mild={false}
                onChildrenChange={setItems}
            >
                {items}
            </OrderableList>
            <p>
                Data: {items.map((item) => item.props.data).join(', ')}
            </p>
        </main>
    )
}
