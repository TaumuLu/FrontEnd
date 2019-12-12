// ==UserScript==
// @name         LocalScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *.douyu.*
// @include      *.bilibili.*
// @grant        none
// ==/UserScript==

"use strict";
console.log("-----------------------------")
console.log("------load local script------")
console.log("-----------------------------")

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
    this.dom.innerText = text
    this.dom.style.display = 'flex'
    this.timer = setTimeout(() => {
      if (this.dom) {
        this.dom.style.display = 'none'
      }
    }, time);
  }
}

const toFixed = (value, num = 1) => {
  return +value.toFixed(num)
}

// handle map
const handleMap = {
  douyu() {
    const addEventListener = document.addEventListener;
    document.addEventListener = function(type, listener, ...other) {
      const args = [type, listener, ...other];
      if (type === "visibilitychange") return;

      return addEventListener.apply(this, args);
    };
  },
  bilibili() {
    const getElementsByTagName = document.getElementsByTagName
    document.getElementsByTagName = function(tagName) {
      const values = getElementsByTagName.call(this, tagName)
      if (tagName === 'video') {
        return [new Proxy({}, {
          get(target, key, receiver) {
            const [video] = values
            const value = video[key]
            if (typeof value === 'function') {
              return value.bind(video)
            }
            return value
          },
          set(target, key, value, receiver) {
            const [video] = values
            if (key === 'currentTime') {
              const oldValue = video[key]
              Toast.show(toFixed(value - oldValue))
            } else if (key === 'volume') {
              Toast.show(toFixed(value))
            }
            video[key] = value
            return value
          }
        })]
      }
      return values
    }
  }
}

const getMainDomain = host => {
	const re = /com|tv|net|org|gov|edu/
	const a = host.split('.')
	let i = a.length - 2
	if (re.test(a[i])) i--
	return a[i]
}

const { host } = location
const mainDomain = getMainDomain(host)
const handle = handleMap[mainDomain]

if (handle) handle.call(handleMap)
