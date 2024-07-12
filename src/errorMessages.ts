export interface IErrorMessage {
  userMessage: string;
}

export const errorMessages: IErrorMessage[] = [
  {
    userMessage: 'User rejected request',
  },
  {
    userMessage: 'User closed login window',
  },
  {
    userMessage: 'Connection request reset. Please try again',
  },
];
