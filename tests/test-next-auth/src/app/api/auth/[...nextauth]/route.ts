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
    credentialsConfigServer,
}                           from '@/../credentials.config.server'



const authRouteHandler = createAuthRouteHandler({
    adapter           : PrismaAdapterWithCredentials(prisma),
    authConfig        : authConfig,
    credentialsConfig : credentialsConfigServer,
})
export {
    authRouteHandler as GET,
    authRouteHandler as POST,
    authRouteHandler as PATCH,
    authRouteHandler as PUT,
};
