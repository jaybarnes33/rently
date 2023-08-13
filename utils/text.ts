export const capitalise = (text: string) => {
  return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
};

export const rentify = (text: string) => {
  return capitalise(text.toLowerCase().replaceAll("hostel", "Apartments"));
};
