// next-js:
// import {
//     type NextConfig,
// }                           from 'next'
// import {
//     withBundleAnalyzer,
// }                           from '@next/bundle-analyzer'



/** @type {import('next').NextConfig} */
const nextConfig /* : NextConfig */ = {
    experimental: {
        // appDir       : true,
        // esmExternals : 'loose',
    },
    
    reactStrictMode : false,
    // swcMinify       : false,
    
    // webpack: (config) => {
    //     config.experiments = {
    //         ...config.experiments,
    //         // ...{ topLevelAwait: true }
    //     }
    //     return config
    // },
}



// export default withBundleAnalyzer(nextConfig);
export default nextConfig;
