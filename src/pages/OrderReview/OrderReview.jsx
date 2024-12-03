import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./OrderReview.scss";
import { Button, Input, message, Rate } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import clientApi from "../../client-api/rest-client";
import { formatIOSDate } from "../../utils/format";
const OrderReview = () => {
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState([]);
    const { id } = useParams();
    let [orderDetail, setOrderDetail] = useState({});
    let navigate = useNavigate();
    useEffect(() => {
        fetchOrderDetail();
    }, []);
    let fetchOrderDetail = async () => {
        let order = clientApi.service('orders');
        try {
            let response = await order.get(id)
            if (response.EC === 0) {
                setOrderDetail(response.DT);
                const initialReviews = response.DT.orderItems.map((item) => ({
                    productId: item.product._id,
                    rating: 0,
                    comment: "",
                }));
                setReviews(initialReviews);
            } else {
                message.error(response.EM);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleRatingChange = (value, productId) => {
        const updatedReviews = reviews.map((review) =>
            review.productId === productId ? { ...review, rating: value } : review
        );
        setReviews(updatedReviews);
    };

    const handleCommentChange = (e, productId) => {
        const updatedReviews = reviews.map((review) =>
            review.productId === productId ? { ...review, comment: e.target.value } : review
        );
        setReviews(updatedReviews);
    };

    const handleSubmit = async (productId) => {
        const review = reviews.find((review) => review.productId === productId);
        if (review.rating > 0 && review.rating <= 5 && review.comment) {
            let reviews = await clientApi.service('reviews');
            try {
                let response = await reviews.create({ productID: productId, rating: review.rating, comment: review.comment });
                console.log(response);
                if (response.EC === 0) {
                    message.success(response.EM);
                }
                else {
                    message.error(response.EM);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            message.warning("Please rate and comment for product");
        }
    };
    return (
        <>
            <Header />
            <div className="order-review-content mt-5">
                <div className="detail">
                    <div className="title">Order detail</div>
                    <div className="mb-2">
                        <span><b>Order code: </b></span>
                        <span className="ms-4">{orderDetail?._id}</span>
                    </div>
                    <div className="mb-2">
                        <span><b>Order date: </b></span>
                        <span className="ms-4">{formatIOSDate(orderDetail?.orderDate)}</span>
                    </div>
                    <div className="mb-2">
                        <span><b>Payment method: </b></span>
                        <span className="ms-4">{orderDetail?.paymentMethod?.name}</span>
                    </div>
                </div>
                {orderDetail?.orderItems?.length > 0 &&
                    orderDetail.orderItems.map((item, index) => {
                        const review = reviews.find((r) => r.productId === item.product._id) || {};
                        return (
                            <div className="pendant-item-container" key={index}>
                                <div className="image-section">
                                    <img
                                        src={
                                            item?.product?.image ||
                                            "https://res.cloudinary.com/degcwwwii/image/upload/v1732013626/PetCare/ncxgbjfl4cmvuzuyhseb.jpg"
                                        }
                                        alt="Pendant"
                                    />
                                </div>
                                <div className="info-section">
                                    <h2>{item?.product?.name}</h2>
                                    <div className="mb-3">
                                        Rate:
                                        <Rate
                                            className="ms-3"
                                            onChange={(value) => handleRatingChange(value, item.product._id)}
                                            value={review.rating}
                                        />
                                    </div>
                                    <Input.TextArea
                                        className="mb-3"
                                        placeholder="Comment here..."
                                        rows={4}
                                        value={review.comment}
                                        onChange={(e) => handleCommentChange(e, item.product._id)}
                                    />
                                    <div className="d-flex justify-content-end">
                                        <Button type="primary" onClick={() => handleSubmit(item.product._id)}>
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <Footer />
        </>
    );
}

export default OrderReview;