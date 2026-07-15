export const getSafeArray = (res) => {
  return Array.isArray(res?.data?.data?.data)
    ? res.data.data.data
    : Array.isArray(res?.data?.data)
    ? res.data.data
    : Array.isArray(res?.data)
    ? res.data
    : [];
};