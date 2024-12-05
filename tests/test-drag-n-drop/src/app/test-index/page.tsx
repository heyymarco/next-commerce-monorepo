'use client'

import styles from './styles.module.css'
import {useState} from 'react'
import { OrderableList, OrderableListItem, OrderableListItemDropHandshakeEvent } from '@heymarco/orderable-list'
import { useEvent } from '@reusable-ui/core';



export default function Home() {
    const [generation, setGeneration] = useState<number>(0);
    const handleReset = useEvent(() => {
        setGeneration((current) => (current + 1));
        console.clear();
    });
    
    // const prevLogRef = useRef<number|undefined>(undefined);
    const handleOrderHandshake = useEvent(({isDragging, ownListIndex, pairListIndex, ownData, pairData, target}: OrderableListItemDropHandshakeEvent<HTMLElement, unknown>): void => {
        // if (!isDragging) return;
        // if (isDragging) return;
        if (pairListIndex === undefined) return;
        
        // if (ownListIndex === pairListIndex) return;
        
        // if (prevLogRef.current === pairListIndex) return;
        // prevLogRef.current = pairListIndex;
        // if ((target instanceof Element) && target.tagName === 'LI') return; // ignore when on blank <ListItem>
        
        if (isDragging) {
            console.log(`migrate ${pairListIndex} by ${ownListIndex} [dragging]`)
        }
        else {
            console.log(`migrate ${ownListIndex} by ${pairListIndex} [dragged]`);
        } // if
    });
    
    
    
    return (
        <main key={generation} className={styles.main}>
            <button onClick={handleReset}>Reset</button>
            <OrderableList theme='primary' className={styles.list} mild={false} defaultChildren={<>
                <OrderableListItem data={'000'} onOrderHandshake={handleOrderHandshake}>000</OrderableListItem>
                <OrderableListItem data={'111'} onOrderHandshake={handleOrderHandshake}>111</OrderableListItem>
                <OrderableListItem data={'222'} onOrderHandshake={handleOrderHandshake}>222</OrderableListItem>
                <OrderableListItem data={'333'} onOrderHandshake={handleOrderHandshake}>333</OrderableListItem>
                <OrderableListItem data={'444'} onOrderHandshake={handleOrderHandshake}>444</OrderableListItem>
                <OrderableListItem data={'555'} onOrderHandshake={handleOrderHandshake}>555</OrderableListItem>
                <OrderableListItem data={'666'} onOrderHandshake={handleOrderHandshake} theme='success'>666</OrderableListItem>
                <OrderableListItem data={'777'} onOrderHandshake={handleOrderHandshake}>777</OrderableListItem>
                <OrderableListItem data={'888'} onOrderHandshake={handleOrderHandshake}>888</OrderableListItem>
                <OrderableListItem data={'999'} onOrderHandshake={handleOrderHandshake}>999</OrderableListItem>
            </>} />
        </main>
    )
}
