import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clientApi from "../client-api/rest-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { message, Rate } from "antd";
import { FaHeart } from "react-icons/fa"; // Thêm import cho biểu tượng trái tim
import ProductReview from "./Review/ProductReview";
import ReactMarkdown from "react-markdown";


const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [userID, setUserID] = useState(localStorage.getItem('id'));
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
  const [isFavorited, setIsFavorited] = useState(false); // Trạng thái yêu thích
  const [favorList, setFavorList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const handleRatingCalculated = (avg, total) => {
    setAverageRating(avg);
    setTotalRatings(total);
  };

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

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const uid = localStorage.getItem('id');
        const response = await clientApi.service('favorites').get(uid); // Lấy danh sách yêu thích

        if (response && response.EC === 0) {
          const favoriteItems = Array.isArray(response.DT) ? response.DT : response.DT.items || [];

          // Lọc ra các mục yêu thích có type là "Product"
          const filteredFavorites = favoriteItems.filter(item => item.type === 'Product');

          // Lặp qua danh sách yêu thích, lấy chi tiết sản phẩm từ API
          const favorListWithDetails = await Promise.all(
            filteredFavorites.map(async (item) => {
              const productResponse = await clientApi.service('products').get(item.referenceID); // Truyền _id của sản phẩm
              return {
                id: productResponse.DT._id, // Lưu _id của sản phẩm
                name: productResponse.DT.name, // Lưu tên của sản phẩm
                image: productResponse.DT.image || 'https://via.placeholder.com/150', // Lưu hình ảnh hoặc placeholder nếu không có
                price: productResponse.DT.price, // Lưu giá của sản phẩm
                favoriteID: item._id, // Thêm _id của mục yêu thích vào
              };
            })
          );

          setFavorList(favorListWithDetails);

          // Kiểm tra xem sản phẩm hiện tại có trong danh sách yêu thích không
          const isProductFavorited = favorListWithDetails.some(item => item.id === id);
          setIsFavorited(isProductFavorited); // Cập nhật trạng thái yêu thích

          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching favorite items:', error);
        setLoading(false);
      }
    };

    if (userID) {
      fetchFavorites();
    }
  }, [userID, id]);

  const handleFavor = async () => {
    const uid = localStorage.getItem("id"); // Lấy userID từ localStorage
    if (!uid) {
      message.error("You must be logged in to add to favorites.");
      return;
    }

    try {
      if (isFavorited) {
        // Nếu sản phẩm đã yêu thích, thực hiện xóa yêu thích
        const favoriteItem = favorList.find(item => item.id === id); // Tìm sản phẩm trong danh sách yêu thích
        if (favoriteItem) {
          // Gửi yêu cầu xóa yêu thích
          const response = await clientApi.service("favorites").delete(favoriteItem.favoriteID);

          if (response.EC === 200 || response.EC === 0) {
            message.success("Product removed from favorites.");

            // Cập nhật lại trạng thái
            setFavorList(prevFavorList => prevFavorList.filter(item => item.id !== id)); // Xóa sản phẩm khỏi danh sách yêu thích
            setIsFavorited(false); // Cập nhật trạng thái là chưa yêu thích
          } else {
            message.error("Failed to remove product from favorites.");
          }
        }
      } else {
        // Nếu sản phẩm chưa yêu thích, thực hiện thêm vào yêu thích
        const response = await clientApi.service("favorites").create({
          userID: uid,
          referenceID: id, // referenceID là id của sản phẩm hiện tại
          type: "Product", // Type là "product"
        });

        if (response.EC === 200 || response.EC === 0) {
          message.success("Product added to favorites.");

          // Thêm sản phẩm vào danh sách yêu thích
          const newFavoriteItem = {
            id,
            name: product.name,
            price: product.price,
            image: product.image,
            favoriteID: response.DT._id, // Lấy _id từ response khi thêm vào yêu thích
          };

          setFavorList(prevFavorList => [...prevFavorList, newFavoriteItem]); // Thêm vào danh sách yêu thích
          setIsFavorited(true); // Cập nhật trạng thái là đã yêu thích
        } else {
          message.error("Failed to add product to favorites.");
        }
      }
    } catch (err) {
      message.error("Failed to update favorites.");
      console.error(err);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
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
        <div className="flex flex-col gap-6">
          {/* Khối 1: Hình ảnh và thông tin */}
          <div className="flex flex-col lg:flex-row gap-6 bg-white shadow-md rounded-lg p-6">
            {/* Cột trái: Hình ảnh */}
            <div className="flex justify-center items-center lg:w-1/2 mb-6 lg:mb-0">
              <img
                src={product.image || "https://via.placeholder.com/300?text=No+Image"}
                alt={product.name}
                className="rounded-lg w-96 h-96 object-cover"
              />
            </div>

            {/* Cột phải: Thông tin sản phẩm + số lượng + nút */}
            <div className="flex flex-col lg:w-1/2 justify-between">
              <div>
                {/* Tên sản phẩm với khoảng cách lớn hơn phía dưới */}
                <h1 className="text-3xl font-bold mb-2" style={{ color: "rgb(22, 66, 60)" }}>
                  {product.name}
                </h1>

                {/* Rating hiển thị một ngôi sao đơn giản */}
                <p className="text-gray-800 mb-2" style={{ fontSize: "16px" }}>
                  Rating: {averageRating.toFixed(1)} ⭐
                  <span style={{ marginLeft: "16px" }}>|</span>
                  <span className="text-gray-800" style={{ marginLeft: "16px" }}>
                    Total Ratings: {totalRatings}
                  </span>
                </p>



                <p className="text-gray-600 mb-2">
                  <span className="font-bold">Posted on:</span>{" "}
                  {new Date(product.createdAt).toLocaleDateString()}

                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold">Product Code:</span> {product.productCode}

                </p>
                <p className="text-gray-600 mb-10">
                  <span className="font-bold">Type:</span> {product.productType}
                </p>
                <p
                  className="text-3xl  font-bold mb-3"
                  style={{ color: "rgb(22, 122, 122)" }}
                >
                  {product.price} VNĐ
                </p>

                <div className="flex items-center gap-4 mb-2">
                  <label className="font-bold">Quantity:</label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1) setQuantity(val);
                    }}
                    className="w-16 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>


              {/* Các nút */}
              <div className="flex gap-2 mt-2">
                <button
                  className="flex-1 bg-white text-teal-600 border-2 border-teal-600 h-14 rounded-md py-3 text-xl font-semibold
             hover:bg-teal-100 shadow-md hover:-translate-y-1
             transition-all duration-200 ease-in-out flex items-center justify-center"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </button>
                <button
                  className="flex-1 bg-teal-500 text-white rounded-md h-14 hover:bg-teal-600 text-lg font-semibold
             flex items-center justify-center hover:-translate-y-1 shadow-md transition-all duration-200 ease-in-out"
                  onClick={handleBuyNow}
                >
                  Buy now
                </button>
                <button
                  className={`w-14 h-14 ${isFavorited ? "bg-red-500" : "bg-white border-2 border-red-500"
                    } text-white rounded-md flex items-center justify-center hover:bg-red-600 hover:-translate-y-1
             transition-all duration-200 ease-in-out`}
                  onClick={handleFavor}
                >
                  <FaHeart size={24} color={isFavorited ? "white" : "red"} />
                </button>
              </div>
            </div>
          </div>


          {/* Khối 2: Mô tả */}
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: "rgb(22, 66, 60)" }}
            >
              Description
            </h2>
            <hr className="my-4 border-t border-gray-500" />
            <div className="text-gray-600 mb-4 prose max-w-full">
              {product.description ? (
                <ReactMarkdown>{product.description}</ReactMarkdown>
              ) : (
                "No description available."
              )}
            </div>


          </div>

        </div>
        <div className="flex-1 bg-white shadow-md rounded-lg p-6 mt-4">
          {id && <ProductReview productId={product._id} onRatingCalculated={handleRatingCalculated} />
          }
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
