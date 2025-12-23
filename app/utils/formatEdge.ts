export default (chance: number) => {
    return `+${100 - Math.round(chance*100)}%`;
};