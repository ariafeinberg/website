document.addEventListener("DOMContentLoaded", () => {
  // 🎵 Get Sound Elements
  const bgMusic = document.getElementById("bgMusic");
  const spinSound = document.getElementById("spinSound");
  const victorySound = document.getElementById("victorySound");
  const playButton = document.getElementById("playMusic");
  const pauseButton = document.getElementById("pauseMusic");

  // ✅ Try to autoplay music when page loads
  function enableMusic() {
    bgMusic.play().catch(() => {
      console.log("Autoplay blocked, waiting for user action...");
    });

    bgMusic.volume = 0.7;

    // Remove event listener after first interaction
    document.removeEventListener("click", enableMusic);
  }

  // ✅ Try autoplay, but wait for user click if blocked
  bgMusic.play().catch(() => {
    document.addEventListener("click", enableMusic);
  });

  // 🎵 Play Button Click
  playButton.addEventListener("click", () => {
    bgMusic.play();
  });

  // ⏸️ Pause Button Click
  pauseButton.addEventListener("click", () => {
    bgMusic.pause();
  });
});

const tooltip = document.createElement("div");
tooltip.classList.add("wheel-tooltip");
document.body.appendChild(tooltip);


const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const centerImage = document.querySelector(".center-image");
const goToPageButton = document.getElementById("goToPage");

const sections = [
  { label: "About", url: "AboutMe/aboutme.html", icon: "about.png" },
  { label: "Videos", url: "portfolio_page/video-portfolio.html", icon: "gallery.png" },
  { label: "Services", url: "../services.html", icon: "services.png" },
  { label: "Resume", url: "resume/resume.html", icon: "contact.png" },
  { label: "Portfolio", url: "../index.html", icon: "portfolio.png" },
  { label: "Freelance", url: "../freelance.html", icon: "freelance.png" },
  { label: "Food", url: "../food.html", icon: "food.png" },
  { label: "Contact", url: "../contact.html", icon: "contact.png" }
];

// 🎨 Colors: Alternating Pale Yellow and Orange
const colors = ["rgb(253, 215, 126)", "rgb(255, 168, 39)"];

const numSections = sections.length;
const arc = (2 * Math.PI) / numSections;
let rotation = 0;
let spinSpeed = 0;
let spinning = false;
let selectedIndex = null;
let iconPositions = [];

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(300, 300);
  ctx.rotate(rotation);
  ctx.translate(-300, -300);

  iconPositions = [];

  for (let i = 0; i < numSections; i++) {
    const startAngle = i * arc;
    const endAngle = startAngle + arc;

    // 🎨 Draw Wheel Slices
    ctx.beginPath();
    ctx.moveTo(300, 300);
    ctx.arc(300, 300, 290, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i % 2];
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 🏷️ Add Text
    ctx.fillStyle = "black";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textX = 300 + Math.cos(startAngle + arc / 2) * 180;
    const textY = 300 + Math.sin(startAngle + arc / 2) * 180;
    ctx.fillText(sections[i].label, textX, textY - 20);

    // 🖼️ Load PNG Icons **(AFTER TEXT for layering)**
    const img = new Image();
    img.src = `icons/${sections[i].icon}`;
    img.onload = function () {
      ctx.drawImage(img, textX - 20, textY, 40, 40);
    };

    // Store icon positions for click detection
    iconPositions.push({ x: textX - 20, y: textY, width: 40, height: 40, url: sections[i].url });
  }

  ctx.restore();
}

function startSpin() {
  if (spinning) return;

  spinning = true;
  spinSpeed = Math.random() * 0.5 + 0.7;
  goToPageButton.style.display = "none";
  
  centerImage.src ="gifs/nauseous.gif";

  // 🔊 Lower Background Music Volume
  bgMusic.volume = 0.2; 

  // 🔊 Play Spinning Sound (Looping)
  spinSound.volume = 1.0;
  spinSound.play();

  function animateSpin() {
    if (!spinning) return;

    rotation += spinSpeed;
    drawWheel();

    spinSpeed *= 0.98;

    if (spinSpeed < 0.01) {
      stopSpin();
    } else {
      requestAnimationFrame(animateSpin);
    }
  }

  requestAnimationFrame(animateSpin);
}

