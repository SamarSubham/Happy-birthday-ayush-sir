let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Mouse events
    document.addEventListener('mousemove', (e) => this.handleMove(e));
    paper.addEventListener('mousedown', (e) => this.handleStart(e));
    window.addEventListener('mouseup', () => this.handleEnd());

    // Touch events
    paper.addEventListener('touchstart', (e) => this.handleStart(e));
    document.addEventListener('touchmove', (e) => this.handleMove(e));
    document.addEventListener('touchend', () => this.handleEnd());
  }

  handleStart(e) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    const evt = e.type.startsWith('touch') ? e.touches[0] : e;
    this.mouseTouchX = evt.clientX;
    this.mouseTouchY = evt.clientY;
    this.prevMouseX = evt.clientX;
    this.prevMouseY = evt.clientY;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    if (e.type === 'mousedown' && e.button === 2) {
      this.rotating = true;
    }
  }

  handleMove(e) {
    const evt = e.type.startsWith('touch') ? e.touches[0] : e;

    if (!this.rotating) {
      this.mouseX = evt.clientX;
      this.mouseY = evt.clientY;
      
      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    }
      
    const dirX = evt.clientX - this.mouseTouchX;
    const dirY = evt.clientY - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = 180 * angle / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;
    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }

    if (e.type.startsWith('touch')) {
      e.preventDefault();
    }
  }

  handleEnd() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

function initDraggable(element) {
  let isDragging = false;
  let startX, startY;

  // Mouse events for desktop
  element.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);

  // Touch events for mobile
  element.addEventListener('touchstart', startDragging);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', stopDragging);

  function startDragging(e) {
    isDragging = true;
    const evt = e.type.startsWith('touch') ? e.touches[0] : e;
    startX = evt.clientX - element.offsetLeft;
    startY = evt.clientY - element.offsetTop;
    e.preventDefault();
  }

  function drag(e) {
    if (!isDragging) return;
    const evt = e.type.startsWith('touch') ? e.touches[0] : e;
    const newX = evt.clientX - startX;
    const newY = evt.clientY - startY;
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;
    e.preventDefault();
  }

  function stopDragging() {
    isDragging = false;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
