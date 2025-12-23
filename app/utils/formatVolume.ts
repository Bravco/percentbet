export default (volume: number) => {
    return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(volume) + " Vol.";
};