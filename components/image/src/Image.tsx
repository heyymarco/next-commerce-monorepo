// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component
import {
    GenericProps,
    Generic,
    
    
    
    Busy,
    Icon,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// next-js:
import * as nextImageCommonJs from 'next/image.js' // a commonJS module
const NextImage : typeof nextImageCommonJs.default = (nextImageCommonJs.default as any).default ?? nextImageCommonJs.default; // a *hack* for importing from commonJS module



// styles:
export const useImageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles.js')
, { id: 'm91zb0019e', specificityWeight: 0 }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './styles/styles.js';



// utilities:
const getRealSrc = (src: NextImageProps['src']|undefined):string|undefined => {
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



type NextImageProps = Parameters<typeof NextImage>[0]
export interface ImageProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<GenericProps<TElement>,
            |'onLoad'|'onLoadCapture'|'onError'|'onErrorCapture' // moved to <Generic<Image>>
        >,
        Pick<GenericProps<HTMLImageElement>,
            |'onLoad'|'onLoadCapture'|'onError'|'onErrorCapture' // moved here
        >,
        
        // additional bases:
        Omit<NextImageProps,
            |'src'       // changed from required to optional
            |'role'      // moved to <Generic>
            |'key'|'ref' // React.ForwardRef
            |keyof React.DOMAttributes<TElement> // not supported yet
        >
{
    // appearances:
    src                 ?: NextImageProps['src'], // changed to optional
    
    
    
    // components:
    imageComponent      ?: React.ReactComponentElement<any, NextImageProps>
    noImageComponent    ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    busyComponent       ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    errorImageComponent ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
}
const Image = <TElement extends Element = HTMLElement>(props: ImageProps<TElement>) => {
    // styles:
    const styleSheet = useImageStyleSheet();
    
    
    
    // rest props:
    const {
        // appearances:
        alt,
        src,
        loader,
        width,
        height,
        sizes               = (width !== undefined) ? `${width}px` : undefined, // a hack for fixing auto_image_size problem when no using [sizes] prop (using [width] & [height] props)
        fill                = !width && !height,
        placeholder,
        blurDataURL,
        
        
        
        // behaviors:
        loading,
        priority,
        quality,
        unoptimized,
        
        
        
        // <img>:
        crossOrigin,
        decoding,
        referrerPolicy,
        useMap,
        
        
        
        // deprecated:
        // @ts-ignore
        layout,
        // @ts-ignore
        objectFit,
        // @ts-ignore
        objectPosition,
        // @ts-ignore
        lazyBoundary,
        // @ts-ignore
        lazyRoot,
        
        
        
        // components:
        // @ts-ignore
        imageComponent      = (<NextImage                          /> as React.ReactComponentElement<any, NextImageProps>),
        noImageComponent    = (<Icon icon='image'        size='lg' /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        busyComponent       = (<Busy                     size='lg' /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        errorImageComponent = (<Icon icon='broken_image' size='lg' /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        
        
        
        // handlers:
        onLoad,
        onLoadCapture,
        onError,
        onErrorCapture,
        onLoadingComplete,
    ...restGenericProps} = props;
    
    
    
    // states:
    const [isLoaded, setIsLoaded] = useState<boolean|null>((): false|null => {
        const realSrc = getRealSrc(src);
        /*
            * no image  => show error indicator.
            * has image => show loading indicator => then onLoadingComplete => true => show the image
        */
        return !realSrc ? false : null;
    });
    
    
    
    // dom effects:
    const prevSrcRef = useRef<typeof src>(src);
    useIsomorphicLayoutEffect(() => { // needs a fast resetter before `onError|onLoadingComplete` runs
        // conditions:
        if (prevSrcRef.current === src) return; // exact the same => ignore
        const prevSrc = prevSrcRef.current;
        const realPrevSrc = getRealSrc(prevSrc);
        const realSrc     = getRealSrc(src);
        if (realPrevSrc === realSrc) return; // not the same but equivalent of src => ignore
        prevSrcRef.current = src; // sync
        
        
        
        // resets:
        setIsLoaded(
            /*
            * no image  => show error indicator.
            * has image => show loading indicator => then onLoadingComplete => true => show the image
            */
            !realSrc ? false : null
        );
    }, [src]);
    
    
    
    // handlers:
    const handleErrorInternal           = useEvent<React.ReactEventHandler<HTMLImageElement>>(() => {
        setIsLoaded(false); // error => false
    });
    const handleError                   = useMergeEvents(
        // preserves the original `onError`:
        onError,
        
        
        
        // handlers:
        handleErrorInternal,
    );
    
    const handleLoadingCompleteInternal = useEvent((_img: HTMLImageElement) => {
        setIsLoaded(true); // loaded => true
    });
    const handleLoadingComplete         = useMergeEvents(
        // preserves the original `onLoadingComplete`:
        onLoadingComplete,
        
        
        
        // handlers:
        handleLoadingCompleteInternal,
    );
    
    
    
    /*
        To make your <ImageWithStatus /> component semantically better and accessible, you can use the <figure> and <figcaption> elements.
        However, since you encountered an issue with <figure> inside a <p>, you can use a <div> with appropriate ARIA roles and attributes.
        
        Here’s how you can improve the semantic structure and accessibility of your component:
        1. Use role="img": This role indicates that the element is an image.
        2. Use aria-label: Provide a descriptive label for the image.
        3. Use aria-busy: Indicate when the image is loading.
        4. Use aria-live: Announce error messages to screen readers.
        
        Here’s the updated component:
        ```tsx
        return (
            <div
                className='wrapper'
                role='img'
                aria-label={state === 'loading' ? 'Loading image' : state === 'error' ? 'Error loading image' : 'Image'}
                aria-busy={state === 'loading'}
                aria-live={state === 'error' ? 'assertive' : 'off'}
            >
                <img className='image' src={src} alt='' />
                {state === 'loading' && <span className='busy'>Loading...</span>}
                {state === 'error' && <span className='error'>Error loading image</span>}
            </div>
        );
        ```
        
        
        
        So, there is an aria-label on the <div> and an alt on the <img>. Will screen readers be confused by the presence of these two labels?
        
        Good question! Screen readers will prioritize the aria-label on the <div> with role="img" over the alt attribute on the <img>.
        This is because the role="img" and aria-label combination is designed to provide a more descriptive and accessible experience for users.
        
        However, to avoid any potential confusion and ensure the best accessibility,
        you can remove the alt attribute from the <img> element since the aria-label on the <div> already provides the necessary description.
        Here’s the updated component:
        ```tsx
        return (
            <div
                className='wrapper'
                role='img'
                aria-label={state === 'loading' ? 'Loading image' : state === 'error' ? 'Error loading image' : 'Image'}
                aria-busy={state === 'loading'}
                aria-live={state === 'error' ? 'assertive' : 'off'}
            >
                <img className='image' src={src} />
                {state === 'loading' && <span className='busy'>Loading...</span>}
                {state === 'error' && <span className='error'>Error loading image</span>}
            </div>
        );
        ```
        
        
        
        Should I add aria-role="none|presentation" to <span> busy and error (and add the aria-role to the <img> too)? Or is the previous code semantic enough?
        
        Adding role="none" or role="presentation" to the <span> elements for the busy and error states can help ensure that screen readers ignore these elements,
        focusing only on the main content. This can improve the accessibility of your component.
        Here’s the updated code with these roles added:
        ```tsx
        return (
            <div
                className='wrapper'
                role='img'
                aria-label={state === 'loading' ? 'Loading image' : state === 'error' ? 'Error loading image' : 'Image'}
                aria-busy={state === 'loading'}
                aria-live={state === 'error' ? 'assertive' : 'off'}
            >
                <img className='image' src={src} role='none' />
                {state === 'loading' && <span className='busy' role='none'>Loading...</span>}
                {state === 'error' && <span className='error' role='none'>Error loading image</span>}
            </div>
        );
        ```
    */
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // semantics:
            tag={props.tag ?? 'figure'}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            {(!!src) && (isLoaded !== false) && React.cloneElement<NextImageProps>(imageComponent,
                // props:
                {
                    // appearances:
                    alt               : alt,
                    src               : src,
                    loader            : loader,
                    width             : width,
                    height            : height,
                    sizes             : sizes,
                    fill              : fill,
                    placeholder       : placeholder,
                    blurDataURL       : blurDataURL,
                    
                    
                    
                    // behaviors:
                    loading           : loading,
                    priority          : priority,
                    quality           : quality,
                    unoptimized       : unoptimized,
                    
                    
                    
                    // <img>:
                    crossOrigin       : crossOrigin,
                    decoding          : decoding,
                    referrerPolicy    : referrerPolicy,
                    useMap            : useMap,
                    
                    
                    
                    // deprecated:
                    // @ts-ignore
                    layout            : layout,
                    // @ts-ignore
                    objectFit         : objectFit,
                    // @ts-ignore
                    objectPosition    : objectPosition,
                    // @ts-ignore
                    lazyBoundary      : lazyBoundary,
                    // @ts-ignore
                    lazyRoot          : lazyRoot,
                    
                    
                    
                    // handlers:
                    onLoad            : onLoad,
                    onLoadCapture     : onLoadCapture,
                    onError           : handleError,
                    onErrorCapture    : onErrorCapture,
                    onLoadingComplete : handleLoadingComplete,
                },
            )}
            
            {/* no image => show default image: */}
            {( !src) && React.cloneElement<React.HTMLAttributes<HTMLElement>>(noImageComponent,
                // props:
                {
                    // classes:
                    className : noImageComponent.props.className    ?? 'status',
                },
            )}
            
            {/* loading: */}
            {(!!src) && (isLoaded === null ) && React.cloneElement<React.HTMLAttributes<HTMLElement>>(busyComponent,
                // props:
                {
                    // classes:
                    className : busyComponent.props.className       ?? 'status',
                },
            )}
            
            {/* error: */}
            {(!!src) && (isLoaded === false) && React.cloneElement<React.HTMLAttributes<HTMLElement>>(errorImageComponent,
                // props:
                {
                    // classes:
                    className : errorImageComponent.props.className ?? 'status',
                },
            )}
        </Generic>
    );
}
export {
    Image,
    Image as default,
}
