export class Camera {

  constructor(display, subject, mode='center') {
    console.log('constructing camera')
    this.display = display.getOptions()
    this.subject = subject
       this.mode = mode
          this.x = 0
          this.y = 0

    if (this.mode == 'center') {
      this.x = -this.subject.x + Math.floor(this.display.width/2),
      this.y = -this.subject.y + Math.floor(this.display.height/2)
    }
  }

  update(subject=this.subject, mode='center') {
    this.subject = subject
    if (this.mode == 'center') {
      this.x = -this.subject.x + Math.floor(this.display.width/2),
      this.y = -this.subject.y + Math.floor(this.display.height/2)
    }
  }

}
