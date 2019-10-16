// ==UserScript==
// @name         LocalScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *.douyu.*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  console.log('-----------------------------')
  console.log('------load local script------')
  console.log('-----------------------------')
  const typeMap = {}
  const addEventListener = document.addEventListener;
  document.addEventListener = function(type, listener, ...other) {
      const args = [type, listener, ...other];
      if (!typeMap[type]) typeMap[type] = []
      typeMap[type].push(listener)
      // douyu
      if (location.host === 'www.douyu.com') {
          if (type === 'visibilitychange') return
      }
      return addEventListener.apply(this, args);
  };
})();