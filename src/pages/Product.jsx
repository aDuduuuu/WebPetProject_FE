import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductFilter from '../components/ProductFilter';
import Card from '../components/Card';
import clientApi from '../client-api/rest-client';

const Product = () => {
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const productsPerPage = 8;
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({ productType: '', minPrice: '', maxPrice: '', sortBy: '' });
  const [searchKeyword, setSearchKeyword] = useState('');

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
          const params = {
            page,
            limit: productsPerPage,
            Type: filters.productType,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sortBy: filters.sortBy,
          };

          const productApi = clientApi.service('products');
          result = await productApi.find(params);
        }

        if (result && result.EC === 200) {
          const products = Array.isArray(result.DT) ? result.DT : [];
          setProductList(products);
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
  }, [page, filters, searchKeyword]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="px-3 py-1 border rounded bg-white text-teal-600 border-teal-500 hover:bg-teal-100"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          « Prev
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`px-3 py-1 border rounded ${page === num
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
    <div className="product-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        {/* Bộ lọc + tìm kiếm */}
        <div className="w-1/4 bg-white p-6 shadow-lg">

          <div className="mb-4">
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder="Search product by name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <ProductFilter onFilter={handleFilterChange} />


        </div>

        {/* Danh sách sản phẩm */}
        <div className="w-3/4 p-6">
          {productList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
      </div>
      <Footer />
    </div>
  );
};

export default Product;
