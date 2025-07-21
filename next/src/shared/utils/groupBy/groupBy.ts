export const groupBy = <T, K extends keyof T>(
  arr: T[],
  key: (i: T) => K,
): Record<K, T[]> =>
  arr.reduce(
    (groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
