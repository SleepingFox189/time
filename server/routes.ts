import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // This is a static website, so we only need to serve static files
  // The frontend will be served by the server/vite.ts file
  
  // Simple health check API endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
