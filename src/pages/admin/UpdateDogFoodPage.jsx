import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import clientApi from '../../client-api/rest-client';
import Swal from 'sweetalert2';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import { Progress } from 'antd';

const UpdateDogFoodPage = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    isSafe: true,
    effects: '',
    note: '',
    image: '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const primaryColor = '#184440';

  // Fetch current food data
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await clientApi.service('dogfoods').get(foodId);
        if (res.EC === 0) {
          setFormData(res.DT);
        } else {
          setError(res.EM || 'Cannot find dog food');
        }
      } catch (err) {
        setError('Failed to load dog food data');
        console.error(err);
      }
    };
    fetchFood();
  }, [foodId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadToCloudinary(file, 'DogFoodImages', (progress) => {
        setUploadProgress(progress);
      });
      setFormData((prev) => ({ ...prev, image: url }));
      Swal.fire('Uploaded!', 'Image uploaded to Cloudinary.', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to upload image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await clientApi.service('dogfoods').patch(foodId, formData);
      if (res.EC === 0) {
        Swal.fire('Success', 'Dog food updated successfully!', 'success');
        navigate('/dashboard/dog-foods');
      } else {
        setError(res.EM || 'Failed to update dog food');
      }
    } catch (err) {
      setError('Server error during update');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto bg-white shadow p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">✏️ Update Dog Food</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium">Is Safe?</label>
            <input
              type="checkbox"
              name="isSafe"
              checked={formData.isSafe}
              onChange={handleChange}
              className="mr-2"
            />
            <span>{formData.isSafe ? 'Yes' : 'No'}</span>
          </div>

          <div>
            <label className="block font-medium">Effects</label>
            <textarea
              name="effects"
              value={formData.effects}
              onChange={handleChange}
              rows="4"
              className="w-full border px-4 py-2 rounded-md"
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-medium">Note (optional)</label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium">Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {uploading && (
              <div className="mt-3">
                <Progress percent={uploadProgress} status="active" />
              </div>
            )}
            {formData.image && (
              <div className="mt-4">
                <img
                  src={formData.image}
                  alt="Dog Food"
                  className="rounded-md w-full max-h-64 object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-md text-white font-semibold"
              style={{ backgroundColor: primaryColor }}
            >
              {loading ? 'Updating...' : 'Update Food'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default UpdateDogFoodPage;
