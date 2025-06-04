export interface JwtPayload {
  email: string;
  sub: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}
