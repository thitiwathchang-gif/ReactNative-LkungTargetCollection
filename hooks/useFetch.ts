import { getStorageData, setStorageData } from "@/services/storage";
import { useEffect, useState } from "react";

type UseFetchOptions = {
  cacheKey?: string;
  cacheDuration?: number; // in milliseconds
};

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions = {},
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { cacheKey, cacheDuration = 5 * 60 * 1000 } = options; // default 5 minutes

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get cached data first
        if (cacheKey) {
          const cached = await getStorageData(cacheKey);
          if (cached) {
            const { data: cachedData, timestamp } = cached;
            const isStale = Date.now() - timestamp > cacheDuration;

            if (!isStale) {
              if (isMounted) {
                setData(cachedData);
                setLoading(false);
              }
              return;
            }
          }
        }

        // Fetch fresh data
        const result = await fetchFn();

        if (isMounted) {
          setData(result);

          // Cache the result
          if (cacheKey) {
            await setStorageData(cacheKey, {
              data: result,
              timestamp: Date.now(),
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchFn, cacheKey, cacheDuration]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFn();
      setData(result);

      // Cache the result
      if (cacheKey) {
        await setStorageData(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}
