// Descriptive error messages for various input validation errors
export enum InputErrorMessage {
  INVALID_PASSWORD = 'Password must have 6-61 characters',
  INVALID_EMAIL = 'Invalid email addresss',
  PASSWORD_MISMATCH = 'Passwords do not match',
  MISSING_INPUT = 'Missing input',
}

export const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
export const passwordRegex = /^[a-zA-Z0-9!?$%^*)(+=._-]{6,61}$/g;
export const nameRegex = /^[a-z ,.'-]+/i;
