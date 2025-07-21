import { ReactElement } from "react";
import { Footnote } from "../../typography";
import { classNames } from "@/shared/utils/classNames";
import { getErrorMessage } from "../lib/utils";

export type ErrorMessage = string | boolean;
interface HelperTextProps {
  disabled?: boolean;
  footnote?: string;
  error?: ErrorMessage;
  className?: string;
}

export const HelperText = ({
  footnote,
  error,
  disabled,
}: HelperTextProps): ReactElement | null => {
  const footnoteStyles = classNames(
    "ml-4 mt-1 text-label text-supplementary-600",
    {
      "text-red-400": error,
      "peer-hover:text-red-900": error,
      "peer-focus:text-red-900": error,
      "peer-hover:text-supplementary-800": !error,
      "peer-focus:text-supplementary-800": !error,
    },
  );

  if (disabled || typeof error === "boolean" || (!error && !footnote)) {
    return null;
  }

  const errorMessage = getErrorMessage(error);

  return (
    <Footnote className={footnoteStyles}>{errorMessage ?? footnote}</Footnote>
  );
};
