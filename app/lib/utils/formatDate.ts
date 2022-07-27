const formatDate = (date: string | number | Date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  // @ts-ignore
  const now = new Date(date).toLocaleDateString("en-US", options);

  return now;
};

export default formatDate;
