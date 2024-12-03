// ==UserScript==
// @name         Enable Feature View Schedule SGU
// @namespace    http://tampermonkey.net/
// @version      2024-01-03
// @description  Enable custom features for SGU
// @author       github.com/tnowad
// @match        https://thongtindaotao.sgu.edu.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.vn
// @grant        none
// @run-at       document-start
// ==/UserScript==

class IApiModification {
  constructor(endpoint, beforeSendRequest, afterRequest) {
    this.endpoint = endpoint;
    this.beforeSendRequest = beforeSendRequest;
    this.afterRequest = afterRequest;
  }
}

class IRequestHandler {
  handleRequest(modification, input, init) {
    if (modification && modification.beforeSendRequest) {
      if (!modification.beforeSendRequest(input, init)) {
        return Promise.resolve(new Response(null, { status: 403 }));
      }
    }
  }

  handleResponse(modification, originalResponse) {
    if (modification && modification.afterRequest) {
      const clonedResponse = originalResponse.clone();
      return clonedResponse.json().then((data) => {
        const modifiedData = modification.afterRequest(data);
        return new Response(JSON.stringify(modifiedData), {
          headers: clonedResponse.headers,
          status: clonedResponse.status,
          statusText: clonedResponse.statusText,
        });
      });
    }
    return originalResponse;
  }
}

(function () {
  const apiModifications = [
    new IApiModification(
      "/api/web/w-locdschucnang",
      function () {
        return true;
      },
      function (responseData) {
        const features = [
          {
            id: "-7701268144035246840",
            ma_chuc_nang: "WEB_XEMTHONGBAO",
            ma_menu: "9",
            thu_tu: 2,
            ten_hien_thi: "Thông báo từ ban quản trị",
            url: "xemthongbao",
          },
          {
            id: "-8772441298890752335",
            ma_chuc_nang: "WEB_DKMNV",
            ma_menu: "11",
            thu_tu: 16,
            ten_hien_thi: "Gửi nguyện vọng ĐKMH",
            url: "dknguyenvong",
          },
          {
            id: "-5285151085840002484",
            ma_chuc_nang: "WEB_HOCPHI",
            ma_menu: "2",
            thu_tu: 20,
            ten_hien_thi: "Xem học phí",
            url: "hocphi",
          },
          {
            id: "-5072032565773683271",
            ma_chuc_nang: "WEB_TKB_1TUAN",
            ma_menu: "1",
            thu_tu: 36,
            ten_hien_thi: "Xem thời khóa biểu tuần",
            url: "tkb-tuan",
          },
          {
            id: "-6064676023748772916",
            ma_chuc_nang: "WEB_TKB_HK",
            ma_menu: "1",
            thu_tu: 37,
            ten_hien_thi: "Xem thời khóa biểu học kỳ",
            url: "tkb-hocky",
          },
          {
            id: "-5990985924427104739",
            ma_chuc_nang: "WEB_LICHTHI",
            ma_menu: "5",
            thu_tu: 52,
            ten_hien_thi: "Xem lịch thi",
            url: "lichthi",
          },
          {
            id: "-7512293826419818112",
            ma_chuc_nang: "WEB_DIEM",
            ma_menu: "3",
            thu_tu: 56,
            ten_hien_thi: "Xem điểm",
            url: "diem",
          },
          {
            id: "-8391895377440600098",
            ma_chuc_nang: "WEB_SVDANHGIARENLUYEN",
            thu_tu: 96,
            ten_hien_thi: "Đánh giá kết quả rèn luyện",
            url: "danhgiarenluyensv",
          },
          {
            id: "-9088307709473611328",
            ma_chuc_nang: "WEB_KSDG",
            thu_tu: 128,
            ten_hien_thi: "Khảo sát đánh giá",
            url: "home/danhgia",
          },
          {
            id: "-7994288002086106954",
            ma_chuc_nang: "WEB_GOPYKIEN",
            ma_menu: "15",
            thu_tu: 194,
            ten_hien_thi: "Gửi ý kiến ban quản trị",
            url: "gopykien",
          },
        ];

        const uniqueFeatures = features.filter(
          (feature) =>
            !responseData.data.ds_chuc_nang.some(
              (existingFeature) => existingFeature.id === feature.id,
            ),
        );

        responseData.data.ds_chuc_nang = [
          ...uniqueFeatures,
          ...responseData.data.ds_chuc_nang,
        ];

        return responseData;
      },
    ),
  ];

  const requestHandler = new IRequestHandler();

  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    const modification = apiModifications.find(
      (mod) => typeof input === "string" && input.includes(mod.endpoint),
    );

    requestHandler.handleRequest(modification, input, init);

    const response = await originalFetch(input, init);
    return requestHandler.handleResponse(modification, response);
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    method,
    url,
    async,
    user,
    password,
  ) {
    this.__zone_symbol__xhrURL = url;
    const modification = apiModifications.find((mod) =>
      url.includes(mod.endpoint),
    );

    if (modification && modification.beforeSendRequest) {
      if (!modification.beforeSendRequest(method, url, async, user, password)) {
        this._skipRequest = true;
        return;
      }
    }

    originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (data) {
    if (this._skipRequest) return;

    const modification = apiModifications.find((mod) =>
      this.__zone_symbol__xhrURL.includes(mod.endpoint),
    );

    if (modification && modification.afterRequest) {
      this.addEventListener(
        "readystatechange",
        function () {
          if (this.readyState === 4) {
            const originalResponse = JSON.parse(this.responseText);
            const modifiedResponse =
              modification.afterRequest(originalResponse);
            redefineProperty(
              this,
              "response",
              JSON.stringify(modifiedResponse),
            );
            redefineProperty(
              this,
              "responseText",
              JSON.stringify(modifiedResponse),
            );
          }
        },
        false,
      );
    }

    originalSend.apply(this, arguments);
  };

  function redefineProperty(xhr, property, value) {
    Object.defineProperty(xhr, property, { writable: true });
    xhr[property] = value;
  }
})();
