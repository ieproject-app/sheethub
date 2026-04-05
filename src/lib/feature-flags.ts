const asBoolean = (value: string | undefined, fallback = false) => {
  if (!value) return fallback;
  return value.toLowerCase() === "true";
};

export const FEATURE_FLAGS = {
  loginEnabled: asBoolean(process.env.NEXT_PUBLIC_ENABLE_LOGIN, false),
} as const;
