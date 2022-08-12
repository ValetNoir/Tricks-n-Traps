const GameSolver = {
  isPaused : false,
  interval : undefined,

  loop : () => {
    // game logic here
    console.log()
    requestAnimationFrame(this.draw)
  },

  draw : () => {
    ctx.clearRect(0, 0, W, H)
  },

  startInterval : () => {this.interval = setInterval(this.loop, TICKPERSECOND)},
  pauseInterval : () => {this.isPaused = true},
  continueInterval : () => {this.isPaused = false},
  clearInterval : () => {clearInterval(this.interval)},
}