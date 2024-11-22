import axios from 'axios';

class RestClient {
    path = '';
    token = localStorage.getItem('token');

    async config(url) {
        // Cấu hình axios với URL cơ bản
        this.client = axios.create({
            baseURL: url,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Thiết lập interceptor để thêm token vào mỗi yêu cầu
        this.client.interceptors.request.use(
            config => {
                this.token = localStorage.getItem('token');
                if (this.token) {
                    config.headers['Authorization'] = `Bearer ${this.token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );
    }

    // Phương thức đăng nhập để lấy token
    async authenticate(data) {
        try {
            const response = await this.client.post('/authentication', data);
            this.token = response.data.token;
            return response.data;
        } catch (error) {
            console.error('Error in AUTHENTICATION:', error);
            throw error;
        }
    }

    // Phương thức để làm mới token khi hết hạn
    async reAuthenticate(refreshToken) {
        try {
            const response = await this.client.post('/refreshAuthentication', { refreshToken });
            this.token = response.data.token;
            return response.data;
        } catch (error) {
            console.error('Error in REAUTHENTICATION:', error);
            throw error;
        }
    }

    async get(objectId) {
        try {
            const response = await this.client.get(`${this.path}/${objectId}`);
            return response.data;
        } catch (error) {
            console.error('Error in GET:', error);
            throw error;
        }
    }

    async find(query) {
        try {
            const response = await this.client.get(this.path, { params: query });
            return response.data;
        } catch (error) {
            console.error('Error in FIND:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const response = await this.client.post(this.path, data);
            return response.data;
        } catch (error) {
            console.error('Error in CREATE:', error);
            throw error;
        }
    }

    async patch(objectId, data) {
        try {
            const response = await this.client.patch(`${this.path}/${objectId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error in PATCH:', error);
            throw error;
        }
    }

    async delete(objectId) {
        try {
            const response = await this.client.delete(`${this.path}/${objectId}`);
            return response.data;
        } catch (error) {
            console.error('Error in DELETE:', error);
            throw error;
        }
    }

    service(path) {
        this.path = path;
        return this;
    }
}

let clientApi = new RestClient();
clientApi.config('http://localhost:3000/api/');
export default clientApi;