export class Camera {

  constructor(display, subject, mode='center') {
    this.setDisplay(display)
    this.subject = subject
    this.mode    = mode
    this.x       = 0
    this.y       = 0
  }

  setDisplay(display) {
    this.display = display.getOptions()
  }

  update(subject=this.subject, mode=this.mode) {
    this.subject = subject
    this.mode    = mode
    if (this.mode == 'center') {
      this.x = -this.subject.x + Math.floor(this.display.width/2)
      this.y = -this.subject.y + Math.floor(this.display.height/2)
    }
  }

}
