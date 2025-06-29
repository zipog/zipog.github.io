let flashcards = []; // will contain an array of dictionaries with format:  
//[{ Front: "Dog", FrontImage: "dog.png", Back: "いぬ", BackImage: "dog_kanji.png" },{},{}]
let flashcard_decks = {};  // { sheetName: [flashcard, flashcard, ...], ... }
let currentIndex = 0;
let showingFront = true;

const flashcard = document.getElementById("flashcard");
const flipBtn = document.getElementById("flipBtn");
const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

const csvSelect = document.getElementById("csvSelect");




// --------------------Card data processing-------------------------//
// Load Excel file, parse all sheets into flashcard_decks
// populates flashcard_decks
async function loadExcelFile(filePath) {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();

    // Read the Excel workbook
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Clear existing decks
    flashcard_decks = {};

    // Parse each sheet into an array of flashcard objects
    workbook.SheetNames.forEach(sheetName => { // loops
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Map each row to a flashcard object, with safe defaults and trimming
      flashcard_decks[sheetName] = jsonData.map(row => ({
        front: (row.Front || "").toString().trim(),
        frontImage: (row.FrontImage || "").toString().trim(),
        back: (row.Back || "").toString().trim(),
        backImage: (row.BackImage || "").toString().trim()
      }));
    });

    console.log("Loaded decks:", Object.keys(flashcard_decks)); 
    populateDeckDropdown(); // sets up the options drop down selection
  } catch (error) {
    console.error("Error loading Excel file:", error);
  }
}
// Load the file (from relative path), e.g. "decks/myflashcards.xlsx"
loadExcelFile("excel_files/flash_card_data.xlsx")
// loadExcelFile("excel_files/flash_card_data_test.xlsx").then(() => {
//   // After loading, pick a deck (sheet name must exist in the Excel file)
//   selectDeck("Constants"); // populates flashcards
// });


// dynamic options dropdown
// assumes that flashcard_decks is already populated
function populateDeckDropdown() {
  const deckSelect = document.getElementById("deckSelect");
  deckSelect.innerHTML = ""; // Clear existing options

  Object.keys(flashcard_decks).forEach(deckName => {
    const option = document.createElement("option");
    option.value = deckName;
    option.textContent = deckName;
    deckSelect.appendChild(option);
  });

  // Optional: auto-select the first deck and load it
  if (deckSelect.options.length > 0) {
    selectDeck(deckSelect.options[0].value);
  }
}

// Flash card deck options selection change
document.getElementById("deckSelect").addEventListener("change", (e) => {
  selectDeck(e.target.value);
});

// Select a deck by its name (sheet name), set it as current flashcards and show first card
function selectDeck(sheetName) {
  if (!(sheetName in flashcard_decks)) {
    console.warn(`Deck "${sheetName}" does not exist.`);
    return;
  }

  flashcards = flashcard_decks[sheetName];
  currentIndex = 0;
  showCard(); // Your existing function to display the current card
}


// ---------------------Card Visual display------------------------//
// assumes that flashcards and flashcard_decks are already populated
function showCardContent(label, text, imagePath) {
  const formattedText = text.replaceAll("\n", "<br>");

  flashcard.innerHTML = `
    <div class="card-content">
      ${imagePath ? `
        <a href="${imagePath}" target="_blank">
          <img src="${imagePath}" alt="${label} Image" class="card-image" />
        </a>` : ""
      }
      <div><strong>${label}</strong> ${formattedText}</div>
    </div>
  `;
}

function showCard() { // mainly shows the front face of the card
  const card = flashcards[currentIndex];//takes a dictionary/object on the flashcard array at currentIndex
  showCardContent(">", card.front, card.frontImage); //card.front getting key directly
  showingFront = true;
}

// ---------------------UI interactions------------------------//


// Button presses
flipBtn.addEventListener("click", () => {
  flipCard();
});

prevBtn.addEventListener("click", () => {
  showPreviousCard();
});

nextBtn.addEventListener("click", () => {
  showNextCard();
});

shuffleBtn.addEventListener("click", () => {
  shuffleCards();
});


// Keyboard presses
document.addEventListener("keydown", function (event) {
  event.preventDefault();
  switch (event.key) {
    case "ArrowLeft":
      showPreviousCard();
      break;
    case "ArrowRight":
      showNextCard();
      break;
    case "ArrowUp":
      shuffleCards();
      break;
    case "ArrowDown":
      flipCard();
      break;
  }
});

function showPreviousCard(){
  // Prevents errors from trying to access an index in an empty list.
  if (flashcards.length === 0) return; 
  //This line moves one card back, but safely wraps around to the last card if you're at the beginning.
  currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
  showCard();
}

function showNextCard(){
  if (flashcards.length === 0) return;
  currentIndex = (currentIndex + 1) % flashcards.length;
  showCard();
}

function shuffleCards(){
  if (flashcards.length <= 1) return;
  // Fisher–Yates shuffle
  for (let i = flashcards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
  }
  currentIndex = 0;
  showCard();
}

function flipCard(){
  const card = flashcards[currentIndex];
  if (showingFront) {
    showCardContent("", card.back, card.backImage);
  } else {
    showCardContent(">", card.front, card.frontImage);
  }
  showingFront = !showingFront;
}