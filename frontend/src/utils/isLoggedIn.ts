export function isLoggedIn() {
  const expiredAt = localStorage.getItem("expired_at")
  return new Date().getTime() < parseInt(expiredAt || "0")
}
