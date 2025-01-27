// types:
export type EditorChangeEventHandler<in TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>> = (value: TValue, event: TChangeEvent) => void
