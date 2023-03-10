class Audios {
  constructor(file) {
    let audio = new Audio()
    audio.src = `./assets/${file}/`
    this.clip = audio
  }

  play() {
    this.load()
    var playPrimise = this.clip.play()

    if (playPrimise !== undefined) {
      playPrimise
        .then((_) => {
          this.clip.play()
        })
        .catch((error) => {
          console.log('Erro: ', error.message)
        })
    }
  }

  load() {
    this.clip.preload = true
    this.clip.load()
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
