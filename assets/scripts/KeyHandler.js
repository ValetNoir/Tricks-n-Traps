function KeyHandler(key, startCallback, holdCallback, endCallback) {
  this.key = key;
  this.startCallback = startCallback;
  this.holdCallback = holdCallback;
  this.endCallback = endCallback;
  
  this.setKey = (newKey) => {
    this.onHoldEnd();
    this.key = newKey;
  }

  this.isHeld = false;
  this.activeInterval;

  this.onHoldStart = () => {
    this.isHeld = true;
    this.startCallback();
    // this.activeInterval = setInterval(this.holdCallback, 10);
    this.activeInterval = setInterval(() => {
      if(this.isHeld) {
        this.holdCallback();
      } else {
        clearInterval(this.activeInterval);
      }
    }, 10);
  }

  this.onHoldEnd = () => {
    this.isHeld = false;
    this.endCallback();
    clearInterval(this.activeInterval);
  }

  window.addEventListener('keydown', (e) => { if(e.key == this.key && !this.isHeld) {e.preventDefault(); this.onHoldStart()}});
  window.addEventListener('keyup', (e) => { if(e.key == this.key) {e.preventDefault(); this.onHoldEnd()}});
}