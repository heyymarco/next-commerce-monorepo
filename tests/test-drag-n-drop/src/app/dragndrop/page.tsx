'use client'

import styles from './page.module.css';

import { useRef } from 'react'
import { Basic, Indicator } from '@reusable-ui/components';
import { DragNDropData, DraggableProps, useDraggable, DroppableProps, useDroppable } from '@/libs/drag-n-drop';



interface DraggableComponentProps {
    text            : React.ReactNode
    dragData        : DragNDropData
    onDragHandshake : DraggableProps['onDragHandshake']
}
const DraggableComponent = (props: DraggableComponentProps) => {
    const dragRef = useRef<HTMLElement|null>(null);
    const {
        dropData,
        isDragging,
        handleMouseDown,
        handleTouchStart,
        DragOverlay,
    } = useDraggable({
        dragData : props.dragData,
        dragRef,
        onDragHandshake : props.onDragHandshake,
        onDragged(event) {
            console.log('onDragged: ', event, event.dropData);
        },
        dragComponent : () => <Basic theme='warning'>
            {(() => {
                switch (isDragging) {
                    case null  : return 'Drop me on droppable area.';
                    case true  : return 'Yes, drop here.';
                    case false : return "Noo, don't drop here.";
                    default    : return '';
                } // switch
            })()}
        </Basic>,
    });
    
    return (
        <>
            <Indicator
                elmRef={dragRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                
                className={styles.panel}
                theme='danger'
                
                {...(() => {
                    if (isDragging === undefined)   return { mild     : false  };
                    if (isDragging === null     )   return { outlined : true   };
                    if (isDragging === false    )   return { theme    : 'dark', enabled: false };
                                                    return { mild     : true   };
                })()}
            >
                <span>{props.text}</span>
                <Basic theme='warning' className={styles.info}>
                    {`${Array.from(dropData?.entries() ?? []).map(([key, value]) => `${key} => ${value}`).join(', ') ?? '--no-data--'}`}
                </Basic>
            </Indicator>
            <DragOverlay />
        </>
    );
}

interface DroppableComponentProps {
    text            : React.ReactNode
    dropData        : DragNDropData
    onDropHandshake : DroppableProps['onDropHandshake']
}
const DroppableComponent = (props: DroppableComponentProps) => {
    const dropRef = useRef<HTMLElement|null>(null);
    const {
        dragData,
        isDropping,
    } = useDroppable({
        dropData : props.dropData,
        dropRef,
        onDropHandshake: props.onDropHandshake,
        onDropped(event) {
            console.log('onDropped: ', event, event.dragData);
        },
    });
    return (
        <Indicator
            elmRef={dropRef}
            
            className={styles.panel}
            theme='danger'
            
            {...(() => {
                if (isDropping === undefined)   return { mild     : false  };
                if (isDropping === null     )   return { outlined : true   };
                if (isDropping === false    )   return { theme    : 'dark', enabled: false };
                                                return { mild     : true   };
            })()}
        >
            <span>{props.text}</span>
            <Basic theme='warning' className={styles.info}>
                {`${Array.from(dragData?.entries() ?? []).map(([key, value]) => `${key} => ${value}`).join(', ') ?? '--no-data--'}`}
            </Basic>
        </Indicator>
    );
}



export default function Home() {
    return (
        <main style={{
            display: 'grid',
            gridAutoFlow: 'column',
            justifyItems: 'center',
            alignItems: 'center',
            gap: '3rem',
            padding: '1rem',
        }}>
            <DraggableComponent text='Drag Universal' dragData={new Map<string, unknown>(Object.entries({'drag/universal': 123}))}       onDragHandshake={(event) => {event.response = true}} />
            <DraggableComponent text='Drag Specific'  dragData={new Map<string, unknown>(Object.entries({'drag/specific': 'abc-333'}))} onDragHandshake={(event) => {event.response = event.dropData.has('drop/specific')}} />
            
            <DroppableComponent text='Drop Universal' dropData={new Map<string, unknown>(Object.entries({'drop/universal': 456}))}       onDropHandshake={(event) => {event.response = true}} />
            <DroppableComponent text='Drop Specific'  dropData={new Map<string, unknown>(Object.entries({'drop/specific': 'def-666'}))} onDropHandshake={(event) => {event.response = event.dragData.has('drag/specific')}} />
        </main>
    )
}
