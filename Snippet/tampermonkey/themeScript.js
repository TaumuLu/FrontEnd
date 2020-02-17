// ==UserScript==
// @name         主题切换
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  网站@media (prefers-color-scheme: dark|light)主题样式切换，深色模式和浅色模式的切换
// @author       taumu
// @include      *://*.weixin.*
// @include      *://sspai.*
// @run-at       document-start
// @require      https://unpkg.com/style-media-toggle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/users/445432
// ==/UserScript==

(function() {
  'use strict';
  const mediaName = 'prefers-color-scheme'
  const { matches: isDark } = matchMedia(`(${mediaName}: dark)`)
  const { host } = location
  const saveName = `${mediaName}:${host}`

  function getValue(name, defaultVal = true) {
    return GM_getValue(name, defaultVal)
  }

  function registerMenu(title, name) {
    const value = name && getValue(name)
    if (name && value) {
      title += '√'
    }
    GM_registerMenuCommand(title, () => {
      if (name) {
        GM_setValue(name, !value)
        location.reload()
      } else {
        alert('当前系统主题下无可切换主题')
      }
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
    })
  }

  const mediaToggle = getMediaToggle({
    onError(e, styleSheet) {
      replaceStyle(styleSheet)
    }
  })

  const themeMap = new Map([
    ['dark', {
      isDefault: isDark,
      title: '深色模式',
      menuId: null
    }],
    ['light', {
      isDefault: !isDark,
      title: '浅色模式',
      menuId: null
    }]
  ])
  let first = false
  function toggle() {
    first = true
    const mediaMap = mediaToggle.get()
    const keys = Array.from(mediaMap.keys()).filter((key) => key.includes(mediaName))

    themeMap.forEach((v, k) => {
      const { menuId, title, isDefault } = v
      if (keys.length) {
        if (isDefault) {
          const key = keys.find((item) => item.includes(k))
          const media = key && mediaMap.get(key)
          const value = getValue(saveName)
          const params = []
          if (media) {
            params.push(title, saveName)
            media.toggle(!value)
          } else {
            params.push('无可切换主题')
          }
          if (!menuId) v.menuId = registerMenu(title, saveName)
        }
      } else if (menuId) {
        GM_unregisterMenuCommand(menuId)
        v.menuId = null
      }
    })
  }

  mediaToggle.subscribe(toggle)
  if(!first) toggle()
})();