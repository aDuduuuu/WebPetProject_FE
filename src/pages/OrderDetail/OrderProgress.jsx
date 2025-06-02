import React from 'react';
import { useTranslation } from 'react-i18next';
import { Popover, Steps } from 'antd';

const OrderStatus = (props) => {
    const { t } = useTranslation();
    const currentStep = props?.value;

    const customDot = (dot, { status, index }) => (
        <Popover
            content={
                <span>
                    {t('Step')} {index + 1} {t('status')}: {status}
                </span>
            }
        >
            {dot}
        </Popover>
    );

    return (
        <div className="process-order">
            <Steps
                current={currentStep}
                progressDot={customDot}
                items={[
                    {
                        title: t('Ordered'),
                        description: t('Your order is confirmed.'),
                    },
                    {
                        title: t('Waiting shipping'),
                        description: t('Preparing for shipment.'),
                    },
                    {
                        title: t('Shipping'),
                        description: t('Your package is on the way.'),
                    },
                    {
                        title: t('Delivered'),
                        description: t('Order successfully delivered.'),
                    },
                ]}
            />
        </div>
    );
};

export default OrderStatus;