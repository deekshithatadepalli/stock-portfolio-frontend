export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const handleApiError = (error) => {
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'An unexpected error occurred' };
};