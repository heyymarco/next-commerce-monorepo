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
    authConfigServer,
}                           from '@/../auth.config.server'
import {
    credentialsConfigServer,
}                           from '@/../credentials.config.server'



const authRouteHandler = createAuthRouteHandler({
    adapter                 : PrismaAdapterWithCredentials(prisma),
    authConfigServer        : authConfigServer,
    credentialsConfigServer : credentialsConfigServer,
})
export {
    authRouteHandler as GET,
    authRouteHandler as POST,
    authRouteHandler as PATCH,
    authRouteHandler as PUT,
};
