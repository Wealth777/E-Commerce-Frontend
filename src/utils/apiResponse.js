export const getPayload = (response, fallback = null) => {
  const body = response?.data ?? response;

  if (body?.data !== undefined) return body.data;
  if (body?.payload !== undefined) return body.payload;
  if (body?.result !== undefined) return body.result;

  return body ?? fallback;
};

export const getMessage = (error, fallback = 'Something went wrong') => {
  const body = error?.response?.data;

  return (
    body?.message ||
    body?.error ||
    body?.errors?.[0]?.message ||
    error?.message ||
    fallback
  );
};

export const getList = (response, keys = []) => {
  const payload = getPayload(response, response);

  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    const value = payload?.[key] ?? response?.data?.[key];
    if (Array.isArray(value)) return value;
  }

  return [];
};

export const getTokenFromResponse = (response) => {
  const payload = getPayload(response, {});
  const body = response?.data || {};

  return payload?.token || body?.token || payload?.accessToken || body?.accessToken || null;
};

export const getUserFromResponse = (response) => {
  const payload = getPayload(response, {});

  return payload?.user || payload?.account || payload?.profile || payload || null;
};

export const getCartItems = (response) => {
  const payload = getPayload(response, {});
  return payload?.items || payload?.cart?.items || response?.data?.items || [];
};
