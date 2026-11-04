import { getRequest } from "@tanstack/react-start/server";

type CloudflareRequest = Request & {
  runtime?: {
    cloudflare?: {
      env?: Record<string, unknown>;
    };
  };
};

export function getServerEnvironmentVariable(name: string): string | undefined {
  const request = getRequest() as CloudflareRequest;
  const binding = request.runtime?.cloudflare?.env?.[name];
  if (typeof binding === "string") return binding;
  const runtimeValue = typeof process !== "undefined" ? process.env[name] : undefined;
  if (runtimeValue) return runtimeValue;

  if (name === "SUPABASE_URL") return import.meta.env["VITE_SUPABASE_URL"];
  if (name === "SUPABASE_PUBLISHABLE_KEY") return import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  return undefined;
}
