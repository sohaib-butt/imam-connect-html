document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".sub-menu-item");
  const currentPath = window.location.pathname;
  console.log("Current Path:", currentPath);

  navItems.forEach((item) => {
    const itemPath = new URL(item.href).pathname;
    console.log("Item Path:", itemPath);

    if (itemPath === currentPath) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }

    item.addEventListener("click", () => {
      navItems.forEach((nav) => nav.classList.remove("selected"));
      item.classList.add("selected");
    });
  });

  const popularTags = ["Nikah", "Marriage & Family Services", "Classes", "Training", "Counselling", "Life update"];

  const tagList = document.getElementById("popular-list");

  popularTags.forEach((str) => {
    const div = document.createElement("div");
    div.textContent = str;
    div.classList.add("popular-tag");
    tagList.appendChild(div);
  });
});
