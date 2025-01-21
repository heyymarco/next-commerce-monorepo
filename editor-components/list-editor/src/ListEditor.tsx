// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// heymarco core:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// heymarco components:
import {
    // react components:
    type EditorProps,
    type EditorComponentProps,
}                           from '@heymarco/editor'
import {
    // layout-components:
    type OrderableListProps,
    OrderableList,
    type OrderableListComponentProps,
    
    type OrderableListItemProps,
    OrderableListItem,
    type OrderableListItemComponentProps,
}                           from '@heymarco/orderable-list'             // represents a series of content that the order can be rearranged
import {
    // react components:
    TextEditor,
}                           from '@heymarco/text-editor'



// utilities:
const defaultValueToUi = <TValue extends any = string>(value: TValue|null): React.ReactNode => `${value ?? ''}`;



// react components:
export type EditorPosition = 'start'|'end'|'both'|'none'
export interface ListEditorProps<out TElement extends Element = HTMLButtonElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>, TValue extends unknown = string>
    extends
        // bases:
        Pick<EditorProps<TElement, TChangeEvent, TValue[]>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            
            |'notifyValueChange'
        >,
        Omit<OrderableListProps<TElement, TValue>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            
            
            
            // children:
            |'defaultChildren'  // not supported
            |'children'         // not supported
            |'onChildrenChange' // not supported
        >,
        Pick<React.InputHTMLAttributes<TElement>,
            // accessibilities:
            |'placeholder'
        >,
        
        // components:
        OrderableListComponentProps<TElement, TValue>,
        OrderableListItemComponentProps<Element, TValue>,
        EditorComponentProps<Element, TChangeEvent, TValue>
{
    // positions:
    editorPosition                   ?: EditorPosition
    
    
    
    // values:
    valueToUi                        ?: (value: TValue|null) => React.ReactNode
    
    
    
    // components:
    editorOrderableListItemComponent ?: React.ReactComponentElement<any, OrderableListItemProps<Element, unknown>>
}
const ListEditor = <TElement extends Element = HTMLButtonElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>, TValue extends unknown = string>(props: ListEditorProps<TElement, TChangeEvent, TValue>): JSX.Element|null => {
    // props:
    const {
        // positions:
        editorPosition                   = 'end',
        
        
        
        // accessibilities:
        placeholder                      = 'Add new',
        
        
        
        // values:
        valueToUi                        = defaultValueToUi,
        
        defaultValue                     : defaultUncontrollableValue = [],
        value                            : controllableValue,
        onChange                         : onValueChange,
        
        
        
        // components:
        orderableListComponent           = (<OrderableList<TElement, TValue>      /> as React.ReactElement<OrderableListProps<TElement, TValue>>),
        orderableListItemComponent       = (<OrderableListItem<Element, TValue>   /> as React.ReactElement<OrderableListItemProps<Element, TValue>>),
        editorOrderableListItemComponent = (<OrderableListItem<Element, unknown>  /> as React.ReactElement<OrderableListItemProps<Element, unknown>>),
        editorComponent                  = (<TextEditor placeholder={placeholder} /> as React.ReactElement<EditorProps<Element, TChangeEvent, TValue>>),
        
        
        
        // other props:
        ...restPreListEditorProps
    } = props;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue[], TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onValueChange,
    });
    
    const existingRegisteredKeyMapRef = useRef<Map<TValue, number[]>|undefined>(undefined);
    const uniqueValueCounterRef       = useRef<number>(0);
    const uniqueKeys = useMemo<number[]>(() => {
        // deep clone the `existingRegisteredKeyMap` to ``availableRegisteredKeyMap` because we need to mutate the data:
        const availableRegisteredKeyMap = (
            existingRegisteredKeyMapRef.current
            ? new Map<TValue, number[]>(
                existingRegisteredKeyMapRef.current
                .entries()
                .map(([key, list]) =>
                    [key, [...list]]
                )
            )
            : new Map<TValue, number[]>()
        );
        
        
        
        const renewRegisteredKeyMap = new Map<TValue, number[]>();
        const renewUniqueKeys : number[] = [];
        
        
        
        let index = -1;
        for (const val of value) {
            index++;
            
            
            
            const availableRegisteredKeysOfValue = availableRegisteredKeyMap.get(val) ?? (() => {
                const newRegisteredKeysOfValue : number[] = [];
                availableRegisteredKeyMap.set(val, newRegisteredKeysOfValue);
                return newRegisteredKeysOfValue;
            })();
            const renewRegisteredKeysOfValue = renewRegisteredKeyMap.get(val) ?? (() => {
                const newRegisteredKeysOfValue : number[] = [];
                renewRegisteredKeyMap.set(val, newRegisteredKeysOfValue);
                return newRegisteredKeysOfValue;
            })();
            const key = (
                availableRegisteredKeysOfValue.shift() // take existing key (if any)
                ??
                uniqueValueCounterRef.current++        // create new key
            );
            renewRegisteredKeysOfValue.push(key);
            renewUniqueKeys.push(key);
        } // for
        
        
        
        existingRegisteredKeyMapRef.current = renewRegisteredKeyMap;
        return renewUniqueKeys;
    }, [value]);
    
    
    
    // handlers:
    const handleChildrenChangeInternal = useEvent((children: React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, TValue>>[]): void => {
        triggerValueChange(
            children
            .filter(({props}) => 'data' in props) // filter out <EditorComponent>
            .map(({props: {data}}) =>
                data!
            ),
            { triggerAt: 'immediately', event: undefined as any } // TODO: define event
        );
    });
    const handleChildrenChange         = useMergeEvents(
        // preserves the original `onChildrenChange` from `orderableListComponent`:
        orderableListComponent.props.onChildrenChange,
        
        
        
        // actions:
        handleChildrenChangeInternal,
    );
    
    
    
    // props:
    const {
        // values:
        notifyValueChange       = value, // take, to be handled by `<EditableButton>`
        
        
        
        // other props:
        ...restListEditorProps
    } = restPreListEditorProps;
    
    
    
    // default props:
    const {
        // other props:
        ...restOrderableListProps
    } = restListEditorProps satisfies NoForeignProps<typeof restListEditorProps, OrderableListProps<TElement, TValue>>;
    
    const OrderableListItemWithEditor = (props: OrderableListItemProps<Element, unknown>): JSX.Element|null => {
        // default props:
        const {
            // variants:
            nude : editorComponentNude = true,
            
            
            
            // other props:
            ...restEditorComponentProps
        } = editorComponent.props;
        
        const {
            // behaviors:
            orderable = false,
            
            
            
            // children:
            children  = React.cloneElement<EditorProps<Element, TChangeEvent, TValue>>(editorComponent,
                // props:
                {
                    // other props:
                    ...restEditorComponentProps,
                    
                    
                    
                    // variants:
                    nude : editorComponentNude,
                },
            ),
            
            
            
            // other props:
            ...restOrderableListItemProps
        } = props;
        
        const {
            // behaviors:
            orderable : editorOrderableListItemComponentOrderable = orderable,
            
            
            
            // children:
            children  : editorOrderableListItemComponentChildren  = children,
            
            
            
            // other props:
            ...restEditorOrderableListItemComponentProps
        } = editorOrderableListItemComponent.props;
        
        
        
        // jsx:
        /* <OrderableListItem> */
        return React.cloneElement<OrderableListItemProps<Element, unknown>>(editorOrderableListItemComponent,
            // props:
            {
                // other props:
                ...restOrderableListItemProps,
                ...restEditorOrderableListItemComponentProps, // overwrites restOrderableListItemProps (if any conflics)
                
                
                
                // behaviors:
                orderable : editorOrderableListItemComponentOrderable,
            },
            
            
            
            // children:
            editorOrderableListItemComponentChildren,
        );
    };
    
    const {
        // children:
        children : orderableListComponentChildren = <>
            {/* <OrderableListItemWithEditor> */}
            {((editorPosition === 'start') || (editorPosition === 'both')) && <OrderableListItemWithEditor />}
            
            {/* <OrderableListItem> */}
            {value.map((val, childIndex) => {
                const uniqueKey = uniqueKeys[childIndex];
                
                
                
                // default props:
                const {
                    // data:
                    data     : orderableListItemComponentData     = val,
                    
                    
                    
                    // children:
                    // children : orderableListItemComponentChildren = valueToUi(val),
                    children : orderableListItemComponentChildren = <>${uniqueKey} - {valueToUi(val)}</>, // TODO: remove visual key debugger
                    
                    
                    
                    // other props:
                    ...restOrderableListItemComponentProps
                } = orderableListItemComponent.props;
                
                
                
                // jsx:
                /* <OrderableListItem> */
                return React.cloneElement<OrderableListItemProps<Element, TValue>>(orderableListItemComponent,
                    // props:
                    {
                        // other props:
                        ...restOrderableListItemComponentProps,
                        
                        
                        
                        // identifiers:
                        key  : uniqueKey,
                        
                        
                        
                        // data:
                        data : orderableListItemComponentData,
                    },
                    
                    
                    
                    // children:
                    orderableListItemComponentChildren,
                );
            })}
            
            {/* <OrderableListItemWithEditor> */}
            {((editorPosition === 'end') || (editorPosition === 'both')) && <OrderableListItemWithEditor />}
        </>,
        
        
        
        // other props:
        ...restOrderableListComponentProps
    } = orderableListComponent.props;
    
    
    
    // jsx:
    /* <OrderableList> */
    return React.cloneElement<OrderableListProps<TElement, TValue>>(orderableListComponent,
        // props:
        {
            // other props:
            ...restOrderableListProps,
            ...restOrderableListComponentProps, // overwrites restOrderableListProps (if any conflics)
            
            
            
            // handlers:
            onChildrenChange : handleChildrenChange,
        },
        
        
        
        // children:
        orderableListComponentChildren,
    );
};
export {
    ListEditor,            // named export for readibility
    ListEditor as default, // default export to support React.lazy
}



export interface ListEditorComponentProps<out TElement extends Element = HTMLButtonElement, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.SyntheticEvent<unknown, Event>, TValue extends unknown = string>
{
    // components:
    listEditorComponent ?: React.ReactElement<ListEditorProps<TElement, TChangeEvent, TValue>>
}
