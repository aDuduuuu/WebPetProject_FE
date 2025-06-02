import React from 'react';
import { Dropdown, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import "./Cart.scss";

const DropdownShip = (props) => {
  const { t } = useTranslation();

  const items = [
    {
      label: (
        <div className="d-flex justify-content-between">
          <span>{t('cart.shipping.express')}</span>
          <span>8.00 VNĐ</span>
        </div>
      ),
      key: "1",
      onClick: () => { props.click({ name: t('cart.shipping.express'), price: 8 }) }
    },
    {
      label: (
        <div className="d-flex justify-content-between">
          <span>{t('cart.shipping.economy')}</span>
          <span>2.00 VNĐ</span>
        </div>
      ),
      key: "2",
      onClick: () => { props.click({ name: t('cart.shipping.economy'), price: 2 }) }
    },
    {
      label: (
        <div className="d-flex justify-content-between">
          <span>{t('cart.shipping.expedited')}</span>
          <span>20.00 VNĐ</span>
        </div>
      ),
      key: "3",
      onClick: () => { props.click({ name: t('cart.shipping.expedited'), price: 20 }) }
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        style: { width: "300px" },
      }}
      placement="bottomRight"
      overlayClassName='dropdown-ship'
    >
      <Space>
        <FontAwesomeIcon className="ms-2" icon={faCaretDown} color={props.color} />
      </Space>
    </Dropdown>
  );
};

export default DropdownShip;
