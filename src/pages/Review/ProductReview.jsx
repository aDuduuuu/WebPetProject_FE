import React, { useEffect, useState } from "react";
import { Rate, Button, Avatar, Divider, Row, Col, message } from "antd";
import "./ProductReview.scss";
import { useNavigate } from "react-router-dom";
import clientApi from "../../client-api/rest-client";
const ProductReview = (props) => {
    const [selectedRating, setSelectedRating] = useState("Tất cả"); // Lọc đánh giá
    let [listReview, setListReview] = useState([]);
    let [totalReview, setTotalReview] = useState(0);
    let navigate = useNavigate();
    useEffect(() => {
        fetchListOrder();
    }, []);
    useEffect(() => {
        if (listReview.length > 0) {
            let totalRate = 0;
            for (let i = 0; i < listReview.length; i++) {
                totalRate += +listReview[i].rating;
            }
            const avg = totalRate / listReview.length;
            setTotalReview(avg);

            if (props.onRatingCalculated) {
                props.onRatingCalculated(avg, listReview.length); // Gửi về parent: avg + total reviews
            }
        } else {
            setTotalReview(0);
            if (props.onRatingCalculated) {
                props.onRatingCalculated(0, 0); // Trường hợp không có đánh giá
            }
        }
    }, [listReview]);

    let fetchListOrder = async () => {
        let reviews = clientApi.service('reviews');
        try {
            let response = await reviews.find({ productID: props.productId });
            if (response.EC === 0) {
                setListReview(response.DT);
            } else {
                message.error(response.EM);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="product-review">
            <h2>Product ratings</h2>
            <div className="rating-summary">
                <Row>
                    <Col span={12}>
                        <div className="d-flex align-items-end overall-rating">
                            <Rate disabled value={+totalReview}></Rate>
                            <h3 className="ms-5">{totalReview} out of 5</h3>

                        </div>
                    </Col>
                </Row>
            </div>
            <hr className="my-3" />
            <div className="reviews-list">
                {listReview.map((review, index) => (
                    <div className="review-item" key={index}>
                        <Avatar src={review?.userID?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} size={64} />
                        <div className="review-content">
                            <h4>{review?.userID?.lastName + " " + review?.userID?.firstName}</h4>
                            <p>{review.comment}</p>
                            <Rate disabled value={review.rating} />
                            <div className="review-actions">
                                <span>👍 {0}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {listReview.length === 0 && <p>Không có đánh giá nào.</p>}
            </div>
        </div>
    );
};

export default ProductReview;
