// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useMemo,
}                           from 'react'

// styles:
import {
    useImageStyleSheets,
}                           from './styles/loader'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
    useMergeStyles,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component
import {
    GenericProps,
    Generic,
    
    
    
    Busy,
    Icon,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals:
import {
    // types:
    type NextImageProps,
}                           from './types.js'
import {
    // utilities:
    getRealSrc,
}                           from './utilities.js'
import {
    // features:
    usesImage,
}                           from './features/image.js'

// next-js:
import * as nextImageCommonJs from 'next/image.js' // a commonJS module
const NextImage : typeof nextImageCommonJs.default = (nextImageCommonJs.default as any).default ?? nextImageCommonJs.default; // a *hack* for importing from commonJS module



// react components:
export interface ImageProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<GenericProps<TElement>,
            // refs:
            |'elmRef' // forwarded to <Image>
            
            // handlers:
            |'onLoad'|'onLoadCapture'|'onError'|'onErrorCapture' // moved to <Generic<Image>>
        >,
        Pick<GenericProps<HTMLImageElement>,
            // refs:
            |'elmRef' // forwarded to <Image>
            
            // handlers:
            |'onLoad'|'onLoadCapture'|'onError'|'onErrorCapture' // moved here
        >,
        
        // additional bases:
        Pick<NextImageProps,
            // appearances:
            |'alt'
            // |'src' // changed to optional
            |'loader'
            |'width'
            |'height'
            |'sizes'
            |'fill'
            |'placeholder'
            |'blurDataURL'
            
            // behaviors:
            |'loading'
            |'priority'
            |'fetchPriority'
            |'quality'
            |'unoptimized'
            
            // <img>:
            |'crossOrigin'
            |'decoding'
            |'referrerPolicy'
            |'useMap'
        >
{
    // appearances:
    src                   ?: NextImageProps['src']|null, // changed to optional
    
    
    
    // accessibilities:
    title                 ?: string
    label                 ?: string
    labelNoImage          ?: string
    labelLoading          ?: string
    labelError            ?: string
    
    
    
    // components:
    imageComponent        ?: React.ReactElement<NextImageProps>
    noImageComponent      ?: React.ReactElement<React.HTMLAttributes<HTMLElement>>
    loadingImageComponent ?: React.ReactElement<React.HTMLAttributes<HTMLElement>>
    /**
     * @deprecated Renamed to `loadingImageComponent`
     */
    busyComponent         ?: React.ReactElement<React.HTMLAttributes<HTMLElement>>
    errorImageComponent   ?: React.ReactElement<React.HTMLAttributes<HTMLElement>>
}
const Image = <TElement extends Element = HTMLElement>(props: ImageProps<TElement>) => {
    // props:
    const {
        // refs:
        elmRef,
        
        
        
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
        
        
        
        // styles:
        style,
        
        
        
        // accessibilities:
        title,
        label               = alt,
        labelNoImage        = 'No image',
        labelLoading        = 'Loading image',
        labelError          = 'Error loading image',
        
        
        
        // behaviors:
        loading,
        priority,
        fetchPriority,
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
        // @ts-ignore
        onLoadingComplete,
        
        
        
        // components:
        // @ts-ignore
        imageComponent        = (<NextImage                          /> as React.ReactElement<NextImageProps>),
        noImageComponent      = (<Icon icon='image'        size='lg' /> as React.ReactElement<React.HTMLAttributes<HTMLElement>>),
        busyComponent         = (<Busy                     size='lg' /> as React.ReactElement<React.HTMLAttributes<HTMLElement>>),
        loadingImageComponent = busyComponent,
        errorImageComponent   = (<Icon icon='broken_image' size='lg' /> as React.ReactElement<React.HTMLAttributes<HTMLElement>>),
        
        
        
        // handlers:
        onLoad,
        onLoadCapture,
        onError,
        onErrorCapture,
        
        
        
        // other props:
        ...restImageProps
    } = props;
    
    
    
    // features:
    const {imageVars} = usesImage();
    
    
    
    // styles:
    const styles = useImageStyleSheets();
    
    const intrinsicStyle = useMemo<React.CSSProperties>(() => ({
        [
            imageVars.intrinsicWidth
            .slice(4, -1) // fix: var(--customProp) => --customProp
        ]  : ((width !== undefined) ? `${width }px` : 'unset'),
        
        [
            imageVars.intrinsicHeight
            .slice(4, -1) // fix: var(--customProp) => --customProp
        ] : ((height !== undefined) ? `${height}px` : 'unset'),
    }), [width, height]);
    const mergedStyle = useMergeStyles(
        // styles:
        intrinsicStyle,
        
        
        
        // preserves the original `style` from `props` (can overwrite the `intrinsicStyle`):
        style,
    );
    
    
    
    // states:
    const [state, setState] = useState<boolean|0|null>((): 0|null => {
        const realSrc = getRealSrc(src);
        /*
        * no image  => show empty indicator.
        * has image => show loading indicator => then onLoad => true => show the image
        */
        return !realSrc ? 0 : null; // 0 => no image; null => loading
    });
    
    
    
    // handlers:
    const handleErrorInternal = useEvent<React.ReactEventHandler<HTMLImageElement>>(() => {
        setState(false); // error => false
    });
    const handleError         = useMergeEvents(
        // preserves the original `onError`:
        onError,
        
        
        
        // handlers:
        handleErrorInternal,
    );
    
    const handleLoadInternal  = useEvent<React.ReactEventHandler<HTMLImageElement>>(() => {
        setState(true); // loaded => true
    });
    const handleLoad          = useMergeEvents(
        // preserves the original `onLoad`:
        onLoad,
        
        
        
        // handlers:
        handleLoadInternal,
    );
    
    
    
    // effects:
    const prevSrcRef = useRef<typeof src>(src);
    useIsomorphicLayoutEffect(() => { // needs a fast resetter before `onError|onLoad` runs
        // conditions:
        if (prevSrcRef.current === src) return; // exact the same => ignore
        const prevSrc = prevSrcRef.current;
        const realPrevSrc = getRealSrc(prevSrc);
        const realSrc     = getRealSrc(src);
        if (realPrevSrc === realSrc) return; // not the same but equivalent of src => ignore
        prevSrcRef.current = src; // sync
        
        
        
        // resets:
        setState(
            /*
            * no image  => show empty indicator.
            * has image => show loading indicator => then onLoad => true => show the image
            */
            !realSrc ? 0 : null // 0 => no image; null => loading
        );
    }, [src]);
    
    
    
    /*
        I created an image component, let's say <ImageWithStatus src='...' /> that something like this:
        ```ts
        return (
            <div className='wrapper'>
                <img className='image' ... />
                {(state === 'loading') && <span className='busy'>...</span>}
                {(state === 'error  ') && <span className='error'>...</span>}
            </div>
        );
        ```
        
        Initially the wrapper was made from <figure>, but then i changed it to <div>
        because when the <ImageWithStatus/> placed in <p>, i got a console error:
        "Warning: In HTML, <figure> cannot be a descendant of <p>".
        
        I want my <ImageWithStatus/> behave like a regular <img/>.
        The wrapper is required for easily centering the loading and error indicator at the center of image.
        
        The question is: what's the appropriate role and aria attributes for my component above?
        Can you fix it with semantically better? Is there a more appropriate tag other than
        <div role='...'>?
        
        
        
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
    
    
    
    // default props:
    const {
        // semantics:
        tag                      = 'span', // use <span> instead of <div> so, the <Image> can be placed inside <p> without any issue
        role                     = 'img',
        'aria-label' : ariaLabel = (() => {
            switch (state) {
                case 0     : return labelNoImage;
                case null  : return labelLoading;
                case false : return labelError;
                default    : return label;
            } // switch
        })(),
        'aria-busy'  : ariaBusy  = (state === null),
        'aria-live'  : ariaLive  = (state === false) ? 'assertive' : 'off',
        
        
        
        // classes:
        mainClass                = styles.main,
        
        
        
        // other props:
        ...restGenericProps
    } = restImageProps satisfies NoForeignProps<typeof restImageProps, GenericProps<TElement>>;
    
    const {
        // semantics:
        role      : noImageComponentRole           = 'presentation',
        
        
        
        // classes:
        className : noImageComponentClassName      = 'status',
        
        
        
        // other props:
        ...restNoImageComponentProps
    } = noImageComponent.props;
    
    const {
        // semantics:
        role      : loadingImageComponentRole      = 'presentation',
        
        
        
        // classes:
        className : loadingImageComponentClassName = 'status',
        
        
        
        // other props:
        ...restLoadingImageComponentProps
    } = loadingImageComponent.props;
    
    const {
        // semantics:
        role      : errorImageComponentRole        = 'presentation',
        
        
        
        // classes:
        className : errorImageComponentClassName   = 'status',
        
        
        
        // other props:
        ...restErrorImageComponentProps
    } = errorImageComponent.props;
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // semantics:
            tag={tag}
            role={role}
            aria-label={ariaLabel}
            aria-busy={ariaBusy}
            aria-live={ariaLive}
            
            
            
            // accessibilities:
            // @ts-ignore
            title={title}
            
            
            
            // classes:
            mainClass={mainClass}
            
            
            
            // styles:
            style={mergedStyle}
        >
            {/* show the progressing_image or loaded_image */}
            {((state === null) || (state === true)) && React.cloneElement<NextImageProps>(imageComponent,
                // props:
                {
                    // refs:
                    ref               : elmRef,
                    
                    
                    
                    // appearances:
                    alt               : alt,
                    src               : src ?? undefined,
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
                    fetchPriority     : fetchPriority,
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
                    // @ts-ignore
                    onLoadingComplete : onLoadingComplete,
                    
                    
                    
                    // handlers:
                    onLoad            : handleLoad,
                    onLoadCapture     : onLoadCapture,
                    onError           : handleError,
                    onErrorCapture    : onErrorCapture,
                },
            )}
            
            {/* no image => show default image: */}
            {(state === 0) && React.cloneElement<React.HTMLAttributes<HTMLElement>>(noImageComponent,
                // props:
                {
                    // other props:
                    ...restNoImageComponentProps,
                    
                    
                    
                    // semantics:
                    role      : noImageComponentRole,
                    
                    
                    
                    // classes:
                    className : noImageComponentClassName,
                },
            )}
            
            {/* loading: */}
            {(state === null)  && React.cloneElement<React.HTMLAttributes<HTMLElement>>(loadingImageComponent,
                // props:
                {
                    // other props:
                    ...restLoadingImageComponentProps,
                    
                    
                    
                    // semantics:
                    role      : loadingImageComponentRole,
                    
                    
                    
                    // classes:
                    className : loadingImageComponentClassName,
                },
            )}
            
            {/* error: */}
            {(state === false) && React.cloneElement<React.HTMLAttributes<HTMLElement>>(errorImageComponent,
                // props:
                {
                    // other props:
                    ...restErrorImageComponentProps,
                    
                    
                    
                    // semantics:
                    role      : errorImageComponentRole,
                    
                    
                    
                    // classes:
                    className : errorImageComponentClassName,
                },
            )}
        </Generic>
    );
};
export {
    Image,            // named export for readibility
    Image as default, // default export to support React.lazy
}
