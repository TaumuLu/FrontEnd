// ==UserScript==
// @name         b站防沉迷
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
  const name = `${host}AntiAddiction`
  const endTime = 30 * 60
  const now = Date.now()
  // eslint-disable-next-line no-undef
  const value = GM_getValue(name)
  const useTime = (now - value) / 1000

  // eslint-disable-next-line no-undef
  GM_registerMenuCommand('重置时间·', () => {
    // eslint-disable-next-line no-undef
    GM_setValue(name, null)
    window.location.reload()
  })

  if (!value || useTime >= endTime) {
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
      if (input.every(checkbox => checkbox.checked)) {
        // eslint-disable-next-line no-undef
        GM_setValue(name, Date.now())
        window.location.replace(href)
      } else {
        alert('请填写完表单')
      }
    })
  }
})()
