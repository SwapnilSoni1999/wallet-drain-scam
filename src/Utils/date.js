export const unixStamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const humanDateFormat = date.toLocaleString();
  return humanDateFormat;
};
