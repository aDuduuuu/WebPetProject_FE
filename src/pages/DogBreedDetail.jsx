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
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
  const { t, i18n } = useTranslation();

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


  const CustomPrevArrow = ({ onClick }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="absolute top-1/2 left-2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-teal-800 p-2 rounded-full shadow transition duration-300"
    >
      <FaChevronLeft size={20} />
    </motion.button>
  );
  
  const CustomNextArrow = ({ onClick }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="absolute top-1/2 right-2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-teal-800 p-2 rounded-full shadow transition duration-300"
    >
      <FaChevronRight size={20} />
    </motion.button>
  );
  
  // Cập nhật settingsMain để sử dụng custom arrows
  const settingsMain = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    appendDots: dots => (
      <div style={{ bottom: "-25px" }}>
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-3 h-3 bg-teal-500 rounded-full cursor-pointer"></div>
    )
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

  const breedTranslations = {
    'Affenpinscher': t('BREED_Affenpinscher'),
    'Afghan Hound': t('BREED_AfghanHound'),
    'Airedale Terrier': t('BREED_AiredaleTerrier'),
    'Akita': t('BREED_Akita'),
    'Alaskan Klee Kai': t('BREED_AlaskanKleeKai'),
    'Alaskan Malamute': t('BREED_AlaskanMalamute'),
    'American English Coonhound': t('BREED_AmericanEnglishCoonhound'),
    'American Eskimo Dog': t('BREED_AmericanEskimoDog'),
    'American Foxhound': t('BREED_AmericanFoxhound'),
    'American Hairless Terrier': t('BREED_AmericanHairlessTerrier'),
    'American Leopard Hound': t('BREED_AmericanLeopardHound'),
    'American Staffordshire Terrier': t('BREED_AmericanStaffordshireTerrier'),
    'American Water Spaniel': t('BREED_AmericanWaterSpaniel'),
    'Anatolian Shepherd Dog': t('BREED_AnatolianShepherdDog'),
    'Appenzeller Sennenhund': t('BREED_AppenzellerSennenhund'),
    'Australian Kelpie': t('BREED_AustralianKelpie'),
    'Azawakh': t('BREED_Azawakh'),
    'Barbado da Terceira': t('BREED_BarbadoDaTerceira'),
    'Barbet': t('BREED_Barbet'),
    'Bavarian Mountain Scent Hound': t('BREED_BavarianMountainScentHound'),
    'Bearded Collie': t('BREED_BeardedCollie'),
    'Beauceron': t('BREED_Beauceron'),
    'Bedlington Terrier': t('BREED_BedlingtonTerrier'),
    'Belgian Laekenois': t('BREED_BelgianLaekenois'),
    'Belgian Malinois': t('BREED_BelgianMalinois'),
    'Belgian Sheepdog': t('BREED_BelgianSheepdog'),
    'Belgian Tervuren': t('BREED_BelgianTervuren'),
    'Bergamasco Sheepdog': t('BREED_BergamascoSheepdog'),
    'Berger Picard': t('BREED_BergerPicard'),
    'Bernese Mountain Dog': t('BREED_BerneseMountainDog'),
    'Bichon Frise': t('BREED_BichonFrise'),
    'Biewer Terrier': t('BREED_BiewerTerrier'),
    'Black and Tan Coonhound': t('BREED_BlackAndTanCoonhound'),
    'Black Russian Terrier': t('BREED_BlackRussianTerrier'),
    'Bloodhound': t('BREED_Bloodhound'),
    'Bluetick Coonhound': t('BREED_BluetickCoonhound'),
    'Boerboel': t('BREED_Boerboel'),
    'Bohemian Shepherd': t('BREED_BohemianShepherd'),
    'Bolognese': t('BREED_Bolognese'),
    'Border Collie': t('BREED_BorderCollie'),
    'Border Terrier': t('BREED_BorderTerrier'),
    'Borzoi': t('BREED_Borzoi'),
    'Boston Terrier': t('BREED_BostonTerrier'),
    'Bouvier des Ardennes': t('BREED_BouvierDesArdennes'),
    'Bouvier des Flandres': t('BREED_BouvierDesFlandres'),
    'Boxer': t('BREED_Boxer'),
    'Boykin Spaniel': t('BREED_BoykinSpaniel'),
    'Bracco Italiano': t('BREED_BraccoItaliano'),
    'Braque du Bourbonnais': t('BREED_BraqueDuBourbonnais'),
    'Braque Francais Pyrenean': t('BREED_BraqueFrancaisPyrenean'), 
    'Brazilian Terrier': t('BREED_BrazilianTerrier'),
    'Briard': t('BREED_Briard'),
    'Brittany': t('BREED_Brittany'),
    'Broholmer': t('BREED_Broholmer'),
    'Brussels Griffon': t('BREED_BrusselsGriffon'),
    'Bull Terrier': t('BREED_BullTerrier'),
    'Bulldog': t('BREED_Bulldog'),
    'Bullmastiff': t('BREED_Bullmastiff'),
    'Cairn Terrier': t('BREED_CairnTerrier'),
    'Canaan Dog': t('BREED_CanaanDog'),
    'Cane Corso': t('BREED_CaneCorso'),
    'Cardigan Welsh Corgi': t('BREED_CardiganWelshCorgi'),
    'Carolina Dog': t('BREED_CarolinaDog'),
    'Catahoula Leopard Dog': t('BREED_CatahoulaLeopardDog'),
    'Caucasian Shepherd Dog': t('BREED_CaucasianShepherdDog'),
    'Cavalier King Charles Spaniel': t('BREED_CavalierKingCharlesSpaniel'),
    'Central Asian Shepherd Dog': t('BREED_CentralAsianShepherdDog'),
    'Cesky Terrier': t('BREED_CeskyTerrier'),
    'Chesapeake Bay Retriever': t('BREED_ChesapeakeBayRetriever'),
    'Chihuahua': t('BREED_Chihuahua'),
    'Chinese Crested': t('BREED_ChineseCrested'),
    'Chinese Shar-Pei': t('BREED_ChineseSharPei'),
    'Chinook': t('BREED_Chinook'),
    'Chow Chow': t('BREED_ChowChow'),
    'Cirneco dell’Etna': t('BREED_CirnecoDellEtna'),
    'Clumber Spaniel': t('BREED_ClumberSpaniel'),
    'Cocker Spaniel': t('BREED_CockerSpaniel'),
    'Collie': t('BREED_Collie'),
    'Coton de Tulear': t('BREED_CotonDeTulear'),
    'Croatian Sheepdog': t('BREED_CroatianSheepdog'),
    'Curly-Coated Retriever': t('BREED_CurlyCoatedRetriever'),
    'Czechoslovakian Vlciak': t('BREED_CzechoslovakianVlciak'),
    'Dachshund': t('BREED_Dachshund'),
    'Dalmatian': t('BREED_Dalmatian'),
    'Dandie Dinmont Terrier': t('BREED_DandieDinmontTerrier'),
    'Danish-Swedish Farmdog': t('BREED_DanishSwedishFarmdog'),
    'Deutscher Wachtelhund': t('BREED_DeutscherWachtelhund'),
    'Doberman Pinscher': t('BREED_DobermanPinscher'),
    'Dogo Argentino': t('BREED_DogoArgentino'),
    'Dogue de Bordeaux': t('BREED_DogueDeBordeaux'),
    'Drentsche Patrijshond': t('BREED_DrentschePatrijshond'),
    'Drever': t('BREED_Drever'),
    'Dutch Shepherd': t('BREED_DutchShepherd'),
    'English Cocker Spaniel': t('BREED_EnglishCockerSpaniel'),
    'English Foxhound': t('BREED_EnglishFoxhound'),
    'English Setter': t('BREED_EnglishSetter'),
    'English Springer Spaniel': t('BREED_EnglishSpringerSpaniel'),
    'English Toy Spaniel': t('BREED_EnglishToySpaniel'),
    'Entlebucher Mountain Dog': t('BREED_EntlebucherMountainDog'),
    'Estrela Mountain Dog': t('BREED_EstrelaMountainDog'),
    'Eurasier': t('BREED_Eurasier'),
    'Field Spaniel': t('BREED_FieldSpaniel'),
    'Finnish Lapphund': t('BREED_FinnishLapphund'),
    'Finnish Spitz': t('BREED_FinnishSpitz'),
    'Flat-Coated Retriever': t('BREED_FlatCoatedRetriever'),
    'French Bulldog': t('BREED_FrenchBulldog'),
    'French Spaniel': t('BREED_FrenchSpaniel'),
    'German Longhaired Pointer': t('BREED_GermanLonghairedPointer'),
    'German Pinscher': t('BREED_GermanPinscher'),
    'German Shepherd Dog': t('BREED_GermanShepherdDog'),
    'German Shorthaired Pointer': t('BREED_GermanShorthairedPointer'),
    'German Spitz': t('BREED_GermanSpitz'),
    'German Wirehaired Pointer': t('BREED_GermanWirehairedPointer'),
    'Giant Schnauzer': t('BREED_GiantSchnauzer'),
    'Glen of Imaal Terrier': t('BREED_GlenOfImaalTerrier'),
    'Golden Retriever': t('BREED_GoldenRetriever'),
    'Gordon Setter': t('BREED_GordonSetter'),
    'Grand Basset Griffon Vendéen': t('BREED_GrandBassetGriffonVendeen'),
    'Great Dane': t('BREED_GreatDane'),
    'Great Pyrenees': t('BREED_GreatPyrenees'),
    'Greater Swiss Mountain Dog': t('BREED_GreaterSwissMountainDog'),
    'Greyhound': t('BREED_Greyhound'),
    'Hamiltonstovare': t('BREED_Hamiltonstovare'),
    'Hanoverian Scenthound': t('BREED_HanoverianScenthound'),
    'Harrier': t('BREED_Harrier'),
    'Havanese': t('BREED_Havanese'),
    'Hokkaido': t('BREED_Hokkaido'),
    'Hovawart': t('BREED_Hovawart'),
    'Ibizan Hound': t('BREED_IbizanHound'),
    'Icelandic Sheepdog': t('BREED_IcelandicSheepdog'),
    'Irish Red and White Setter': t('BREED_IrishRedAndWhiteSetter'),
    'Irish Setter': t('BREED_IrishSetter'),
    'Irish Terrier': t('BREED_IrishTerrier'),
    'Irish Water Spaniel': t('BREED_IrishWaterSpaniel'),
    'Irish Wolfhound': t('BREED_IrishWolfhound'),
    'Italian Greyhound': t('BREED_ItalianGreyhound'),
    'Jagdterrier': t('BREED_Jagdterrier'),
    'Japanese Akita Inu': t('BREED_JapaneseAkitaInu'),
    'Japanese Chin': t('BREED_JapaneseChin'),
    'Japanese Spitz': t('BREED_JapaneseSpitz'),
    'Japanese Terrier': t('BREED_JapaneseTerrier'),
    'Kai Ken': t('BREED_KaiKen'),
    'Karelian Bear Dog': t('BREED_KarelianBearDog'),
    'Keeshond': t('BREED_Keeshond'),
    'Kerry Blue Terrier': t('BREED_KerryBlueTerrier'),
    'Kishu Ken': t('BREED_KishuKen'),
    'Komondor': t('BREED_Komondor'),
    'Korean Jindo Dog': t('BREED_KoreanJindoDog'),
    'Kromfohrlander': t('BREED_Kromfohrlander'),
    'Kuvasz': t('BREED_Kuvasz'),  
    'Labrador Retriever': t('BREED_LabradorRetriever'),
    'Lagotto Romagnolo': t('BREED_LagottoRomagnolo'),
    'Lakeland Terrier': t('BREED_LakelandTerrier'),
    'Lancashire Heeler': t('BREED_LancashireHeeler'),
    'Lapponian Herder': t('BREED_LapponianHerder'),
    'Large Munsterlander': t('BREED_LargeMunsterlander'),
    'Leonberger': t('BREED_Leonberger'),
    'Lhasa Apso': t('BREED_LhasaApso'),
    'Löwchen': t('BREED_Lowchen'),
    'Maltese': t('BREED_Maltese'),
    'Manchester Terrier (Standard)': t('BREED_ManchesterTerrierStandard'),
    'Manchester Terrier (Toy)': t('BREED_ManchesterTerrierToy'),
    'Mastiff': t('BREED_Mastiff'),
    'Miniature American Shepherd': t('BREED_MiniatureAmericanShepherd'),
    'Miniature Bull Terrier': t('BREED_MiniatureBullTerrier'),
    'Miniature Pinscher': t('BREED_MiniaturePinscher'),
    'Miniature Schnauzer': t('BREED_MiniatureSchnauzer'),
    'Mountain Cur': t('BREED_MountainCur'),
    'Mudi': t('BREED_Mudi'),
    'Neapolitan Mastiff': t('BREED_NeapolitanMastiff'),
    'Nederlandse Kooikerhondje': t('BREED_NederlandseKooikerhondje'),
    'Newfoundland': t('BREED_Newfoundland'),
    'Norfolk Terrier': t('BREED_NorfolkTerrier'),
    'Norrbottenspets': t('BREED_Norrbottenspets'),
    'Norwegian Buhund': t('BREED_NorwegianBuhund'),  
    'Norwegian Elkhound': t('BREED_NorwegianElkhound'),
    'Norwegian Lundehund': t('BREED_NorwegianLundehund'),
    'Norwich Terrier': t('BREED_NorwichTerrier'),
    'Nova Scotia Duck Tolling Retriever': t('BREED_NovaScotiaDuckTollingRetriever'),
    'Old English Sheepdog': t('BREED_OldEnglishSheepdog'),
    'Otterhound': t('BREED_Otterhound'),
    'Papillon': t('BREED_Papillon'),
    'Parson Russell Terrier': t('BREED_ParsonRussellTerrier'),
    'Pekingese': t('BREED_Pekingese'),
    'Pembroke Welsh Corgi': t('BREED_PembrokeWelshCorgi'),
    'Peruvian Inca Orchid': t('BREED_PeruvianIncaOrchid'),
    'Petit Basset Griffon Vendéen': t('BREED_PetitBassetGriffonVendeen'),
    'Pharaoh Hound': t('BREED_PharaohHound'),
    'Plott Hound': t('BREED_PlottHound'),
    'Pointer': t('BREED_Pointer'),
    'Polish Lowland Sheepdog': t('BREED_PolishLowlandSheepdog'),
    'Pomeranian': t('BREED_Pomeranian'),
    'Pont-Audemer Spaniel': t('BREED_PontAudemerSpaniel'),
    'Poodle (Miniature)': t('BREED_PoodleMiniature'),
    'Poodle (Standard)': t('BREED_PoodleStandard'),
    'Poodle (Toy)': t('BREED_PoodleToy'),
    'Porcelaine': t('BREED_Porcelaine'),
    'Portuguese Podengo': t('BREED_PortuguesePodengo'),
    'Portuguese Podengo Pequeno': t('BREED_PortuguesePodengoPequeno'),
    'Portuguese Pointer': t('BREED_PortuguesePointer'),  
    'Portuguese Sheepdog': t('BREED_PortugueseSheepdog'),
    'Portuguese Water Dog': t('BREED_PortugueseWaterDog'),
    'Presa Canario': t('BREED_PresaCanario'),
    'Pudelpointer': t('BREED_Pudelpointer'),
    'Pug': t('BREED_Pug'),
    'Puli': t('BREED_Puli'),
    'Pumi': t('BREED_Pumi'),
    'Pyrenean Mastiff': t('BREED_PyreneanMastiff'),
    'Pyrenean Shepherd': t('BREED_PyreneanShepherd'),
    'Rafeiro do Alentejo': t('BREED_RafeiroDoAlentejo'),
    'Rat Terrier': t('BREED_RatTerrier'),
    'Redbone Coonhound': t('BREED_RedboneCoonhound'),
    'Rhodesian Ridgeback': t('BREED_RhodesianRidgeback'),
    'Romanian Carpathian Shepherd': t('BREED_RomanianCarpathianShepherd'),
    'Rottweiler': t('BREED_Rottweiler'),
    'Russell Terrier': t('BREED_RussellTerrier'),
    'Russian Toy': t('BREED_RussianToy'),
    'Russian Tsvetnaya Bolonka': t('BREED_RussianTsvetnayaBolonka'),
    'Saint Bernard': t('BREED_SaintBernard'),
    'Saluki': t('BREED_Saluki'),
    'Samoyed': t('BREED_Samoyed'),
    'Schapendoes': t('BREED_Schapendoes'),
    'Schipperke': t('BREED_Schipperke'),
    'Scottish Deerhound': t('BREED_ScottishDeerhound'),
    'Scottish Terrier': t('BREED_ScottishTerrier'),  
    'Sealyham Terrier': t('BREED_SealyhamTerrier'),
    'Segugio Italiano': t('BREED_SegugioItaliano'),
    'Shetland Sheepdog': t('BREED_ShetlandSheepdog'),
    'Shiba Inu': t('BREED_ShibaInu'),
    'Shih Tzu': t('BREED_ShihTzu'),
    'Shikoku': t('BREED_Shikoku'),
    'Siberian Husky': t('BREED_SiberianHusky'),
    'Silky Terrier': t('BREED_SilkyTerrier'),
    'Skye Terrier': t('BREED_SkyeTerrier'),
    'Sloughi': t('BREED_Sloughi'),
    'Slovakian Wirehaired Pointer': t('BREED_SlovakianWirehairedPointer'),
    'Slovensky Cuvac': t('BREED_SlovenskyCuvac'),
    'Slovensky Kopov': t('BREED_SlovenskyKopov'),
    'Small Munsterlander': t('BREED_SmallMunsterlander'),
    'Smooth Fox Terrier': t('BREED_SmoothFoxTerrier'),
    'Soft Coated Wheaten Terrier': t('BREED_SoftCoatedWheatenTerrier'),
    'Spanish Mastiff': t('BREED_SpanishMastiff'),
    'Spanish Water Dog': t('BREED_SpanishWaterDog'),
    'Spinone Italiano': t('BREED_SpinoneItaliano'),
    'Stabyhoun': t('BREED_Stabyhoun'),
    'Staffordshire Bull Terrier': t('BREED_StaffordshireBullTerrier'),
    'Standard Schnauzer': t('BREED_StandardSchnauzer'),
    'Sussex Spaniel': t('BREED_SussexSpaniel'),
    'Swedish Vallhund': t('BREED_SwedishVallhund'),
    'Taiwan Dog': t('BREED_TaiwanDog'),  
    'Teddy Roosevelt Terrier': t('BREED_TeddyRooseveltTerrier'),
    'Thai Bangkaew': t('BREED_ThaiBangkaew'),
    'Thai Ridgeback': t('BREED_ThaiRidgeback'),
    'Tibetan Mastiff': t('BREED_TibetanMastiff'),
    'Tibetan Spaniel': t('BREED_TibetanSpaniel'),
    'Tibetan Terrier': t('BREED_TibetanTerrier'),
    'Tornjak': t('BREED_Tornjak'),
    'Tosa': t('BREED_Tosa'),
    'Toy Fox Terrier': t('BREED_ToyFoxTerrier'),
    'Transylvanian Hound': t('BREED_TransylvanianHound'),
    'Treeing Tennessee Brindle': t('BREED_TreeingTennesseeBrindle'),
    'Treeing Walker Coonhound': t('BREED_TreeingWalkerCoonhound'),
    'Vizsla': t('BREED_Vizsla'),
    'Volpino Italiano': t('BREED_VolpinoItaliano'),
    'Weimaraner': t('BREED_Weimaraner'),
    'Welsh Springer Spaniel': t('BREED_WelshSpringerSpaniel'),
    'Welsh Terrier': t('BREED_WelshTerrier'),
    'West Highland White Terrier': t('BREED_WestHighlandWhiteTerrier'),
    'Wetterhoun': t('BREED_Wetterhoun'),
    'Whippet': t('BREED_Whippet'),
    'Wire Fox Terrier': t('BREED_WireFoxTerrier'),
    'Wirehaired Pointing Griffon': t('BREED_WirehairedPointingGriffon'),
    'Wirehaired Vizsla': t('BREED_WirehairedVizsla'),
    'Working Kelpie': t('BREED_WorkingKelpie'),
    'Xoloitzcuintli': t('BREED_Xoloitzcuintli'),
    'Yakutian Laika': t('BREED_YakutianLaika'),
    'Yorkshire Terrier': t('BREED_YorkshireTerrier'),  
  }; 

  const groupTranslations = {
    'Sporting Group': t('GROUP_SportingGroup'),
    'Hound Group': t('GROUP_HoundGroup'),
    'Working Group': t('GROUP_WorkingGroup'),
    'Toy Group': t('GROUP_ToyGroup'),
    'Herding Group': t('GROUP_HerdingGroup'),
    'Foundation Stock Service': t('GROUP_FoundationStockService'),
    'Terrier Group': t('GROUP_TerrierGroup'),
    'Non-Sporting Group': t('GROUP_NonSportingGroup'),
    'Miscellaneous Class': t('GROUP_MiscellaneousClass'),
  };  

  const breedDescriptions = {
    'Affenpinscher': t('BREED_DESC_Affenpinscher'),
    'Afghan Hound': t('BREED_DESC_AfghanHound'),
    'Airedale Terrier': t('BREED_DESC_AiredaleTerrier'),
    'Akita': t('BREED_DESC_Akita'),
    'Alaskan Klee Kai': t('BREED_DESC_AlaskanKleeKai'),
    'Alaskan Malamute': t('BREED_DESC_AlaskanMalamute'),
    'American English Coonhound': t('BREED_DESC_AmericanEnglishCoonhound'),
    'American Eskimo Dog': t('BREED_DESC_AmericanEskimoDog'),
    'American Foxhound': t('BREED_DESC_AmericanFoxhound'),
    'American Hairless Terrier': t('BREED_DESC_AmericanHairlessTerrier'),
    'American Leopard Hound': t('BREED_DESC_AmericanLeopardHound'),
    'American Staffordshire Terrier': t('BREED_DESC_AmericanStaffordshireTerrier'),
    'American Water Spaniel': t('BREED_DESC_AmericanWaterSpaniel'),
    'Anatolian Shepherd Dog': t('BREED_DESC_AnatolianShepherdDog'),
    'Appenzeller Sennenhund': t('BREED_DESC_AppenzellerSennenhund'),
    'Australian Kelpie': t('BREED_DESC_AustralianKelpie'),
    'Azawakh': t('BREED_DESC_Azawakh'),
    'Barbado da Terceira': t('BREED_DESC_BarbadoDaTerceira'),
    'Barbet': t('BREED_DESC_Barbet'),
    'Bavarian Mountain Scent Hound': t('BREED_DESC_BavarianMountainScentHound'),
    'Bearded Collie': t('BREED_DESC_BeardedCollie'),
    'Beauceron': t('BREED_DESC_Beauceron'),
    'Bedlington Terrier': t('BREED_DESC_BedlingtonTerrier'),
    'Belgian Laekenois': t('BREED_DESC_BelgianLaekenois'),
    'Belgian Malinois': t('BREED_DESC_BelgianMalinois'),
    'Belgian Sheepdog': t('BREED_DESC_BelgianSheepdog'),
    'Belgian Tervuren': t('BREED_DESC_BelgianTervuren'),
    'Bergamasco Sheepdog': t('BREED_DESC_BergamascoSheepdog'),
    'Berger Picard': t('BREED_DESC_BergerPicard'),
    'Bernese Mountain Dog': t('BREED_DESC_BerneseMountainDog'),
    'Bichon Frise': t('BREED_DESC_BichonFrise'),
    'Biewer Terrier': t('BREED_DESC_BiewerTerrier'),
    'Black and Tan Coonhound': t('BREED_DESC_BlackAndTanCoonhound'),
    'Black Russian Terrier': t('BREED_DESC_BlackRussianTerrier'),
    'Bloodhound': t('BREED_DESC_Bloodhound'),
    'Bluetick Coonhound': t('BREED_DESC_BluetickCoonhound'),
    'Boerboel': t('BREED_DESC_Boerboel'),
    'Bohemian Shepherd': t('BREED_DESC_BohemianShepherd'),
    'Bolognese': t('BREED_DESC_Bolognese'),
    'Border Collie': t('BREED_DESC_BorderCollie'),
    'Border Terrier': t('BREED_DESC_BorderTerrier'),
    'Borzoi': t('BREED_DESC_Borzoi'),
    'Boston Terrier': t('BREED_DESC_BostonTerrier'),
    'Bouvier des Ardennes': t('BREED_DESC_BouvierDesArdennes'),
    'Bouvier des Flandres': t('BREED_DESC_BouvierDesFlandres'),
    'Boxer': t('BREED_DESC_Boxer'),
    'Boykin Spaniel': t('BREED_DESC_BoykinSpaniel'),
    'Bracco Italiano': t('BREED_DESC_BraccoItaliano'),
    'Braque du Bourbonnais': t('BREED_DESC_BraqueDuBourbonnais'),
    'Braque Francais Pyrenean': t('BREED_DESC_BraqueFrancaisPyrenean'),
    'Brazilian Terrier': t('BREED_DESC_BrazilianTerrier'),
    'Briard': t('BREED_DESC_Briard'),
    'Brittany': t('BREED_DESC_Brittany'),
    'Broholmer': t('BREED_DESC_Broholmer'),
    'Brussels Griffon': t('BREED_DESC_BrusselsGriffon'),
    'Bull Terrier': t('BREED_DESC_BullTerrier'),
    'Bulldog': t('BREED_DESC_Bulldog'),
    'Bullmastiff': t('BREED_DESC_Bullmastiff'),
    'Cairn Terrier': t('BREED_DESC_CairnTerrier'),
    'Canaan Dog': t('BREED_DESC_CanaanDog'),
    'Cane Corso': t('BREED_DESC_CaneCorso'),
    'Cardigan Welsh Corgi': t('BREED_DESC_CardiganWelshCorgi'),
    'Carolina Dog': t('BREED_DESC_CarolinaDog'),
    'Catahoula Leopard Dog': t('BREED_DESC_CatahoulaLeopardDog'),
    'Caucasian Shepherd Dog': t('BREED_DESC_CaucasianShepherdDog'),
    'Cavalier King Charles Spaniel': t('BREED_DESC_CavalierKingCharlesSpaniel'),
    'Central Asian Shepherd Dog': t('BREED_DESC_CentralAsianShepherdDog'),
    'Cesky Terrier': t('BREED_DESC_CeskyTerrier'),
    'Chesapeake Bay Retriever': t('BREED_DESC_ChesapeakeBayRetriever'),
    'Chihuahua': t('BREED_DESC_Chihuahua'),
    'Chinese Crested': t('BREED_DESC_ChineseCrested'),
    'Chinese Shar-Pei': t('BREED_DESC_ChineseSharPei'),
    'Chinook': t('BREED_DESC_Chinook'),
    'Chow Chow': t('BREED_DESC_ChowChow'),
    'Cirneco dell’Etna': t('BREED_DESC_CirnecoDellEtna'),
    'Clumber Spaniel': t('BREED_DESC_ClumberSpaniel'),
    'Cocker Spaniel': t('BREED_DESC_CockerSpaniel'),
    'Collie': t('BREED_DESC_Collie'),
    'Coton de Tulear': t('BREED_DESC_CotonDeTulear'),
    'Croatian Sheepdog': t('BREED_DESC_CroatianSheepdog'),
    'Curly-Coated Retriever': t('BREED_DESC_CurlyCoatedRetriever'),
    'Czechoslovakian Vlciak': t('BREED_DESC_CzechoslovakianVlciak'),
    'Dachshund': t('BREED_DESC_Dachshund'),
    'Dalmatian': t('BREED_DESC_Dalmatian'),
    'Dandie Dinmont Terrier': t('BREED_DESC_DandieDinmontTerrier'),
    'Danish-Swedish Farmdog': t('BREED_DESC_DanishSwedishFarmdog'),
    'Deutscher Wachtelhund': t('BREED_DESC_DeutscherWachtelhund'),
    'Doberman Pinscher': t('BREED_DESC_DobermanPinscher'),
    'Dogo Argentino': t('BREED_DESC_DogoArgentino'),
    'Dogue de Bordeaux': t('BREED_DESC_DogueDeBordeaux'),
    'Drentsche Patrijshond': t('BREED_DESC_DrentschePatrijshond'),
    'Drever': t('BREED_DESC_Drever'),
    'Dutch Shepherd': t('BREED_DESC_DutchShepherd'),
    'English Cocker Spaniel': t('BREED_DESC_EnglishCockerSpaniel'),
    'English Foxhound': t('BREED_DESC_EnglishFoxhound'),
    'English Setter': t('BREED_DESC_EnglishSetter'),
    'English Springer Spaniel': t('BREED_DESC_EnglishSpringerSpaniel'),
    'English Toy Spaniel': t('BREED_DESC_EnglishToySpaniel'),
    'Entlebucher Mountain Dog': t('BREED_DESC_EntlebucherMountainDog'),
    'Estrela Mountain Dog': t('BREED_DESC_EstrelaMountainDog'),
    'Eurasier': t('BREED_DESC_Eurasier'),
    'Field Spaniel': t('BREED_DESC_FieldSpaniel'),
    'Finnish Lapphund': t('BREED_DESC_FinnishLapphund'),
    'Finnish Spitz': t('BREED_DESC_FinnishSpitz'),
    'Flat-Coated Retriever': t('BREED_DESC_FlatCoatedRetriever'),
    'French Bulldog': t('BREED_DESC_FrenchBulldog'),
    'French Spaniel': t('BREED_DESC_FrenchSpaniel'),
    'German Longhaired Pointer': t('BREED_DESC_GermanLonghairedPointer'),
    'German Pinscher': t('BREED_DESC_GermanPinscher'),
    'German Shepherd Dog': t('BREED_DESC_GermanShepherdDog'),
    'German Shorthaired Pointer': t('BREED_DESC_GermanShorthairedPointer'),
    'German Spitz': t('BREED_DESC_GermanSpitz'),
    'German Wirehaired Pointer': t('BREED_DESC_GermanWirehairedPointer'),
    'Giant Schnauzer': t('BREED_DESC_GiantSchnauzer'),
    'Glen of Imaal Terrier': t('BREED_DESC_GlenOfImaalTerrier'),
    'Golden Retriever': t('BREED_DESC_GoldenRetriever'),
    'Gordon Setter': t('BREED_DESC_GordonSetter'),
    'Grand Basset Griffon Vendéen': t('BREED_DESC_GrandBassetGriffonVendeen'),
    'Great Dane': t('BREED_DESC_GreatDane'),
    'Great Pyrenees': t('BREED_DESC_GreatPyrenees'),
    'Greater Swiss Mountain Dog': t('BREED_DESC_GreaterSwissMountainDog'),
    'Greyhound': t('BREED_DESC_Greyhound'),
    'Hamiltonstovare': t('BREED_DESC_Hamiltonstovare'),
    'Hanoverian Scenthound': t('BREED_DESC_HanoverianScenthound'),
    'Harrier': t('BREED_DESC_Harrier'),
    'Havanese': t('BREED_DESC_Havanese'),
    'Hokkaido': t('BREED_DESC_Hokkaido'),
    'Hovawart': t('BREED_DESC_Hovawart'),
    'Ibizan Hound': t('BREED_DESC_IbizanHound'),
    'Icelandic Sheepdog': t('BREED_DESC_IcelandicSheepdog'),
    'Irish Red and White Setter': t('BREED_DESC_IrishRedAndWhiteSetter'),
    'Irish Setter': t('BREED_DESC_IrishSetter'),
    'Irish Terrier': t('BREED_DESC_IrishTerrier'),
    'Irish Water Spaniel': t('BREED_DESC_IrishWaterSpaniel'),
    'Irish Wolfhound': t('BREED_DESC_IrishWolfhound'),
    'Italian Greyhound': t('BREED_DESC_ItalianGreyhound'),
    'Jagdterrier': t('BREED_DESC_Jagdterrier'),
    'Japanese Akita Inu': t('BREED_DESC_JapaneseAkitaInu'),
    'Japanese Chin': t('BREED_DESC_JapaneseChin'),
    'Japanese Spitz': t('BREED_DESC_JapaneseSpitz'),
    'Japanese Terrier': t('BREED_DESC_JapaneseTerrier'),
    'Kai Ken': t('BREED_DESC_KaiKen'),
    'Karelian Bear Dog': t('BREED_DESC_KarelianBearDog'),
    'Keeshond': t('BREED_DESC_Keeshond'),
    'Kerry Blue Terrier': t('BREED_DESC_KerryBlueTerrier'),
    'Kishu Ken': t('BREED_DESC_KishuKen'),
    'Komondor': t('BREED_DESC_Komondor'),
    'Korean Jindo Dog': t('BREED_DESC_KoreanJindoDog'),
    'Kromfohrlander': t('BREED_DESC_Kromfohrlander'),
    'Kuvasz': t('BREED_DESC_Kuvasz'),
    'Labrador Retriever': t('BREED_DESC_LabradorRetriever'),
    'Lagotto Romagnolo': t('BREED_DESC_LagottoRomagnolo'),
    'Lakeland Terrier': t('BREED_DESC_LakelandTerrier'),
    'Lancashire Heeler': t('BREED_DESC_LancashireHeeler'),
    'Lapponian Herder': t('BREED_DESC_LapponianHerder'),
    'Large Munsterlander': t('BREED_DESC_LargeMunsterlander'),
    'Leonberger': t('BREED_DESC_Leonberger'),
    'Lhasa Apso': t('BREED_DESC_LhasaApso'),
    'Löwchen': t('BREED_DESC_Lowchen'),
    'Maltese': t('BREED_DESC_Maltese'),
    'Manchester Terrier (Standard)': t('BREED_DESC_ManchesterTerrierStandard'),
    'Manchester Terrier (Toy)': t('BREED_DESC_ManchesterTerrierToy'),
    'Mastiff': t('BREED_DESC_Mastiff'),
    'Miniature American Shepherd': t('BREED_DESC_MiniatureAmericanShepherd'),
    'Miniature Bull Terrier': t('BREED_DESC_MiniatureBullTerrier'),
    'Miniature Pinscher': t('BREED_DESC_MiniaturePinscher'),
    'Miniature Schnauzer': t('BREED_DESC_MiniatureSchnauzer'),
    'Mountain Cur': t('BREED_DESC_MountainCur'),
    'Mudi': t('BREED_DESC_Mudi'),
    'Neapolitan Mastiff': t('BREED_DESC_NeapolitanMastiff'),
    'Nederlandse Kooikerhondje': t('BREED_DESC_NederlandseKooikerhondje'),
    'Newfoundland': t('BREED_DESC_Newfoundland'),
    'Norfolk Terrier': t('BREED_DESC_NorfolkTerrier'),
    'Norrbottenspets': t('BREED_DESC_Norrbottenspets'),
    'Norwegian Buhund': t('BREED_DESC_NorwegianBuhund'),
    'Norwegian Elkhound': t('BREED_DESC_NorwegianElkhound'),
    'Norwegian Lundehund': t('BREED_DESC_NorwegianLundehund'),
    'Norwich Terrier': t('BREED_DESC_NorwichTerrier'),
    'Nova Scotia Duck Tolling Retriever': t('BREED_DESC_NovaScotiaDuckTollingRetriever'),
    'Old English Sheepdog': t('BREED_DESC_OldEnglishSheepdog'),
    'Otterhound': t('BREED_DESC_Otterhound'),
    'Papillon': t('BREED_DESC_Papillon'),
    'Parson Russell Terrier': t('BREED_DESC_ParsonRussellTerrier'),
    'Pekingese': t('BREED_DESC_Pekingese'),
    'Pembroke Welsh Corgi': t('BREED_DESC_PembrokeWelshCorgi'),
    'Peruvian Inca Orchid': t('BREED_DESC_PeruvianIncaOrchid'),
    'Petit Basset Griffon Vendéen': t('BREED_DESC_PetitBassetGriffonVendeen'),
    'Pharaoh Hound': t('BREED_DESC_PharaohHound'),
    'Plott Hound': t('BREED_DESC_PlottHound'),
    'Pointer': t('BREED_DESC_Pointer'),
    'Polish Lowland Sheepdog': t('BREED_DESC_PolishLowlandSheepdog'),
    'Pomeranian': t('BREED_DESC_Pomeranian'),
    'Pont-Audemer Spaniel': t('BREED_DESC_PontAudemerSpaniel'),
    'Poodle (Miniature)': t('BREED_DESC_PoodleMiniature'),
    'Poodle (Standard)': t('BREED_DESC_PoodleStandard'),
    'Poodle (Toy)': t('BREED_DESC_PoodleToy'),
    'Porcelaine': t('BREED_DESC_Porcelaine'),
    'Portuguese Podengo': t('BREED_DESC_PortuguesePodengo'),
    'Portuguese Podengo Pequeno': t('BREED_DESC_PortuguesePodengoPequeno'),
    'Portuguese Pointer': t('BREED_DESC_PortuguesePointer'),
    'Portuguese Sheepdog': t('BREED_DESC_PortugueseSheepdog'),
    'Portuguese Water Dog': t('BREED_DESC_PortugueseWaterDog'),
    'Presa Canario': t('BREED_DESC_PresaCanario'),
    'Pudelpointer': t('BREED_DESC_Pudelpointer'),
    'Pug': t('BREED_DESC_Pug'),
    'Puli': t('BREED_DESC_Puli'),
    'Pumi': t('BREED_DESC_Pumi'),
    'Pyrenean Mastiff': t('BREED_DESC_PyreneanMastiff'),
    'Pyrenean Shepherd': t('BREED_DESC_PyreneanShepherd'),
    'Rafeiro do Alentejo': t('BREED_DESC_RafeiroDoAlentejo'),
    'Rat Terrier': t('BREED_DESC_RatTerrier'),
    'Redbone Coonhound': t('BREED_DESC_RedboneCoonhound'),
    'Rhodesian Ridgeback': t('BREED_DESC_RhodesianRidgeback'),
    'Romanian Carpathian Shepherd': t('BREED_DESC_RomanianCarpathianShepherd'),
    'Rottweiler': t('BREED_DESC_Rottweiler'),
    'Russell Terrier': t('BREED_DESC_RussellTerrier'),
    'Russian Toy': t('BREED_DESC_RussianToy'),
    'Russian Tsvetnaya Bolonka': t('BREED_DESC_RussianTsvetnayaBolonka'),
    'Saint Bernard': t('BREED_DESC_SaintBernard'),
    'Saluki': t('BREED_DESC_Saluki'),
    'Samoyed': t('BREED_DESC_Samoyed'),
    'Schapendoes': t('BREED_DESC_Schapendoes'),
    'Schipperke': t('BREED_DESC_Schipperke'),
    'Scottish Deerhound': t('BREED_DESC_ScottishDeerhound'),
    'Scottish Terrier': t('BREED_DESC_ScottishTerrier'),
    'Sealyham Terrier': t('BREED_DESC_SealyhamTerrier'),
    'Segugio Italiano': t('BREED_DESC_SegugioItaliano'),
    'Shetland Sheepdog': t('BREED_DESC_ShetlandSheepdog'),
    'Shiba Inu': t('BREED_DESC_ShibaInu'),
    'Shih Tzu': t('BREED_DESC_ShihTzu'),
    'Shikoku': t('BREED_DESC_Shikoku'),
    'Siberian Husky': t('BREED_DESC_SiberianHusky'),
    'Silky Terrier': t('BREED_DESC_SilkyTerrier'),
    'Skye Terrier': t('BREED_DESC_SkyeTerrier'),
    'Sloughi': t('BREED_DESC_Sloughi'),
    'Slovakian Wirehaired Pointer': t('BREED_DESC_SlovakianWirehairedPointer'),
    'Slovensky Cuvac': t('BREED_DESC_SlovenskyCuvac'),
    'Slovensky Kopov': t('BREED_DESC_SlovenskyKopov'),
    'Small Munsterlander': t('BREED_DESC_SmallMunsterlander'),
    'Smooth Fox Terrier': t('BREED_DESC_SmoothFoxTerrier'),
    'Soft Coated Wheaten Terrier': t('BREED_DESC_SoftCoatedWheatenTerrier'),
    'Spanish Mastiff': t('BREED_DESC_SpanishMastiff'),
    'Spanish Water Dog': t('BREED_DESC_SpanishWaterDog'),
    'Spinone Italiano': t('BREED_DESC_SpinoneItaliano'),
    'Stabyhoun': t('BREED_DESC_Stabyhoun'),
    'Staffordshire Bull Terrier': t('BREED_DESC_StaffordshireBullTerrier'),
    'Standard Schnauzer': t('BREED_DESC_StandardSchnauzer'),
    'Sussex Spaniel': t('BREED_DESC_SussexSpaniel'),
    'Swedish Vallhund': t('BREED_DESC_SwedishVallhund'),
    'Taiwan Dog': t('BREED_DESC_TaiwanDog'),
    'Teddy Roosevelt Terrier': t('BREED_DESC_TeddyRooseveltTerrier'),
    'Thai Bangkaew': t('BREED_DESC_ThaiBangkaew'),
    'Thai Ridgeback': t('BREED_DESC_ThaiRidgeback'),
    'Tibetan Mastiff': t('BREED_DESC_TibetanMastiff'),
    'Tibetan Spaniel': t('BREED_DESC_TibetanSpaniel'),
    'Tibetan Terrier': t('BREED_DESC_TibetanTerrier'),
    'Tornjak': t('BREED_DESC_Tornjak'),
    'Tosa': t('BREED_DESC_Tosa'),
    'Toy Fox Terrier': t('BREED_DESC_ToyFoxTerrier'),
    'Transylvanian Hound': t('BREED_DESC_TransylvanianHound'),
    'Treeing Tennessee Brindle': t('BREED_DESC_TreeingTennesseeBrindle'),
    'Treeing Walker Coonhound': t('BREED_DESC_TreeingWalkerCoonhound'),
    'Vizsla': t('BREED_DESC_Vizsla'),
    'Volpino Italiano': t('BREED_DESC_VolpinoItaliano'),
    'Weimaraner': t('BREED_DESC_Weimaraner'),
    'Welsh Springer Spaniel': t('BREED_DESC_WelshSpringerSpaniel'),
    'Welsh Terrier': t('BREED_DESC_WelshTerrier'),
    'West Highland White Terrier': t('BREED_DESC_WestHighlandWhiteTerrier'),
    'Wetterhoun': t('BREED_DESC_Wetterhoun'),
    'Whippet': t('BREED_DESC_Whippet'),
    'Wire Fox Terrier': t('BREED_DESC_WireFoxTerrier'),
    'Wirehaired Pointing Griffon': t('BREED_DESC_WirehairedPointingGriffon'),
    'Wirehaired Vizsla': t('BREED_DESC_WirehairedVizsla'),
    'Working Kelpie': t('BREED_DESC_WorkingKelpie'),
    'Xoloitzcuintli': t('BREED_DESC_Xoloitzcuintli'),
    'Yakutian Laika': t('BREED_DESC_YakutianLaika'),
    'Yorkshire Terrier': t('BREED_DESC_YorkshireTerrier'),
  };

  const breedHistories = {
    'Affenpinscher': t('BREED_HIST_Affenpinscher'),
    'Afghan Hound': t('BREED_HIST_AfghanHound'),
    'Airedale Terrier': t('BREED_HIST_AiredaleTerrier'),
    'Akita': t('BREED_HIST_Akita'),
    'Alaskan Klee Kai': t('BREED_HIST_AlaskanKleeKai'),
    'Alaskan Malamute': t('BREED_HIST_AlaskanMalamute'),
    'American English Coonhound': t('BREED_HIST_AmericanEnglishCoonhound'),
    'American Eskimo Dog': t('BREED_HIST_AmericanEskimoDog'),
    'American Foxhound': t('BREED_HIST_AmericanFoxhound'),
    'American Hairless Terrier': t('BREED_HIST_AmericanHairlessTerrier'),
    'American Leopard Hound': t('BREED_HIST_AmericanLeopardHound'),
    'American Staffordshire Terrier': t('BREED_HIST_AmericanStaffordshireTerrier'),
    'American Water Spaniel': t('BREED_HIST_AmericanWaterSpaniel'),
    'Anatolian Shepherd Dog': t('BREED_HIST_AnatolianShepherdDog'),
    'Appenzeller Sennenhund': t('BREED_HIST_AppenzellerSennenhund'),
    'Australian Kelpie': t('BREED_HIST_AustralianKelpie'),
    'Azawakh': t('BREED_HIST_Azawakh'),
    'Barbado da Terceira': t('BREED_HIST_BarbadoDaTerceira'),
    'Barbet': t('BREED_HIST_Barbet'),
    'Bavarian Mountain Scent Hound': t('BREED_HIST_BavarianMountainScentHound'),
    'Bearded Collie': t('BREED_HIST_BeardedCollie'),
    'Beauceron': t('BREED_HIST_Beauceron'),
    'Bedlington Terrier': t('BREED_HIST_BedlingtonTerrier'),
    'Belgian Laekenois': t('BREED_HIST_BelgianLaekenois'),
    'Belgian Malinois': t('BREED_HIST_BelgianMalinois'),
    'Belgian Sheepdog': t('BREED_HIST_BelgianSheepdog'),
    'Belgian Tervuren': t('BREED_HIST_BelgianTervuren'),
    'Bergamasco Sheepdog': t('BREED_HIST_BergamascoSheepdog'),
    'Berger Picard': t('BREED_HIST_BergerPicard'),
    'Bernese Mountain Dog': t('BREED_HIST_BerneseMountainDog'),
    'Bichon Frise': t('BREED_HIST_BichonFrise'),
    'Biewer Terrier': t('BREED_HIST_BiewerTerrier'),
    'Black and Tan Coonhound': t('BREED_HIST_BlackAndTanCoonhound'),
    'Black Russian Terrier': t('BREED_HIST_BlackRussianTerrier'),
    'Bloodhound': t('BREED_HIST_Bloodhound'),
    'Bluetick Coonhound': t('BREED_HIST_BluetickCoonhound'),
    'Boerboel': t('BREED_HIST_Boerboel'),
    'Bohemian Shepherd': t('BREED_HIST_BohemianShepherd'),
    'Bolognese': t('BREED_HIST_Bolognese'),
    'Border Collie': t('BREED_HIST_BorderCollie'),
    'Border Terrier': t('BREED_HIST_BorderTerrier'),
    'Borzoi': t('BREED_HIST_Borzoi'),
    'Boston Terrier': t('BREED_HIST_BostonTerrier'),
    'Bouvier des Ardennes': t('BREED_HIST_BouvierDesArdennes'),
    'Bouvier des Flandres': t('BREED_HIST_BouvierDesFlandres'),
    'Boxer': t('BREED_HIST_Boxer'),
    'Boykin Spaniel': t('BREED_HIST_BoykinSpaniel'),
    'Bracco Italiano': t('BREED_HIST_BraccoItaliano'),
    'Braque du Bourbonnais': t('BREED_HIST_BraqueDuBourbonnais'),
    'Braque Francais Pyrenean': t('BREED_HIST_BraqueFrancaisPyrenean'),
    'Brazilian Terrier': t('BREED_HIST_BrazilianTerrier'),
    'Briard': t('BREED_HIST_Briard'),
    'Brittany': t('BREED_HIST_Brittany'),
    'Broholmer': t('BREED_HIST_Broholmer'),
    'Brussels Griffon': t('BREED_HIST_BrusselsGriffon'),
    'Bull Terrier': t('BREED_HIST_BullTerrier'),
    'Bulldog': t('BREED_HIST_Bulldog'),
    'Bullmastiff': t('BREED_HIST_Bullmastiff'),
    'Cairn Terrier': t('BREED_HIST_CairnTerrier'),
    'Canaan Dog': t('BREED_HIST_CanaanDog'),
    'Cane Corso': t('BREED_HIST_CaneCorso'),
    'Cardigan Welsh Corgi': t('BREED_HIST_CardiganWelshCorgi'),
    'Carolina Dog': t('BREED_HIST_CarolinaDog'),
    'Catahoula Leopard Dog': t('BREED_HIST_CatahoulaLeopardDog'),
    'Caucasian Shepherd Dog': t('BREED_HIST_CaucasianShepherdDog'),
    'Cavalier King Charles Spaniel': t('BREED_HIST_CavalierKingCharlesSpaniel'),
    'Central Asian Shepherd Dog': t('BREED_HIST_CentralAsianShepherdDog'),
    'Cesky Terrier': t('BREED_HIST_CeskyTerrier'),
    'Chesapeake Bay Retriever': t('BREED_HIST_ChesapeakeBayRetriever'),
    'Chihuahua': t('BREED_HIST_Chihuahua'),
    'Chinese Crested': t('BREED_HIST_ChineseCrested'),
    'Chinese Shar-Pei': t('BREED_HIST_ChineseSharPei'),
    'Chinook': t('BREED_HIST_Chinook'),
    'Chow Chow': t('BREED_HIST_ChowChow'),
    'Cirneco dell’Etna': t('BREED_HIST_CirnecoDellEtna'),
    'Clumber Spaniel': t('BREED_HIST_ClumberSpaniel'),
    'Cocker Spaniel': t('BREED_HIST_CockerSpaniel'),
    'Collie': t('BREED_HIST_Collie'),
    'Coton de Tulear': t('BREED_HIST_CotonDeTulear'),
    'Croatian Sheepdog': t('BREED_HIST_CroatianSheepdog'),
    'Curly-Coated Retriever': t('BREED_HIST_CurlyCoatedRetriever'),
    'Czechoslovakian Vlciak': t('BREED_HIST_CzechoslovakianVlciak'),
    'Dachshund': t('BREED_HIST_Dachshund'),
    'Dalmatian': t('BREED_HIST_Dalmatian'),
    'Dandie Dinmont Terrier': t('BREED_HIST_DandieDinmontTerrier'),
    'Danish-Swedish Farmdog': t('BREED_HIST_DanishSwedishFarmdog'),
    'Deutscher Wachtelhund': t('BREED_HIST_DeutscherWachtelhund'),
    'Doberman Pinscher': t('BREED_HIST_DobermanPinscher'),
    'Dogo Argentino': t('BREED_HIST_DogoArgentino'),
    'Dogue de Bordeaux': t('BREED_HIST_DogueDeBordeaux'),
    'Drentsche Patrijshond': t('BREED_HIST_DrentschePatrijshond'),
    'Drever': t('BREED_HIST_Drever'),
    'Dutch Shepherd': t('BREED_HIST_DutchShepherd'),
    'English Cocker Spaniel': t('BREED_HIST_EnglishCockerSpaniel'),
    'English Foxhound': t('BREED_HIST_EnglishFoxhound'),
    'English Setter': t('BREED_HIST_EnglishSetter'),
    'English Springer Spaniel': t('BREED_HIST_EnglishSpringerSpaniel'),
    'English Toy Spaniel': t('BREED_HIST_EnglishToySpaniel'),
    'Entlebucher Mountain Dog': t('BREED_HIST_EntlebucherMountainDog'),
    'Estrela Mountain Dog': t('BREED_HIST_EstrelaMountainDog'),
    'Eurasier': t('BREED_HIST_Eurasier'),
    'Field Spaniel': t('BREED_HIST_FieldSpaniel'),
    'Finnish Lapphund': t('BREED_HIST_FinnishLapphund'),
    'Finnish Spitz': t('BREED_HIST_FinnishSpitz'),
    'Flat-Coated Retriever': t('BREED_HIST_FlatCoatedRetriever'),
    'French Bulldog': t('BREED_HIST_FrenchBulldog'),
    'French Spaniel': t('BREED_HIST_FrenchSpaniel'),
    'German Longhaired Pointer': t('BREED_HIST_GermanLonghairedPointer'),
    'German Pinscher': t('BREED_HIST_GermanPinscher'),
    'German Shepherd Dog': t('BREED_HIST_GermanShepherdDog'),
    'German Shorthaired Pointer': t('BREED_HIST_GermanShorthairedPointer'),
    'German Spitz': t('BREED_HIST_GermanSpitz'),
    'German Wirehaired Pointer': t('BREED_HIST_GermanWirehairedPointer'),
    'Giant Schnauzer': t('BREED_HIST_GiantSchnauzer'),
    'Glen of Imaal Terrier': t('BREED_HIST_GlenOfImaalTerrier'),
    'Golden Retriever': t('BREED_HIST_GoldenRetriever'),
    'Gordon Setter': t('BREED_HIST_GordonSetter'),
    'Grand Basset Griffon Vendéen': t('BREED_HIST_GrandBassetGriffonVendeen'),
    'Great Dane': t('BREED_HIST_GreatDane'),
    'Great Pyrenees': t('BREED_HIST_GreatPyrenees'),
    'Greater Swiss Mountain Dog': t('BREED_HIST_GreaterSwissMountainDog'),
    'Greyhound': t('BREED_HIST_Greyhound'),
    'Hamiltonstovare': t('BREED_HIST_Hamiltonstovare'),
    'Hanoverian Scenthound': t('BREED_HIST_HanoverianScenthound'),
    'Harrier': t('BREED_HIST_Harrier'),
    'Havanese': t('BREED_HIST_Havanese'),
    'Hokkaido': t('BREED_HIST_Hokkaido'),
    'Hovawart': t('BREED_HIST_Hovawart'),
    'Ibizan Hound': t('BREED_HIST_IbizanHound'),
    'Icelandic Sheepdog': t('BREED_HIST_IcelandicSheepdog'),
    'Irish Red and White Setter': t('BREED_HIST_IrishRedAndWhiteSetter'),
    'Irish Setter': t('BREED_HIST_IrishSetter'),
    'Irish Terrier': t('BREED_HIST_IrishTerrier'),
    'Irish Water Spaniel': t('BREED_HIST_IrishWaterSpaniel'),
    'Irish Wolfhound': t('BREED_HIST_IrishWolfhound'),
    'Italian Greyhound': t('BREED_HIST_ItalianGreyhound'),
    'Jagdterrier': t('BREED_HIST_Jagdterrier'),
    'Japanese Akita Inu': t('BREED_HIST_JapaneseAkitaInu'),
    'Japanese Chin': t('BREED_HIST_JapaneseChin'),
    'Japanese Spitz': t('BREED_HIST_JapaneseSpitz'),
    'Japanese Terrier': t('BREED_HIST_JapaneseTerrier'),
    'Kai Ken': t('BREED_HIST_KaiKen'),
    'Karelian Bear Dog': t('BREED_HIST_KarelianBearDog'),
    'Keeshond': t('BREED_HIST_Keeshond'),
    'Kerry Blue Terrier': t('BREED_HIST_KerryBlueTerrier'),
    'Kishu Ken': t('BREED_HIST_KishuKen'),
    'Komondor': t('BREED_HIST_Komondor'),
    'Korean Jindo Dog': t('BREED_HIST_KoreanJindoDog'),
    'Kromfohrlander': t('BREED_HIST_Kromfohrlander'),
    'Kuvasz': t('BREED_HIST_Kuvasz'),
    'Labrador Retriever': t('BREED_HIST_LabradorRetriever'),
    'Lagotto Romagnolo': t('BREED_HIST_LagottoRomagnolo'),
    'Lakeland Terrier': t('BREED_HIST_LakelandTerrier'),
    'Lancashire Heeler': t('BREED_HIST_LancashireHeeler'),
    'Lapponian Herder': t('BREED_HIST_LapponianHerder'),
    'Large Munsterlander': t('BREED_HIST_LargeMunsterlander'),
    'Leonberger': t('BREED_HIST_Leonberger'),
    'Lhasa Apso': t('BREED_HIST_LhasaApso'),
    'Löwchen': t('BREED_HIST_Lowchen'),
    'Maltese': t('BREED_HIST_Maltese'),
    'Manchester Terrier (Standard)': t('BREED_HIST_ManchesterTerrierStandard'),
    'Manchester Terrier (Toy)': t('BREED_HIST_ManchesterTerrierToy'),
    'Mastiff': t('BREED_HIST_Mastiff'),
    'Miniature American Shepherd': t('BREED_HIST_MiniatureAmericanShepherd'),
    'Miniature Bull Terrier': t('BREED_HIST_MiniatureBullTerrier'),
    'Miniature Pinscher': t('BREED_HIST_MiniaturePinscher'),
    'Miniature Schnauzer': t('BREED_HIST_MiniatureSchnauzer'),
    'Mountain Cur': t('BREED_HIST_MountainCur'),
    'Mudi': t('BREED_HIST_Mudi'),
    'Neapolitan Mastiff': t('BREED_HIST_NeapolitanMastiff'),
    'Nederlandse Kooikerhondje': t('BREED_HIST_NederlandseKooikerhondje'),
    'Newfoundland': t('BREED_HIST_Newfoundland'),
    'Norfolk Terrier': t('BREED_HIST_NorfolkTerrier'),
    'Norrbottenspets': t('BREED_HIST_Norrbottenspets'),
    'Norwegian Buhund': t('BREED_HIST_NorwegianBuhund'),
    'Norwegian Elkhound': t('BREED_HIST_NorwegianElkhound'),
    'Norwegian Lundehund': t('BREED_HIST_NorwegianLundehund'),
    'Norwich Terrier': t('BREED_HIST_NorwichTerrier'),
    'Nova Scotia Duck Tolling Retriever': t('BREED_HIST_NovaScotiaDuckTollingRetriever'),
    'Old English Sheepdog': t('BREED_HIST_OldEnglishSheepdog'),
    'Otterhound': t('BREED_HIST_Otterhound'),
    'Papillon': t('BREED_HIST_Papillon'),
    'Parson Russell Terrier': t('BREED_HIST_ParsonRussellTerrier'),
    'Pekingese': t('BREED_HIST_Pekingese'),
    'Pembroke Welsh Corgi': t('BREED_HIST_PembrokeWelshCorgi'),
    'Peruvian Inca Orchid': t('BREED_HIST_PeruvianIncaOrchid'),
    'Petit Basset Griffon Vendéen': t('BREED_HIST_PetitBassetGriffonVendeen'),
    'Pharaoh Hound': t('BREED_HIST_PharaohHound'),
    'Plott Hound': t('BREED_HIST_PlottHound'),
    'Pointer': t('BREED_HIST_Pointer'),
    'Polish Lowland Sheepdog': t('BREED_HIST_PolishLowlandSheepdog'),
    'Pomeranian': t('BREED_HIST_Pomeranian'),
    'Pont-Audemer Spaniel': t('BREED_HIST_PontAudemerSpaniel'),
    'Poodle (Miniature)': t('BREED_HIST_PoodleMiniature'),
    'Poodle (Standard)': t('BREED_HIST_PoodleStandard'),
    'Poodle (Toy)': t('BREED_HIST_PoodleToy'),
    'Porcelaine': t('BREED_HIST_Porcelaine'),
    'Portuguese Podengo': t('BREED_HIST_PortuguesePodengo'),
    'Portuguese Podengo Pequeno': t('BREED_HIST_PortuguesePodengoPequeno'),
    'Portuguese Pointer': t('BREED_HIST_PortuguesePointer'),
    'Portuguese Sheepdog': t('BREED_HIST_PortugueseSheepdog'),
    'Portuguese Water Dog': t('BREED_HIST_PortugueseWaterDog'),
    'Presa Canario': t('BREED_HIST_PresaCanario'),
    'Pudelpointer': t('BREED_HIST_Pudelpointer'),
    'Pug': t('BREED_HIST_Pug'),
    'Puli': t('BREED_HIST_Puli'),
    'Pumi': t('BREED_HIST_Pumi'),
    'Pyrenean Mastiff': t('BREED_HIST_PyreneanMastiff'),
    'Pyrenean Shepherd': t('BREED_HIST_PyreneanShepherd'),
    'Rafeiro do Alentejo': t('BREED_HIST_RafeiroDoAlentejo'),
    'Rat Terrier': t('BREED_HIST_RatTerrier'),
    'Redbone Coonhound': t('BREED_HIST_RedboneCoonhound'),
    'Rhodesian Ridgeback': t('BREED_HIST_RhodesianRidgeback'),
    'Romanian Carpathian Shepherd': t('BREED_HIST_RomanianCarpathianShepherd'),
    'Rottweiler': t('BREED_HIST_Rottweiler'),
    'Russell Terrier': t('BREED_HIST_RussellTerrier'),
    'Russian Toy': t('BREED_HIST_RussianToy'),
    'Russian Tsvetnaya Bolonka': t('BREED_HIST_RussianTsvetnayaBolonka'),
    'Saint Bernard': t('BREED_HIST_SaintBernard'),
    'Saluki': t('BREED_HIST_Saluki'),
    'Samoyed': t('BREED_HIST_Samoyed'),
    'Schapendoes': t('BREED_HIST_Schapendoes'),
    'Schipperke': t('BREED_HIST_Schipperke'),
    'Scottish Deerhound': t('BREED_HIST_ScottishDeerhound'),
    'Scottish Terrier': t('BREED_HIST_ScottishTerrier'),
    'Sealyham Terrier': t('BREED_HIST_SealyhamTerrier'),
    'Segugio Italiano': t('BREED_HIST_SegugioItaliano'),
    'Shetland Sheepdog': t('BREED_HIST_ShetlandSheepdog'),
    'Shiba Inu': t('BREED_HIST_ShibaInu'),
    'Shih Tzu': t('BREED_HIST_ShihTzu'),
    'Shikoku': t('BREED_HIST_Shikoku'),
    'Siberian Husky': t('BREED_HIST_SiberianHusky'),
    'Silky Terrier': t('BREED_HIST_SilkyTerrier'),
    'Skye Terrier': t('BREED_HIST_SkyeTerrier'),
    'Sloughi': t('BREED_HIST_Sloughi'),
    'Slovakian Wirehaired Pointer': t('BREED_HIST_SlovakianWirehairedPointer'),
    'Slovensky Cuvac': t('BREED_HIST_SlovenskyCuvac'),
    'Slovensky Kopov': t('BREED_HIST_SlovenskyKopov'),
    'Small Munsterlander': t('BREED_HIST_SmallMunsterlander'),
    'Smooth Fox Terrier': t('BREED_HIST_SmoothFoxTerrier'),
    'Soft Coated Wheaten Terrier': t('BREED_HIST_SoftCoatedWheatenTerrier'),
    'Spanish Mastiff': t('BREED_HIST_SpanishMastiff'),
    'Spanish Water Dog': t('BREED_HIST_SpanishWaterDog'),
    'Spinone Italiano': t('BREED_HIST_SpinoneItaliano'),
    'Stabyhoun': t('BREED_HIST_Stabyhoun'),
    'Staffordshire Bull Terrier': t('BREED_HIST_StaffordshireBullTerrier'),
    'Standard Schnauzer': t('BREED_HIST_StandardSchnauzer'),
    'Sussex Spaniel': t('BREED_HIST_SussexSpaniel'),
    'Swedish Vallhund': t('BREED_HIST_SwedishVallhund'),
    'Taiwan Dog': t('BREED_HIST_TaiwanDog'),
    'Teddy Roosevelt Terrier': t('BREED_HIST_TeddyRooseveltTerrier'),
    'Thai Bangkaew': t('BREED_HIST_ThaiBangkaew'),
    'Thai Ridgeback': t('BREED_HIST_ThaiRidgeback'),
    'Tibetan Mastiff': t('BREED_HIST_TibetanMastiff'),
    'Tibetan Spaniel': t('BREED_HIST_TibetanSpaniel'),
    'Tibetan Terrier': t('BREED_HIST_TibetanTerrier'),
    'Tornjak': t('BREED_HIST_Tornjak'),
    'Tosa': t('BREED_HIST_Tosa'),
    'Toy Fox Terrier': t('BREED_HIST_ToyFoxTerrier'),
    'Transylvanian Hound': t('BREED_HIST_TransylvanianHound'),
    'Treeing Tennessee Brindle': t('BREED_HIST_TreeingTennesseeBrindle'),
    'Treeing Walker Coonhound': t('BREED_HIST_TreeingWalkerCoonhound'),
    'Vizsla': t('BREED_HIST_Vizsla'),
    'Volpino Italiano': t('BREED_HIST_VolpinoItaliano'),
    'Weimaraner': t('BREED_HIST_Weimaraner'),
    'Welsh Springer Spaniel': t('BREED_HIST_WelshSpringerSpaniel'),
    'Welsh Terrier': t('BREED_HIST_WelshTerrier'),
    'West Highland White Terrier': t('BREED_HIST_WestHighlandWhiteTerrier'),
    'Wetterhoun': t('BREED_HIST_Wetterhoun'),
    'Whippet': t('BREED_HIST_Whippet'),
    'Wire Fox Terrier': t('BREED_HIST_WireFoxTerrier'),
    'Wirehaired Pointing Griffon': t('BREED_HIST_WirehairedPointingGriffon'),
    'Wirehaired Vizsla': t('BREED_HIST_WirehairedVizsla'),
    'Working Kelpie': t('BREED_HIST_WorkingKelpie'),
    'Xoloitzcuintli': t('BREED_HIST_Xoloitzcuintli'),
    'Yakutian Laika': t('BREED_HIST_YakutianLaika'),
    'Yorkshire Terrier': t('BREED_HIST_YorkshireTerrier'),
    };

  return (
    <div className="dog-breed-detail-page">
      {/* Thêm Header component */}
      <Header />

      <motion.div
        className="dog-breed-detail relative max-w-4xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Language Buttons */}
        <div className="absolute top-4 right-4 translate-x-16 flex space-x-2 z-10">
          <button
            onClick={() => i18n.changeLanguage('en')}
            className="px-4 py-2 border border-white text-[#97d5c8] rounded-md text-sm transition duration-200 hover:bg-white hover:text-[#97d5c8]"
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage('vi')}
            className="px-4 py-2 border border-white text-[#97d5c8] rounded-md text-sm transition duration-200 hover:bg-white hover:text-[#97d5c8]"
          >
            VI
          </button>
        </div>

        {/* Title */}
        <motion.h1
          className="text-4xl font-extrabold text-center mb-4 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {breedTranslations[dogBreed.name] || dogBreed.name}
        </motion.h1>

        {/* Group Info */}
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="px-4 py-2 bg-white text-teal-800 rounded-full text-sm font-semibold shadow">
            {groupTranslations[dogBreed.group] || dogBreed.group}
          </span>
        </motion.div>

        {/* Main Carousel */}
        <motion.div
          className="w-full md:w-3/4 lg:w-2/3 mx-auto mb-8 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <Slider {...settingsMain} className="main-slider rounded-xl overflow-hidden shadow-lg">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <motion.img
                  src={img}
                  alt={`${dogBreed.name} - ${index}`}
                  className="w-full h-[400px] object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            ))}
          </Slider>
        </motion.div>
      </motion.div>

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
            <h3 className="font-bold text-lg">{t('HEIGHT')}</h3>
            <p>{dogBreed.height.min} - {dogBreed.height.max} inches</p>
          </div>

          {/* Thông tin cân nặng */}
          <div className="dog-info text-center">
            <img src={weightIcon} alt="Cân nặng" className="icon" />  
            <h3 className="font-bold text-lg">{t('WEIGHT')}</h3>
            <p>{dogBreed.weight.min} - {dogBreed.weight.max} lbs</p>
          </div>

          {/* Tuổi thọ trung bình */}
          <div className="dog-info text-center">
            <img src={birthdayIcon} alt="Tuổi thọ" className="icon" />
            <h3 className="font-bold text-lg">{t('LIFE_EXPECTANCY')}</h3>
            <p>{dogBreed.lifespan.min} - {dogBreed.lifespan.max} {t('YEAR')}</p>
          </div>
        </div>

        <div>
          {/* Tiêu đề cho phần Family Life */}
          <p className="colors-title" onClick={toggleFamilyLifeVisibility}>
          {t('FAMILY_LIFE')}
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
                      onClick={() =>
                        toggleModal(
                          t('Affectionate_with_Family'),
                          t('Affectionate_with_Family_Description')
                        )
                      }
                    >
                      {t('Affectionate_with_Family')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Affectionate_with_Family_Independent')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span
                            key={index}
                            className={index < dogBreed.affectionateWithFamily ? 'filled text-[#16423C]' : 'text-gray-400'}
                          ></span>
                        ))}
                      </div>
                      <p>{t('Affectionate_with_Family_LoveyDovey')}</p>
                    </div>
                  </div>
                )}

                {/* Good with Other Dogs */}
                {dogBreed.goodWithOtherDogs !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() =>
                        toggleModal(
                          t('Good_with_other_dogs'),
                          t('Good_with_other_dogs_Description')
                        )
                      }
                    >
                      {t('Good_with_other_dogs')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Good_with_other_dogs_NotRecommended')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.goodWithOtherDogs ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>{t('Good_with_other_dogs_Recommended')}</p>
                    </div>
                  </div>
                )}

                {/* Good with Young Children */}
                {dogBreed.goodWithYoungChildren !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() =>
                        toggleModal(
                          t('Good_with_young_children'),
                          t('Good_with_young_children_Description')
                        )
                      }
                    >
                      {t('Good_with_young_children')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Good_with_young_children_NotRecommended')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.goodWithYoungChildren ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>{t('Good_with_young_children_Recommended')}</p>
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
            {t('PHYSICAL')}
          </p>

          {/* Danh sách các thông tin về gia đình, chỉ hiển thị khi isFamilyLifeVisible là true */}
          {isPhysicalVisible && (
            <div className="temperament-levels-section">
              <div className="trait-section">

                {/* Shedding Level */}
                {dogBreed.sheddingLevel !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        t('Shedding_level'),
                        t('Shedding_level_Description')
                      )}
                    >
                      {t('Shedding_level')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Shedding_level_Low')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.sheddingLevel ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>{t('Shedding_level_High')}</p>
                    </div>
                  </div>
                )}

                {/* Coat Grooming Frequency */}
                {dogBreed.coatGroomingFrequency !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        t('Coat_grooming_frequency'),
                        t('Coat_grooming_frequency_Description')
                      )}
                    >
                      {t('Coat_grooming_frequency')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Coat_grooming_frequency_Low')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.coatGroomingFrequency ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>{t('Coat_grooming_frequency_High')}</p>
                    </div>
                  </div>
                )}

                {/* Drooling Level */}
                {dogBreed.droolingLevel !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() => toggleModal(
                        t('Drooling_level'),
                        t('Drooling_level_Description')
                      )}
                    >
                      {t('Drooling_level')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Drooling_level_Low')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.droolingLevel ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>{t('Drooling_level_High')}</p>
                    </div>
                  </div>
                )}

                </div>

                <div id="coat-details" className="coat-details">

                  {/* Coat Type Section */}
                  <div className="coat-type">
                    <h4
                      className="text-16423C cursor-pointer hover:underline mb-7 font-semibold"
                      onClick={() =>
                        toggleModal(t('Coat_Type'), t('Coat_Type_Description'))
                      }
                    >
                      {t('Coat_Type')}
                    </h4>
                    <ul id="coatTypeList">
                      {[
                        'Wiry',
                        'Hairless',
                        'Smooth',
                        'Rough',
                        'Corded',
                        'Double',
                        'Curly',
                        'Wavy',
                        'Silky',
                      ].map((type) => (
                        <li
                          key={type}
                          className={dogBreed.coatType.includes(type) ? 'selected' : 'disabled'}
                        >
                          {t(`Coat_Type_${type}`)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coat Length Section */}
                  <div className="coat-length">
                    <h4
                      className="text-16423C cursor-pointer hover:underline mt-7 mb-7 font-semibold"
                      onClick={() =>
                        toggleModal(t('Coat_Length'), t('Coat_Length_Description'))
                      }
                    >
                      {t('Coat_Length')}
                    </h4>
                    <ul id="coatLengthList">
                      {['Short', 'Medium', 'Long'].map((length) => (
                        <li
                          key={length}
                          className={dogBreed.coatLength.includes(length) ? 'selected' : 'disabled'}
                        >
                          {t(`Coat_Length_${length}`)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  </div>
            </div>
          )}
        </div>

        <div>
          {/* SOCIAL Section Title */}
          <p className="colors-title" onClick={toggleSocialVisibility}>
            {t('SOCIAL')}
          </p>

          {/* Trait Section */}
          {isSocialVisible && (
            <div className="temperament-levels-section">
              <div className="trait-row">

                {/* Openness to Strangers */}
                {dogBreed.opennessToStrangers !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() =>
                        toggleModal(
                          t('Openness_to_strangers'),
                          t('Openness_to_strangers_Description')
                        )
                      }
                    >
                      {t('Openness_to_strangers')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Openness_Reserved')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.opennessToStrangers ? "filled" : ""}></span>
                        ))}
                      </div>
                      <p>{t('Openness_EveryoneFriend')}</p>
                    </div>
                  </div>
                )}

                {/* Watchdog/Protective Nature */}
                {dogBreed.watchdogProtectiveNature !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() =>
                        toggleModal(
                          t('Protective_nature'),
                          t('Protective_nature_Description')
                        )
                      }
                    >
                      {t('Protective_nature')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Protective_Sharing')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.watchdogProtectiveNature ? "filled" : ""}></span>
                        ))}
                      </div>
                      <p>{t('Protective_Vigilant')}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="trait-row">

                {/* Playfulness Level */}
                {dogBreed.playfulnessLevel !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() =>
                        toggleModal(
                          t('Playfulness_level'),
                          t('Playfulness_level_Description')
                        )
                      }
                    >
                      {t('Playfulness_level')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Playfulness_Low')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.playfulnessLevel ? "filled" : ""}></span>
                        ))}
                      </div>
                      <p>{t('Playfulness_High')}</p>
                    </div>
                  </div>
                )}

                {/* Adaptability Level */}
                {dogBreed.adaptabilityLevel !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() =>
                        toggleModal(
                          t('Adaptability_level'),
                          t('Adaptability_level_Description')
                        )
                      }
                    >
                      {t('Adaptability_level')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Adaptability_Routine')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.adaptabilityLevel ? "filled" : ""}></span>
                        ))}
                      </div>
                      <p>{t('Adaptability_High')}</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        <div>
          {/* PERSONAL Section Title */}
          <p className="colors-title" onClick={togglePersonalVisibility}>
            {t('PERSONAL')}
          </p>

          {isPersonalVisible && (
            <div className="temperament-levels-section">
              <div className="trait-row">

                {/* Trainability Level */}
                {dogBreed.trainabilityLevel !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() =>
                        toggleModal(
                          t('Trainability_level'),
                          t('Trainability_level_Description')
                        )
                      }
                    >
                      {t('Trainability_level')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Trainability_Low')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.trainabilityLevel ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>{t('Trainability_High')}</p>
                    </div>
                  </div>
                )}

                {/* Barking Level */}
                {dogBreed.barkingLevel !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() =>
                        toggleModal(
                          t('Barking_level'),
                          t('Barking_level_Description')
                        )
                      }
                    >
                      {t('Barking_level')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Barking_Low')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.barkingLevel ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>{t('Barking_High')}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="trait-row">

                {/* Energy Level */}
                {dogBreed.energyLevel !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() =>
                        toggleModal(
                          t('Energy_level'),
                          t('Energy_level_Description')
                        )
                      }
                    >
                      {t('Energy_level')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Energy_Low')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.energyLevel ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>{t('Energy_High')}</p>
                    </div>
                  </div>
                )}

                {/* Mental Stimulation Needs */}
                {dogBreed.mentalStimulationNeeds !== undefined && (
                  <div className="trait">
                    <h4
                      className="text-16423C cursor-pointer hover:underline"
                      onClick={() =>
                        toggleModal(
                          t('Mental_stimulation_needs'),
                          t('Mental_stimulation_needs_Description')
                        )
                      }
                    >
                      {t('Mental_stimulation_needs')}
                    </h4>
                    <div className="rating-bar-container">
                      <p>{t('Mental_Low')}</p>
                      <div className="rating-bar">
                        {Array(5).fill().map((_, index) => (
                          <span key={index} className={index < dogBreed.mentalStimulationNeeds ? 'filled' : ''}></span>
                        ))}
                      </div>
                      <p>{t('Mental_High')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="colors-title" onClick={toggleColorsVisibility}>
          {t('Colors')}
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
              <h2>{t('About_the_breed')}</h2>
              <p className={isExpanded2 ? 'expanded' : 'collapsed'}>{breedDescriptions[dogBreed.name] || dogBreed.description}</p>
              <button className="toggle-button" onClick={toggleDesescription2}>
                {isExpanded2 ? t('Read_Less') : t('Read_More')}
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
              <h2>{t('History')}</h2>
              <p className={isExpanded ? 'expanded' : 'collapsed'}>{breedHistories[dogBreed.name] || dogBreed.history}</p>
              <button className="toggle-button" onClick={toggleDescription}>
                {isExpanded ? t('Read_Less') : t('Read_More')}
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
      <div className="flex justify-center my-10">
        <a
          href="http://localhost:5173/breedList"
          className="px-6 py-3 border border-[#97d5c8] text-[#97d5c8] rounded-md text-base transition-colors duration-200 hover:bg-[#97d5c8] hover:text-white"
        >
          ← Back to List
        </a>
      </div>
      <Footer />
    </div>
  );
};


export default DogBreedDetail;
