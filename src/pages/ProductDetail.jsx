import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clientApi from "../client-api/rest-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { message, Rate } from "antd";
import { FaHeart } from "react-icons/fa";
import ProductReview from "./Review/ProductReview";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [userID, setUserID] = useState(localStorage.getItem('id'));
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
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
          setProduct(response.DT);
        } else {
          setError(response.EM);
        }
      } catch {
        setError(t('error.fetchProduct'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, t]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const uid = localStorage.getItem('id');
        const response = await clientApi.service('favorites').get(uid);

        if (response && response.EC === 0) {
          const favoriteItems = Array.isArray(response.DT) ? response.DT : response.DT.items || [];

          const filteredFavorites = favoriteItems.filter(item => item.type === 'Product');

          const favorListWithDetails = await Promise.all(
            filteredFavorites.map(async (item) => {
              const productResponse = await clientApi.service('products').get(item.referenceID);
              return {
                id: productResponse.DT._id,
                name: productResponse.DT.name,
                image: productResponse.DT.image || 'https://via.placeholder.com/150',
                price: productResponse.DT.price,
                favoriteID: item._id,
              };
            })
          );

          setFavorList(favorListWithDetails);
          const isProductFavorited = favorListWithDetails.some(item => item.id === id);
          setIsFavorited(isProductFavorited);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setLoading(false);
      }
    };

    if (userID) {
      fetchFavorites();
    }
  }, [userID, id]);

  const handleFavor = async () => {
    const uid = localStorage.getItem("id");
    if (!uid) {
      message.error(t('favorite.loginRequired'));
      return;
    }

    try {
      if (isFavorited) {
        const favoriteItem = favorList.find(item => item.id === id);
        if (favoriteItem) {
          const response = await clientApi.service("favorites").delete(favoriteItem.favoriteID);

          if (response.EC === 200 || response.EC === 0) {
            message.success(t('favorite.removed'));
            setFavorList(prev => prev.filter(item => item.id !== id));
            setIsFavorited(false);
          } else {
            message.error(t('favorite.removeFailed'));
          }
        }
      } else {
        const response = await clientApi.service("favorites").create({
          userID: uid,
          referenceID: id,
          type: "Product",
        });

        if (response.EC === 200 || response.EC === 0) {
          message.success(t('favorite.added'));
          const newFavoriteItem = {
            id,
            name: product.name,
            price: product.price,
            image: product.image,
            favoriteID: response.DT._id,
          };

          setFavorList(prev => [...prev, newFavoriteItem]);
          setIsFavorited(true);
        } else {
          message.error(t('favorite.addFailed'));
        }
      }
    } catch (err) {
      message.error(t('favorite.updateFailed'));
      console.error(err);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  const handleAddToCart = async () => {
    try {
      const response = await clientApi.service("cartItem").create({ product: id, quantity });
      if (response.EC === 0) {
        message.success(t('cart.added'));
      } else {
        message.error(t('cart.addError'));
      }
    } catch {
      message.error(t('cart.addError'));
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">{t('loading')}</h1>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-500">{error || t('product.notFound')}</h1>
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={() => navigate("/products")}
          >
            {t('actions.backToProducts')}
          </button>
        </div>
      </div>
    );
  }

  const productDescriptions = {
    'Cute T-Shirt': t('PRODUCT_DESC_CuteTShirt'),
    'Wireless Headphones': t('PRODUCT_DESC_WirelessHeadphones'),
    'T-Shirt': t('PRODUCT_DESC_TShirt'),
    'MFDG': t('PRODUCT_DESC_MFDG'),
    'Blue Pajama': t('PRODUCT_DESC_BluePajama'),
    'Avocado Pajama': t('PRODUCT_DESC_AvocadoPajama'),
    'Batman Costume': t('PRODUCT_DESC_BatmanCostume'),
    'Fairy Costume': t('PRODUCT_DESC_FairyCostume'),
    'ARMY Costume': t('PRODUCT_DESC_ArmyCostume'),
    'Premium Dog Food': t('PRODUCT_DESC_PremiumDogFood'),
    'Natural Dog Treats': t('PRODUCT_DESC_NaturalDogTreats'),
    'Premium Dog Biscuits': t('PRODUCT_DESC_PremiumDogBiscuits'),
    'Dog Muzzle': t('PRODUCT_DESC_DogMuzzle'),
    'Adjustable Dog Collar': t('PRODUCT_DESC_AdjustableDogCollar'),
    'Dog Harness and Leash Set': t('PRODUCT_DESC_DogHarnessLeashSet'),
    'Durable Colorful Dog Tennis Ball': t('PRODUCT_DESC_DogTennisBall'),
    'Durable Chew-Resistant Dog Ball': t('PRODUCT_DESC_ChewResistantBall'),
    'Durable Yellow Chew Toy for Dogs': t('PRODUCT_DESC_YellowChewToy'),
    'Natural Rawhide Bone Chew Toy': t('PRODUCT_DESC_RawhideBone'),
    'Durable Yellow Dog Frisbee': t('PRODUCT_DESC_YellowFrisbee'),
    'Plush Orthopedic Dog Bed': t('PRODUCT_DESC_OrthopedicDogBed'),
    'Retractable Dog Leash Set': t('PRODUCT_DESC_RetractableLeashSet'),
    'Personalized Luxury Dog Collars': t('PRODUCT_DESC_LuxuryCollars'),
    '2-in-1 Dog Bath Brush with Soap Dispenser': t('PRODUCT_DESC_BathBrush'),
    'Double Stainless Steel Dog Bowls': t('PRODUCT_DESC_DogBowls'),
    'Interactive Treat Dispensing Dog Toy': t('PRODUCT_DESC_TreatToy'),
    'Dog Paw Cleaner Cup': t('PRODUCT_DESC_PawCleaner'),
    'Interactive Puzzle Feeder for Dogs': t('PRODUCT_DESC_PuzzleFeeder'),
    'Durable Rope Tug Toy for Dogs': t('PRODUCT_DESC_RopeTugToy'),
    'Funny Smile Dog Ball': t('PRODUCT_DESC_SmileDogBall'),
    'Cozy Fleece Dog Jacket': t('PRODUCT_DESC_FleeceJacket'),
    'Colorful Dog Hoodie': t('PRODUCT_DESC_ColorfulHoodie'),
    '2-in-1 Travel Dog Water and Food Bottle': t('PRODUCT_DESC_TravelWaterFoodBottle'),
    'Premium Dog Kibble Bowl': t('PRODUCT_DESC_KibbleBowl'),
    'Ultimate Canine Delight': t('PRODUCT_DESC_CanineDelight'),
    'Doge All-Over Print T-Shirt': t('PRODUCT_DESC_DogeTShirt'),
    'Oversized Dog Print Sweater': t('PRODUCT_DESC_DogPrintSweater'),
    'Black Graphic Dog T-Shirt': t('PRODUCT_DESC_BlackDogTShirt'),
    'Dog Mom Graphic T-Shirt': t('PRODUCT_DESC_DogMomTShirt'),
    'Pet-Themed Adjustable Bracelets': t('PRODUCT_DESC_PetBracelets'),
    'Heart & Paw Print Necklace': t('PRODUCT_DESC_HeartPawNecklace'),
    'Dog Embroidered Cap': t('PRODUCT_DESC_DogCap'),
    'Personalized Dog-Themed Tumblers': t('PRODUCT_DESC_DogTumblers'),
    'Custom Dog Face Cap': t('PRODUCT_DESC_CustomDogCap'),
    '"Can I Pet Your Dog?" Cap': t('PRODUCT_DESC_PetYourDogCap'),
    'Rose Gold Paw Print Necklace': t('PRODUCT_DESC_RoseGoldNecklace'),
    'Personalized Pet Engraved Necklaces': t('PRODUCT_DESC_EngravedNecklaces'),
    'Custom Paw Print Water Bottles': t('PRODUCT_DESC_PawPrintBottles'),
    'Dog-Themed Stainless Steel Bottles': t('PRODUCT_DESC_DogSteelBottles'),
    'te ob': t('PRODUCT_DESC_TeOb'),
    'mate': t('PRODUCT_DESC_Mate'),
    'ass12': t('PRODUCT_DESC_Ass12')
  }

  return (
    <div className="product-detail-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-6 bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-center items-center lg:w-1/2 mb-6 lg:mb-0">
              <img
                src={product.image || "https://via.placeholder.com/300?text=No+Image"}
                alt={product.name}
                className="rounded-lg w-96 h-96 object-cover"
              />
            </div>

            <div className="flex flex-col lg:w-1/2 justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-teal-900">
                  {product.name}
                </h1>

                <p className="text-gray-800 mb-2 text-base">
                  {t('product.rating')}: {averageRating.toFixed(1)} ⭐
                  <span className="mx-4">|</span>
                  {t('product.totalRatings')}: {totalRatings}
                </p>

                <p className="text-gray-600 mb-2">
                  <span className="font-bold">{t('product.postedOn')}:</span>{" "}
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold">{t('product.code')}:</span> {product.productCode}
                </p>
                <p className="text-gray-600 mb-10">
                  <span className="font-bold">{t('product.type')}:</span> {product.productType}
                </p>
                <p className="text-3xl font-bold mb-3 text-teal-700">
                  {new Intl.NumberFormat('vi-VN').format(product.price)} VNĐ
                </p>

                <div className="flex items-center gap-4 mb-2">
                  <label className="font-bold">{t('product.quantity')}:</label>
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

              <div className="flex gap-2 mt-2">
                <button
                  className="flex-1 bg-white text-teal-600 border-2 border-teal-600 h-14 rounded-md py-3 text-xl font-semibold hover:bg-teal-100 shadow-md hover:-translate-y-1 transition-all duration-200 ease-in-out"
                  onClick={handleAddToCart}
                >
                  {t('actions.addToCart')}
                </button>
                <button
                  className="flex-1 bg-teal-500 text-white rounded-md h-14 hover:bg-teal-600 text-lg font-semibold shadow-md hover:-translate-y-1 transition-all duration-200 ease-in-out"
                  onClick={handleBuyNow}
                >
                  {t('actions.buyNow')}
                </button>
                <button
                  className={`w-14 h-14 ${isFavorited ? "bg-red-500" : "bg-white border-2 border-red-500"} text-white rounded-md flex items-center justify-center hover:bg-red-600 hover:-translate-y-1 transition-all duration-200 ease-in-out`}
                  onClick={handleFavor}
                >
                  <FaHeart size={24} color={isFavorited ? "white" : "red"} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-1 text-teal-900">
              {t('product.description')}
            </h2>
            <hr className="my-4 border-t border-gray-500" />
            <div className="text-gray-600 mb-4 prose max-w-full">
              {product.description ? (
                <ReactMarkdown>{productDescriptions[product.name] || product.description}</ReactMarkdown>
              ) : (
                t('product.noDescription')
              )}
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mt-4">
            {id && (
              <ProductReview
                productId={product._id}
                onRatingCalculated={handleRatingCalculated}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
