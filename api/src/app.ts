import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import { env, isDev } from "./config/env";
import { swaggerDocument } from "./config/swagger";
import { globalErrorHandler } from "./middleware/errorHandler";
import { AppError } from "./utils/AppError";
import authRoutes from "./routes/authRoutes";
import cabinRoutes from "./routes/cabinRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import guestRoutes from "./routes/guestRoutes";
import settingsRoutes from "./routes/settingsRoutes";

const app = express();

app.use("/api-docs", helmet({ contentSecurityPolicy: false }));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: env.CORS_ORIGINS,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message:
      "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

app.use("/api/", apiLimiter);
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/signup", authLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

if (isDev) app.use(morgan("dev"));

app.use("/public", express.static(path.join(process.cwd(), "public")));

if (isDev) {
  const swaggerServe = swaggerUi.serve as unknown as express.RequestHandler[];
  const swaggerSetup = swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "Wild Oasis API Docs",
    swaggerOptions: { persistAuthorization: true },
  }) as unknown as express.RequestHandler;
  app.use("/api/docs", swaggerServe, swaggerSetup);
}

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cabins", cabinRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/guests", guestRoutes);
app.use("/api/v1/settings", settingsRoutes);

app.all("*", (req, _res, next) => {
  next(
    new AppError(
      `Can't find ${req.method} ${req.originalUrl} on this server.`,
      404,
    ),
  );
});

app.use(globalErrorHandler);

export default app;
