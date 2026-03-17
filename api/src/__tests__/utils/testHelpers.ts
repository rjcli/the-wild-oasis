import { Request, Response, NextFunction } from 'express';

/**
 * Helper to execute catchAsync-wrapped handlers and await their completion.
 * Since catchAsync handlers run asynchronously, this helper allows tests to await them properly.
 */
export async function executeHandler(
  handler: (req: Request, res: Response, next: NextFunction) => void,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // Call the handler (which is the catchAsync wrapper)
  handler(req, res, next);

  // Allow all pending microtasks to complete (including the async handler and its awaited promises)
  await new Promise((resolve) => {
    // Use setImmediate to ensure all async/await chains complete
    setImmediate(resolve);
  });
}
