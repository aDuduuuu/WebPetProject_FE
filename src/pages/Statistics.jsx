import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import clientApi from '../client-api/rest-client';
import CustomDatePicker from '../components/DatePicker';

const Statistics = () => {
  const [activeSection, setActiveSection] = useState('orders');
  const [orders, setOrders] = useState([]);  // Danh sách đơn hàng
  const [loading, setLoading] = useState(false);  // Trạng thái loading
  const [error, setError] = useState('');  // Thông báo lỗi
  const [page, setPage] = useState(1);  // Trang hiện tại
  const pageSize = 10;  // Số lượng đơn hàng mỗi lần tải
  const [hasMore, setHasMore] = useState(true);  // Trạng thái còn dữ liệu để tải
  const [filters, setFilters] = useState({ year: '', month: '', day: '' });  // Bộ lọc ngày tháng
  const [totalOrders, setTotalOrders] = useState(0);  // Biến lưu trữ tổng số đơn hàng
  const navigate = useNavigate();

  // Hàm để lấy danh sách đơn hàng theo phân trang và bộ lọc
  const fetchOrders = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { year, month, day } = filters;
      const params = {
        page,
        limit: pageSize,
        year,
        month,
        day,
      };

      const response = await clientApi.service('orders/all').find(params);

      if (response.EC === 0) {
        const newOrders = response.DT.orders;
        setTotalOrders(response.DT.totalOrders);  // Lưu tổng số đơn hàng từ response

        // Append the new orders to the existing list without resetting
        setOrders((prevOrders) => {
          return page === 1 ? newOrders : [...prevOrders, ...newOrders];  // Append new orders to the previous ones, only for subsequent pages
        });

        setHasMore(newOrders.length === pageSize);
      } else {
        setHasMore(false);  // No more data
      }
    } catch (err) {
      setHasMore(false);  // Error or no more data
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấn nút filter
  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);  // Cập nhật bộ lọc
    setPage(1);  // Reset trang khi áp dụng filter
    setOrders([]);  // Clear current orders when changing filters
    setHasMore(true);  // Reset "has more" state
  };

  // Fetch đơn hàng khi `page` hoặc `filters` thay đổi
  useEffect(() => {
    if (activeSection === 'orders') {
      fetchOrders();
    }
  }, [page, filters, activeSection]);  // Mỗi khi `filters`, `page`, hoặc `activeSection` thay đổi, gọi lại fetchOrders

  // Hàm xử lý khi nhấp vào đơn hàng
  const handleClick = (orderId) => {
    navigate(`/orderDetail/${orderId}`);  // Điều hướng đến trang chi tiết đơn hàng
  };

  // Render working message
  const renderWorkingMessage = () => (
    <div className="text-center text-teal-500 text-lg font-semibold">
      <p>Working...</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header />
      <div className="flex flex-grow flex-col">
        {/* Buttons to switch between sections */}
        <div className="p-6 flex space-x-4 bg-teal-50">
          <button
            onClick={() => setActiveSection('orders')}
            className={`flex-1 text-lg font-semibold ${activeSection === 'orders' ? 'bg-teal-500 text-white' : 'text-teal-500'} flex justify-center items-center space-x-2 py-3 rounded-lg border-b-4 border-transparent hover:bg-gray-100 
            ${activeSection === 'orders' ? 'hover:bg-teal-500' : 'hover:bg-gray-300'}`}
          >
            <i className="fas fa-box"></i>
            <span>Total Orders</span>
          </button>
          <button
            onClick={() => setActiveSection('revenue')}
            className={`flex-1 text-lg font-semibold ${activeSection === 'revenue' ? 'bg-teal-500 text-white' : 'text-teal-500'} flex justify-center items-center space-x-2 py-3 rounded-lg border-b-4 border-transparent hover:bg-gray-100 
            ${activeSection === 'revenue' ? 'hover:bg-teal-500' : 'hover:bg-gray-300'}`}
          >
            <i className="fas fa-chart-line"></i>
            <span>Revenue</span>
          </button>
          <button
            onClick={() => setActiveSection('topProducts')}
            className={`flex-1 text-lg font-semibold ${activeSection === 'topProducts' ? 'bg-teal-500 text-white' : 'text-teal-500'} flex justify-center items-center space-x-2 py-3 rounded-lg border-b-4 border-transparent hover:bg-gray-100 
            ${activeSection === 'topProducts' ? 'hover:bg-teal-500' : 'hover:bg-gray-300'}`}
          >
            <i className="fas fa-cogs"></i>
            <span>Top Products</span>
          </button>
        </div>

        {/* Content based on selected section */}
        <div className="flex-grow flex p-6">
          {activeSection === 'orders' && (
            <div className="w-full">
              {/* Chọn bộ lọc */}
              <CustomDatePicker
                selectedDate={filters}
                setSelectedDate={setFilters}  // Truyền state filters xuống CustomDatePicker để cập nhật bộ lọc
                onApplyFilter={handleApplyFilter}  // Truyền hàm để áp dụng bộ lọc
              />

              {/* Hiển thị tổng số đơn hàng */}
              <div className="mb-4 text-lg font-semibold text-teal-500">
                <span>Total Orders: </span>
                <span className="font-bold text-teal-700">{totalOrders}</span>
              </div>

              {/* Hiển thị các đơn hàng */}
              <div>
                {loading && <p className="text-teal-500 text-center">Loading orders...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {/* Kiểm tra nếu không có đơn hàng */}
                {orders.length === 0 && !loading && !error && (
                  <p className="text-center text-gray-500">No orders found for the selected filter.</p>
                )}

                <div className="space-y-6">
                  {orders.length > 0 && orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:bg-teal-50"
                      onClick={() => handleClick(order._id)}  // Thêm sự kiện nhấp chuột
                    >
                      <div className="mb-4 text-lg font-semibold text-teal-500">
                        <div>Order ID: <span className="font-normal text-teal-700">{order._id}</span></div>
                      </div>
                      <div className="mb-4 flex items-center">
                        <div className="text-sm font-medium text-teal-500 mr-2">Name:</div>
                        <div className="text-2xl font-bold text-gray">
                          {order.orderUser?.fullName || 'N/A'}
                        </div>
                      </div>
                      <div className="flex justify-start mb-4 space-x-6">
                        <div className="flex w-2/5 items-center">
                          <div className="text-sm font-medium text-teal-500 mr-2">Payment Method:</div>
                          <div className="text-black">{order.paymentMethod?.name || 'N/A'}</div>
                        </div>
                        <div className="flex w-2/5 items-center">
                          <div className="text-sm font-medium text-teal-500 mr-2">Shipment Method:</div>
                          <div className="text-black">{order.shipmentMethod?.name || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex justify-start mb-4 space-x-6">
                        <div className="flex w-3/5 items-center">
                          <div className="text-sm font-medium text-teal-500 mr-2">Address:</div>
                          <div className="text-black">
                            {`${order.orderUser?.address || ''}, ${order.orderUser?.ward || ''}, ${order.orderUser?.district || ''}, ${order.orderUser?.city || ''}`}
                          </div>
                        </div>
                        <div className="flex w-2/5 items-center">
                          <div className="text-sm font-medium text-teal-500 mr-2">Phone:</div>
                          <div className="text-black">{order.orderUser?.phoneNumber || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {hasMore && !loading && (
                <div className="text-center mt-4">
                  <button
                    className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                    onClick={() => setPage(page + 1)}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Show Working message for other sections */}
          {activeSection === 'revenue' && renderWorkingMessage()}
          {activeSection === 'topProducts' && renderWorkingMessage()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Statistics;
