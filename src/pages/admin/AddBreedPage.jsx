import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import clientApi from '../../client-api/rest-client';
import { FaArrowLeft } from 'react-icons/fa';

const enumOptions = {
  coatType: ['Wiry', 'Hairless', 'Smooth', 'Rough', 'Corded', 'Double', 'Curly', 'Wavy', 'Silky'],
  coatLength: ['Short', 'Medium', 'Long'],
  group: ['Sporting Group', 'Hound Group', 'Working Group', 'Toy Group', 'Herding Group', 'Foundation Stock Service', 'Terrier Group', 'Non-Sporting Group', 'Miscellaneous Class'],
  activityLevel: ['Needs Lots Of Activity', 'Regular Exercise', 'Energetic', 'Calm'],
  barkingLevelDescription: ['When Necessary', 'Infrequent', 'Medium', 'Frequent', 'Likes To Be Vocal'],
  characteristics: ['Smallest Dog Breeds', 'Largest Dog Breeds', 'Hypoallergenic Dogs', 'Best Guard Dogs', 'Hairless Dog Breeds', 'Large Dog Breeds', 'Medium Dog Breeds', 'Smartest Breeds Of Dogs', 'Best Family Dogs', 'Best Dog Breeds For Kids', 'Best Dogs For Apartment Dwellers', 'Smartest Breeds Of Dog'],
  size: ['XSmall', 'Small', 'Medium', 'Large', 'XLarge'],
  shedding: ['Infrequent', 'Frequent', 'Regularly', 'Seasonal', 'Occasional'],
  trainability: ['May Be Stubborn', 'Eager To Please', 'Easy Training', 'Agreeable', 'Independent'],
};

const AddBreedPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', image: '', image1: '', image2: '', image3: '', image4: '',
    height: { min: '', max: '' }, weight: { min: '', max: '' }, lifespan: { min: '', max: '' },
    affectionateWithFamily: 1, goodWithOtherDogs: 1, goodWithYoungChildren: 1,
    sheddingLevel: 1, coatGroomingFrequency: 1, droolingLevel: 1,
    coatType: [], coatLength: [], opennessToStrangers: 1, watchdogProtectiveNature: 1,
    playfulnessLevel: 1, adaptabilityLevel: 1, trainabilityLevel: 1,
    barkingLevel: 1, energyLevel: 1, mentalStimulationNeeds: 1,
    colors: [], description: '', history: '', group: '', activityLevel: '',
    barkingLevelDescription: '', characteristics: [], size: '', shedding: '', trainability: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, key, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => {
      const exists = prev[name].includes(value);
      const updated = exists ? prev[name].filter((v) => v !== value) : [...prev[name], value];
      return { ...prev, [name]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await clientApi.service('dogbreeds').create(formData);
      if (response.EC === 0) {
        navigate('/dashboard/dog-breeds');
      } else {
        alert('Failed to add breed: ' + response.EM);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data) alert(JSON.stringify(err.response.data));
      else alert('Server error.');
    }
  };

  const renderLevelSelector = (label, name) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        {[1, 2, 3, 4, 5].map((level) => (
          <option key={level} value={level}>{level} - {['Very Low', 'Low', 'Medium', 'High', 'Very High'][level - 1]}</option>
        ))}
      </select>
    </div>
  );

  return (
    <AdminLayout>
      <div className="bg-white shadow rounded-xl p-6 max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#184440]">Add New Dog Breed</h2>
          <button
            onClick={() => navigate('/dashboard/dog-breeds')}
            className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
          >
            <FaArrowLeft /> Back to Breed List
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Images */}
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Breed Name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
            <input type="text" name="image" placeholder="Main Image URL" value={formData.image} onChange={handleChange} className="w-full border p-2 rounded" required />
            {[1, 2, 3, 4].map((i) => (
              <input key={i} type="text" name={`image${i}`} placeholder={`Image ${i} URL`} value={formData[`image${i}`]} onChange={handleChange} className="w-full border p-2 rounded" />
            ))}
          </div>

          {/* Dimensions */}
          {["height", "weight", "lifespan"].map((field) => (
            <div key={field} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <input type="number" placeholder={`${field} min`} value={formData[field].min} onChange={(e) => handleNestedChange(field, 'min', e.target.value)} className="border p-2 rounded" required />
              <input type="number" placeholder={`${field} max`} value={formData[field].max} onChange={(e) => handleNestedChange(field, 'max', e.target.value)} className="border p-2 rounded" required />
            </div>
          ))}

          {/* Levels */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['affectionateWithFamily','goodWithOtherDogs','goodWithYoungChildren','sheddingLevel','coatGroomingFrequency','droolingLevel','opennessToStrangers','watchdogProtectiveNature','playfulnessLevel','adaptabilityLevel','trainabilityLevel','barkingLevel','energyLevel','mentalStimulationNeeds'].map((field) =>
              renderLevelSelector(field, field)
            )}
          </div>

          {/* Description */}
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" required />
          <textarea name="history" placeholder="History" value={formData.history} onChange={handleChange} className="w-full border p-2 rounded" required />

          {/* Enums (Select) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["group", "activityLevel", "barkingLevelDescription", "size", "shedding", "trainability"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
                <select name={field} value={formData[field]} onChange={handleChange} className="w-full border p-2 rounded" required>
                  <option value="">Select {field}</option>
                  {enumOptions[field].map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Multi-selects */}
          {["coatType", "coatLength", "characteristics", "colors"].map((field) => (
            <div key={field}>
              <p className="font-semibold text-sm text-gray-700 mb-2 capitalize">{field}</p>
              <div className="flex flex-wrap gap-4">
                {(enumOptions[field] || ["Black", "White", "Brown", "Golden", "Grey"]).map((val) => (
                  <label key={val} className="flex items-center text-sm gap-1">
                    <input type="checkbox" checked={formData[field].includes(val)} onChange={() => handleMultiSelect(field, val)} className="accent-[#184440]" />
                    {val}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="flex justify-end">
            <button type="submit" className="bg-[#184440] text-white px-6 py-2 rounded hover:bg-[#145c54]">
              Save Breed
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddBreedPage;
