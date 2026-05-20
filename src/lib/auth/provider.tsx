"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  organization_id: string | null;
  role: "admin" | "agent";
  full_name: string | null;
  avatar_url: string | null;
}

interface OrgInfo {
  id: string;
  name: string;
  city: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  org: OrgInfo | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  org: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [org, setOrg] = useState<OrgInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        if (profileData?.organization_id) {
          const { data: orgData } = await supabase
            .from("organizations")
            .select("id, name, city")
            .eq("id", profileData.organization_id)
            .single();

          setOrg(orgData);
        }
      }

      setLoading(false);
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, profile, org, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
