function Game() {
  this.loop = () => {
    // game logic here
    console.log()
    requestAnimationFrame(draw)
  }

  this.draw = () => {
    ctx.clearRect(0, 0, W, H)
  }

  this.isPaused = false
  this.interval

  this.startInterval = () => {this.interval = setInterval(this.loop, TICKPERSECOND)}
  this.pauseInterval = () => {this.isPaused = true}
  this.continueInterval = () => {this.isPaused = false}
  this.clearInterval = () => {clearInterval(this.interval)}
}