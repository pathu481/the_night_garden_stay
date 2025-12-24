const images = document.querySelectorAll(".gallery-item img");

const modal = document.createElement("div");
modal.className = "image-modal";

const modalImg = document.createElement("img");
const closeBtn = document.createElement("span");

closeBtn.innerHTML = "&times;";
closeBtn.className = "close-btn";

modal.appendChild(closeBtn);
modal.appendChild(modalImg);
document.body.appendChild(modal);

images.forEach(img => {
  img.addEventListener("click", () => {
    modalImg.src = img.src;
    modal.classList.add("active");
  });
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("publicGallery");
  const gallery = Storage.get("gallery").filter(img => img.status === "active");

  gallery.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `<img src="${item.image}" /><p>${item.title}</p>`;
    container.appendChild(div);
  });
});
const gallery = Storage.get("gallery").filter(i => i.status==="active");
