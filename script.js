const panel = document.getElementById("panel");
const button = document.getElementById("changeBtn");

button.addEventListener("click", () => {
  panel.textContent = "You clicked the button!";
});