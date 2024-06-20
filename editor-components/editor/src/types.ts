// types:
export type EditorChangeEventHandler<TEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, TValue extends unknown = string> = (value: TValue, event: TEvent) => void
