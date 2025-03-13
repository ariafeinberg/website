document.addEventListener("DOMContentLoaded", () => {


  
  
  // 🎵 Get Sound Elements
  const bgMusic = document.getElementById("bgMusic");
  const spinSound = document.getElementById("spinSound");
  const victorySound = document.getElementById("victorySound");
  const playButton = document.getElementById("playMusic");
  const pauseButton = document.getElementById("pauseMusic");

  function enableMusic() {
    bgMusic.play().catch(() => console.log("Autoplay blocked, waiting for user action..."));
    bgMusic.volume = 0.7;
    document.removeEventListener("click", enableMusic);
  }
  bgMusic.play().catch(() => document.addEventListener("click", enableMusic));

  playButton.addEventListener("click", () => bgMusic.play());
  pauseButton.addEventListener("click", () => bgMusic.pause());

  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");
  const centerImage = document.querySelector(".center-image");
  const goToPageButton = document.getElementById("goToPage");
  const wheelContainer = document.querySelector(".wheel-container");

  const sections = [
    { label: "About", url: "AboutMe/aboutme.html", icon: "about.png" },
    { label: "Videos", url: "portfolio_page/video-portfolio.html", icon: "video.png" },
    { label: "Digital Art", url: "digital_art_page/digital_art.html", icon: "digitalArt.png" },
    { label: "Resume", url: "resume/resume.html", icon: "resume.png" },
    { label: "Illustrations", url: "illustrations_page/illustrations.html", icon: "illustration.png" },
    { label: "Freelance", url: "freelance_page/freelance.html", icon: "freelance.png" },
    { label: "Food", url: "food_page/food.html", icon: "food.png" },
    { label: "Custom", url: "custom_page/custom.html", icon: "custom.png" }
  ];

  const colors = ["rgb(253, 215, 126)", "rgb(255, 168, 39)"];
  const numSections = sections.length;
  const arc = (2 * Math.PI) / numSections;
  let rotation = 0;
  let spinSpeed = 0;
  let spinning = false;
  let selectedIndex = null;
  let iconElements = [];

  function drawWheel() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(300, 300);
    ctx.rotate(rotation);  // ✅ Ensure the whole wheel rotates
    ctx.translate(-300, -300);

    for (let i = 0; i < numSections; i++) {
        const startAngle = i * arc;
        const endAngle = startAngle + arc;

        ctx.beginPath();
        ctx.moveTo(300, 300);
        ctx.arc(300, 300, 290, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % 2];
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawIconsInsideCanvas(); // ✅ Draw icons inside the wheel
    ctx.restore();
}

let iconPositions = []; // Store icon positions for click detection


// Create tooltip element
const tooltip = document.createElement("div");
tooltip.classList.add("wheel-tooltip");
tooltip.innerText = "Click Me!";
document.body.appendChild(tooltip);

function drawIconsInsideCanvas() {
  const iconRadius = 220; // Distance from center
  iconPositions = []; // Reset stored positions

  for (let i = 0; i < numSections; i++) {
      const iconAngle = (i + 0.42) * arc + rotation; 
      const iconX = 300 + Math.cos(iconAngle) * iconRadius;
      const iconY = 300 + Math.sin(iconAngle) * iconRadius;

      iconPositions.push({ x: iconX, y: iconY, url: sections[i].url });

      const img = new Image();
      img.src = `icons/${sections[i].icon}`;
      img.onload = function () {
          ctx.save();
          ctx.translate(iconX, iconY);
          ctx.rotate(iconAngle + Math.PI / 2);
          ctx.drawImage(img, -40, -40, 100, 100);
          ctx.restore();
      };
  }
}

// ✅ Detect hover over icons and show tooltip
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    let iconHovered = false;

    for (let icon of iconPositions) {
        const distance = Math.sqrt((mouseX - icon.x) ** 2 + (mouseY - icon.y) ** 2);
        if (distance < 50) { // Hover detection range
            tooltip.style.left = `${event.clientX + 10}px`; // Adjust position
            tooltip.style.top = `${event.clientY + 10}px`;
            tooltip.style.opacity = "1"; // Show tooltip
            iconHovered = true;
            break;
        }
    }

    if (!iconHovered) {
        tooltip.style.opacity = "0"; // Hide tooltip when not hovering
    }
});

// Hide tooltip when moving out of canvas
canvas.addEventListener("mouseleave", () => {
    tooltip.style.opacity = "0";
});


