import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import clientApi from '../../client-api/rest-client';
import Swal from 'sweetalert2';

const DogFoodDetailPage = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [error, setError] = useState(null);
  const primaryColor = '#184440';

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await clientApi.service('dogfoods').get(foodId);
        if (res.EC === 0) {
          setFood(res.DT);
        } else {
          setError(res.EM || 'Failed to fetch dog food');
        }
      } catch (err) {
        setError('Server error while fetching data');
        console.error(err);
      }
    };

    fetchFood();
  }, [foodId]);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-white shadow-md p-8 rounded-xl">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : !food ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                🍖 {food.name} - Details
              </h2>
              <button
                onClick={() => navigate('/dashboard/dog-foods')}
                className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
              >
                ← Back to List
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-auto max-h-[350px] object-cover rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-lg">Name:</h4>
                  <p>{food.name}</p>
                </div>

                <div>
                  <h4 className="font-bold text-lg">Category:</h4>
                  <p>{food.category || 'N/A'}</p>
                </div>

                <div>
                  <h4 className="font-bold text-lg">Is it safe for dogs?</h4>
                  <p className={food.isSafe ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {food.isSafe ? 'Yes' : 'No'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-lg">Effects / Reactions:</h4>
                  <p className="text-gray-700 whitespace-pre-line">{food.effects}</p>
                </div>

                {food.note && (
                  <div>
                    <h4 className="font-bold text-lg">Additional Note:</h4>
                    <p className="text-gray-600">{food.note}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default DogFoodDetailPage;
