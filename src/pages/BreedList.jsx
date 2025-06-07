import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import arrowRightIcon from '../pictures/icons8-arrow-right-50.png';
import arrowDownIcon from '../pictures/icons8-arrow-down-50.png';
import clientApi from '../client-api/rest-client';
import '../css/BreedList.css';
import { useTranslation } from 'react-i18next';

const FilterSection = () => {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState({
    group: false,
    activityLevel: false,
    barkingLevel: false,
    characteristics: false,
    coatType: false,
    sheddingLevel: false,
    size: false,
    trainability: false,
  });

  const [filters, setFilters] = useState({});
  const [dogBreeds, setDogBreeds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBreeds, setTotalBreeds] = useState(0);
  const itemsPerPage = 16;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [selectedBreedsDetails, setSelectedBreedsDetails] = useState([]);
  const [goToPage, setGoToPage] = useState(currentPage);
  const [searchTerm, setSearchTerm] = useState("");  // Add search term state
  const { t, i18n } = useTranslation();

  // Lấy selectedBreeds từ localStorage khi load trang
  useEffect(() => {
    const savedSelectedBreeds = JSON.parse(localStorage.getItem('selectedBreeds')) || [];
    setSelectedBreeds(savedSelectedBreeds);
  }, []);

  // Lưu selectedBreeds vào localStorage mỗi khi có sự thay đổi
  useEffect(() => {
    localStorage.setItem('selectedBreeds', JSON.stringify(selectedBreeds));
  }, [selectedBreeds]);

  // Fetch dog breeds data
  const fetchDogBreeds = async () => {
    setLoading(true);
    setError(null);

    let authen = clientApi.service('dogbreeds');

    const requestPayload = {
      page: currentPage,
      limit: itemsPerPage,
      ...filters,
      name: searchTerm,
    };

    console.log("Payload Sent to API:", requestPayload);

    try {
      const response = await authen.find(requestPayload);
      if (response.EC === 0) {
        setDogBreeds(response.DT);
        setTotalBreeds(response.totalBreeds);
      } else {
        setError(response.EM);
        setDogBreeds([]);
        setTotalBreeds(0);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("No dog breeds match the filters.");
      setDogBreeds([]);
      setTotalBreeds(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogBreeds();
  }, [currentPage, filters, searchTerm]);

  // Pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle filter sections
  const toggleFilter = (filterName) => {
    setFiltersOpen((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (value) {
        updatedFilters[filterKey] = value;
      } else {
        delete updatedFilters[filterKey];
      }
      return updatedFilters;
    });

    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);  // Update search term on input change
    setCurrentPage(1);  // Reset to the first page when a new search is entered
  };  

  const renderFilterSection = (title, filterKey, options, tooltipText) => (
    <div className="filter-group mb-6">
      <div className="flex justify-between items-center">
        <h4
          className="text-sm font-semibold text-gray-600 mb-2"
          title={tooltipText}
        >
          {title}
        </h4>
        <img
          src={filtersOpen[filterKey] ? arrowDownIcon : arrowRightIcon}
          alt="Toggle Filter"
          className="w-5 h-5 cursor-pointer"
          onClick={() => toggleFilter(filterKey)}
        />
      </div>
      {filtersOpen[filterKey] && (
        <div className="grid grid-cols-2 gap-y-2 mt-2">
          {options.map(({ label, tooltip, value }) => (
            <label key={value} className="flex items-center text-sm text-gray-600 relative group cursor-pointer">
              <input
                type="checkbox"
                className="mr-2"
                onChange={(e) =>
                  handleFilterChange(filterKey, e.target.checked ? value : null)
                }
              />
              <CustomTooltipLabel label={label} tooltip={tooltip} />
            </label>
          ))}
        </div>
      )}
    </div>
  );  

  const handleViewDetails = (breedId) => {
    navigate(`/dogbreeds/${breedId}`);
  };

  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleCompareChange = (breed, checked) => {
    if (checked) {
      if (selectedBreedsDetails.length < 5) {
        setSelectedBreedsDetails((prev) => [...prev, breed]);
      }
    } else {
      setSelectedBreedsDetails((prev) =>
        prev.filter((selected) => selected._id !== breed._id)
      );
    }
  };

  const handleCompareBreeds = () => {
    localStorage.setItem('selectedBreedsDetails', JSON.stringify(selectedBreedsDetails)); // Store selected breeds in localStorage
    console.log('Selected breeds to compare:', selectedBreedsDetails); // Log selected breeds for debugging
    navigate('/compareDogs'); // Redirect to the CompareDogs page
  };

  const handleGoToPage = () => {
    if (goToPage >= 1 && goToPage <= Math.ceil(totalBreeds / itemsPerPage)) {
      paginate(goToPage);
    }
  };

  const CustomTooltipLabel = ({ label, tooltip }) => (
    <div className="relative group inline-block">
      <span>{label}</span>
      <div className="absolute bottom-full left-0 group-hover:block hidden mb-2 z-10 bg-black text-white text-xs px-3 py-2 rounded shadow-lg w-[max-content] max-w-[250px] break-words text-left">
        {tooltip}
      </div>
    </div>
  );  

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

  return (
    <div className="home-container text-white flex flex-col min-h-screen">
      <Header />
      <div className="flex p-6 space-x-4">
        <div className="filter-section p-6 bg-white rounded-lg shadow-lg w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{t('FILTER_BREEDS')}</h3>
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 border border-teal-600 rounded-md text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder={t('SEARCH_PLACEHOLDER')}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Filters */}
          {renderFilterSection(t('FILTER_GROUP'), 'group', [
            { label: t('Sporting Group'), tooltip: t('Sporting Group Tooltip'), value: 'Sporting Group' },
            { label: t('Hound Group'), tooltip: t('Hound Group Tooltip'), value: 'Hound Group' },
            { label: t('Working Group'), tooltip: t('Working Group Tooltip'), value: 'Working Group' },
            { label: t('Terrier Group'), tooltip: t('Terrier Group Tooltip'), value: 'Terrier Group' },
            { label: t('Toy Group'), tooltip: t('Toy Group Tooltip'), value: 'Toy Group' },
            { label: t('Non-Sporting Group'), tooltip: t('Non-Sporting Group Tooltip'), value: 'Non-Sporting Group' },
            { label: t('Herding Group'), tooltip: t('Herding Group Tooltip'), value: 'Herding Group' },
            { label: t('Miscellaneous Class'), tooltip: t('Miscellaneous Class Tooltip'), value: 'Miscellaneous Class' },
            { label: t('Foundation Stock'), tooltip: t('Foundation Stock Tooltip'), value: 'Foundation Stock' }
          ], t('FILTER_GROUP_TOOLTIP'))}


          {renderFilterSection(t('FILTER_ACTIVITY_LEVEL'), 'activityLevel', [
            { label: t('Needs Lots Of Activity'), tooltip: t('Needs Lots Of Activity Tooltip'), value: 'Needs Lots Of Activity' },
            { label: t('Regular Exercise'), tooltip: t('Regular Exercise Tooltip'), value: 'Regular Exercise' },
            { label: t('Energetic'), tooltip: t('Energetic Tooltip'), value: 'Energetic' },
            { label: t('Calm'), tooltip: t('Calm Tooltip'), value: 'Calm' },
          ], t('FILTER_ACTIVITY_LEVEL_TOOLTIP'))}

          {renderFilterSection(t('FILTER_BARKING_LEVEL'), 'barkingLevelDescription', [
            { label: t('When Necessary'), tooltip: t('When Necessary Tooltip'), value: 'When Necessary' },
            { label: t('Infrequent'), tooltip: t('Infrequent Tooltip'), value: 'Infrequent' },
            { label: t('Medium'), tooltip: t('Medium Tooltip'), value: 'Medium' },
            { label: t('Frequent'), tooltip: t('Frequent Tooltip'), value: 'Frequent' },
            { label: t('Likes To Be Vocal'), tooltip: t('Likes To Be Vocal Tooltip'), value: 'Likes To Be Vocal' },
          ], t('FILTER_BARKING_LEVEL_TOOLTIP'))}

          {renderFilterSection(t('FILTER_CHARACTERISTICS'), 'characteristics', [
            { label: t('Smallest Dog Breeds'), tooltip: t('Smallest Dog Breeds Tooltip'), value: 'Smallest Dog Breeds' },
            { label: t('Medium Dog Breeds'), tooltip: t('Medium Dog Breeds Tooltip'), value: 'Medium Dog Breeds' },
            { label: t('Largest Dog Breeds'), tooltip: t('Largest Dog Breeds Tooltip'), value: 'Largest Dog Breeds' },
            { label: t('Smartest Breeds Of Dogs'), tooltip: t('Smartest Breeds Of Dogs Tooltip'), value: 'Smartest Breeds Of Dogs' },
            { label: t('Hypoallergenic Dogs'), tooltip: t('Hypoallergenic Dogs Tooltip'), value: 'Hypoallergenic Dogs' },
            { label: t('Best Dog Breeds For Kids'), tooltip: t('Best Dog Breeds For Kids Tooltip'), value: 'Best Dog Breeds For Kids' },
            { label: t('Hairless Dog Breeds'), tooltip: t('Hairless Dog Breeds Tooltip'), value: 'Hairless Dog Breeds' },
            { label: t('Best Dogs For Apartment Dwellers'), tooltip: t('Best Dogs For Apartment Dwellers Tooltip'), value: 'Best Dogs For Apartment Dwellers' },
            { label: t('Large Dog Breeds'), tooltip: t('Large Dog Breeds Tooltip'), value: 'Large Dog Breeds' },
          ], t('FILTER_CHARACTERISTICS_TOOLTIP'))}

          {renderFilterSection(t('FILTER_COAT_TYPE'), 'coatType', [
            { label: t('Curly'), tooltip: t('Curly Tooltip'), value: 'Curly' },
            { label: t('Wavy'), tooltip: t('Wavy Tooltip'), value: 'Wavy' },
            { label: t('Rough'), tooltip: t('Rough Tooltip'), value: 'Rough' },
            { label: t('Corded'), tooltip: t('Corded Tooltip'), value: 'Corded' },
            { label: t('Hairless'), tooltip: t('Hairless Tooltip'), value: 'Hairless' },
            { label: t('Short'), tooltip: t('Short Tooltip'), value: 'Short' },
            { label: t('Moderate Length'), tooltip: t('Moderate Length Tooltip'), value: 'Medium' },
            { label: t('Long'), tooltip: t('Long Tooltip'), value: 'Long' },
            { label: t('Smooth'), tooltip: t('Smooth Tooltip'), value: 'Smooth' },
            { label: t('Wiry'), tooltip: t('Wiry Tooltip'), value: 'Wiry' },
            { label: t('Silky'), tooltip: t('Silky Tooltip'), value: 'Silky' },
            { label: t('Double'), tooltip: t('Double Tooltip'), value: 'Double' },
          ], t('FILTER_COAT_TYPE_TOOLTIP'))}

          {renderFilterSection(t('FILTER_SHEDDING'), 'shedding', [
            { label: t('SHEDDING_Infrequent'), tooltip: t('SHEDDING_Infrequent_Tooltip'), value: 'Infrequent' },
            { label: t('SHEDDING_Seasonal'), tooltip: t('SHEDDING_Seasonal_Tooltip'), value: 'Seasonal' },
            { label: t('SHEDDING_Frequent'), tooltip: t('SHEDDING_Frequent_Tooltip'), value: 'Frequent' },
            { label: t('SHEDDING_Occasional'), tooltip: t('SHEDDING_Occasional_Tooltip'), value: 'Occasional' },
            { label: t('SHEDDING_Regularly'), tooltip: t('SHEDDING_Regularly_Tooltip'), value: 'Regularly' }
          ], t('FILTER_SHEDDING_TOOLTIP'))}

          {renderFilterSection(t('FILTER_SIZE'), 'size', [
            { label: t('SIZE_XSmall'), tooltip: t('SIZE_XSmall_Tooltip'), value: 'XSmall' },
            { label: t('SIZE_Small'), tooltip: t('SIZE_Small_Tooltip'), value: 'Small' },
            { label: t('SIZE_Medium'), tooltip: t('SIZE_Medium_Tooltip'), value: 'Medium' },
            { label: t('SIZE_Large'), tooltip: t('SIZE_Large_Tooltip'), value: 'Large' },
            { label: t('SIZE_XLarge'), tooltip: t('SIZE_XLarge_Tooltip'), value: 'XLarge' }
          ], t('FILTER_SIZE_TOOLTIP'))}

          {renderFilterSection(t('FILTER_TRAINABILITY'), 'trainability', [
            { label: t('TRAINABILITY_Stubborn'), tooltip: t('TRAINABILITY_Stubborn_Tooltip'), value: 'May be Stubborn' },
            { label: t('TRAINABILITY_Agreeable'), tooltip: t('TRAINABILITY_Agreeable_Tooltip'), value: 'Agreeable' },
            { label: t('TRAINABILITY_Eager'), tooltip: t('TRAINABILITY_Eager_Tooltip'), value: 'Eager To Please' },
            { label: t('TRAINABILITY_Independent'), tooltip: t('TRAINABILITY_Independent_Tooltip'), value: 'Independent' },
            { label: t('TRAINABILITY_Easy'), tooltip: t('TRAINABILITY_Easy_Tooltip'), value: 'Easy Training' }
          ], t('FILTER_TRAINABILITY_TOOLTIP'))}

          <div className="flex justify-between mt-4">
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg" onClick={fetchDogBreeds}>
            {t('FILTER')}
            </button>
          </div>
        </div>

        {/* Breed List Section */}
        <div className="breed-list-section flex-1 p-6 bg-white rounded-lg shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              {t('DOG_BREED_LIST')}
            </h1>

            <div className="flex space-x-2">
              <button
                onClick={() => i18n.changeLanguage('en')}
                className="px-3 py-1 border border-teal-500 text-teal-700 rounded text-sm hover:bg-teal-100"
              >
                EN
              </button>
              <button
                onClick={() => i18n.changeLanguage('vi')}
                className="px-3 py-1 border border-teal-500 text-teal-700 rounded text-sm hover:bg-teal-100"
              >
                VI
              </button>
            </div>
          </div>


          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {dogBreeds.map((breed, index) => (
                <div
                  key={index}
                  className="breed-card bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out cursor-pointer"
                  onClick={() => handleViewDetails(breed._id)}
                >
                  <img
                    src={breed.image}
                    alt={breed.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <h4 className="text-lg font-semibold text-gray-800 mt-2">
                    {breedTranslations[breed.name] || breed.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-2" style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: '2',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {breedDescriptions[breed.name] || breed.description}
                  </p>
                  <div className="mt-2 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedBreedsDetails.some(
                        (selected) => selected._id === breed._id
                      )}
                      onChange={(e) =>
                        handleCompareChange(breed, e.target.checked)
                      }
                      disabled={selectedBreeds.length >= 5 && !selectedBreeds.includes(breed._id)}
                    />
                    <span className="text-sm text-gray-600">{t('COMPARE_BREED')}</span>
                  </div>
                </div>            
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="pagination flex justify-center mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50"
            >
              {t('PREV')}
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
            {t('PAGE')} {currentPage} {t('OF')} {Math.ceil(totalBreeds / itemsPerPage)}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalBreeds / itemsPerPage)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50"
            >
              {t('NEXT')}
            </button>
          </div>
          {/* Go to Page Section */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center ml-4">
              {/* Label "Go to Page" */}
              <span className="mr-2 text-teal-800 text-sm font-semibold">{t('GO_TO_PAGE')}</span>
              
              <input
                type="number"
                value={goToPage}
                onChange={(e) => setGoToPage(Number(e.target.value))}
                min={1}
                max={Math.ceil(totalBreeds / itemsPerPage)}
                className="px-2 py-1 border border-teal-600 rounded-md text-sm focus:ring-2 focus:ring-teal-400 text-teal-800"
                placeholder="Enter page number"
              />
              
              <button
                onClick={handleGoToPage}
                className="ml-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {t('GO')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh so sánh giống chó */}
      {selectedBreedsDetails.length > 0 && (
        <div className="compare-breeds fixed bottom-0 left-0 w-full bg-teal-600 text-white p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-xl">{t('COMPARE_BREED')}</h3>
            <span className="text-sm">{selectedBreedsDetails.length} / 5</span>
          </div>
          <div className="mt-2">
            <ul className="text-sm">
              {selectedBreedsDetails.map((breed) => (
                <li key={breed._id}>{breedTranslations[breed.name] || breed.name}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleCompareBreeds}
            className="mt-4 px-6 py-2 bg-white text-teal-600 font-semibold rounded-lg"
          >
            COMPARE BREED
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FilterSection;
