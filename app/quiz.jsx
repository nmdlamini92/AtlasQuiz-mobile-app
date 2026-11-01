import { useEffect, useRef, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Constants

const POINTS_PER_CORRECT = 1;
const TIME_LIMIT_SECONDS = 15;
const MAX_STRIKES = 5;

const ALL_COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola", "Antigua and Barbuda", "Argentina","Armenia","Australia",
  "Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium",
  "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei",
  "Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde", "Central African Republic", "Chad",
  "Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus",
  "Czech Republic", "Democratic_Republic_of_Congo", "Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji",
  "Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece", "Greenland", "Grenada",
  "Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland",
  "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy", "Ivory Coast", "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho",
  "Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi",
  "Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Micronesia",
  "Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia",
  "Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea",
  "North Macedonia","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea",
  "Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa",
  "San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles",
  "Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa",
  "South Korea","South Sudan", "Spain","Sri Lanka", "St Kitts and Nevis", "St Lucia", "St Vincent and the Grenadines", "Sudan","Suriname","Sweden","Switzerland",
  "Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago",
  "Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates",
  "United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela",
  "Vietnam","Yemen","Zambia","Zimbabwe"
];

const initialQuestions = [
  { id: "afghanistan", name: "Afghanistan", continent: "Asia", image: require("../assets/images/Afghanistan.png") },
  { id: "albania", name: "Albania", continent: "Europe", image: require("../assets/images/Albania.png") },
  { id: "algeria", name: "Algeria", continent: "Africa", image: require("../assets/images/Algeria.png") },
  { id: "andorra", name: "Andorra", continent: "Europe", image: require("../assets/images/Andorra.png") },
  { id: "angola", name: "Angola", continent: "Africa", image: require("../assets/images/Angola.png") },
  { id: "antigua and barbuda", name: "Antigua and Barbuda", continent: "North America", image: require("../assets/images/Antigua_and_Barbuda.png") },
  { id: "argentina", name: "Argentina", continent: "South America", image: require("../assets/images/Argentina.png") },
  { id: "armenia", name: "Armenia", continent: "Asia", image: require("../assets/images/Armenia.png") },
  { id: "australia", name: "Australia", continent: "Oceania", image: require("../assets/images/Australia.png") },
  { id: "austria", name: "Austria", continent: "Europe", image: require("../assets/images/Austria.png") },
  { id: "azerbaijan", name: "Azerbaijan", continent: "Asia", image: require("../assets/images/Azerbaijan.png") },
  { id: "bahamas", name: "Bahamas", continent: "North America", image: require("../assets/images/Bahamas.png") },
  { id: "bahrain", name: "Bahrain", continent: "Asia", image: require("../assets/images/Bahrain.png") },
  { id: "bangladesh", name: "Bangladesh", continent: "Asia", image: require("../assets/images/Bangladesh.png") },
  { id: "barbados", name: "Barbados", continent: "North America", image: require("../assets/images/Barbados.png") },
  { id: "belarus", name: "Belarus", continent: "Europe", image: require("../assets/images/Belarus.png") },
  { id: "belgium", name: "Belgium", continent: "Europe", image: require("../assets/images/Belgium.png") },
  { id: "belize", name: "Belize", continent: "North America", image: require("../assets/images/Belize.png") },
  { id: "benin", name: "Benin", continent: "Africa", image: require("../assets/images/Benin.png") },
  { id: "bhutan", name: "Bhutan", continent: "Asia", image: require("../assets/images/Bhutan.png") },
  { id: "bolivia", name: "Bolivia", continent: "South America", image: require("../assets/images/Bolivia.png") },
  { id: "bosnia and herzegovina", name: "Bosnia and Herzegovina", continent: "Europe", image: require("../assets/images/Bosnia_and_Herzegovina.png") },
  { id: "botswana", name: "Botswana", continent: "Africa", image: require("../assets/images/Botswana.png") },
  { id: "brazil", name: "Brazil", continent: "South America", image: require("../assets/images/Brazil.png") },
  { id: "brunei", name: "Brunei", continent: "Asia", image: require("../assets/images/Brunei.png") },
  { id: "bulgaria", name: "Bulgaria", continent: "Europe", image: require("../assets/images/Bulgaria.png") },
  { id: "burkina faso", name: "Burkina Faso", continent: "Africa", image: require("../assets/images/Burkina_Faso.png") },
  { id: "burundi", name: "Burundi", continent: "Africa", image: require("../assets/images/Burundi.png") },
  { id: "cambodia", name: "Cambodia", continent: "Asia", image: require("../assets/images/Cambodia.png") },
  { id: "cameroon", name: "Cameroon", continent: "Africa", image: require("../assets/images/Cameroon.png") },
  { id: "canada", name: "Canada", continent: "North America", image: require("../assets/images/Canada.png") },
  { id: "cape verde", name: "Cape Verde", continent: "Africa", image: require("../assets/images/Cape_Verde.png") },
  { id: "central african republic", name: "Central African Republic", continent: "Africa", image: require("../assets/images/Central_African_Republic.png") },
  { id: "chad", name: "Chad", continent: "Africa", image: require("../assets/images/Chad.png") },
  { id: "chile", name: "Chile", continent: "South America", image: require("../assets/images/Chile.png") },
  { id: "china", name: "China", continent: "Asia", image: require("../assets/images/China.png") },
  { id: "colombia", name: "Colombia", continent: "South America", image: require("../assets/images/Colombia.png") },
  { id: "comoros", name: "Comoros", continent: "Africa", image: require("../assets/images/Comoros.png") },
  { id: "congo", name: "Congo", continent: "Africa", image: require("../assets/images/Congo.png") },
  { id: "costa rica", name: "Costa Rica", continent: "North America", image: require("../assets/images/Costa_Rica.png") },
  { id: "croatia", name: "Croatia", continent: "Europe", image: require("../assets/images/Croatia.png") },
  { id: "cuba", name: "Cuba", continent: "North America", image: require("../assets/images/Cuba.png") },
  { id: "cyprus", name: "Cyprus", continent: "Europe", image: require("../assets/images/Cyprus.png") },
  { id: "czech republic", name: "Czech Republic", continent: "Europe", image: require("../assets/images/Czech_Republic.png") },
  { id: "democratic republic of the congo", name: "Democratic Republic of the Congo", continent: "Africa", image: require("../assets/images/Democratic_Republic_of_Congo.png") },
  { id: "denmark", name: "Denmark", continent: "Europe", image: require("../assets/images/Denmark.png") },
  { id: "djibouti", name: "Djibouti", continent: "Africa", image: require("../assets/images/Djibouti.png") },
  { id: "dominica", name: "Dominica", continent: "North America", image: require("../assets/images/Dominica.png") },
  { id: "dominican republic", name: "Dominican Republic", continent: "North America", image: require("../assets/images/Dominican_Republic.png") },
  { id: "ecuador", name: "Ecuador", continent: "South America", image: require("../assets/images/Ecuador.png") },
  { id: "egypt", name: "Egypt", continent: "Africa", image: require("../assets/images/Egypt.png") },
  { id: "el salvador", name: "El Salvador", continent: "North America", image: require("../assets/images/El_Salvador.png") },
  { id: "equatorial guinea", name: "Equatorial Guinea", continent: "Africa", image: require("../assets/images/Equatorial_Guinea.png") },
  { id: "eritrea", name: "Eritrea", continent: "Africa", image: require("../assets/images/Eritrea.png") },
  { id: "estonia", name: "Estonia", continent: "Europe", image: require("../assets/images/Estonia.png") },
  { id: "eswatini", name: "Eswatini", continent: "Africa", image: require("../assets/images/Eswatini.png") },
  { id: "ethiopia", name: "Ethiopia", continent: "Africa", image: require("../assets/images/Ethiopia.png") },
  { id: "fiji", name: "Fiji", continent: "Oceania", image: require("../assets/images/Fiji.png") },
  { id: "finland", name: "Finland", continent: "Europe", image: require("../assets/images/Finland.png") },
  { id: "france", name: "France", continent: "Europe", image: require("../assets/images/France.png") },
  { id: "gabon", name: "Gabon", continent: "Africa", image: require("../assets/images/Gabon.png") },
  { id: "gambia", name: "Gambia", continent: "Africa", image: require("../assets/images/Gambia.png") },
  { id: "georgia", name: "Georgia", continent: "Asia", image: require("../assets/images/Georgia.png") },
  { id: "germany", name: "Germany", continent: "Europe", image: require("../assets/images/Germany.png") },
  { id: "ghana", name: "Ghana", continent: "Africa", image: require("../assets/images/Ghana.png") },
  { id: "greece", name: "Greece", continent: "Europe", image: require("../assets/images/Greece.png") },
  { id: "greenland", name: "Greenland", continent: "North America", image: require("../assets/images/Greenland.png") },
  { id: "grenada", name: "Grenada", continent: "North America", image: require("../assets/images/Grenada.png") },
  { id: "guatemala", name: "Guatemala", continent: "North America", image: require("../assets/images/Guatemala.png") },
  { id: "guinea", name: "Guinea", continent: "Africa", image: require("../assets/images/Guinea.png") },
  { id: "guinea-bissau", name: "Guinea-Bissau", continent: "Africa", image: require("../assets/images/Guinea_Bissau.png") },
  { id: "guyana", name: "Guyana", continent: "South America", image: require("../assets/images/Guyana.png") },
  { id: "haiti", name: "Haiti", continent: "North America", image: require("../assets/images/Haiti.png") },
  { id: "honduras", name: "Honduras", continent: "North America", image: require("../assets/images/Honduras.png") },
  { id: "hungary", name: "Hungary", continent: "Europe", image: require("../assets/images/Hungary.png") },
  { id: "iceland", name: "Iceland", continent: "Standalone", image: require("../assets/images/Iceland.png") },
  { id: "india", name: "India", continent: "Asia", image: require("../assets/images/India.png") },
  { id: "indonesia", name: "Indonesia", continent: "Asia", image: require("../assets/images/Indonesia.png") },
  { id: "iran", name: "Iran", continent: "Asia", image: require("../assets/images/Iran.png") },
  { id: "iraq", name: "Iraq", continent: "Asia", image: require("../assets/images/Iraq.png") },
  { id: "ireland", name: "Ireland", continent: "Europe", image: require("../assets/images/Ireland.png") },
  { id: "israel", name: "Israel", continent: "Asia", image: require("../assets/images/Israel.png") },
  { id: "italy", name: "Italy", continent: "Europe", image: require("../assets/images/Italy.png") },
  { id: "ivory coast", name: "Ivory Coast", continent: "Africa", image: require("../assets/images/Ivory_Coast.png") },
  { id: "jamaica", name: "Jamaica", continent: "North America", image: require("../assets/images/Jamaica.png") },
  { id: "japan", name: "Japan", continent: "Asia", image: require("../assets/images/Japan.png") },
  { id: "jordan", name: "Jordan", continent: "Asia", image: require("../assets/images/Jordan.png") },
  { id: "khazakhstan", name: "Kazakhstan", continent: "Asia", image: require("../assets/images/Kazakhstan.png") },
  { id: "kenya", name: "Kenya", continent: "Africa", image: require("../assets/images/Kenya.png") },
  { id: "krygyzstan", name: "Kyrgyzstan", continent: "Asia", image: require("../assets/images/Kyrgyzstan.png") },
  { id: "kuwait", name: "Kuwait", continent: "Asia", image: require("../assets/images/Kuwait.png") },
  { id: "laos", name: "Laos", continent: "Asia", image: require("../assets/images/Laos.png") },
  { id: "latvia", name: "Latvia", continent: "Europe", image: require("../assets/images/Latvia.png") },
  //{ id: "lebanon", name: "Lebanon", continent: "Asia", image: require("../assets/images/Lebanon.png") },
  { id: "lesotho", name: "Lesotho", continent: "Africa", image: require("../assets/images/Lesotho.png") },
  { id: "liberia", name: "Liberia", continent: "Africa", image: require("../assets/images/Liberia.png") },
  { id: "libya", name: "Libya", continent: "Africa", image: require("../assets/images/Libya.png") },
  { id: "liechtenstein", name: "Liechtenstein", continent: "Europe", image: require("../assets/images/Liechtenstein.png") },
  { id: "lithuania", name: "Lithuania", continent: "Europe", image: require("../assets/images/Lithuania.png") },
  { id: "luxembourg", name: "Luxembourg", continent: "Europe", image: require("../assets/images/Luxembourg.png") },
  { id: "madagascar", name: "Madagascar", continent: "Africa", image: require("../assets/images/Madagascar.png") },
  { id: "malawi", name: "Malawi", continent: "Africa", image: require("../assets/images/Malawi.png") },
  { id: "malaysia", name: "Malaysia", continent: "Asia", image: require("../assets/images/Malaysia.png") },
  { id: "maldives", name: "Maldives", continent: "Asia", image: require("../assets/images/Maldives.png") },
  { id: "mali", name: "Mali", continent: "Africa", image: require("../assets/images/Mali.png") },
  { id: "malta", name: "Malta", continent: "Europe", image: require("../assets/images/Malta.png") },
  { id: "mauritania", name: "Mauritania", continent: "Africa", image: require("../assets/images/Mauritania.png") },
  { id: "mauritius", name: "Mauritius", continent: "Africa", image: require("../assets/images/Mauritius.png") },
  { id: "mexico", name: "Mexico", continent: "North America", image: require("../assets/images/Mexico.png") },
  //{ id: "micronesia", name: "Micronesia", continent: "Oceania", image: require("../assets/images/Micronesia.png") },
  { id: "moldova", name: "Moldova", continent: "Europe", image: require("../assets/images/Moldova.png") },
  { id: "monaco", name: "Monaco", continent: "Europe", image: require("../assets/images/Monaco.png") },
  { id: "mongolia", name: "Mongolia", continent: "Asia", image: require("../assets/images/Mongolia.png") },
  { id: "montenegro", name: "Montenegro", continent: "Europe", image: require("../assets/images/Montenegro.png") },
  { id: "morocco", name: "Morocco", continent: "Africa", image: require("../assets/images/Morocco.png") },
  { id: "mozambique", name: "Mozambique", continent: "Africa", image: require("../assets/images/Mozambique.png") },
  { id: "myanmar", name: "Myanmar", continent: "Asia", image: require("../assets/images/Myanmar.png") },
  { id: "namibia", name: "Namibia", continent: "Africa", image: require("../assets/images/Namibia.png") },
  { id: "nauru", name: "Nauru", continent: "Oceania", image: require("../assets/images/Nauru.png") },
  { id: "nepal", name: "Nepal", continent: "Asia", image: require("../assets/images/Nepal.png") },
  { id: "netherlands", name: "Netherlands", continent: "Europe", image: require("../assets/images/Netherlands.png") },
  { id: "new zealand", name: "New Zealand", continent: "Oceania", image: require("../assets/images/New_Zealand.png") },
  { id: "nicaragua", name: "Nicaragua", continent: "North America", image: require("../assets/images/Nicaragua.png") },
  { id: "niger", name: "Niger", continent: "Africa", image: require("../assets/images/Niger.png") },
  { id: "nigeria", name: "Nigeria", continent: "Africa", image: require("../assets/images/Nigeria.png") },
  { id: "north korea", name: "North Korea", continent: "Asia", image: require("../assets/images/North_Korea.png") },
  //{ id: "north macedonia", name: "North Macedonia", continent: "Europe", image: require("../assets/images/North_Macedonia.png") },
  { id: "norway", name: "Norway", continent: "Europe", image: require("../assets/images/Norway.png") },
  { id: "oman", name: "Oman", continent: "Asia", image: require("../assets/images/Oman.png") },
  { id: "pakistan", name: "Pakistan", continent: "Asia", image: require("../assets/images/Pakistan.png") },
  { id: "palau", name: "Palau", continent: "Oceania", image: require("../assets/images/Palau.png") },
  { id: "panama", name: "Panama", continent: "North America", image: require("../assets/images/Panama.png") },
  { id: "papua new guinea", name: "Papua New Guinea", continent: "Oceania", image: require("../assets/images/Papua_New_Guinea.png") },
  { id: "paraguay", name: "Paraguay", continent: "South America", image: require("../assets/images/Paraguay.png") },
  { id: "peru", name: "Peru", continent: "South America", image: require("../assets/images/Peru.png") },
  { id: "philippines", name: "Philippines", continent: "Asia", image: require("../assets/images/Philippines.png") },
  { id: "poland", name: "Poland", continent: "Europe", image: require("../assets/images/Poland.png") },
  { id: "portugal", name: "Portugal", continent: "Europe", image: require("../assets/images/Portugal.png") },
  { id: "qatar", name: "Qatar", continent: "Asia", image: require("../assets/images/Qatar.png") },
  { id: "romania", name: "Romania", continent: "Europe", image: require("../assets/images/Romania.png") },
  { id: "russia", name: "Russia", continent: "Europe", image: require("../assets/images/Russia.png") },
  { id: "rwanda", name: "Rwanda", continent: "Africa", image: require("../assets/images/Rwanda.png") },
  { id: "samoa", name: "Samoa", continent: "Oceania", image: require("../assets/images/Samoa.png") },
  { id: "saudi arabia", name: "Saudi Arabia", continent: "Asia", image: require("../assets/images/Saudi_Arabia.png") },
  { id: "senegal", name: "Senegal", continent: "Africa", image: require("../assets/images/Senegal.png") },
  { id: "serbia", name: "Serbia", continent: "Europe", image: require("../assets/images/Serbia.png") },
  { id: "seychelles", name: "Seychelles", continent: "Africa", image: require("../assets/images/Seychelles.png") },
  { id: "sierra leone", name: "Sierra Leone", continent: "Africa", image: require("../assets/images/Sierra_Leone.png") },
  { id: "singapore", name: "Singapore", continent: "Asia", image: require("../assets/images/Singapore.png") },
  { id: "slovakia", name: "Slovakia", continent: "Europe", image: require("../assets/images/Slovakia.png") },
  { id: "slovenia", name: "Slovenia", continent: "Europe", image: require("../assets/images/Slovenia.png") },
  { id: "solomon islands", name: "Solomon Islands", continent: "Oceania", image: require("../assets/images/Solomon_Islands.png") },
  { id: "somalia", name: "Somalia", continent: "Africa", image: require("../assets/images/Somalia.png") },
  { id: "south africa", name: "South Africa", continent: "Africa", image: require("../assets/images/South_Africa.png") },
  { id: "south korea", name: "South Korea", continent: "Asia", image: require("../assets/images/South_Korea.png") },
  { id: "south sudan", name: "South Sudan", continent: "Africa", image: require("../assets/images/South_Sudan.png") },
  { id: "spain", name: "Spain", continent: "Europe", image: require("../assets/images/Spain.png") },
  { id: "sri lanka", name: "Sri Lanka", continent: "Asia", image: require("../assets/images/Sri_Lanka.png") },
  { id: "St. Kitts and Nevis", name: "St. Kitts and Nevis", continent: "North America", image: require("../assets/images/St_Kitts_and_Nevis.png") },
  { id: "st. lucia", name: "St. Lucia", continent: "North America", image: require("../assets/images/St_Lucia.png") },
  { id: "st. vincent and the grenadines", name: "St. Vincent and the Grenadines", continent: "North America", image: require("../assets/images/St_Vincent_and_the_Grenadines.png") },
  { id: "suriname", name: "Suriname", continent: "South America", image: require("../assets/images/Suriname.png") },
  { id: "sweden", name: "Sweden", continent: "Europe", image: require("../assets/images/Sweden.png") },
  { id: "switzerland", name: "Switzerland", continent: "Europe", image: require("../assets/images/Switzerland.png") },
  { id: "syria", name: "Syria", continent: "Asia", image: require("../assets/images/Syria.png") },
  { id: "taiwan", name: "Taiwan", continent: "Asia", image: require("../assets/images/Taiwan.png") },
  { id: "tajikistan", name: "Tajikistan", continent: "Asia", image: require("../assets/images/Tajikistan.png") },
  { id: "tanzania", name: "Tanzania", continent: "Africa", image: require("../assets/images/Tanzania.png") },
  { id: "thailand", name: "Thailand", continent: "Asia", image: require("../assets/images/Thailand.png") },
  { id: "togo", name: "Togo", continent: "Africa", image: require("../assets/images/Togo.png") },
  { id: "tonga", name: "Tonga", continent: "Oceania", image: require("../assets/images/Tonga.png") },
  { id: "trinidad and tobago", name: "Trinidad and Tobago", continent: "North America", image: require("../assets/images/Trinidad_and_Tobago.png") },
  { id: "tunisia", name: "Tunisia", continent: "Africa", image: require("../assets/images/Tunisia.png") },
  { id: "turkey", name: "Turkey", continent: "Asia", image: require("../assets/images/Turkey.png") },
  { id: "turkmenistan", name: "Turkmenistan", continent: "Asia", image: require("../assets/images/Turkmenistan.png") },
  { id: "tuvalu", name: "Tuvalu", continent: "Oceania", image: require("../assets/images/Tuvalu.png") },
  { id: "uganda", name: "Uganda", continent: "Africa", image: require("../assets/images/Uganda.png") },
  { id: "ukraine", name: "Ukraine", continent: "Europe", image: require("../assets/images/Ukraine.png") },
  { id: "united arab emirates", name: "United Arab Emirates", continent: "Asia", image: require("../assets/images/United_Arab_Emirates.png") },
  { id: "united kingdom", name: "United Kingdom", continent: "Europe", image: require("../assets/images/United_Kingdom.png") },
  { id: "united states", name: "United States", continent: "North America", image: require("../assets/images/United_States.png") },
  { id: "uruguay", name: "Uruguay", continent: "South America", image: require("../assets/images/Uruguay.png") },
  { id: "uzbekistan", name: "Uzbekistan", continent: "Asia", image: require("../assets/images/Uzbekistan.png") },
  { id: "vanuatu", name: "Vanuatu", continent: "Oceania", image: require("../assets/images/Vanuatu.png") },
  { id: "venezuela", name: "Venezuela", continent: "South America", image: require("../assets/images/Venezuela.png") },
  { id: "vietnam", name: "Vietnam", continent: "Asia", image: require("../assets/images/Vietnam.png") },
  { id: "yemen", name: "Yemen", continent: "Asia", image: require("../assets/images/Yemen.png") },
  { id: "zambia", name: "Zambia", continent: "Africa", image: require("../assets/images/Zambia.png") },
  { id: "zimbabwe", name: "Zimbabwe", continent: "Africa", image: require("../assets/images/Zimbabwe.png") },
];


