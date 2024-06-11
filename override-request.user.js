// ==UserScript==
// @name         Enable Feature View Schedule SGU
// @namespace    http://tampermonkey.net/
// @version      2024-01-03
// @description  try to take over the world!
// @author       github.com/tnowad
// @match        https://thongtindaotao.sgu.edu.vn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.vn
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  const apiModifications = [
    {
      endpoint: "/api/web/w-locdschucnang",
      beforeSendRequest: function () {
        return true;
      },
      afterRequest: function (xhr) {
        const response = JSON.parse(xhr.response);
        const features = [
          {
            id: "-7701268144035246840",
            ma_chuc_nang: "WEB_XEMTHONGBAO",
            ma_menu: "9",
            thu_tu: 2,
            ten_hien_thi: "Thông báo từ ban quản trị",
            ten_mobile: {
              nhom: "",
              ten_eng: "",
            },
            ten_hien_thi_Eg: "Notice from the administrator",
            ten_tooltip: "Thông báo từ ban quản trị",
            url: "xemthongbao",
            url_danh_muc_hoc_lieu: "",
            ds_chi_tiet: [],
          },
          {
            id: "-8772441298890752335",
            ma_chuc_nang: "WEB_DKMNV",
            ma_menu: "11",
            thu_tu: 16,
            ten_hien_thi: "Gửi nguyện vọng ĐKMH",
            ten_mobile: {
              nhom: "update",
              ten_viet: " ĐK nguyên vọng",
              ten_eng: " ĐK nguyên vọng",
            },
            ten_hien_thi_Eg: "Register for your desired subjects",
            ten_tooltip: "Gửi nguyện vọng ĐKMH",
            url: "dknguyenvong",
            url_danh_muc_hoc_lieu: "",
            ds_chi_tiet: [],
          },
          {
            id: "-5285151085840002484",
            ma_chuc_nang: "WEB_HOCPHI",
            ma_menu: "2",
            thu_tu: 20,
            ten_hien_thi: "Xem học phí",
            ten_mobile: {
              nhom: "view",
              ten_viet: "Học phí",
              ten_eng: "Học phí",
            },
            ten_hien_thi_Eg: "Tuition",
            ten_tooltip: "Xem học phí",
            url: "hocphi",
            url_danh_muc_hoc_lieu: "",
            ds_chi_tiet: [],
          },
          {
            id: "-6064676023748772916",
            ma_chuc_nang: "WEB_TKB_HK",
            ma_menu: "1",
            thu_tu: 37,
            ten_hien_thi: "Xem thời khóa biểu học kỳ",
            ten_mobile: {
              nhom: "view",
              ten_viet: "TKB học kỳ",
              ten_eng: "TKB học kỳ",
            },
            ten_hien_thi_Eg: "View Semester schedule",
            ten_tooltip: "Xem thời khóa biểu học kỳ",
            url: "tkb-hocky",
            url_danh_muc_hoc_lieu: "",
            ds_chi_tiet: [],
          },
          {
            id: "-5990985924427104739",
            ma_chuc_nang: "WEB_LICHTHI",
            ma_menu: "5",
            thu_tu: 52,
            ten_hien_thi: "Xem lịch thi",
            ten_mobile: {
              nhom: "view",
              ten_viet: "Lịch thi",
              ten_eng: "Lịch thi",
            },
            ten_hien_thi_Eg: "View exam schedule",
            ten_tooltip: "Xem lịch thi",
            url: "lichthi",
            url_danh_muc_hoc_lieu: "",
            ds_chi_tiet: [],
          },
          {
            id: "-7512293826419818112",
            ma_chuc_nang: "WEB_DIEM",
            ma_menu: "3",
            thu_tu: 56,
            ten_hien_thi: "Xem điểm",
            ten_mobile: {
              nhom: "view",
              ten_viet: "Xem điểm",
              ten_eng: "Xem điểm",
            },
            ten_hien_thi_Eg: "View scores",
            ten_tooltip: "Xem điểm",
            url: "diem",
            url_danh_muc_hoc_lieu: "",
            ds_chi_tiet: [],
          },
          {
            id: "-8391895377440600098",
            ma_chuc_nang: "WEB_SVDANHGIARENLUYEN",
            thu_tu: 96,
            ten_hien_thi: "Đánh giá kết quả rèn luyện",
            ten_mobile: {
              nhom: "update",
              ten_viet: "Điểm rèn luyện",
              ten_eng: "Điểm rèn luyện",
            },
            ten_hien_thi_Eg: "Evaluation of training results",
            ten_tooltip: "Đánh giá kết quả rèn luyện",
            url: "danhgiarenluyensv",
            url_danh_muc_hoc_lieu: "",
            ds_chi_tiet: [],
          },
          {
            id: "-9088307709473611328",
            ma_chuc_nang: "WEB_KSDG",
            thu_tu: 128,
            ten_hien_thi: "Khảo sát đánh giá",
            ten_mobile: {
              nhom: "update",
              ten_viet: "Khảo sát",
              ten_eng: "Khảo sát",
            },
            ten_hien_thi_Eg: "Evaluation",
            ten_tooltip: "Khảo sát đánh giá",
            url: "home/danhgia",
            url_danh_muc_hoc_lieu: "",
            ds_chi_tiet: [],
          },
          {
            id: "-7994288002086106954",
            ma_chuc_nang: "WEB_GOPYKIEN",
            ma_menu: "15",
            thu_tu: 194,
            ten_hien_thi: "Gửi ý kiến ban quản trị",
            ten_mobile: {
              nhom: "",
              ten_eng: "",
            },
            ten_hien_thi_Eg: "Send comments to management",
            ten_tooltip: "Gửi ý kiến ban quản trị",
            url: "gopykien",
            url_danh_muc_hoc_lieu: "",
            ds_chi_tiet: [],
          },
        ];

        const uniqueFeatures = features.filter(
          (feature) =>
            !response.data.ds_chuc_nang.some(
              (existingFeature) => existingFeature.id === feature.id,
            ),
        );

        response.data.ds_chuc_nang = [
          ...uniqueFeatures,
          ...response.data.ds_chuc_nang,
        ];

        const modifiedResponse = JSON.stringify(response);
        redefineProperty(xhr, "response", modifiedResponse);
        redefineProperty(xhr, "responseText", modifiedResponse);
      },
    },
  ];

  XMLHttpRequest.prototype.open = function (
    method,
    url,
    async,
    user,
    password,
  ) {
    this.__zone_symbol__xhrURL = url;
    let shouldContinue = true;

    apiModifications.forEach((mod) => {
      if (url.includes(mod.endpoint) && mod.beforeSendRequest) {
        shouldContinue = mod.beforeSendRequest(
          method,
          url,
          async,
          user,
          password,
        );
      }
    });

    if (!shouldContinue) {
      return;
    }
    originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (_data) {
    apiModifications.forEach((mod) => {
      if (
        this.__zone_symbol__xhrURL.includes(mod.endpoint) &&
        mod.afterRequest
      ) {
        this.addEventListener(
          "readystatechange",
          function () {
            if (this.readyState === 4) {
              mod.afterRequest(this);
            }
          },
          false,
        );
      }
    });
    originalSend.apply(this, arguments);
  };

  function redefineProperty(xhr, property, value) {
    Object.defineProperty(xhr, property, { writable: true });
    xhr[property] = value;
  }
})();
