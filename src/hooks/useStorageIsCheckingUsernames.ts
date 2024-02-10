import { useCallback, useEffect, useState } from "react";

export const useStorageIsCheckingUsernames = () => {
  const [isCheckingUsernames, setIsCheckingUsernames] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getDataFromStorage = useCallback(() => {
    chrome.storage.local.get(["isCheckingUsernames"], (result) => {
      if (result.isCheckingUsernames) {
        setIsCheckingUsernames(result.isCheckingUsernames);
      }
      setIsLoading(false);
    });
  }, []);

  const setDataFromStorage = useCallback((value: boolean) => {
    setIsLoading(true);

    // setTimeout is to prevent user click madness
    setTimeout(() => {
      chrome.storage.local.set({ isCheckingUsernames: value }, () => {
        setIsCheckingUsernames(value);

        setIsLoading(false);
      });
    }, 1000);
  }, []);

  useEffect(() => {
    getDataFromStorage();
  }, [getDataFromStorage]);

  return {
    isCheckingUsernames,
    setIsCheckingUsernames: setDataFromStorage,
    isLoading,
  };
};
