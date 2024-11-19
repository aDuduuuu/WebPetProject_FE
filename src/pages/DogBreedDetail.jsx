import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from '../components/Header'; // Import Header component
import '../css/DogBreedDetail.css'; // Import CSS
import birthdayIcon from '../pictures/icons8-birthday-cake-100.png';
import heightIcon from '../pictures/icons8-height-50.png';
import weightIcon from '../pictures/icons8-weight-50.png';
import clientApi from '../client-api/rest-client';

const DogBreedDetail = () => {
  const { breedId } = useParams();
  const [dogBreed, setDogBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isColorsVisible, setIsColorsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const [isFamilyLifeVisible, setFamilyLifeVisible] = useState(false);
  const [isPhysicalVisible, setPhysicalVisible] = useState(false);
  const [isSocialVisible, setSocialVisible] = useState(false);
  const [isPersonalVisible, setPersonalVisible] = useState(false);
  useEffect(() => {
    const fetchDogBreedDetails = async () => {
      setLoading(true);
      setError(null);

      let authen = clientApi.service('dogbreeds');
      try {
        const response = await authen.get(breedId);
        if (response.EC === 0) {
          setDogBreed(response.DT);
        } else {
          setError(response.EM);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("An error occurred while fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDogBreedDetails();
  }, [breedId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const images = [dogBreed.image, dogBreed.image1, dogBreed.image2, dogBreed.image3, dogBreed.image4].filter(Boolean);


  // Cấu hình cho slider chính và thumbnail
  const settingsMain = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: '50px',
  };

  const toggleColorsVisibility = () => {
    setIsColorsVisible(!isColorsVisible); // Đảo ngược trạng thái khi bấm vào tiêu đề
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded); // Đảo ngược trạng thái mở rộng/thu gọn
  };

  const toggleDesescription2 = () => {
    setIsExpanded2(!isExpanded2); // Đảo ngược trạng thái mở rộng/thu gọn
  };

  const toggleFamilyLifeVisibility = () => {
    setFamilyLifeVisible(!isFamilyLifeVisible);
  };

  const togglePhysicalVisibility = () => {
    setPhysicalVisible(!isPhysicalVisible);
  };

  const toggleSocialVisibility = () => {
    setSocialVisible(!isSocialVisible);
  };

  const togglePersonalVisibility = () => {
    setPersonalVisible(!isPersonalVisible);
  };

  return (
    <div className="dog-breed-detail-page">
      {/* Thêm Header component */}
      <Header />

      {/* Phần tên, mô tả, nhóm, và carousel */}
      <div className="dog-breed-detail">
        <h1>{dogBreed.name}</h1>

        <div className="flex items-center space-x-4 mb-6">
          <button className="group-button">
            {dogBreed.group || "Unknown Group"}
          </button>
        </div>

        {/* Carousel chính */}
        <div className="w-2/3 mb-6">
          <Slider {...settingsMain} className="main-slider mb-4">
            {images.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`${dogBreed.name} - ${index}`}
                  className="carousel-image"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Phần thông tin chi tiết phía dưới */}
      <div className="dog-breed-info">

        <div className="physical-attributes-container bg-[#b8d5c0] p-6 rounded-lg flex items-center space-x-8 justify-center">
          {/* Ảnh chó */}
          <div className="dog-image">
            <img src={dogBreed.image3} alt={dogBreed.name} className="w-32 h-32 rounded-lg object-cover" />
          </div>

          {/* Thông tin chiều cao */}
          <div className="dog-info text-center">
            <img src={heightIcon} alt="Chiều cao" className="icon" />
            <h3 className="font-bold text-lg">Height</h3>
            <p>{dogBreed.height.min} - {dogBreed.height.max} inches</p>
          </div>

          {/* Thông tin cân nặng */}
          <div className="dog-info text-center">
            <img src={weightIcon} alt="Cân nặng" className="icon" />
            <h3 className="font-bold text-lg">Weight</h3>
            <p>{dogBreed.weight.min} - {dogBreed.weight.max} lbs</p>
          </div>

          {/* Tuổi thọ trung bình */}
          <div className="dog-info text-center">
            <img src={birthdayIcon} alt="Tuổi thọ" className="icon" />
            <h3 className="font-bold text-lg">Life Expectancy</h3>
            <p>{dogBreed.lifespan.min} - {dogBreed.lifespan.max} year</p>
          </div>
        </div>

        <div>
          {/* Tiêu đề cho phần Family Life */}
          <p className="colors-title" onClick={toggleFamilyLifeVisibility}>
            FAMILY LIFE
          </p>

          {/* Danh sách các thông tin về gia đình, chỉ hiển thị khi isFamilyLifeVisible là true */}
          {isFamilyLifeVisible && (
            <div className="temperament-levels-section">
              <div className="trait-section">
                {/* Affectionate with Family */}
                {dogBreed.affectionateWithFamily !== undefined && (
                  <div className="trait">
                    <h4>Affectionate with family</h4>
                    <div className="rating-bar-container">
                      <p>Independent</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.affectionateWithFamily ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>Lovely-dovey</p>
                    </div>
                  </div>
                )}

                {/* Good with Other Dogs */}
                {dogBreed.goodWithOtherDogs !== undefined && (
                  <div className="trait">
                    <h4>Good with other dogs</h4>
                    <div className="rating-bar-container">
                      <p>Not recommended</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.goodWithOtherDogs ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>Good with other dogs</p>
                    </div>
                  </div>
                )}

                {/* Good with Young Children */}
                {dogBreed.goodWithYoungChildren !== undefined && (
                  <div className="trait">
                    <h4>Good with young children</h4>
                    <div className="rating-bar-container">
                      <p>Not recommended</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.goodWithYoungChildren ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>Good with young children</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          {/* Tiêu đề cho phần Family Life */}
          <p className="colors-title" onClick={togglePhysicalVisibility}>
            PHYSICAL
          </p>

          {/* Danh sách các thông tin về gia đình, chỉ hiển thị khi isFamilyLifeVisible là true */}
          {isPhysicalVisible && (
            <div className="temperament-levels-section">
              <div className="trait-section">
                {dogBreed.sheddingLevel !== undefined && (
                  <div className="trait">
                    <h4>Shedding level</h4>
                    <div className="rating-bar-container">
                      <p>No shedding</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.sheddingLevel ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>Hair everywhere</p>
                    </div>
                  </div>
                )}

                {dogBreed.coatGroomingFrequency !== undefined && (
                  <div className="trait">
                    <h4>Coat grooming frequency</h4>
                    <div className="rating-bar-container">
                      <p>Monthly</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.coatGroomingFrequency ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>Daily</p>
                    </div>
                  </div>
                )}

                {dogBreed.droolingLevel !== undefined && (
                  <div className="trait">
                    <h4>Drooling level</h4>
                    <div className="rating-bar-container">
                      <p>Less likely to drool</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.droolingLevel ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>Always have a Towel</p>
                    </div>
                  </div>
                )}
              </div>
              <div id="coat-details" className="coat-details">
                {/* Coat Type Section */}
                <div className="coat-type">
                  <h3>Coat Type</h3>
                  <ul id="coatTypeList">
                    {[
                      "Wiry",
                      "Hairless",
                      "Smooth",
                      "Rough",
                      "Corded",
                      "Double",
                      "Curly",
                      "Wavy",
                      "Silky",
                    ].map((type) => (
                      <li
                        key={type}
                        className={dogBreed.coatType.includes(type) ? "selected" : "disabled"}
                      >
                        {type}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coat Length Section */}
                <div className="coat-length">
                  <h3>Coat Length</h3>
                  <ul id="coatLengthList">
                    {["Short", "Medium", "Long"].map((length) => (
                      <li
                        key={length}
                        className={dogBreed.coatLength.includes(length) ? "selected" : "disabled"}
                      >
                        {length}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          {/* Tiêu đề cho phần Family Life */}
          <p className="colors-title" onClick={toggleSocialVisibility}>
            SOCIAL
          </p>

          {/* Danh sách các thông tin về gia đình, chỉ hiển thị khi isFamilyLifeVisible là true */}
          {isSocialVisible && (
            <div className="temperament-levels-section">
              <div className="trait-row">
                {/* Openness to strangers */}
                {dogBreed.opennessToStrangers !== undefined && (
                  <div className="trait">
                    <h4>Openness to strangers</h4>
                    <div className="rating-bar-container">
                      <p>Reserved</p>
                      <div className="rating-bar">
                        {Array(5)
                          .fill()
                          .map((_, index) => (
                            <span key={index} className={index < dogBreed.opennessToStrangers ? "filled" : ""}></span>
                          ))}
                      </div>
                      <p>Everyone is my best friend</p>
                    </div>
                  </div>
                )}

                {/* Watchdog/Protective nature */}
                {dogBreed.watchdogProtectiveNature !== undefined && (
                  <div className="trait">
                    <h4>Watchdog/Protective nature</h4>
                    <div className="rating-bar-container">
                      <p>What's mine is yours</p>
                      <div className="rating-bar">
                        {Array(5)
                          .fill()
                          .map((_, index) => (
                            <span key={index} className={index < dogBreed.watchdogProtectiveNature ? "filled" : ""}></span>
                          ))}
                      </div>
                      <p>Vigilant</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="trait-row">
                {/* Playfulness level */}
                {dogBreed.playfulnessLevel !== undefined && (
                  <div className="trait">
                    <h4>Playfulness level</h4>
                    <div className="rating-bar-container">
                      <p>Only when you want to play</p>
                      <div className="rating-bar">
                        {Array(5)
                          .fill()
                          .map((_, index) => (
                            <span key={index} className={index < dogBreed.playfulnessLevel ? "filled" : ""}></span>
                          ))}
                      </div>
                      <p>Non-stop</p>
                    </div>
                  </div>
                )}

                {/* Adaptability level */}
                {dogBreed.adaptabilityLevel !== undefined && (
                  <div className="trait">
                    <h4>Adaptability level</h4>
                    <div className="rating-bar-container">
                      <p>Live for routine</p>
                      <div className="rating-bar">
                        {Array(5)
                          .fill()
                          .map((_, index) => (
                            <span key={index} className={index < dogBreed.adaptabilityLevel ? "filled" : ""}></span>
                          ))}
                      </div>
                      <p>Highly Adaptable</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          {/* Tiêu đề cho phần Family Life */}
          <p className="colors-title" onClick={togglePersonalVisibility}>
            PERSONAL
          </p>

          {/* Danh sách các thông tin về gia đình, chỉ hiển thị khi isFamilyLifeVisible là true */}
          {isPersonalVisible && (
            <div className="temperament-levels-section">
              <div className="trait-row">
                {/* Trainability level */}
                {dogBreed.trainabilityLevel !== undefined && (
                  <div className="trait">
                    <h4>Trainability level</h4>
                    <div className="rating-bar-container">
                      <p>Self-willed</p>
                      <div className="rating-bar">
                        {Array(5)
                          .fill()
                          .map((_, index) => (
                            <span key={index} className={index < dogBreed.trainabilityLevel ? "filled" : ""}></span>
                          ))}
                      </div>
                      <p>Eager to please</p>
                    </div>
                  </div>
                )}

                {/* Watchdog/Protective nature */}
                {dogBreed.barkingLevel !== undefined && (
                  <div className="trait">
                    <h4>Backing level</h4>
                    <div className="rating-bar-container">
                      <p>Only to alert</p>
                      <div className="rating-bar">
                        {Array(5)
                          .fill()
                          .map((_, index) => (
                            <span key={index} className={index < dogBreed.barkingLevel ? "filled" : ""}></span>
                          ))}
                      </div>
                      <p>Very vocal</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="trait-row">
                {/* Energy level */}
                {dogBreed.energyLevel !== undefined && (
                  <div className="trait">
                    <h4>Energy level</h4>
                    <div className="rating-bar-container">
                      <p>Couch potato</p>
                      <div className="rating-bar">
                        {Array(5)
                          .fill()
                          .map((_, index) => (
                            <span key={index} className={index < dogBreed.energyLevel ? "filled" : ""}></span>
                          ))}
                      </div>
                      <p>High energy</p>
                    </div>
                  </div>
                )}

                {/* Adaptability level */}
                {dogBreed.mentalStimulationNeeds !== undefined && (
                  <div className="trait">
                    <h4>Mental stimulation needs</h4>
                    <div className="rating-bar-container">
                      <p>Happy to lounge</p>
                      <div className="rating-bar">
                        {Array(5)
                          .fill()
                          .map((_, index) => (
                            <span key={index} className={index < dogBreed.mentalStimulationNeeds ? "filled" : ""}></span>
                          ))}
                      </div>
                      <p>Needs a job or activity</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="colors-title" onClick={toggleColorsVisibility}>
          Colors:
        </p>

        {/* Danh sách màu sắc, chỉ hiển thị khi isColorsVisible là true */}
        {isColorsVisible && (
          <ul className="dog-colors-list">
            {dogBreed.colors.map((color, index) => (
              <li key={index} className="dog-color-item">
                {color}
              </li>
            ))}
          </ul>
        )}

        <div className="dog-description-container">
          <div className="dog-description-content">
            {/* Dog Image */}
            <div className="dog-description-image">
              <img src={dogBreed.image1} alt={dogBreed.name} />
            </div>

            {/* Dog Description */}
            <div className="dog-description-text">
              <h2>About the bread</h2>
              <p className={isExpanded2 ? 'expanded' : 'collapsed'}>{dogBreed.description}</p>
              <button className="toggle-button" onClick={toggleDesescription2}>
                {isExpanded2 ? 'READ LESS' : 'READ MORE'}
              </button>
            </div>
          </div>
        </div>

        <div className="dog-description-container">
          <div className="dog-description-content">
            {/* Hình ảnh giống chó */}
            <div className="dog-description-image">
              <img src={dogBreed.image2} alt={dogBreed.name} />
            </div>

            {/* Mô tả lịch sử giống chó */}
            <div className="dog-description-text">
              <h2>History</h2>
              <p className={isExpanded ? 'expanded' : 'collapsed'}>{dogBreed.history}</p>
              <button className="toggle-button" onClick={toggleDescription}>
                {isExpanded ? 'READ LESS' : 'READ MORE'}
              </button>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
};


export default DogBreedDetail;
