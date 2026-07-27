export function isPortalSessionMissingError(error) {
  if (!error) {
    return false;
  }

  return (
    error.name === "AuthSessionMissingError" ||
    error.code === "session_not_found" ||
    error.message?.toLowerCase().includes("auth session missing")
  );
}
