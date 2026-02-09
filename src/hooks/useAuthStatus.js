import { useCallback, useEffect, useState } from "react";
import { fetchMe } from "../api/user.api";

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMe();
      setLoggedIn(Boolean(data?.loggedIn));
      setUser(data?.user || null);
    } catch (err) {
      console.error("Auth check failed", err);
      setLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loggedIn, user, loading, refresh };
};
