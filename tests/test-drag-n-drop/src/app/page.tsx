'use client'

import {useState} from 'react'
import { OrderableList, OrderableListItem, OrderableListItemDropHandshakeEvent, OrderableListItemProps } from '@heymarco/orderable-list'
import { Basic } from '@reusable-ui/components';
import { useEvent } from '@reusable-ui/core';



export default function Home() {
    const [items, setItems] = useState<React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, number>>[]>([
        <OrderableListItem<HTMLElement, number> key='000' data={0}>000</OrderableListItem>,
        <OrderableListItem<HTMLElement, number> key='111' data={1}
            onOrderHandshake={(event) => {
                console.log(event);
                // console.log({
                //     type: event.type,
                //     isDragging: event.isDragging,
                //     currentTarget: event.currentTarget.outerHTML,
                //     // @ts-ignore
                //     target: event.target?.outerHTML,
                //     // @ts-ignore
                //     relatedTarget: event.relatedTarget?.outerHTML,
                // });
            }}
        >111</OrderableListItem>,
        <OrderableListItem<HTMLElement, number> key='999' data={9}
            onOrderHandshake={(event) => {
                event.response = false;
                console.log(event);
            }}
        >no drop</OrderableListItem>,
        <OrderableListItem<HTMLElement, number> key='222' data={2}>222</OrderableListItem>,
        <OrderableListItem<HTMLElement, number> key='333' data={3}
            onOrderStart={(event) => {
                console.log(event);
                event.response = (event.target as Element).classList.contains('grip') ?? false;
            }}
            onOrderHandshake={(event) => {
                console.log(event);
                // console.log({
                //     type: event.type,
                //     isDragging: event.isDragging,
                //     currentTarget: event.currentTarget.outerHTML,
                //     // @ts-ignore
                //     target: event.target?.outerHTML,
                //     // @ts-ignore
                //     relatedTarget: event.relatedTarget?.outerHTML,
                // });
            }}
        >
            <span>333</span>
            <Basic theme='secondary' className='grip' style={{display: 'inline-block', marginInlineStart: 'auto', padding: 0, inlineSize: '5rem', cursor: 'move'}}>&nbsp;handler</Basic>
        </OrderableListItem>,
        <OrderableListItem<HTMLElement, number> key='444' data={4}>444</OrderableListItem>,
    ]);
    const handleOrderHandshake = useEvent(({isDragging, ownListIndex, pairListIndex, ownData, pairData}: OrderableListItemDropHandshakeEvent<HTMLElement, unknown>): void => {
        if (ownListIndex === pairListIndex) return;
        console.log({isDragging, ownListIndex, pairListIndex, ownData, pairData});
    });
    return (
        <main>
            <OrderableList theme='primary' mild={false} defaultChildren={<>
                <OrderableListItem data={0}>000</OrderableListItem>
                <OrderableListItem data={1}>111</OrderableListItem>
                <OrderableListItem data={2} orderable={false}>unmoveable</OrderableListItem>
                <OrderableListItem data={3}>333</OrderableListItem>
                <OrderableListItem data={4}>444</OrderableListItem>
                <OrderableListItem data={4} draggable={false}>not draggable</OrderableListItem>
                <OrderableListItem data={4}>666</OrderableListItem>
                <OrderableListItem data={4}>777</OrderableListItem>
                <OrderableListItem data={4} droppable={false}>not droppable</OrderableListItem>
                <OrderableListItem data={4}>990</OrderableListItem>
            </>} />
            
            <hr />
            
            <OrderableList theme='primary' mild={false} orderMode='swap' defaultChildren={<>
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
            
            <hr />
            
            <OrderableList theme='primary' mild={false} orderMode='swap' defaultChildren={<>
                <OrderableListItem data={'000'} onOrderHandshake={handleOrderHandshake}>000</OrderableListItem>
                <OrderableListItem data={'111'} onOrderHandshake={handleOrderHandshake}>111</OrderableListItem>
                <OrderableListItem data={'222'} onOrderHandshake={handleOrderHandshake}>222</OrderableListItem>
                <OrderableListItem data={'333'} onOrderHandshake={handleOrderHandshake}>333</OrderableListItem>
                <OrderableListItem data={'444'} onOrderHandshake={handleOrderHandshake}>444</OrderableListItem>
            </>} />
        </main>
    )
}
