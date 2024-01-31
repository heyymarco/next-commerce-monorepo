'use client'

import OrderableList from '@/components/OrderableList'
import { ListItem } from '@reusable-ui/components'



export default function Home() {
    return (
        <main>
            <OrderableList theme='primary' mild={false} defaultChildren={<>
                <ListItem key='000'>000</ListItem>
                <ListItem key='111'>111</ListItem>
                <ListItem key='222'>222</ListItem>
                <ListItem key='333'>333</ListItem>
                <ListItem key='444'>444</ListItem>
            </>} />
        </main>
    )
}
