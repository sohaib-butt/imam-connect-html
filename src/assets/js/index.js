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

  const popularTags = [
    "Nikah",
    "Marriage & Family Services",
    "Classes",
    "Training",
    "Counselling",
    "Life update",
  ];

  const tagList = document.getElementById("popular-list");

  popularTags.forEach((str) => {
    const div = document.createElement("div");
    div.textContent = str;
    div.classList.add("popular-tag");
    tagList.appendChild(div);
  });

  const logos = [
    "assets/images/yahoo.svg",
    "assets/images/vulcan.svg",
    "assets/images/bbc.svg",
    "assets/images/islam.svg",
    "assets/images/arabnews.svg",
    "assets/images/lavanguaria.svg",
    "assets/images/malaymail.svg",
  ];

  const logoContainer = document.getElementById("media-list");

  logos.forEach((logo) => {
    const img = document.createElement("img");
    img.src = logo;
    img.alt = "Logo";
    // img.style.width = "100px"; // Adjust the width as needed
    // img.style.height = "100px"; // Adjust the height as needed
    logoContainer.appendChild(img);
  });

  const statsData = [
    { count: "10k+", text: "Service Providers" },
    { count: "931k+", text: "Services searched per day" },
    { count: "10k+", text: "Customers present day" },
    { count: "100+", text: "Categories" },
  ];

  const statsContainer = document.getElementById("stats-container");
  console.log('statsContainer', statsContainer);

  statsData.forEach((stat) => {
    console.log('stat', stat);
    const statDiv = document.createElement("div");
    statDiv.classList.add("stat-div");

    const statCount = document.createElement("span");
    statCount.classList.add("stat-count");
    statCount.textContent = stat.count;

    const statText = document.createElement("span");
    statText.classList.add("stat-txt");
    statText.textContent = stat.text;

    statDiv.appendChild(statCount);
    statDiv.appendChild(statText);
    statsContainer.appendChild(statDiv);
  });
});
