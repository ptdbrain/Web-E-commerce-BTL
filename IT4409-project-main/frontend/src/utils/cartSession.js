export const shouldHydrateStoredCart = (token) => !String(token || "").trim();

export const getCartSessionTransition = (previousUserId, nextUserId) => {
  const previous = String(previousUserId || "");
  const next = String(nextUserId || "");

  if (!previous && next) return "merge-guest";
  if (previous !== next) return "clear";
  return "keep";
};

export const getStoredUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return String(user?._id || user?.id || "");
  } catch {
    return "";
  }
};
