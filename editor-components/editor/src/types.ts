// types:
export type EditorChangeEventHandler<in TEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, in TValue extends unknown = string> = (value: TValue, event: TEvent) => void
