import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductFilter from '../components/ProductFilter';
import Card from '../components/Card';
import clientApi from '../client-api/rest-client';

const Product = () => {
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const productsPerPage = 16;
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ productType: '', minPrice: '', maxPrice: '', sortBy: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        page,
        limit: productsPerPage,
        ...filters,
      };

      try {
        const productApi = clientApi.service('products');
        const result = await productApi.find(params);
        if (result && result.EC === 200) {
          const newProducts = Array.isArray(result.DT) ? result.DT : [];
          if (newProducts.length < productsPerPage) {
            setHasMore(false);
          }
          setProductList((prevList) => (page === 1 ? newProducts : [...prevList, ...newProducts]));
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setHasMore(false);
      }
    };

    fetchProducts();
  }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
    setProductList([]);
  };

  return (
    <div className="product-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <div className="w-1/4 bg-white p-6 shadow-lg">
          <ProductFilter onFilter={handleFilterChange} />
        </div>
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
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-lg text-gray-600">No Products found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Product;
