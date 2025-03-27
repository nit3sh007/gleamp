export const formatDate = (utcTime) => {
    return new Date(utcTime).toLocaleString(undefined, {
      timeZoneName: "short",
    });
  };
  