export interface AuthUser {
  id: string;
  name: string;
  email: string;
  /** Optional URL; mock auth leaves this undefined. */
  avatarUrl?: string;
}

export interface AuthSession {
  user: AuthUser;
  /** Opaque token — mock auth generates a random string; real auth holds a JWT/cookie reference. */
  token: string;
  /** Unix seconds; used by real auth to refresh before expiry. */
  issuedAt: number;
}

export interface AuthContextValue {
  session: AuthSession | null;
  /** True until the provider has finished reading localStorage on the client. */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  /** Patch the current user; no-op when signed out. */
  updateUser: (patch: Partial<Pick<AuthUser, "name" | "email" | "avatarUrl">>) => void;
}
