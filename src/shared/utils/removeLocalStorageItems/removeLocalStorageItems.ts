import { STORAGE_KEYS } from "@/shared/constants/auth.constants";

export const removeLocalStorageItems = (
  excludedItems: Array<(typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]> = [],
): void => {
  Object.values(STORAGE_KEYS).forEach((storageKey) => {
    if (excludedItems.includes(storageKey)) {
      return;
    }
    localStorage.removeItem(storageKey);
  });
};
