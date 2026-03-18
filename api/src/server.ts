import app from './app';
import { env } from './config/env';
import prisma from './config/prisma';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(
    `\nThe Wild Oasis API running on http://localhost:${PORT} [${env.NODE_ENV}]\n`,
  );
});

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully…`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed. Process terminated.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
  shutdown('UNHANDLED_REJECTION');
});

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});
