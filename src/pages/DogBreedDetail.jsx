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
import Footer from '../components/Footer';

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
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

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

  const toggleModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setShowModal(!showModal);
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Affectionate with Family",
                        "How affectionate a breed is likely to be with family members, or other people he knows well. Some breeds can be aloof with everyone but their owner, while other breeds treat everyone they know like their best friend."
                      )}
                    >
                      Affectionate with Family
                    </h4>
                    <div className="rating-bar-container">
                      <p>Independent</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span
                            key={index}
                            className={index < dogBreed.affectionateWithFamily ? 'filled text-[#16423C]' : 'text-gray-400'}
                          ></span>
                        ))}
                      </div>
                      <p>Lovely-dovey</p>
                    </div>
                  </div>
                )}

                {/* Good with Other Dogs */}
                {dogBreed.goodWithOtherDogs !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Good with other dogs",
                        "How generally friendly a breed is towards other dogs. Dogs should always be supervised for interactions and introductions with other dogs, but some breeds are innately more likely to get along with other dogs, both at home and in public."
                      )}
                    >
                      Good with other dogs
                    </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Good with young children",
                        "A breed's level of tolerance and patience with childrens' behavior, and overall family-friendly nature. Dogs should always be supervised around young children, or children of any age who have little exposure to dogs."
                      )}
                    >
                      Good with young children
                    </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Shedding level",
                        "How much fur and hair you can expect the breed to leave behind. Breeds with high shedding will need to be brushed more frequently, are more likely to trigger certain types of allergies, and are more likely to require more consistent vacuuming and lint-rolling."
                      )}
                    >
                      Shedding level
                    </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Coat grooming frequency",
                        "How frequently a breed requires bathing, brushing, trimming, or other kinds of coat maintenance. Consider how much time, patience, and budget you have for this type of care when looking at the grooming effort needed. All breeds require regular nail trimming."
                      )}
                    >
                      Coat grooming frequency
                    </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Drooling level",
                        "How drool-prone a breed tends to be. If you're a neat freak, dogs that can leave ropes of slobber on your arm or big wet spots on your clothes may not be the right choice for you."
                      )}
                    >
                      Drooling level
                    </h4>
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
                  <h4
                    className="text-16423C cursor-pointer hover:underline mb-7 font-semibold"
                    onClick={() => toggleModal(
                      "Coat Type",
                      "Canine coats come in many different types, depending on the breed's purpose. Each coat type comes with different grooming needs, allergen potential, and shedding level. You may also just prefer the look or feel of certain coat types over others when choosing a family pet."
                    )}
                  >
                    Coat Type
                  </h4>
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
                <h4
                    className="text-16423C cursor-pointer hover:underline mt-7 mb-7 font-semibold"
                    onClick={() => toggleModal(
                      "Coat Length",
                      "How long the breed's coat is expected to be. Some long-haired breeds can be trimmed short, but this will require additional upkeep to maintain."
                    )}
                  >
                    Coat Length
                  </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Openness to strangers",
                        "How welcoming a breed is likely to be towards strangers. Some breeds will be reserved or cautious around all strangers, regardless of the location, while other breeds will be happy to meet a new human whenever one is around!"
                      )}
                    >
                      Openness to strangers
                    </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Watchdog/Protective nature",
                        "A breed's tendency to alert you that strangers are around. These breeds are more likely to react to any potential threat, whether it's the mailman or a squirrel outside the window. These breeds are likely to warm to strangers who enter the house and are accepted by their family."
                      )}
                    >
                      Watchdog/Protective nature
                    </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Playfulness level",
                        "How enthusiastic about play a breed is likely to be, even past the age of puppyhood. Some breeds will continue wanting to play tug-of-war or fetch well into their adult years, while others will be happy to just relax on the couch with you most of the time."
                      )}
                    >
                      Playfulness level
                    </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Adaptability level",
                        "How easily a breed handles change. This can include changes in living conditions, noise, weather, daily schedule, and other variations in day-to-day life."
                      )}
                    >
                      Adaptability level
                    </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Trainability level",
                        "How easy it will be to train your dog, and how willing your dog will be to learn new things. Some breeds just want to make their owner proud, while others prefer to do what they want, when they want to, wherever they want!"
                      )}
                    >
                      Trainability level
                    </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Backing level",
                        "How often this breed vocalizes, whether it's with barks or howls. While some breeds will bark at every passer-by or bird in the window, others will only bark in particular situations. Some barkless breeds can still be vocal, using other sounds to express themselves."
                      )}
                    >
                      Backing level
                    </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Energy level",
                        "The amount of exercise and mental stimulation a breed needs. High energy breeds are ready to go and eager for their next adventure. They'll spend their time running, jumping, and playing throughout the day. Low energy breeds are like couch potatoes - they're happy to simply lay around and snooze."
                      )}
                    >
                      Energy level
                    </h4>
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
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        "Mental stimulation needs",
                        "How much mental stimulation a breed needs to stay happy and healthy. Purpose-bred dogs can have jobs that require decision-making, problem-solving, concentration, or other qualities, and without the brain exercise they need, they'll create their own projects to keep their minds busy -- and they probably won't be the kind of projects you'd like."
                      )}
                    >
                      Mental stimulation needs
                    </h4>
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
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-16423C text-lg font-semibold mb-4">
              {modalTitle}
            </h3>
            <p className="text-16423C text-sm mb-4">
              {modalContent}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-16423C text-white px-4 py-2 rounded-md hover:bg-16423C/90"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};


export default DogBreedDetail;
