// react:
import {
    // react:
    default as React,
}                           from 'react'



// react components:
const DummyInput = React.forwardRef((props: React.InputHTMLAttributes<HTMLInputElement>, ref: React.ForwardedRef<HTMLInputElement>): JSX.Element|null => {
    // ignore all props (except `ref`), because it just a decorator of `<span>`
    // jsx:
    return (
        <span
            // refs:
            ref={ref}
        />
    );
});
export {
    DummyInput,            // named export for readibility
    DummyInput as default, // default export to support React.lazy
}
