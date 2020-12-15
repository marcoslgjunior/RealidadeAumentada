const create360Viewer = require('../');
const getMaxTextureSize = require('./getMaxTextureSize');
const dragDrop = require('drag-drop');

const dropRegion = document.querySelector('#drop-region');

const canvas = createCanvas({
  canvas: document.querySelector('#canvas'),
});

const imageUrl = getImageURL();

const autoSpin = false;

const image = new Image();
image.src = imageUrl;
image.onload = () => {
  const viewer = create360Viewer({
    image: image,
    canvas: canvas
  });

  setupDragDrop(canvas, viewer);

  viewer.start();

  viewer.on('tick', (dt) => {
    if (autoSpin && !viewer.controls.dragging) {
      viewer.controls.theta -= dt * 0.00005;
    }
  });
};

function createCanvas (opt = {}) {
  const viewport = opt.viewport || [ 0, 0 ];

  const canvas = opt.canvas || document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = `${viewport[0]}px`;
  canvas.style.left = `${viewport[1]}px`;

  const resizeCanvas = () => {
    const width = typeof viewport[2] === 'number' ? viewport[2] : window.innerWidth;
    const height = typeof viewport[3] === 'number' ? viewport[3] : window.innerHeight;
    const dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  };

  const setupGrabCursor = () => {
    canvas.addEventListener('mousedown', () => {
      document.documentElement.classList.remove('grabbing');
      document.documentElement.classList.add('grabbing');
    });
    window.addEventListener('mouseup', () => {
      document.documentElement.classList.remove('grabbing');
    });
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  setupGrabCursor();
  return canvas;
}

function getImageURL () {
  const maxTextureSize = getMaxTextureSize();
  let imageUrl = 'floresta.jpg';
  if (maxTextureSize >= 1000) imageUrl = 'floresta.jpg';
  else if (maxTextureSize >= 2000) imageUrl = 'floresta.jpg';
  return imageUrl;
}

function setupDragDrop (canvas, viewer) {
  dragDrop(canvas, {
    onDragEnter: () => {
      dropRegion.style.display = '';
    },
    onDragLeave: () => {
      dropRegion.style.display = 'none';
    },
    onDrop: (files) => {
      var img = new Image();
      img.onload = () => {
        viewer.texture(img);
      };
      img.onerror = () => {
        alert('Could not load image!');
      };
      img.crossOrigin = 'Anonymous';
      img.src = URL.createObjectURL(files[0]);
    }
  });
}

function ocultaForm(){
  console.log("Oi mundo!");
}