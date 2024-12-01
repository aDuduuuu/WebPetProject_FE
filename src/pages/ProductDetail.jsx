import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clientApi from "../client-api/rest-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { message } from "antd";
import { FaHeart } from "react-icons/fa"; // Thêm import cho biểu tượng trái tim
import ProductReview from "./Review/ProductReview";

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productApi = clientApi.service("products");
        const response = await productApi.get(id);

        if (response.EC === 200) {
          setProduct(response.DT); // Lưu dữ liệu sản phẩm
        } else {
          setError(response.EM); // Lưu thông báo lỗi nếu có
        }
      } catch (err) {
        setError("An error occurred while fetching the product.");
      } finally {
        setLoading(false); // Tắt trạng thái tải
      }
    };

    fetchProduct();
  }, [id]);

  const handleFavor = async () => {
    const uid = localStorage.getItem("id"); // Lấy userID từ localStorage
    if (!uid) {
      message.error("You must be logged in to add to favorites.");
      return;
    }

    try {
      const response = await clientApi.service("favorites").create({
        userID: uid,
        referenceID: id, // referenceID là id của sản phẩm hiện tại
        type: "Product", // Type là "product"
      });

      if (response.EC === 200 || response.EC === 0) {
        message.success("Product added to favorites.");
      } else {
        message.error("Failed to add product to favorites.");
      }
    } catch (err) {
      message.error("Failed to add product to favorites.");
      console.error(err);
    }
  };


  const handleAddToCart = async () => {
    let cart = clientApi.service("cartItem");
    try {
      let response = await cart.create({ product: id, quantity: quantity });
      if (response.EC === 0) {
        message.success("Added to cart successfully.");
      } else {
        message.error("An error occurred while adding to cart.");
      }
    } catch (error) {
      message.error("An error occurred while adding to cart.");
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-500">{error || "Product not found."}</h1>
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={() => navigate("/products")}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
        {/* Bố cục chính */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Khối 1: Hình ảnh và thông tin */}
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-center items-center mb-6">
              <img
                src={product.image || "https://via.placeholder.com/300?text=No+Image"}
                alt={product.name}
                className="rounded-lg w-96 h-96 object-cover"
              />
            </div>
            <h1
              className="text-3xl font-bold mb-4"
              style={{ color: "rgb(22, 66, 60)" }}
            >
              {product.name}
            </h1>
            <p className="text-gray-600 mb-2">
              <span className="font-bold">Product Code:</span> {product.productCode}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-bold">Type:</span> {product.productType}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-bold">Posted on:</span>{" "}
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
            <p
              className="text-4xl font-bold mb-4"
              style={{ color: "rgb(22, 122, 122)" }} // Màu giống màu nút
            >
              ${product.price}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <label className="font-bold">Quantity:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => e.target.value > 0 && setQuantity(e.target.value)}
                className="w-16 p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Các nút */}
            <div className="flex gap-4">
  <button
    className="w-5/6 bg-teal-500 text-white rounded-md py-3 hover:bg-teal-600 text-xl font-semibold"
    onClick={handleAddToCart}
  >
    Add to cart
  </button>
  <button 
    className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
    onClick={handleFavor}
  >
    <FaHeart size={24} />
  </button>
</div>

          </div>

          {/* Khối 2: Mô tả */}
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "rgb(22, 66, 60)" }}
            >
              Description
            </h2>
            <p className="text-gray-600">
              {product.description || "No description available."}
            </p>
          </div>
        </div>
        <div className="flex-1 bg-white shadow-md rounded-lg p-6 mt-4">
          {id && <ProductReview productId={id} />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
