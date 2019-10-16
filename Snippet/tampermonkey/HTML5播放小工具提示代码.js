
const Toast = new class {
  styles = {
    display: 'none',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    zIndex: '1000',
    height: '32px',
    lineHeight: '32px',
    padding: '6px 12px',
    fontSize: '20px',
    transform: 'translate(-50%, -50%)',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#000',
    textAlign: 'center',
  }

  id = '_bilibili-play-toast_'

  init = () => {
    const parent = document.querySelector('.bilibili-player-video-wrap')
    if (parent) {
      this.dom = document.createElement('div')
      this.dom.setAttribute('id', this.id)
      Object.keys(this.styles).forEach((key) => {
        const value = this.styles[key]
        this.dom.style[key] = value
      })
      parent.appendChild(this.dom)
    }
  }

  checkDom() {
    if(!this.dom || !document.getElementById(this.id)) {
      this.init()
    }
  }

  show(text, time = 2000) {
    this.checkDom()
    if(!this.dom) return

    clearTimeout(this.timer)
    const number = +text
    this.dom.innerText = +number.toFixed(1)
    this.dom.style.display = 'flex'
    this.timer = setTimeout(() => {
      if (this.dom) {
        this.dom.style.display = 'none'
      }
    }, time);
  }
}
