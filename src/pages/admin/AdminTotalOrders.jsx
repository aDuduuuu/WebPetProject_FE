import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import clientApi from '../../client-api/rest-client';
import CustomDatePicker from '../../components/DatePicker';
import { useNavigate } from 'react-router-dom';

const AdminTotalOrders = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ year: '', month: '', day: '', status: '' });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const totalPages = Math.ceil(totalOrders / pageSize);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { year, month, day, status } = filters;
      const response = await clientApi.service('orders/all').find({
        page,
        limit: pageSize,
        year,
        month,
        day,
        status,
      });

      if (response.EC === 0) {
        setOrders(response.DT.orders || []);
        setTotalOrders(response.DT.totalOrders || 0);
      } else {
        setOrders([]);
        setTotalOrders(0);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset về trang đầu
  };

  const handleClick = (orderId) => {
    navigate(`/orderDetail/${orderId}`);
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="px-3 py-1 border rounded bg-white text-teal-600 border-teal-500 hover:bg-teal-100"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          « Prev
        </button>

        {pages.map((num) => (
          <button
            key={num}
            className={`px-3 py-1 border rounded ${
              page === num
                ? 'bg-teal-500 text-white'
                : 'bg-white text-teal-600 border-teal-500 hover:bg-teal-100'
            }`}
            onClick={() => setPage(num)}
          >
            {num}
          </button>
        ))}

        <button
          className="px-3 py-1 border rounded bg-white text-teal-600 border-teal-500 hover:bg-teal-100"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next »
        </button>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#184440] mb-1">🧾 Total Orders</h2>
          <p className="text-gray-600">View and filter all customer orders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-4">
            <CustomDatePicker
              selectedDate={filters}
              setSelectedDate={setFilters}
              onApplyFilter={handleApplyFilter}
            />
          </div>

          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="text-lg font-semibold text-gray-700">Total Orders: </span>
              <span className="text-xl font-bold text-teal-600">{totalOrders}</span>
            </div>

            {loading && <p className="text-teal-500 text-center">Loading orders...</p>}
            {!loading && orders.length === 0 && (
              <p className="text-center text-gray-500">No orders found for the selected filter.</p>
            )}

            {orders.length > 0 && (
              <>
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => handleClick(order._id)}
                      className="bg-white shadow hover:shadow-lg transition cursor-pointer rounded-lg p-6 border border-gray-100 hover:border-teal-400"
                    >
                      <div className="text-sm text-gray-500 mb-1">Order ID:</div>
                      <h3 className="text-lg font-semibold text-teal-600">{order._id}</h3>

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm text-gray-500">Customer</div>
                          <div className="font-medium text-gray-800">{order.orderUser?.fullName || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Phone</div>
                          <div className="font-medium">{order.orderUser?.phoneNumber || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Payment Method</div>
                          <div className="font-medium">{order.paymentMethod?.name || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Shipment Method</div>
                          <div className="font-medium">{order.shipmentMethod?.name || 'N/A'}</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="text-sm text-gray-500">Address</div>
                        <div className="text-sm text-gray-800">
                          {[order.orderUser?.address, order.orderUser?.ward, order.orderUser?.district, order.orderUser?.city]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTotalOrders;
