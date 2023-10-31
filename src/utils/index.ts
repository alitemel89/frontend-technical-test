export const formatLabel = (label: string) => {
  // Remove underscores and capitalize each word
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
