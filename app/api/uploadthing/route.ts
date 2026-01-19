import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // config: { ... } // Não precisa configurar token aqui, ele lê do .env automaticamente
});