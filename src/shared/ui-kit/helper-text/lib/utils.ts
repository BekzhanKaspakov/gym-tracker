import { ErrorMessage } from "../ui/helper-text";

export const getErrorMessage = (
  error?: Exclude<ErrorMessage, boolean>,
): null | string => {
  if (!error) return null;

  return error;
};
