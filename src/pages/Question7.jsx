import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAnswers } from "../context/AnswerContext";
import clientApi from "../client-api/rest-client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Question7 = () => {
  const { answers } = useAnswers();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const fetchDogBreeds = async () => {
    setLoading(true);
    setError(null);

    const authen = clientApi.service("dogbreeds");
    const requestPayload = {
      trainabilityLevel: answers.trainabilityLevel,
      energyLevel: answers.energyLevel,
      sheddingLevel: answers.sheddingLevel,
      coatGroomingFrequency: answers.coatGroomingFrequency,
      barkingLevel: answers.barkingLevel,
      size: answers.size,
    };

    try {
      const response = await authen.find(requestPayload);
      if (response.EC === 0) {
        const updatedMatches = response.DT.map((match) => {
          const characteristics = [
            {
              labelKey: "question7.trainability",
              value: match.trainabilityLevel,
              match: match.trainabilityLevel === answers.trainabilityLevel,
            },
            {
              labelKey: "question7.energyLevel",
              value: match.energyLevel,
              match: match.energyLevel === answers.energyLevel,
            },
            {
              labelKey: "question7.sheddingLevel",
              value: match.sheddingLevel,
              match: match.sheddingLevel === answers.sheddingLevel,
            },
            {
              labelKey: "question7.grooming",
              value: match.coatGroomingFrequency,
              match: match.coatGroomingFrequency === answers.coatGroomingFrequency,
            },
            {
              labelKey: "question7.barkingLevel",
              value: match.barkingLevel,
              match: match.barkingLevel === answers.barkingLevel,
            },
            {
              labelKey: "question7.size",
              value: match.size,
              match: match.size === answers.size,
            },
          ];

          const matchCount = characteristics.filter((char) => char.match).length;

          return {
            ...match,
            characteristics,
            matchCount,
          };
        });

        const sortedMatches = updatedMatches.sort((a, b) => b.matchCount - a.matchCount);
        setMatches(sortedMatches.slice(0, 5));
      } else {
        setError(response.EM || t("question7.noMatchError"));
        setMatches([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(t("question7.apiError"));
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogBreeds();
  }, [answers]);

  const handleMatchClick = (index) => {
    setSelectedMatch(index);
  };

  const currentMatch = matches[selectedMatch];

  const handleViewDetails = (breedId) => {
    navigate(`/dogbreeds/${breedId}`);
  };

  const handleBackToStart = () => {
    navigate("/bestDog");
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
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen p-6 flex flex-col">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-[#16423C]">
            {t("question7.title")}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => i18n.changeLanguage("en")}
              className="px-3 py-1 bg-[#16423C] text-white rounded shadow hover:bg-[#1f5e52]"
            >
              EN
            </button>
            <button
              onClick={() => i18n.changeLanguage("vi")}
              className="px-3 py-1 bg-[#16423C] text-white rounded shadow hover:bg-[#1f5e52]"
            >
              VI
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-600">{t("question7.loading")}</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && matches.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-6">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 rounded-full cursor-pointer ${selectedMatch === index ? "border-16423C border-4" : ""}`}
                  onClick={() => handleMatchClick(index)}
                >
                  <img
                    src={match.image || "https://via.placeholder.com/300"}
                    alt={match.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="text-center text-sm font-bold text-[#16423C]">
                    {t("question7.top")} {index + 1} ({match.matchCount} {t("question7.matches")})
                  </div>
                  {match.rare && (
                    <div className="text-yellow-600 text-xs text-center mt-1">
                      {t("question7.rare")}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex">
              {/* Left */}
              <div className="w-2/3">
                <div className="flex items-center mb-4 mt-10">
                  <div className="bg-[#C4DACB] p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold text-[#16423C] mb-7">
                    {breedTranslations[currentMatch.name] || currentMatch.name}
                  </h2>
                  <p className="text-[#16423C]">
                    {breedDescriptions[currentMatch.name] || currentMatch.description}
                  </p>
                  </div>
                </div>
                <div className="w-full h-90 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                  <img
                    src={currentMatch.image || "https://via.placeholder.com/300"}
                    alt={currentMatch.name}
                    className="max-w-full max-h-full"
                  />
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewDetails(currentMatch._id)}
                    className="bg-teal-600 text-white font-medium px-6 py-2 rounded-full shadow hover:bg-teal-700 transition"
                  >
                    {t("question7.viewDetails")}
                  </button>

                  {/* Back to Start Button */}
                  <button
                    onClick={handleBackToStart}
                    className="bg-white border border-[#16423C] text-[#16423C] font-medium px-6 py-2 rounded-full shadow hover:bg-[#16423C] hover:text-white transition"
                  >
                    {t("question7.backToStart")}
                  </button>
                </div>
              </div>

              {/* Right */}
              <div className="w-1/3 bg-white rounded-lg shadow-lg p-4 ml-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {t("question7.characteristics")}
                </h3>
                <div className="space-y-4">
                  {currentMatch.characteristics?.map((char, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm"
                    >
                      <div className="flex flex-col">
                      <span className="text-gray-600 font-semibold">{t(char.labelKey)}:</span>
                        <span className="text-gray-800">{char.value || t("question7.notAvailable")}</span>
                      </div>
                      {char.match !== null && (
                        <div
                          className={`ml-4 px-3 py-1 text-sm font-bold rounded-lg ${char.match
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"}`}
                        >
                          {char.match
                            ? t("question7.matchYes", { label: t(char.labelKey) })
                            : t("question7.matchNo", { label: t(char.labelKey) })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Question7;
