import React from 'react';
import { Popover, Steps } from 'antd';
const OrderStatus = (props) => {
    const currentStep = props?.value; // Đặt bước hiện tại

    const customDot = (dot, { status, index }) => (
        <Popover
            content={
                <span>
                    Step {index + 1} status: {status}
                </span>
            }
        >
            {dot}
        </Popover>
    );

    const description = 'You can hover on the dot.';
    return (
        <div className="process-order">
            <Steps
                current={currentStep} // Bước hiện tại
                progressDot={customDot}
                items={[
                    {
                        title: "Ordered",
                        description: "Your order is confirmed.",

                    },
                    {
                        title: "Waiting shipping",
                        description: "Preparing for shipment.",
                    },
                    {
                        title: "Shipping",
                        description: "Your package is on the way.",
                    },
                    {
                        title: "Delivered",
                        description: "Order successfully delivered.",
                    },
                ]}
            />
        </div>
    );
};

export default OrderStatus;