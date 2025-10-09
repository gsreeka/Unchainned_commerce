import Fastify from "fastify";
import { startPlatform } from "@unchainedshop/platform";
import {
  connect,
  unchainedLogger,
} from "@unchainedshop/api/lib/fastify/index.js";
import defaultModules from "@unchainedshop/plugins/presets/all.js";
import connectDefaultPluginsToFastify from "@unchainedshop/plugins/presets/all-fastify.js";
import { connectChat, fastifyRouter } from '@unchainedshop/admin-ui/fastify';
import { openai } from '@ai-sdk/openai';
import jwt from "jsonwebtoken";
import type { JwtHeader, SigningKeyCallback } from "jsonwebtoken"
import jwksClient from "jwks-rsa";


const fastify = Fastify({
  loggerInstance: unchainedLogger("fastify"),
  disableRequestLogging: true,
  trustProxy: true,
});

try {
  const platform = await startPlatform({
    modules: defaultModules,
    healthCheckEndpoint: "/.well-known/yoga/server-health",
  });

  connect(fastify, platform, {
    allowRemoteToLocalhostSecureCookies: process.env.NODE_ENV !== "production",
  });

  connectDefaultPluginsToFastify(fastify, platform);

  // This is an example of an AI provider, you can configure OPENAI_API_KEY through railway or locally to enable the Copilot chat features.
  if (process.env.OPENAI_API_KEY) {
    connectChat(fastify, {
      model: openai('gpt-4-turbo'),
      imageGenerationTool: { model: openai.image('gpt-image-1') },
    });
  }

  fastify.addHook("onRequest", (request, reply, done) => {
    const clientId = process.env.AZURE_AD_AUDIENCE;
    const tenantId = process.env.AZURE_TENANT_ID;
    if (!clientId || !tenantId) {
      return done();
    }

    try {
      const authHeader = request.headers.authorization || request.headers.Authorization;
      if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        reply.code(401).send({ error: 'Missing or invalid Authorization header' });
        return;
      }
      const token = authHeader.substring('Bearer '.length);
      const audience = clientId
      const issuer = process.env.AZURE_AD_TOKEN_ISSUER
      const jwksUri = `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;
      const client = jwksClient({
        jwksUri,
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 600000
      });

      function getKey(header: JwtHeader, callback: SigningKeyCallback) {
        client.getSigningKey(header.kid!, (err, key) => {
          if (err) return callback(err as any, undefined);
          const pub = key?.getPublicKey();
          callback(null, pub);
        });
      }

      jwt.verify(
        token,
        getKey,
        { audience: audience, issuer},
        (err, decoded) => {
          if (err) reply.code(500).send({ error: 'Token validation failure' });
          if (decoded) done()
        }
      );
    } catch (err: any) {
      fastify.log.error({ err }, 'Error validating Azure AD token');
      reply.code(500).send({ error: 'Token validation failure' });
    }
  })

  fastify.register(fastifyRouter, {
    prefix: "/",
  });

  await fastify.listen({
    host: "::",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
