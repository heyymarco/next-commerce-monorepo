// heymarco components:
import {
    createAuthRouteHandler,
    PrismaAdapterWithCredentials,
}                           from '@heymarco/next-auth/server'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// configs:
import {
    authConfig,
}                           from '@/../auth.config.server'
import {
    credentialsConfig,
}                           from '@/../credentials.config'



const authRouteHandler = createAuthRouteHandler({
    adapter           : PrismaAdapterWithCredentials(prisma),
    authConfig        : authConfig,
    credentialsConfig : credentialsConfig,
})
export {
    authRouteHandler as GET,
    authRouteHandler as POST,
    authRouteHandler as PATCH,
};
