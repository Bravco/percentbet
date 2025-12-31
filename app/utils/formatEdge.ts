export default (chance: number) => {
  const value = 100 - Math.round(chance * 100);
  return value <= 0 ? ">1%" : `+${value}%`;
};