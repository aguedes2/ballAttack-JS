class Audios {
  constructor(file) {
    this.clip = new Audio(`../assets/${file}`)
    this.clip.volume = 0.3
    this.clip.load()
  }

  play() {
    console.log(this.clip.readyState)
    if (this.clip.readyState === 4) this.clip.play()
  }

  pause() {
    this.clip.pause()
  }

  stop() {
    this.clip.pause()
    this.clip.currentTime = 0
  }

  turnUp() {
    if (this.clip.volume < 1) this.clip.volume += 0.1
  }

  turnDown() {
    if (this.clip.volume > 0) this.clip.volume -= 0.1
  }

  mute() {
    if (this.clip.muted) this.clip.muted = false
    else this.clip.mudet = true
  }

  loop() {
    return !this.clip.loop ? true : false
  }
}

export default Audios
