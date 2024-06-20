// types:
export type EditorChangeEventHandler<in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>, in TValue extends unknown = string> = (value: TValue, event: TChangeEvent) => void
