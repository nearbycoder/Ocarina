import { defineConfig } from "vite";
// To reach the dev server through another hostname, list it in
// BELL_ALLOWED_HOSTS (comma-separated), e.g. BELL_ALLOWED_HOSTS=my-host.local.
const allowedHosts = process.env.BELL_ALLOWED_HOSTS?.split(",")
  .map((host) => host.trim())
  .filter(Boolean);
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5174,
    ...(allowedHosts?.length ? { allowedHosts } : {}),
  },
  build: { chunkSizeWarningLimit: 700 },
});
