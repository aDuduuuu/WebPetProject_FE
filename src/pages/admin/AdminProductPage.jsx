import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import clientApi from '../../client-api/rest-client';
import Card from '../../components/Card';

const AdminProductPage = () => {
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const productsPerPage = 8;
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const primaryColor = '#184440';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let result;

        if (searchKeyword.trim() !== '') {
          const productSearch = clientApi.service('products/search/by-name');
          result = await productSearch.find({
            keyword: searchKeyword,
            page,
            limit: productsPerPage,
          });
        } else {
          const productService = clientApi.service('products');
          result = await productService.find({
            page,
            limit: productsPerPage,
          });
        }

        if (result && result.EC === 200) {
          const data = Array.isArray(result.DT) ? result.DT : [];
          setProductList(data);
          setTotalProducts(result.totalProducts || 0);
        } else {
          setProductList([]);
          setTotalProducts(0);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductList([]);
        setTotalProducts(0);
      }
    };

    fetchProducts();
  }, [page, searchKeyword]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="px-3 py-1 border rounded bg-white text-teal-600 border-teal-500 hover:bg-teal-100"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          « Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight mb-1">
              🛒 Product Management
            </h2>
            <div className="inline-block bg-[#184440] text-white text-lg font-semibold px-4 py-1 rounded-md shadow">
              Total products: {totalProducts}
            </div>
          </div>
          <button
            onClick={() => navigate('/products/add')}
            className="text-white px-4 py-2 rounded-lg hover:bg-[#145c54]"
            style={{ backgroundColor: primaryColor }}
          >
            + Add New Product
          </button>
        </div>

        {/* Search input */}
        <div className="mb-6">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            placeholder="Search product by name..."
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Product grid */}
        {productList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productList.map((product) => (
                <Card
                  key={product._id}
                  id={product._id}
                  image={product.image || 'https://via.placeholder.com/150?text=Not+Available'}
                  name={product.name}
                  price={product.price}
                  productType={product.productType}
                  quantity={product.quantity}
                  description={product.description}
                  type="products"
                  action="update"
                />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <p className="text-lg text-gray-600 mt-4">No Products found.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProductPage;
