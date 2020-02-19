// ==UserScript==
// @name         DomainScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       mt
// @include      *.douyu.*
// @include      *.bilibili.*
// @run-at       document-start
// @require      https://raw.githubusercontent.com/TaumuLu/Record/master/Snippet/tampermonkey/domainScript.js
// ==/UserScript==

;(function() {
  // eslint-disable-next-line
  'use strict'

  console.log('-----------------------------')
  console.log('------load DomainScript------')
  console.log('-----------------------------')

  const Toast = new (class {
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
        Object.keys(this.styles).forEach(key => {
          const value = this.styles[key]
          this.dom.style[key] = value
        })
        parent.appendChild(this.dom)
      }
    }

    checkDom() {
      if (!this.dom || !document.getElementById(this.id)) {
        this.init()
      }
    }

    show(text, time = 2000) {
      this.checkDom()
      if (!this.dom) return

      clearTimeout(this.timer)
      this.dom.innerText = text
      this.dom.style.display = 'flex'
      this.timer = setTimeout(() => {
        if (this.dom) {
          this.dom.style.display = 'none'
        }
      }, time)
    }
  })()

  const toFixed = (value, num = 1) => {
    return +value.toFixed(num)
  }

  // domain map
  const domainMap = {
    douyu() {
      const { addEventListener } = document
      document.addEventListener = function(type, listener, ...other) {
        const args = [type, listener, ...other]
        if (type === 'visibilitychange') return null

        return addEventListener.apply(this, args)
      }
    },
    bilibili() {
      const { getElementsByTagName } = document
      document.getElementsByTagName = function(tagName) {
        const values = getElementsByTagName.call(this, tagName)
        if (tagName === 'video') {
          const cacheMap = new Map()
          return new Proxy([], {
            get(target, key, receiver) {
              const video = values[key]
              if (video) {
                if (!cacheMap.has(video)) {
                  cacheMap.set(
                    video,
                    new Proxy(
                      {},
                      {
                        get(t, k, r) {
                          const value = video[k]
                          if (typeof value === 'function') {
                            return value.bind(video)
                          }
                          return value
                        },
                        set(t, k, value, r) {
                          if (k === 'currentTime') {
                            const oldValue = video[k]
                            Toast.show(toFixed(value - oldValue))
                          } else if (k === 'volume') {
                            const fValue = toFixed(value)
                            try {
                              const itemKey = 'bilibili_player_settings'
                              const setting =
                                JSON.parse(localStorage.getItem(itemKey)) || {}
                              // eslint-disable-next-line @typescript-eslint/camelcase
                              setting.video_status = setting.video_status || {}
                              setting.video_status.volume = fValue
                              localStorage.setItem(
                                itemKey,
                                JSON.stringify(setting)
                              )
                              // eslint-disable-next-line no-empty
                            } catch (e) {}
                            Toast.show(fValue)
                          }
                          video[k] = value
                          return value
                        },
                      }
                    )
                  )
                }
                return cacheMap.get(video)
              }
              return video
            },
          })
        }
        return values
      }
    },
  }

  const { host } = window.location
  const key = Object.keys(domainMap).find(k => host.includes(k))
  const handle = domainMap[key]

  if (handle) handle.call(domainMap)
})()
