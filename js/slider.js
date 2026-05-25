console.clear();

gsap.registerPlugin(Flip);

const modal = document.querySelector(".modal");
const modalContent = modal.querySelector(".content");
const modalOverlay = modal.querySelector(".overlay");
const boxes = gsap.utils.toArray(".boxes-container .box");
const boxesContent = gsap.utils.toArray(".box-content");

let activeBoxIndex = null;
let activeBoxContent = null;

function openModal(boxContent, index) {
  if (activeBoxContent) return;

  activeBoxIndex = index;
  activeBoxContent = boxContent;

  const state = Flip.getState(boxContent);

  // Move the clicked element into the modal before animating back into place
  modalContent.appendChild(boxContent);

  // Ensure modal is interactable/visible for the duration of the flip
  modal.classList.add("is-open");

  // Reset overlay appearance
  gsap.set(modalOverlay, { autoAlpha: 0 });

  Flip.from(state, {
    duration: 0.7,
    ease: "power1.inOut",
    absolute: true
  });

  gsap.to(modalOverlay, {
    autoAlpha: 0.65,
    duration: 0.35,
    ease: "power1.inOut"
  });
}

function closeModal() {
  if (!activeBoxContent) return;

  const boxContent = activeBoxContent;
  const index = activeBoxIndex;

  const state = Flip.getState(boxContent);

  boxes[index].appendChild(boxContent);

  activeBoxIndex = null;
  activeBoxContent = null;

  gsap.to(modalOverlay, {
    autoAlpha: 0,
    duration: 0.25,
    ease: "power1.inOut"
  });

  Flip.from(state, {
    duration: 0.7,
    ease: "power1.inOut",
    absolute: true
  });

  // Hide after flip finishes
  gsap.delayedCall(0.35, () => modal.classList.remove("is-open"));
}

boxesContent.forEach((boxContent, i) => {
  boxContent.addEventListener("click", () => openModal(boxContent, i));
});

modalOverlay.addEventListener("click", closeModal);

// Allow ESC even if focus isn't inside the modal element
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});


