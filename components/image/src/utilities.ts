// internals:
import {
    type NextImageProps,
}                           from './types.js'



// utilities:
export const getRealSrc = (src: NextImageProps['src']|null|undefined):string|undefined => {
    return (
        !src
        ? undefined
        : (typeof(src) === 'string')
            ? src
            : ('default' in src)
                ? src.default.src
                : src.src
    );
}