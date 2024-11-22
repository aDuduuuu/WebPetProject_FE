import axios from 'axios';  // tải thư viện này
import CryptoJS from 'crypto-js';  //tải thư viện này
const CLOUD_NAME = "dggrqpioe"
const UPLOAD_PRESET = "image1"  // Giá trị này trong Cloudinary nhe
const CLOUDINARY_API_KEY = "698641687486338"
const CLOUDINARY_API_SECRET = "rT6qM9R33LcUzHw9LSScyWVynJc"  // Giá trị này trong Cloudinary nhe

// Hàm tạo chữ ký (signature)
const generateSignature = (timestamp, folder) => {
    const stringToSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=${UPLOAD_PRESET}`;  // Chuỗi cần ký bao gồm folder, timestamp và upload_preset
    return CryptoJS.SHA1(stringToSign + CLOUDINARY_API_SECRET).toString(CryptoJS.enc.Hex);  // Kết hợp với apiSecret
};
// Hàm upload ảnh lên Cloudinary
export const uploadToCloudinary = async (file, folder, onProgress) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(timestamp, folder);  // Tạo chữ ký
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);  // Chữ ký
    formData.append("folder", folder);
    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);  // Cập nhật tiến trình upload
                },
            }
        );
        return response.data.secure_url;  // Trả về URL ảnh đã upload
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.response?.data || error.message);
        throw error;  // Ném lỗi để xử lý ở nơi gọi
    }
};