function stopSpin() {
  spinning = false;
  spinSpeed = 0;

  // 🔊 Stop Spinning Sound
  spinSound.pause();
  spinSound.currentTime = 0; 

  // 🎯 Select the Section at the TOP (90°)
  let finalAngle = (rotation % (2 * Math.PI));
  let indexOffset = Math.floor(((2 * Math.PI - finalAngle) / arc) + 0.5) % numSections;
  selectedIndex = indexOffset;

  console.log("Selected Section:", sections[selectedIndex].label);

  centerImage.src ="gifs/blinking.gif";


  setTimeout(() => {
    victorySound.volume = 0.7;
    victorySound.play();
  }, 500);  // 1000ms = 1 second

  setTimeout(() => {
    bgMusic.volume = 0.7; 
  }, 1000);  // 1000ms = 1 second

  // 🎉 Show "Go to Page" button
  goToPageButton.style.display = "block";
}

// 🖱️ Detect Clicks on Icons
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  for (let icon of iconPositions) {
    if (
      clickX >= icon.x &&
      clickX <= icon.x + icon.width &&
      clickY >= icon.y &&
      clickY <= icon.y + icon.height
    ) {
      window.location.href = icon.url; // Navigate when an icon is clicked
    }
  }
});

// 🌍 Navigate to Selected Page
goToPageButton.addEventListener("click", () => {
  if (selectedIndex !== null) {
    window.location.href = sections[selectedIndex].url;
  }
});

// 🖱️ Click Center Icon to Start Spin
centerImage.addEventListener("click", startSpin);

// 🔃 Draw Initial Wheel
drawWheel();


// document.addEventListener("mousemove", function(e) {
//   const sparkle = document.createElement("div");
//   sparkle.classList.add("sparkle");
//   document.body.appendChild(sparkle);

//   sparkle.style.left = `${e.clientX}px`;
//   sparkle.style.top = `${e.clientY}px`;

//   setTimeout(() => {
//     sparkle.remove();
//   }, 500); // Remove after animation
// });

// 🎨 Create Paintbrush Cursor
const paintbrush = document.createElement("img");
paintbrush.src = "paintbrush.png"; // Ensure this file exists
paintbrush.classList.add("paintbrush");
document.body.appendChild(paintbrush);

// 🖱️ Move Paintbrush & Create Sparkles
document.addEventListener("mousemove", function(e) {
  // Position the paintbrush at the cursor center
  paintbrush.style.left = `${e.clientX}px`;
  paintbrush.style.top = `${e.clientY}px`;

  // Create a sparkle effect (BEHIND paintbrush)
  const sparkle = document.createElement("div");
  sparkle.classList.add("sparkle");

  // Insert sparkle before paintbrush to keep layering correct
  document.body.insertBefore(sparkle, paintbrush);

  // Set sparkle position
  sparkle.style.left = `${e.clientX}px`;
  sparkle.style.top = `${e.clientY}px`;

  // Remove the sparkle after animation
  setTimeout(() => {
    sparkle.remove();
  }, 500);
});



// Show tooltip on hover
canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const hoverX = event.clientX - rect.left;
  const hoverY = event.clientY - rect.top;

  let iconHovered = false;

  for (let icon of iconPositions) {
    if (
      hoverX >= icon.x &&
      hoverX <= icon.x + icon.width &&
      hoverY >= icon.y &&
      hoverY <= icon.y + icon.height
    ) {
      tooltip.innerText = " Go! ";
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY}px`;
      tooltip.style.opacity = "1";
      iconHovered = true;
      break;
    }
  }

  if (!iconHovered) {
    tooltip.style.opacity = "0";
  }
});

// Hide tooltip when moving out
canvas.addEventListener("mouseleave", () => {
  tooltip.style.opacity = "0";
});

// 🎯 Create Tooltip
const centerTooltip = document.createElement("div");
centerTooltip.classList.add("center-tooltip");
centerTooltip.innerText = "Click to Spin";
document.body.appendChild(centerTooltip);

// 🖱️ Show tooltip when hovering over center image
centerImage.addEventListener("mouseenter", (event) => {
  centerTooltip.style.display = "block"; // Show tooltip
  centerTooltip.style.left = `${event.clientX + 10}px`; // Adjust position
  centerTooltip.style.top = `${event.clientY + 10}px`;
});

// 🖱️ Move tooltip with mouse
centerImage.addEventListener("mousemove", (event) => {
  centerTooltip.style.left = `${event.clientX + 10}px`; // Follow cursor
  centerTooltip.style.top = `${event.clientY + 10}px`;
});

// 🖱️ Hide tooltip when leaving center image
centerImage.addEventListener("mouseleave", () => {
  centerTooltip.style.display = "none";
});
