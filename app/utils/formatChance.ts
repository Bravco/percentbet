export default (chance: number) => {
  const value = Math.round(chance * 100);
  return value <= 0 ? ">1%" : `${value}%`;
};