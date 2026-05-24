/** Cookie settings for auth tokens (local dev vs production / cross-origin). */
export function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  const sameOriginDeploy = process.env.SERVE_FRONTEND === "true";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd && !sameOriginDeploy ? "none" : "lax",
  };
}

export function getClientOrigin() {
  return process.env.CLIENT_ORIGIN || "http://localhost:5173";
}
