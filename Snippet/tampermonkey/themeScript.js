// ==UserScript==
// @name         ThemeScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       mt
// @include      *
// @run-at       document-idle
// @require      https://raw.githubusercontent.com/TaumuLu/style-media-toggle/master/lib/index.js
// @require      https://raw.githubusercontent.com/TaumuLu/Record/master/Snippet/tampermonkey/themeScript.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
  'use strict';
  console.log("-----------------------------")
  console.log("------load ThemeScript------")
  console.log("-----------------------------")
  const mediaName = 'prefers-color-scheme'
  const { matches } = matchMedia(`(${mediaName}: dark)`)
  const { host } = location
  const name = `${mediaName}:${host}`

  function getValue(saveName, defaultVal = matches) {
    return GM_getValue(saveName, defaultVal)
  }

  function registerMenu(title, saveName) {
    const value = getValue(saveName)
    if (value) title += '            √'
    GM_registerMenuCommand(title, () => {
      GM_setValue(saveName, !value)
      location.reload()
    })
  }

  registerMenu('深色模式', name)
  const mediaToggle = getMediaToggle()

  let first = false
  function toggle() {
    first = true
    const value = getValue(name)
    const mediaMap = mediaToggle.get()
    const key = [...mediaMap.keys()].find((v) => v.includes(mediaName))
    const media = key && mediaMap.get(key)
    if (media) {
        media.toggle(!value)
    }
  }

  mediaToggle.subscribe(toggle)
  if(!first) toggle()
})();