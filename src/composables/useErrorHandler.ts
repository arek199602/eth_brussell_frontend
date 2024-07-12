import { Notify } from 'quasar';
import { errorMessages } from 'src/errorMessages';

interface Options {
  group?: boolean;
  badgeClass?: string;
}

/**
 * Finds the appropriate error message based on the given error and custom message.
 * If no matching error message is found, returns the custom message.
 * If no custom message is provided, returns a generic error message.
 *
 * @param {Error} error - The error object that occurred.
 * @param customMessage - The custom error message to be used.
 * @returns {string} The chosen error message.
 */
const _chooseErrorMessage = (error: Error | null, customMessage = ''): string => {
  return (
    errorMessages.find((e) => error?.message?.includes(e.userMessage))?.userMessage ||
    customMessage ||
    'Something went wrong. Please try again later.'
  );
};

/**
 * Handles error by displaying a notification and logging the error to the console.
 *
 * @param {Error} error - The error to handle.
 * @param customMessage
 * @param options
 * @returns {void}
 */
export const useErrorHandler = (
  error: Error | null,
  customMessage = '',
  options: Options = {}
): void => {
  const message = _chooseErrorMessage(error, customMessage);

  Notify.create({
    color: 'negative',
    position: 'top',
    message,
    icon: 'report_problem',
    ...options,
  });
  console.error(error);
};
