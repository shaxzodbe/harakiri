import $ from "jquery";

var CryptoJS = require("crypto-js");

class Api {
    url = "https://foxcomics.ru"
    imgUrl = "https://foxcomics.ru/uploads"
    static imgUrl = "https://foxcomics.ru/uploads"
    server = "https://foxcomics.ru/api"
    archiveUploadUrl = "https://foxcomics.ru/archive"
    user;

    constructor() {
    }

    jerkDabikol() {

        let url = document.URL.split("/")[3].split("?")[1].split("&");
        for(let i=0;i<url.length;i++){
            if(url[i].indexOf("vk_user_id") !== -1)
                return url[i].split("=",)[1]
        }
    }

    async post(data) {
        let r = this.jerkDabikol();
        var mafmaf = CryptoJS.AES.encrypt(`vk_app_${r}_${r}_${r}`, 'TsCqSX1Q34F45g543dcD').toString();

        const response = await fetch(this.server, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-path-x': document.URL,
                'vk-auth': mafmaf
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    async get(data) {

    }

    async uploadFile(type, file, success, glav_id = 0) {
        let formData = new FormData();
        formData.append("file1", file);
        $.ajax({
            xhr: function () {
                let xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        let percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        $(".progress_bar_load .progress_pls .vkuiProgress__in.Progress__in").css("width", `${percentComplete}%`)
                        $(".progress_bar_load .this_is_prog").text(`${percentComplete}%`)

                        if (percentComplete === 100) {

                        }

                    }
                }, false);

                return xhr;
            },
            url: this.archiveUploadUrl,
            type: "POST",
            data: file,
            contentType: false,
            cache: false,
            processData: false,
            success: function (result) {
                success(result, glav_id)
            },
            fail: function (result) {
                success(null)
            }
        });
    }
}

export default Api;