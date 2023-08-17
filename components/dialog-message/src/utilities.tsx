// react:
import {
    // react:
    default as React,
}                           from 'react'



// utilities:
export const paragraphify = (text: string): React.ReactElement => {
    // jsx:
    return (
        <>
            {
                text
                .split(/(?:\r?\n){2,}/) // double/triple/many new_line(s)
                .map((para, index) => <p key={index}>{para}</p>)
            }
        </>
    );
};
