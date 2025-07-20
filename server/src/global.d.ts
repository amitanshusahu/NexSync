import { UserJwtPayload } from "./lib/middleware/verifyAuth";


declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}