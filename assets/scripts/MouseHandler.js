function MouseHandler(button, startCallback, holdCallback, endCallback) {
  this.button = button;
  this.startCallback = startCallback;
  this.holdCallback = holdCallback;
  this.endCallback = endCallback;

  this.isHeld = false;
  this.activeInterval;

  this.onHoldStart = () => {
    this.isHeld = true;
    this.startCallback();
    this.activeInterval = setInterval(this.holdCallback, 10);
  }

  this.onHoldEnd = () => {
    this.isHeld = false;
    this.endCallback();
    clearInterval(this.activeInterval);
  }

  window.addEventListener('mousedown', (e) => { if(e.button == this.button) {e.preventDefault(); this.onHoldStart()}});
  window.addEventListener('mouseup', (e) => { if(e.button == this.button) {e.preventDefault(); this.onHoldEnd()}});
}