export default function Quiz() {

  // State variables

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [answeredThisQuestion, setAnsweredThisQuestion] = useState(false);
  const [options, setOptions] = useState([]);
  const timerRef = useRef(null);
  const correctAnswersCountRef = useRef(0);
  const totalQuestions = questions.length;

  // shuffle array function
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // initialize quiz with shuffled questions
  useEffect(() => {
    setQuestions(shuffleArray(initialQuestions));
  }, []);

  // Generate options and start timer on question change
  useEffect(() => {
    if (questions.length > 0) {
      generateOptions();
      startTimer();
      return () => stopTimer();
    }
  }, [index, questions]);

  // Check for game over condition
  useEffect(() => {
    if (strikes >= MAX_STRIKES && totalQuestions > 0) {
      const pct = Math.round((correctAnswersCountRef.current / totalQuestions) * 100);
      setTimeout(() => {
        Alert.alert(
          "Game Over",
          `You hit ${MAX_STRIKES} strikes.\nScore: ${score}\n Quiz Completion: ${pct}%`
        );
      }, 200);
    }
  }, [strikes]);

  // Generate random options including the correct answer
  function getRandomOptions(correct) {
    const pool = ALL_COUNTRIES.filter(c => c.toLowerCase() !== correct.toLowerCase());
    const shuffled = shuffleArray(pool);
    const wrongs = shuffled.slice(0, 3);
    const combined = shuffleArray([...wrongs, correct]);
    return combined;
  }

  // Generate options for the current question
  function generateOptions() {
    if (!questions[index]) return;
    const correct = questions[index].name;
    setOptions(getRandomOptions(correct));
  }

  // Starts countdown timer for the question
  function startTimer() {
    stopTimer();
    setTimeLeft(TIME_LIMIT_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setStrikes(s => s + 1);
          stopTimer();
          if (!answeredThisQuestion) handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  // Stops the countdown timer
  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // Handle answer selection
  function handleAnswer(selected) {
    
    if (answeredThisQuestion || strikes >= MAX_STRIKES) return;

    const q = questions[index];
    const correct = selected === q.name;
    setAnsweredThisQuestion(true);
    stopTimer();

    if (correct) {
      setScore(p => p + POINTS_PER_CORRECT);
      correctAnswersCountRef.current += 1;
    } else {
      setStrikes(s => s + 1);
  
    }

    setFeedback({ type: correct ? "correct" : "wrong", selected });
  }

  // Handle timeout scenario
  function handleTimeout() {
    setFeedback({ type: "timeout", text: "⏰ Time's up!" });
  }

  // Proceed to the next question
  function goToNextQuestion() {
    setFeedback(null);
    setAnsweredThisQuestion(false);
    setIndex(i => (i + 1) % totalQuestions);
    setQuestionNumber(qn => qn + 1);
  }

  // Render quiz over screen if game over
  if ((strikes >= MAX_STRIKES && totalQuestions > 0) || (questionNumber > 40)) {

    const pct = Math.round((correctAnswersCountRef.current / totalQuestions) * 100);
    const qct = Math.round((correctAnswersCountRef.current / (questionNumber > totalQuestions ? 40 : questionNumber)) * 100);

    return (
      <View style={styles.container2}>
        <Text style={styles.title}>Quiz Over</Text>
        <Text style={styles.stat}>❌Strikes: {(questionNumber > totalQuestions ? 40 : questionNumber) - score} </Text>
        <Text style={styles.stat}>✔️Correct: {score} </Text>
        <Text style={styles.stat}>
          Mark: {correctAnswersCountRef.current}/{(questionNumber > totalQuestions ? 40 : questionNumber)} = {qct}%
        </Text>
        <Text style={styles.stat}>
          Quiz Completion: {correctAnswersCountRef.current}/{totalQuestions} = {pct}%
        </Text>
        {((correctAnswersCountRef.current >= 10) && (correctAnswersCountRef.current < 20))  && (
          <View style={{alignItems: 'center', marginVertical: 10, rowGap: 6}}>
            <Text style={{fontSize: 16}}> Congratulations! you've earned an Atlas Scholar Badge </Text>
            <Image source={require("../assets/images/AtlasScholarBadge.png")} style={{width: 100, height: 100}} resizeMode="contain" />
          </View>
        )}
        {((correctAnswersCountRef.current >= 20) && (correctAnswersCountRef.current < 30))  && (
          <View style={{alignItems: 'center', marginVertical: 10, rowGap: 6}}>
            <Text style={{fontSize: 16}}> Congratulations! you've earned an Atlas Pro Badge </Text>
            <Image source={require("../assets/images/AtlasProBadge.png")} style={{width: 100, height: 100}} resizeMode="contain" />
          </View>
        )}
        {((correctAnswersCountRef.current >= 30) && (correctAnswersCountRef.current < 40))  && (
          <View style={{alignItems: 'center', marginVertical: 10, rowGap: 6}}>
            <Text style={{fontSize: 16}}> Congratulations! you've earned an Atlas Master Badge </Text>
            <Image source={require("../assets/images/AtlasMasterBadge.png")} style={{width: 100, height: 100}} resizeMode="contain" />
          </View>
        )}
        {correctAnswersCountRef.current === 40  && (
          <View style={{alignItems: 'center', marginVertical: 10, rowGap: 6}}>
            <Text style={{fontSize: 16}}> Congratulations! you've earned an Atlas God Badge </Text>
            <Image source={require("../assets/images/AtlasGodBadge.png")} style={{width: 100, height: 100}} resizeMode="contain" />
          </View>
        )}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setQuestions(shuffleArray(initialQuestions));
            setIndex(0);
            setScore(0);
            setStrikes(0);
            setFeedback(null);
            setQuestionNumber(1);
            setAnsweredThisQuestion(false);
            correctAnswersCountRef.current = 0;
          }}
        >
          <Text style={styles.primaryButtonText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render current question
  const q = questions[index];
  if (!q) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Text style={styles.points}>✔️ : {score}/{totalQuestions}</Text>
          <Text style={styles.strikes}>❌: {strikes}/{MAX_STRIKES}</Text>
        </View>
        <View style={styles.mapCard}>
          <Image source={q.image} style={styles.mapImage} resizeMode="contain" />
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>Select the Country map shown:</Text>
          <Text style={{ marginTop: 5 }}>⏰ {timeLeft < 1 ? `❌ time up` : `${timeLeft}`}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((opt, i) => {
            let buttonStyle = [styles.optionButton];
            let label = opt;
            
            if (answeredThisQuestion) {
              if (opt === q.name) {                                            
                  buttonStyle.push(styles.correctOption);       // selected correct option turns green             
                  label = `${opt}     (is the right answer)`;
                if (feedback?.selected === opt) {                      
                  label = `${opt}     ✔️ correct`;
                }
              } else if (feedback?.selected === opt) {                  
                  buttonStyle.push(styles.wrongOption);         // selected wrong option turns red
                  label = `${opt}     ❌ wrong`;
              }
            }
            if (timeLeft < 1 && !answeredThisQuestion) {
              if (opt === q.name) {
                buttonStyle.push(styles.correctOption);        // correct option always turns green
                label = `${opt}      (is the right answer)`;
              }
          }

            return (
              <TouchableOpacity
                key={i} style={buttonStyle}
                onPress={() => handleAnswer(opt)}
                disabled={answeredThisQuestion || timeLeft < 1}
              >
                <Text style={styles.optionText}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {(answeredThisQuestion || timeLeft < 1) && (
          <TouchableOpacity style={styles.nextButton} onPress={goToNextQuestion}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.footer}>Question {questionNumber} / {totalQuestions}</Text>
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", justifyContent: "center", padding: 20, alignItems: "center", backgroundColor: "#f6f7fb" },
  container2: { flex: 1, justifyContent: "center", padding: 20, alignItems: "center", backgroundColor: "#f6f7fb" },
  topRow: { width: "100%", flexDirection: "row", justifyContent: "space-between" },
  points: { fontSize: 16 },
  strikes: { fontSize: 16 },
  mapCard: { width: "100%", height: 250, borderRadius: 12, justifyContent: "center", alignItems: "center", marginVertical: 6 },
  mapImage: { width: "90%", height: "90%" },
  optionsContainer: { width: "100%", marginVertical: 12 },
  optionButton: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, marginVertical: 4 },
  correctOption: { backgroundColor: "#d5f1d8", borderColor: "#6ac46a" },
  wrongOption: { backgroundColor: "#ffdede", borderColor: "#ff6666" },
  optionText: { fontSize: 16 },
  nextButton: { backgroundColor: "#2f6bed", paddingVertical: 12, borderRadius: 10, marginVertical: 6 },
  buttonText: { color: "#fff", fontWeight: "600" },
  footer: { marginTop: 14, color: '#666' },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 10 },
  stat: { fontSize: 18, marginVertical: 6 },
  primaryButton: { marginTop: 20, backgroundColor: "#2f6bed", paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
  primaryButtonText: { color: "#fff", fontWeight: "700" },
});

