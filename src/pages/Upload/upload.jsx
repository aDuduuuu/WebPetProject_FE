import { useState } from "react";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { CloudUploadOutlined } from '@ant-design/icons';
import "./Upload.scss";
import { message, Progress } from "antd";

const Upload = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    let [urlImage, setUrlImage] = useState("");

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true); // Bắt đầu upload
        setUploadProgress(0); // Đặt lại tiến trình về 0
        try {
            // Gọi hàm upload với callback để cập nhật tiến trình   ----> Department này là tạo thư mục trên cloud để biết ảnh ở thư mục nào á
            const url = await uploadToCloudinary(file, "image1", (progress) => {
                setUploadProgress(progress);
            });
            setUrlImage(url); // Lưu URL ảnh sau khi upload
            message.success("Upload thành công!");
        } catch (error) {
            message.error("Upload thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setUploading(false); // Kết thúc upload
        }
    };

    return (
        <div className='image-upload'>
            <input type="file" id='input-upload' hidden={true} onChange={handleImageChange} />
            <div className='container'>
                <span><CloudUploadOutlined /></span>
                <div><span htmlFor={"input-upload"}
                    onClick={() => document.getElementById('input-upload').click()}>Chọn ảnh</span> đăng tải.</div>
                {uploading && (
                    <div style={{ marginTop: '20px', width: '100%' }}>
                        <Progress percent={uploadProgress} status="active" />
                    </div>
                )}
                {urlImage && (
                    <div>
                        <img src={urlImage} alt="Uploaded" style={{ width: "100%", height: "250px", borderRadius: "10px" }} />
                    </div>
                )}
            </div>
        </div>
    );
}
export default Upload;
