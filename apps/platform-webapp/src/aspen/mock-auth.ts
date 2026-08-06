import { env } from "@/env";

export function isAuthMock(): boolean {
  return env.AUTH_MOCK;
}

function iso(daysFromNow: number): Date {
  return new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
}

const mockUser = {
  banExpires: undefined,
  banned: false,
  banReason: undefined,
  createdAt: iso(-30),
  displayUsername: undefined,
  email: "admin@example.com",
  emailVerified: true,
  id: "mock-user-id",
  image: undefined,
  name: "Mock Admin",
  phoneNumber: undefined,
  phoneNumberVerified: undefined,
  role: "platform_admin",
  twoFactorEnabled: false,
  updatedAt: iso(-1),
  username: undefined,
};

const mockSession = {
  createdAt: iso(-1),
  expiresAt: iso(7),
  id: "mock-session-id",
  impersonatedBy: undefined,
  ipAddress: "127.0.0.1",
  token: "mock-session-token",
  updatedAt: iso(-1),
  userAgent: "ohmypi",
  userId: "mock-user-id",
};

export function getMockSession() {
  return { session: mockSession, user: mockUser };
}
