let flashcards = [];
let currentIndex = 0;
let showingFront = true;

const flashcard = document.getElementById("flashcard");
const flipBtn = document.getElementById("flipBtn");
const nextBtn = document.getElementById("nextBtn");

fetch("consts.csv")
  .then(response => response.text())
  .then(text => {
    flashcards = parseCSV(text);
    showCard();
// console.log("csv fetched");
  });

function parseCSV(csv) {
  const lines = csv.trim().split("\n").slice(1); // skip header
  return lines.map(line => {
    const [front, back] = line.split(",");
    return { front, back };
  });
}

function showCard() {
  if (flashcards.length === 0) return;
  const card = flashcards[currentIndex];
  flashcard.textContent = `> ${card.front}`;
  showingFront = true;
}

flipBtn.addEventListener("click", () => {
  if (flashcards.length === 0) return;
  const card = flashcards[currentIndex];
  flashcard.textContent = showingFront ? `* ${card.back}` : `> ${card.front}`;
  showingFront = !showingFront;
});

nextBtn.addEventListener("click", () => {
  if (flashcards.length === 0) return;
  currentIndex = (currentIndex + 1) % flashcards.length;
  showCard();
});
