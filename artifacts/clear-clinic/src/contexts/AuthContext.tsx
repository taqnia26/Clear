import { createContext, useContext, useState, ReactNode } from "react";

interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: "superadmin" | "admin" | "receptionist";
}

interface AuthContextType {
  user: AdminUser | null;
  setUser: (user: AdminUser | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
