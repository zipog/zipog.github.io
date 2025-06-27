let flashcards = [];
let currentIndex = 0;
let showingFront = true;

const flashcard = document.getElementById("flashcard");
const flipBtn = document.getElementById("flipBtn");
const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

const csvSelect = document.getElementById("csvSelect");

function loadCSVFile(filePath) {
  fetch(filePath)
    .then(response => response.text())
    .then(text => {
      flashcards = parseCSV(text);
      currentIndex = 0;
      showCard();
    });
}

loadCSVFile(csvSelect.value);

// built-in csv parser
// function parseCSV(csv) {
//   const lines = csv.trim().split("\n").slice(1); // skip header

//   return lines.map(line => {
//     const [front, frontImage, back, backImage] = line.split(",");
//     return {
//       front: front.trim(),
//       frontImage: frontImage?.trim() || "",
//       back: back.trim(),
//       backImage: backImage?.trim() || ""
//     };
//   });
// }

// parsing using papa parse
function parseCSV(csv) {
  const parsed = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true
  });

  return parsed.data.map(row => ({
    front: (row.Front || "").trim(),
    frontImage: (row.FrontImage || "").trim(),
    back: (row.Back || "").trim(),
    backImage: (row.BackImage || "").trim()
  }));
}


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

function showCard() {
  const card = flashcards[currentIndex];
  showCardContent(">", card.front, card.frontImage);
  showingFront = true;
}

// Button presses
flipBtn.addEventListener("click", () => {
  const card = flashcards[currentIndex];
  if (showingFront) {
    showCardContent("", card.back, card.backImage);
  } else {
    showCardContent(">", card.front, card.frontImage);
  }
  showingFront = !showingFront;
});

prevBtn.addEventListener("click", () => {
  if (flashcards.length === 0) return;
  currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
  showCard();
});

nextBtn.addEventListener("click", () => {
  if (flashcards.length === 0) return;
  currentIndex = (currentIndex + 1) % flashcards.length;
  showCard();
});


shuffleBtn.addEventListener("click", () => {
  if (flashcards.length <= 1) return;

  // Fisher–Yates shuffle
  for (let i = flashcards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
  }

  currentIndex = 0;
  showCard();
});


csvSelect.addEventListener("change", () => {
  loadCSVFile(csvSelect.value);
});


// keyboard controls
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
   if (flashcards.length === 0) return;
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