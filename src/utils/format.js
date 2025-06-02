export const formatCurrency = (amount) => {
    if (typeof amount !== "number") amount = Number(amount) || 0;
  
    return `${amount.toLocaleString("vi-VN")} VNĐ`;
  };
  
export const formatDay = (date) => {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(date));
};

export const formatIOSDate = (isoString) => {
    const date = new Date(isoString);

    // Lấy thông tin ngày, tháng, năm, giờ và phút
    const options = {
        weekday: "short", // Thứ (vd: Th)
        month: "2-digit", // Tháng dạng số (vd: 09)
        day: "2-digit", // Ngày dạng số (vd: 25)
        year: "numeric", // Năm đầy đủ (vd: 2024)
        hour: "2-digit", // Giờ dạng 2 chữ số
        minute: "2-digit", // Phút dạng 2 chữ số
        hour12: true, // Sử dụng định dạng 12 giờ (AM/PM)
    };

    // Format ngày tháng theo locale "vi-VN"
    return date.toLocaleString("en-US", options);
};

