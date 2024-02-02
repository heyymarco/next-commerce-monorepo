'use client'

import {useState} from 'react'
import { OrderableList, OrderableListItem, OrderableListItemProps } from '@/components/OrderableList'



export default function Home() {
    const [items, setItems] = useState<React.ReactComponentElement<any, OrderableListItemProps>[]>([
        <OrderableListItem key='000' data={0}>000</OrderableListItem>,
        <OrderableListItem key='111' data={1}>111</OrderableListItem>,
        <OrderableListItem key='222' data={2}>222</OrderableListItem>,
        <OrderableListItem key='333' data={3}>333</OrderableListItem>,
        <OrderableListItem key='444' data={4}>444</OrderableListItem>,
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
            
            <OrderableList theme='primary' mild={false}
                onChildrenChange={setItems as any}
            >
                {items}
            </OrderableList>
            <p>
                Data: {items.map((item) => item.props.data).join(', ')}
            </p>
        </main>
    )
}
