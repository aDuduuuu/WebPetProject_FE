export const formatCurrency = (amount) => {
    return `${amount?.toFixed(2) || 0} USD`;
};
export const formatDay = (date) => {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(date));
};
