// Safe placeholder - Supabase disabled (no dependency required)
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    signInWithPassword: async () => ({ data: null, error: null }),
    signUp: async () => ({ data: null, error: null }),
    signOut: async () => {},
  },
  from: () => ({
    insert: async () => ({ data: null, error: null }),
    select: () => ({
      eq: async () => ({ data: [] }),
    }),
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
    }),
  },
};