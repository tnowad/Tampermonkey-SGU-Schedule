// ==UserScript==
// @name         SessionStorage to LocalStorage
// @namespace    http://tampermonkey.net/
// @version      2024-05-11
// @description  This script allows you to share login sessions between tabs in the same browser window.
// @author       You
// @match        https://thongtindaotao.sgu.edu.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.vn
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  var sessionStorageWrapper = {
    getItem: function (key) {
      return localStorage.getItem(key);
    },
    setItem: function (key, value) {
      localStorage.setItem(key, value);
    },
    removeItem: function (key) {
      localStorage.removeItem(key);
    },
    clear: function () {
      localStorage.clear();
    },
    key: function (index) {
      return localStorage.key(index);
    },
    get length() {
      return localStorage.length;
    },
  };

  Object.defineProperty(window, "sessionStorage", {
    value: sessionStorageWrapper,
    configurable: false,
    writable: false,
  });
})();