// ✅ Add event listener to detect clicks on the icons inside the canvas
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let icon of iconPositions) {
        const distance = Math.sqrt((mouseX - icon.x) ** 2 + (mouseY - icon.y) ** 2);
        if (distance < 40) { // Adjust click detection radius
            window.location.href = icon.url; // Redirect to page
            return;
        }
    }
});





  function drawIcons() {
    let iconRotation = Math.PI / numSections;  // ✅ Slight offset to align icons to sections

    // Remove old icons to prevent duplicates
    iconElements.forEach(icon => icon.remove());
    iconElements = [];

    const iconRadius = 220; // ✅ Distance from center

    // Offset values to move icons slightly right and down
    const offsetX = 420; // Move right (increase for more shift)
    const offsetY = 100; // Move down (increase for more shift)

    for (let i = 0; i < numSections; i++) {
        const iconAngle = i * arc + iconRotation;

        const iconX = 300 + Math.cos(iconAngle) * iconRadius + offsetX;
        const iconY = 300 + Math.sin(iconAngle) * iconRadius + offsetY;

        const img = document.createElement("img");
        img.src = `icons/${sections[i].icon}`;
        img.classList.add("wheel-icon");
        img.style.position = "absolute";
        img.style.width = "150px"; // ✅ Bigger icons
        img.style.height = "150px";
        img.style.left = `${iconX - 40}px`; // ✅ Centering properly
        img.style.top = `${iconY - 40}px`;
        img.style.transform = `rotate(${-iconRotation}rad)`; // ✅ Ensures icons stay upright
        img.style.transition = "transform 0.5s ease-out"; // ✅ Smooth transition after spin
        img.style.cursor = "pointer";
        img.style.zIndex = 100000;

        img.addEventListener("click", () => {
            window.location.href = sections[i].url;
        });

        document.body.appendChild(img);
        iconElements.push(img);
    }
}


  function startSpin() {
    if (spinning) return;
    spinning = true;
    spinSpeed = Math.random() * 0.5 + 0.7;
    goToPageButton.style.display = "none";
    centerImage.src = "gifs/nauseous.gif";
    bgMusic.volume = 0.2;
    spinSound.volume = 1.0;
    spinSound.play();

    function animateSpin() {
      if (!spinning) return;
      rotation += spinSpeed; // ✅ Ensures wheel & icons rotate in the same direction
      drawWheel();
      spinSpeed *= 0.98;
      if (spinSpeed < 0.01) stopSpin();
      else requestAnimationFrame(animateSpin);
    }

    requestAnimationFrame(animateSpin);
  }

const centerTooltip = document.getElementById("center-tooltip");

// ✅ Show tooltip when hovering over center image
centerImage.addEventListener("mouseenter", (event) => {
  centerTooltip.classList.add("show"); // Show tooltip
  centerTooltip.style.left = `${event.clientX + 10}px`; // Adjust position
  centerTooltip.style.top = `${event.clientY + 10}px`;
});

// ✅ Move tooltip with mouse
centerImage.addEventListener("mousemove", (event) => {
  centerTooltip.style.left = `${event.clientX + 10}px`; // Follow cursor
  centerTooltip.style.top = `${event.clientY + 10}px`;
});

// ✅ Hide tooltip when leaving center image
centerImage.addEventListener("mouseleave", () => {
  centerTooltip.classList.remove("show"); // Hide tooltip
});


  function stopSpin() {
    spinning = false;
    spinSpeed = 0;
    spinSound.pause();
    spinSound.currentTime = 0;

    // ✅ Normalize the rotation angle to a value between 0 and 2π
    let finalAngle = rotation % (2 * Math.PI);
    if (finalAngle < 0) finalAngle += 2 * Math.PI; // Ensure positive angle

    // ✅ Calculate the section closest to the top (90°)
    let indexOffset = Math.round(((3 * Math.PI / 2) - finalAngle) / arc) % numSections;
    if (indexOffset < 0) indexOffset += numSections;

    selectedIndex = indexOffset;
    console.log("Selected Section:", sections[selectedIndex].label); // ✅ Debugging check

    // ✅ Keep the wheel in place, but make icons face upright
    drawWheel();
    centerImage.src = "gifs/blinking.gif";

    setTimeout(() => {
        victorySound.volume = 0.7;
        victorySound.play();
    }, 500);

    setTimeout(() => {
        bgMusic.volume = 0.7;
    }, 1000);

    goToPageButton.style.display = "block";
}


  goToPageButton.addEventListener("click", () => {
    if (selectedIndex !== null) {
      window.location.href = sections[selectedIndex].url;
    }
  });

  centerImage.addEventListener("click", startSpin);
  drawWheel();
});


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

