// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useSelectDropdownEditorItemStyleSheet,
}                           from './styles/loader.js'

// reusable-ui components:
import {
    // layout-components:
    useListActionItemStyleSheet,
    
    useListState,
    
    type ListItemProps,
    ListItem,
    type ListItemComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content

// internal components:
import {
    type RadioDecoratorProps,
    RadioDecorator,
    
    type RadioDecoratorComponentProps,
}                           from '@/components/RadioDecorator'



// react components:
export interface SelectDropdownEditorItemProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>,
        ListItemComponentProps<TElement>,
        
        // components:
        RadioDecoratorComponentProps
{
}
const SelectDropdownEditorItem = <TElement extends Element = HTMLElement>(props: SelectDropdownEditorItemProps<TElement>): JSX.Element|null => {
    // states:
    const {
        // behaviors:
        defaultActionCtrl,
    } = useListState();
    
    
    
    // props:
    const {
        // behaviors:
        actionCtrl              = defaultActionCtrl,
        
        
        
        // components:
        listItemComponent       = (<ListItem />       as React.ReactElement<ListItemProps<TElement>>),
        radioDecoratorComponent = (<RadioDecorator /> as React.ReactElement<RadioDecoratorProps<Element>>),
        
        
        
        // children:
        children,
        
        
        
        // other props:
        ...restSelectDropdownEditorItemProps
    } = props;
    
    
    
    // styles:
    const styleSheet       = useSelectDropdownEditorItemStyleSheet();
    const actionStyleSheet = useListActionItemStyleSheet();
    
    
    
    // default props:
    const {
        // classes:
        mainClass = (
            actionCtrl
            ? `${styleSheet.main} ${actionStyleSheet.main}` // defaults to internal styleSheet
            : styleSheet.main                               // defaults to internal styleSheet
        ),
        
        
        
        // other props:
        ...restListItemProps
    } = restSelectDropdownEditorItemProps;
    
    const {
        // classes:
        className : radioDecoratorClassName = 'indicator', // defaults to 'indicator'
        
        
        
        // other props:
        ...restRadioDecoratorComponentProps
    } = radioDecoratorComponent?.props ?? {};
    
    
    
    // jsx:
    return React.cloneElement<ListItemProps<TElement>>(listItemComponent,
        // props:
        {
            // other props:
            ...restListItemProps,
            ...listItemComponent.props, // overwrites restListItemProps (if any conflics)
            
            
            
            // classes:
            mainClass : mainClass,
        },
        
        
        
        // children:
        (!!radioDecoratorComponent && React.cloneElement<RadioDecoratorProps<Element>>(radioDecoratorComponent,
            // props:
            {
                // other props:
                ...restRadioDecoratorComponentProps,
                
                
                
                // classes:
                className : radioDecoratorClassName,
            },
        )),
        children,
    );
};
export {
    SelectDropdownEditorItem,            // named export for readibility
    SelectDropdownEditorItem as default, // default export to support React.lazy
}
