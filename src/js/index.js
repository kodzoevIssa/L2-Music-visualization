const columnsGap = 10;
const columnCount = 1024;

const canvas = document.getElementById("player-fireplace");
const ctx = canvas.getContext("2d");

const player = document.getElementById("audio-player");

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let source = audioCtx.createMediaElementSource(player);
let analyser = audioCtx.createAnalyser();
analyser.fftSize = columnCount;
source.connect(analyser);
analyser.connect(audioCtx.destination);

let frequencyData = new Uint8Array(analyser.frequencyBinCount);

document.getElementById("player-btn").addEventListener("click", function () {
  if (!this.classList.contains("play-btn__play")) {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    player.play();
    this.textContent = "Pause";
    this.classList.add("play-btn__play");
  } else {
    player.pause();
    this.textContent = "Play";
    this.classList.remove("play-btn__play");
  }
});

window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

function drawColumn(x, width, height) {
  const gradient = ctx.createLinearGradient(
    0,
    canvas.height - height / 2,
    0,
    canvas.height
  );
  gradient.addColorStop(1, "rgba(255,255,255,1)");
  gradient.addColorStop(0.9, "rgba(255,150,0,1)");
  gradient.addColorStop(0, "rgba(255,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, canvas.height - height / 2, width, height);
}

drawColumn(100, 100, 500);

const volumeControl = document.getElementById("volume-control");

volumeControl.addEventListener("input", function () {
  player.volume = this.value;
});

function render() {
  analyser.getByteFrequencyData(frequencyData);

  frequencyData;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const columnWidth =
    canvas.width / frequencyData.length -
    columnsGap +
    columnsGap / frequencyData.length;
  const heightScale = canvas.height / 100;

  let xPos = 0;

  for (let i = 0; i < frequencyData.length; i++) {
    let columnHeight = frequencyData[i] * heightScale;

    drawColumn(xPos, columnWidth, columnHeight / 2);

    xPos += columnWidth + columnsGap;
  }

  window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);
