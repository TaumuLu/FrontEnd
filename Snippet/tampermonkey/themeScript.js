// ==UserScript==
// @name         ThemeScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       mt
// @include      *.bilibili.*
// @include      *.mp.weixin.qq.*
// @run-at       document-idle
// @require      https://raw.githubusercontent.com/TaumuLu/style-media-toggle/master/lib/index.js
// @require      https://raw.githubusercontent.com/TaumuLu/Record/master/Snippet/tampermonkey/themeScript.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
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

  function getUrl(src, path) {
    const sList = src.split('/')
    const pList = path.split('/')
    const host = sList.slice(0, 3).filter((v) => !!v).join('//')
    let absPath
    if (path.startsWith('/')) {
      absPath = pList.slice(1)
    } else {
      const lastIndex = pList.lastIndexOf('..')
      const index = lastIndex === -1 ? undefined : lastIndex + 1
      absPath = sList.slice(3, index && -index).concat(
        pList.slice(index).filter((v) => v !== '.')
      )
    }
    return `url(${host}/${absPath.join('/')})`
  }

  function replaceCssText(cssText, href) {
    const lastIndex = href.lastIndexOf('/')
    const src = href.slice(0, lastIndex)
    return cssText.replace(/url\(([^\)]*)\)/g, (match, p1) => {
      if (p1.includes('data:image')) {
        return match
      }
      return getUrl(src, p1)
    })
  }

  const herfSet = new Set()
  function replaceStyle(styleSheet) {
    const { href } = styleSheet
    if (herfSet.has(href)) return

    herfSet.add(href)
    GM_xmlhttpRequest({
      method: 'GET',
      url: href,
      onload: res => {
        const { responseText } = res
        const style = document.createElement('style')
        style.innerText = replaceCssText(responseText, href)
        styleSheet.disabled = true
        document.head.appendChild(style)
      }
  });
  }

  registerMenu('深色模式', name)
  const mediaToggle = getMediaToggle({
    onError(e, styleSheet) {
      replaceStyle(styleSheet)
    }
  })

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