import { default as React, useContext, useMemo } from 'react'
import { ArticleContext, IArticleContext } from './GenericSection.js';
import { Section, SectionProps } from './Section.js';



export interface HeroSectionProps extends SectionProps {
}
export const HeroSection = (props: HeroSectionProps) => {
    // contexts:
    const { level } = useContext(ArticleContext);
    
    
    
    // jsx:
    const supContextProp = useMemo<IArticleContext>(() => ({
        level: Math.max(1, level - 1), // limits the level to min 1
    }), [level]);
    return (
        /* move-up the level of `ArticleContext` */
        <ArticleContext.Provider value={supContextProp}>
            <Section {...props} />
        </ArticleContext.Provider>
    );
}
