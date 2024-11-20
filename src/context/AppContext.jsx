import { all } from "axios";
import React, { createContext, useState, useContext } from "react";

// Tạo AnswerContext
const AppContext = createContext();

// Provider để quản lý trạng thái toàn cục
export const AppProvider = ({ children }) => {
    const [checkout, setCheckout] = useState({
        allowCheckout: false,
        totalPrice: 0,
        carts: [],
        shipment: null
    });
    // Hàm cập nhật câu trả lời theo key-value
    const updateCheckout = (data) => {
        setCheckout({
            ...checkout,
            allowCheckout: data.allowCheckout,
            totalPrice: data.totalPrice,
            carts: data.carts,
            shipment: data.shipment
        });
    };

    return (
        <AppContext.Provider value={{ checkout, updateCheckout }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook để sử dụng AnswerContext
export const useAppContext = () => useContext(AppContext);
