# KeyActionEditor Component Documentation

## Overview
The `KeyActionEditor` component is a custom React component that handles key events for saving, canceling, and deleting actions. It provides special handling for the `Enter` and `Delete` keys to perform specific actions based on the current state of the text input.

## Props
- `elmRef`: A ref to the input element.
- `saveKeys`: An array of key codes that trigger the save action. Default is `defaultSaveKeys`.
- `cancelKeys`: An array of key codes that trigger the cancel action. Default is `defaultCancelKeys`.
- `deleteKeys`: An array of key codes that trigger the delete action. Default is `defaultDeleteKeys`.
- `textEditorComponent`: A React element representing the text editor component. Default is `<TextEditor />`.
- `onSave`: A callback function triggered when the save action is performed.
- `onCancel`: A callback function triggered when the cancel action is performed.
- `onDelete`: A callback function triggered when the delete action is performed.
- `onKeyDown`: A callback function for handling key down events.
- `onBlur`: A callback function for handling blur events.

## Usage
To use the `KeyActionEditor` component, import it into your React project and provide the necessary props:

```jsx
import KeyActionEditor from './KeyActionEditor';

const MyComponent = () => {
    const handleSave = (event) => {
        console.log('Save action triggered');
    };

    const handleCancel = (event) => {
        console.log('Cancel action triggered');
    };

    const handleDelete = (event) => {
        console.log('Delete action triggered');
    };

    return (
        <KeyActionEditor
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
        />
    );
};
