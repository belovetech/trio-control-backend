export const formatResponse = (
  statusCode: number,
  response: Record<string, unknown>,
) => {
  return {
    statusCode,
    body: response,
  };
};
