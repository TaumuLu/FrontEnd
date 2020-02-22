// ==UserScript==
// @name         网站防沉迷
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  网站防沉迷脚本，访问确认提示，按时间段提示
// @author       taumu
// @license      MIT
// @include      *://*.bilibili.*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/445432
// @require      https://raw.githubusercontent.com/TaumuLu/Record/master/Snippet/tampermonkey/antiAddictionScript.js
// ==/UserScript==

;(function() {
  // eslint-disable-next-line
  'use strict'

  const { href, host } = window.location
  const timeName = `${host}_time`
  const waitName = `${host}_wait`
  const endTime = 30 * 60

  const setValue = (name, value) => {
    // eslint-disable-next-line no-undef
    return GM_setValue(name, value)
  }
  const getValue = (name, defaultValue) => {
    // eslint-disable-next-line no-undef
    return GM_getValue(name, defaultValue)
  }
  // eslint-disable-next-line no-undef
  const timeValue = getValue(timeName, 0)
  const waitValue = getValue(waitName, 0)

  const getUseTime = () => {
    const now = Date.now()
    return (now - timeValue) / 1000
  }
  const resetValue = (tValue = 0, wValue = false) => {
    setValue(timeName, tValue)
    setValue(waitName, wValue)
    window.location.reload()
  }
  const zeroFill = value => {
    if (`${value}`.length >= 2) {
      return value
    }
    return `0${value}`
  }

  // eslint-disable-next-line no-undef
  GM_registerMenuCommand('重置时间', () => {
    const isReset = window.confirm()
    if (isReset) {
      resetValue()
    }
  })

  if (!waitValue && getUseTime() >= endTime) {
    const html = `
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      #submit {
        margin-top: 20px;
        display: block;
        width: 100%;
        color: #fff;
        background-color: #1890ff;
        border-color: #1890ff;
        font-weight: 400;
        white-space: nowrap;
        text-align: center;
        background-image: none;
        border: 1px solid transparent;
        touch-action: manipulation;
        height: 32px;
        padding: 0 15px;
        font-size: 14px;
        border-radius: 4px;
        cursor: pointer;
        outline: 0;
      }
      #submit:hover {
        color: #fff;
        background-color: #40a9ff;
        border-color: #40a9ff;
      }
      #confirm {
        vertical-align: middle;
        transform: scale(1.5);
        cursor: pointer;
      }
      label {
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
      }
      div {
        cursor: pointer;
      }
    </style>
    <form id="form">
      <div>
        <input id="confirm" type="checkbox" name="confirm" />
        <label for="confirm">是否确定打开此网站</label>
      </div>
      <button id="submit" type="submit">
        <span>提交</span>
      </button>
      </form>
    `
    document.write(html)
    document.getElementById('submit').addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      const form = document.getElementById('form')
      const input = [...form.getElementsByTagName('input')].filter(
        item => item.type !== 'submit'
      )
      setValue(timeName, Date.now())
      if (input.every(checkbox => checkbox.checked)) {
        setValue(waitName, false)
        window.location.replace(href)
      } else {
        setValue(waitName, true)
        window.location.reload()
      }
    })
  } else if (waitValue) {
    document.write(`
      <h1 id="title" style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      "></h1>
    `)
    const title = document.getElementById('title')
    const writeTime = (delay = 1000) => {
      return setTimeout(() => {
        const time = parseInt(endTime - getUseTime(), 10)
        const minute = zeroFill(parseInt(time / 60, 10))
        const second = zeroFill(time % 60)
        title.innerText = `剩余等待时间 ${minute}: ${second}`
        if (time > 0) {
          writeTime()
        } else {
          resetValue(Date.now())
        }
      }, delay)
    }
    writeTime(0)
  }
})()
