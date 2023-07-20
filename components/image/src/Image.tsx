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

// nextJS:
import * as nextImageCommonJs from 'next/image.js' // a commonJS module
const NextImage : typeof nextImageCommonJs.default = (nextImageCommonJs.default as any).default ?? nextImageCommonJs.default; // a *hack* for importing from commonJS module



// styles:
export const useImageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/style.js')
, { id: 'm91zb0019e', specificityWeight: 0 }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



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
    src ?: NextImageProps['src'], // changed to optional
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
        sizes = (width !== undefined) ? `${width}px` : undefined, // a hack for fixing auto_image_size problem when no using [sizes] prop (using [width] & [height] props)
        fill  = !width && !height,
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
        
        
        
        // handlers:
        onLoad,
        onLoadCapture,
        onError,
        onErrorCapture,
        onLoadingComplete,
    ...restGenericProps} = props;
    
    
    
    // states:
    const [isLoaded, setIsLoaded] = useState<boolean|undefined>(undefined);
    
    
    
    // dom effects:
    const prevSrcRef = useRef<typeof src>(src);
    useIsomorphicLayoutEffect(() => { // needs a fast resetter before `onError|onLoadingComplete` runs
        // conditions:
        if (prevSrcRef.current === src) return; // exact the same => ignore
        const prevSrc = prevSrcRef.current;
        const realPrevSrc = (
            !prevSrc
            ? undefined
            : (typeof(prevSrc) === 'string')
                ? prevSrc
                : ('default' in prevSrc)
                    ? prevSrc.default.src
                    : prevSrc.src
        );
        const realSrc = (
            !src
            ? undefined
            : (typeof(src) === 'string')
                ? src
                : ('default' in src)
                    ? src.default.src
                    : src.src
        );
        if (realPrevSrc === realSrc) return; // not the same but equivalent of src => ignore
        prevSrcRef.current = src; // sync
        
        
        
        // resets:
        setIsLoaded(undefined);
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
            {/* no image => show default image: */}
            {(!src) && <Icon className='status' icon='image' theme='primary' size='lg' />}
            
            {/* loading: */}
            {(isLoaded === undefined) && <Busy className='status' theme='primary' size='lg' />}
            
            {/* error: */}
            {(isLoaded === false    ) && <Icon className='status' icon='broken_image' theme='primary' size='lg' />}
            
            {src && (isLoaded !== false) && <NextImage
                // appearances:
                alt={alt}
                src={src}
                loader={loader}
                width={width}
                height={height}
                sizes={sizes}
                fill={fill}
                placeholder={placeholder}
                blurDataURL={blurDataURL}
                
                
                
                // behaviors:
                loading={loading}
                priority={priority}
                quality={quality}
                unoptimized={unoptimized}
                
                
                
                // <img>:
                crossOrigin={crossOrigin}
                decoding={decoding}
                referrerPolicy={referrerPolicy}
                useMap={useMap}
                
                
                
                // deprecated:
                // @ts-ignore
                layout={layout}
                // @ts-ignore
                objectFit={objectFit}
                // @ts-ignore
                objectPosition={objectPosition}
                // @ts-ignore
                lazyBoundary={lazyBoundary}
                // @ts-ignore
                lazyRoot={lazyRoot}
                
                
                
                // handlers:
                onLoad={onLoad}
                onLoadCapture={onLoadCapture}
                onError={handleError}
                onErrorCapture={onErrorCapture}
                onLoadingComplete={handleLoadingComplete}
            />}
        </Generic>
    );
}
export {
    Image,
    Image as default,
}
