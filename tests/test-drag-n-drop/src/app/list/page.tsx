'use client'

import { OrderableList, OrderableListItem, OrderableListItemDropHandshakeEvent } from '@heymarco/orderable-list'
import { useEvent } from '@reusable-ui/core';



export default function Home() {
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
            console.log(`[dragging] migrate ${ownListIndex} => ${pairListIndex}`);
        }
        else {
            // console.log(`[dragged] migrate ${ownListIndex} => ${pairListIndex}`);
        } // if
    });
    return (
        <main>
            <OrderableList theme='primary' mild={false} defaultChildren={<>
                <OrderableListItem data={'000'} onOrderHandshake={handleOrderHandshake}>000</OrderableListItem>
                <OrderableListItem data={'111'} onOrderHandshake={handleOrderHandshake}>111</OrderableListItem>
                <OrderableListItem data={'222'} onOrderHandshake={handleOrderHandshake}>222</OrderableListItem>
                <OrderableListItem data={'333'} onOrderHandshake={handleOrderHandshake}>333</OrderableListItem>
                <OrderableListItem data={'444'} onOrderHandshake={handleOrderHandshake}>444<br />444</OrderableListItem>
                <OrderableListItem data={'555'} onOrderHandshake={handleOrderHandshake}>555</OrderableListItem>
                <OrderableListItem data={'666'} onOrderHandshake={handleOrderHandshake}>666</OrderableListItem>
            </>} />
        </main>
    )
}
