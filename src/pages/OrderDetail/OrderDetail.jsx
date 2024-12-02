import { useNavigate, useParams } from "react-router-dom";
import "./OrderDetail.scss"
import { useEffect, useState } from "react";
import clientApi from "../../client-api/rest-client";
import { message } from "antd";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import OrderStatus from "./OrderProgress";
import { formatCurrency, formatDay, formatIOSDate } from "../../utils/format";
const statusOrder = {
    "ordered": 0,
    "waitingShip": 1,
    "shipping": 2,
    "delivered": 3
}
const OrderDetail = () => {
    const { id } = useParams();
    let [orderDetail, setOrderDetail] = useState({});
    let navigate = useNavigate();
    useEffect(() => {
        fetchOrderDetail();
    }, []);
    let fetchOrderDetail = async () => {
        let order = clientApi.service('order');
        try {
            let response = await order.get(id)
            if (response.EC === 0) {
                setOrderDetail(response.DT);
            } else {
                message.error(response.EM);
            }
        } catch (error) {
            console.log(error);
        }
    }
    let handleCancel = async () => {
        if (orderDetail.status !== "ordered") {
            message.error("Can not cancel order");
            return;
        }
        let order = clientApi.service('order');
        try {
            let data = { ...orderDetail, status: "cancel" };
            let response = await order.patch(id, data);
            if (response.EC === 0) {
                message.success("Cancel order successfully");
                navigate("/orderList");
            } else {
                message.error(response.EM);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Header />
            <div className="orderDetail">
                <div className="head-order">Order</div>
                <div className="bg"></div>
                <div className="yourOrder">
                    <div className="title">Your ordered</div>
                    <div className="expectDay">Estimated delivery: {formatDay(orderDetail?.expectDeliveryDate?.from || 0) + "  -  " + formatDay(orderDetail?.expectDeliveryDate?.to || 0)}</div>
                </div>
                <div className="process-order">
                    <OrderStatus value={statusOrder[orderDetail?.status || 1]} />
                </div>
                <div className="info-bg">
                    <div className="info">
                        <div className="title mb-4">Recipient information</div>
                        <div className="view">
                            <div className="mb-3"><span className="me-3">{orderDetail?.orderUser?.fullName}</span><span>{orderDetail?.orderUser?.phoneNumber}</span></div>
                            <div className="mb-3">{orderDetail?.orderUser?.address}</div>
                            <div className="mb-5">{orderDetail?.orderUser?.ward + ", " + orderDetail?.orderUser?.district + ", " + orderDetail?.orderUser?.city + ", Vietnam"}</div>
                        </div>
                    </div>
                </div>
                <div className="list-product">
                    <div className="title">Product list</div>
                    <div className="row justify-content-start ">
                        {orderDetail?.orderItems?.length > 0 && orderDetail?.orderItems?.map((item, index) =>
                            <div className="product col-6" key={index}>
                                <div className="item">
                                    <img src={item?.product?.image || "https://res.cloudinary.com/degcwwwii/image/upload/v1732013626/PetCare/ncxgbjfl4cmvuzuyhseb.jpg"} alt="product" />
                                    <div className="info">
                                        <div className="name mb-3">{item?.product?.name || "Product name"}</div>
                                        <div className="mb-2"> Quantity<span className="ms-3">{item?.quantity || 0}</span></div>
                                        <div>Price <span className="ms-2">{formatCurrency(item?.product?.price || 0)}</span></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="brief-bg">
                    <div className="brief w-100">
                        <div className="title">Order Overview</div>
                        <div className="mb-3 d-flex justify-content-between w-100">
                            <span>Total ({orderDetail?.orderItems?.length} products)</span>
                            <span>{formatCurrency(orderDetail?.totalPrice || 0)}</span>
                        </div>
                        <div className="mb-3 d-flex justify-content-between  w-100"><span>{orderDetail?.shipmentMethod?.name}</span> <span>{formatCurrency(orderDetail?.shipmentMethod?.price)}</span></div>
                        <div className="mb-3 d-flex justify-content-between  w-100">Tax <span>{formatCurrency(orderDetail?.tax)}</span></div>
                        <hr />
                        <div className="mt-3 d-flex justify-content-between  w-100">Total price <span><b className="pe-2">{formatCurrency(orderDetail?.totalAmount)}</b></span> </div>

                    </div>
                </div>
                <div className="detail">
                    <div className="title">Order detail</div>
                    <div className="mb-2">
                        <span><b>Order code: </b></span>
                        <span className="ms-4">{orderDetail?._id}</span>
                    </div>
                    <div className="mb-2">
                        <span><b>Order date: </b></span>
                        <span className="ms-4">{formatIOSDate(orderDetail?.orderDate)} </span>
                    </div>
                    <div className="mb-2">
                        <span><b>Payment method: </b></span>
                        <span className="ms-4">{orderDetail?.paymentMethod?.name}</span>
                    </div>
                </div>
                <div className="cancel">
                    <div className="d-flex justify-content-center mt-5">
                        {orderDetail?.status === "ordered" && <button className="btn-cancel" onClick={() => handleCancel()}>Cancel order</button>}
                        {orderDetail?.status === "delivered" && <button className="btn-review" onClick={() => navigate(`/orderReview/${id}`)}>Review</button>}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )


};
export default OrderDetail;