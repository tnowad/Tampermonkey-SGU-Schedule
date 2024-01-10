// ==UserScript==
// @name         Enable Feature View Schedule SGU
// @namespace    http://tampermonkey.net/
// @version      2024-01-03
// @description  try to take over the world!
// @author       github.com/tnowad
// @match        https://thongtindaotao.sgu.edu.vn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.vn
// @grant        none
// ==/UserScript==

(function() {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this.__zone_symbol__xhrURL = url;
    originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(data) {
    if (this.__zone_symbol__xhrURL === "/api/web/w-locdschucnang") {
      this.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          modifyResponse(this);
        }
      }, false);
    }
    originalSend.apply(this, arguments);
  };

  function modifyResponse(xhr) {
    const response = JSON.parse(xhr.response);
    const features = [{
      "id": "-5072032565773683271",
      "ma_chuc_nang": "WEB_TKB_1TUAN",
      "ma_menu": "1",
      "thu_tu": 36,
      "ten_hien_thi": "Xem thời khóa biểu tuần",
      "ten_mobile": {
        "nhom": "view",
        "ten_viet": "Xem TKB",
        "ten_eng": "Xem TKB"
      },
      "ten_hien_thi_Eg": "View weekly timetable",
      "ten_tooltip": "Xem thời khóa biểu tuần",
      "url": "tkb-tuan",
      "ds_chi_tiet": []
    }]

    const uniqueFeatures = features.filter(feature =>
      !response.data.ds_chuc_nang.some(existingFeature => existingFeature.id === feature.id)
    );

    response.data.ds_chuc_nang = [...uniqueFeatures, ...response.data.ds_chuc_nang];

    const modifiedResponse = JSON.stringify(response);
    redefineProperty(xhr, 'response', modifiedResponse);
    redefineProperty(xhr, 'responseText', modifiedResponse);
  }

  function redefineProperty(xhr, property, value) {
    Object.defineProperty(xhr, property, { writable: true });
    xhr[property] = value;
  }

})();

