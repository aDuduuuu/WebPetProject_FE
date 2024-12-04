import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import clientApi from '../client-api/rest-client';
import CustomDatePicker from '../components/DatePicker';

const TotalOrders = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ year: '', month: '', day: '', status: '' });
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Fetch đơn hàng
  const fetchOrders = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { year, month, day, status } = filters;
      const params = { page, limit: pageSize, year, month, day, status };

      const response = await clientApi.service('orders/all').find(params);
      
      if (response.EC === 0) {
        const newOrders = response.DT.orders;
        setTotalOrders(response.DT.totalOrders);

        // Thêm đơn hàng mới vào danh sách
        setOrders((prevOrders) => (page === 1 ? newOrders : [...prevOrders, ...newOrders]));
        setHasMore(newOrders.length === pageSize);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi áp dụng bộ lọc
  const handleApplyFilter = (newFilters) => {
    setTotalOrders(0);
    setFilters(newFilters);
    setPage(1);
    setOrders([]);  // Xóa danh sách đơn hàng cũ
    setHasMore(true);
  };

  const handleClick = (orderId) => {
    navigate(`/orderDetail/${orderId}`);  // Điều hướng đến trang chi tiết đơn hàng
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header />
      <div className="flex flex-grow p-6">
        {/* Sidebar: 1/3 width for DatePicker, adjusted height to fit only content */}
        <div className="w-full md:w-1/4 lg:w-2/7 p-4 bg-white shadow-lg rounded-lg min-h-fit">
          <CustomDatePicker
            selectedDate={filters}
            setSelectedDate={setFilters}
            onApplyFilter={handleApplyFilter}
          />
        </div>

        {/* Main Content: 2/3 width for Orders */}
        <div className="flex-grow md:w-1/4 lg:w-5/7 pl-4">
          <div className="mb-4 text-lg font-semibold text-teal-500">
            <span>Total Orders: </span>
            <span className="font-bold text-teal-700">{totalOrders}</span>
          </div>

          <div>
            {loading && <p className="text-teal-500 text-center">Loading orders...</p>}
            {orders.length === 0 && !loading && <p className="text-center text-gray-500">No orders found for the selected filter.</p>}
            {orders.length > 0 && (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:bg-teal-50"
                    onClick={() => handleClick(order._id)}
                  >
                    <div className="mb-4 text-lg font-semibold text-teal-500">
                      <div>Order ID: <span className="font-normal text-teal-700">{order._id}</span></div>
                    </div>

                    {/* Chi tiết thông tin đơn hàng */}
                    <div className="mb-4 flex items-center">
                      <div className="text-sm font-medium text-teal-500 mr-2">Customer Name:</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {order.orderUser?.fullName || 'N/A'}
                      </div>
                    </div>

                    <div className="mb-4 flex justify-between">
                      <div className="flex items-center w-1/2">
                        <div className="text-sm font-medium text-teal-500 mr-2">Payment Method:</div>
                        <div className="text-black">{order.paymentMethod?.name || 'N/A'}</div>
                      </div>
                      <div className="flex items-center w-1/2">
                        <div className="text-sm font-medium text-teal-500 mr-2">Shipment Method:</div>
                        <div className="text-black">{order.shipmentMethod?.name || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="mb-4 flex justify-between">
                      <div className="flex items-center w-3/5">
                        <div className="text-sm font-medium text-teal-500 mr-2">Address:</div>
                        <div className="text-black">
                          {`${order.orderUser?.address || ''}, ${order.orderUser?.ward || ''}, ${order.orderUser?.district || ''}, ${order.orderUser?.city || ''}`}
                        </div>
                      </div>
                      <div className="flex items-center w-2/5">
                        <div className="text-sm font-medium text-teal-500 mr-2">Phone:</div>
                        <div className="text-black">{order.orderUser?.phoneNumber || 'N/A'}</div>
                      </div>
                    </div>

                    {/* Có thể thêm thông tin khác như số lượng sản phẩm, giá trị đơn hàng... */}
                  </div>
                ))}
              </div>
            )}
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
      </div>
      <Footer />
    </div>
  );
};

export default TotalOrders;
