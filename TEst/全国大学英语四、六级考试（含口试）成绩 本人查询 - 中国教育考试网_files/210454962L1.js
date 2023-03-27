var serv = new Object();
serv.protocol = document.location.protocol

serv.requestUrl = serv.protocol + "//appquery.neea.edu.cn";

serv.memberLoginUrl = "https://member.neea.cn";
serv.indexUrl = serv.protocol + "//www.neea.edu.cn/";
serv.IEVersion = IEVersion();
serv.source = navigator.userAgent.indexOf(" Mobile") > 0 ? "mb" : "pc";

serv.setUser = function (data) {
    this.user = data;
};

serv.getUser = function () {
    return this.user || {};
};

serv.cjdd = function (subject, code, tab) {
    return DICT_CJDD[subject][code];
};

/**
 * 获取用户欢迎信息
 */
serv.getUserData = function (validateLogin, callback) {
    var url = serv.requestUrl + "/api/user/data?t=" + Math.floor(new Date().getTime());
    $ajax("post", url, null, false, function (result) {

        if (!result || (result.code && result.code == 401) || !result.name) {
            if (validateLogin) {
                //去登录
                goLogin();
            } else {
                if (callback) {
                    callback();
                }
            }
        } else {
            serv.setUser(result);
            if (callback) {
                callback();
            }
        }
    });
};

/**
 * 加载当前用户
 */
serv.loadCurrentUser = function (validateLogin) {
    var userBean = serv.getUser();
    if ($.isEmptyObject(userBean)) {
        if (validateLogin) {
            //去登录
            goLogin();
        }
    } else {
        $("#xm").val(userBean.name);
        //$("#_xm").html(userBean.name);
        $("#sfz").val(userBean.certNo);
        //显示用户信息
        $("#welcome").append("欢迎您：");
        $("#welcome").append("<a href=\"https://member.neea.cn/userCenter/userInfo\" target=\"_blank\">" + userBean.name + "</a>&nbsp;&nbsp;");
        $("#welcome").append("<a href=\"javascript:serv.userLogout()\" class=\"but\" style=\"float:none\">退出</a>");
    }
};

/**
 * 用户退出登录
 */
serv.userLogout = function () {
    var url = serv.requestUrl + "/api/login/logout";
    $get(url, null, false, function (result) {
        location.href = serv.indexUrl;
    });
}
/**
 * 根据是否是小语种判断查询条件文字
 */
serv.selectToZSBH = function () {
    var subject = $("#subject").val(), title = "证书编号";
    if ("CET4,CET6,CET-SET,CBT".indexOf(subject) != -1) title = "成绩报告单编号";
    $("#query_cjbgd").html(title);
    $("#zsbh").attr("alt", title);
};

/**
 * 重置当前表单
 */
serv.formReset = function () {
    document.forms["form1"].reset();
    serv.selectToZSBH();
}

/**
 * 获取验证码
 * @param t 图片元素
 */
serv.verifys = function (t) {
    if (!t) {
        t = $("#img_verifys");
    }
    $(t).hide().attr("src", serv.requestUrl + "/api/verify/get?t=" + Math.random()).fadeIn();
};

/**
 * 校验是否含有特殊字符
 * @param s 校验的字符串
 * @returns boolean{含有？}
 */
serv.containSpecial = function (s) {
    if (!s)
        return true;
    //var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]");
    //var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]");
    //var reg = new RegExp("[`~!@#$^&*=|{}':;',\\[\\]<>/?~！@#￥……&*—|{}【】‘；：”“'。，、？]");
    //var reg = new RegExp("[`~!@#$^&*=|{}':;',\\[\\]<>/！@#￥……&*—|{}【】‘；：”“'。，、]");
    //var reg = new RegExp("[`~!@#$^&*=|{}:;\\[\\]<>/！@#￥……&*—|{}【】‘；：”“。，、]");
    var reg = new RegExp("[`~!@#$^&=|{}:;\\[\\]<>/！@#￥&—|{}【】‘；：”“。，、]");
    return reg.test(s);
};

/**
 * 校验是否含有空格
 * @param s 校验的字符串
 * @returns boolean{含有？}
 */
serv.containSpace = function (s) {
    var reg = new RegExp(/\s/g);
    return reg.test(s)
};

/**
 * 校验查询条件
 * @param t 校验的元素
 * @param f 是否验证 “中间是否有空格”
 * @returns boolean{校验通过？}
 */
serv.checkCondion = function (t, f) {
    var alt = $(t).attr("alt");
    var name = $(t).attr("name");
    var val = $(t).val() || "";
    val = val.trim();
    var errorName = name + "_err";
    var errorObj = $("#" + errorName);
    if (errorObj) {
        if (errorObj.html()) errorObj.html("");
    } else {
        return false;
    }
    var err = "";
    if (val) {
        if (serv.containSpecial(val)) err = "“" + alt + "”格式错误";
    } else err = "“" + alt + "”不能为空";
    if (!err) {
        if (f == true) {
            if (serv.containSpace(val)) err = "“" + alt + "”中间不能有空格";
        }
    }
    if (err) {
        errorObj.html(err);
        return false;
    }
    return true;
};

/**
 * 校验验证码
 * @returns boolean{校验通过？}
 */
serv.checkVerify = function () {
    var verify = $("#verify").val();
    $("#verify_err").html("");
    if (!verify || verify.length != 4) {
        $("#verify_err").html("请输入四位有效验证码！");
        return false;
    }
    return true;
};

serv.gotoQueryCondition = function () {

    $("#achievement-thead").html("");
    $("#achievement-tbody").html("");
    $(".condition").show();
    $(".condition-right").show();
    $(".achievement").hide();
    $(".schrep").hide();
    $(".cjd").hide();

    if ($("#query_rand").is(':visible')) {
        $("#verify").val("");
        serv.verifys();
    }
};

serv.gotoQueryAchievement = function () {
    $(".achievement").show();
    $(".schrep").hide();
    $(".cjd").hide();

    if (/ miniProgram/.test(navigator.userAgent)) {
        wx.miniProgram.navigateBack({delta: 1});
    } else if (/ swan\//.test(navigator.userAgent)) {
        swan.webView.navigateBack();
    }
};


/**
 * 初始化最新查询：自动选择查询方式，当次或历史
 */
serv.initLatestConfig = function (params) {
    if (!params) {
        throw new Error("Invalid params!");
    }
    var subject = params["subject"];
    if (!subject) {
        throw new Error("Invalid params!");
    }
    serv.subject = subject;
    serv.ptype = serv.getUrlParam("ptype");
    var config = params["config"] || {};
    serv.latestConfig = config[subject.toUpperCase() + "_LATEST_CONFIG"] || {};
    serv.latestConfig.STIME = serv.resolveStime();
    serv.latestMasterUrl = params.latestMasterUrl || serv.requestUrl;
    serv.latestSlaveUrl = params.latestSlaveUrl;
};

serv.showtime = function (d) {
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var timeValue = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日" + (hours >= 12 ? "下午" : "上午");
    timeValue += hours > 12 ? hours - 12 : hours;
    timeValue += "时";
    // timeValue += ((minutes < 10) ? ":0" : ":") + minutes;
    return timeValue;
};

serv.checkTime = function (startTime) {
    if (startTime) {
        var startDate = new Date(startTime);
        var t = startDate.getTime();
        var d = new Date().getTime();
        if (d >= t) {
            return "";
        }
        return "未到查询时间，请于" + serv.showtime(startDate) + "再来查询。";
    }
    return "";
};

serv.resolveStime = function () {
    var config = serv.latestConfig || {};
    var stime = null;
    var status = config["STATUS"];
    if (status == 1) {
        stime = config["FTIME"];
    } else if (status == 2) {
        stime = config["DTIME"];
    } else if (status == 3) {
        stime = config["XTIME"];
    }
    return stime;
};
serv.passedTime = function (stime) {
    return stime && new Date().getTime() >= new Date(stime).getTime();
};

/**
 * 获取当前最新查询所处阶段<br/>
 * 0:未发布最新查询;1:未到查询时间非登录查询;2:非登录查询;3:登录查询;4:最新查询下线;
 * @returns {*}
 */
serv.getLatestStage = function () {
    var config = serv.latestConfig || {};
    var status = config["STATUS"];
    if (!status) {
        return 0;
    } else {
        var isPassedTime = serv.passedTime(serv.latestConfig.STIME);
        if (status == 1) {
            if (!isPassedTime) {
                return 1;
            } else {
                return 2;
            }
        } else if (status == 2) {
            if (!isPassedTime) {
                return 2;
            } else {
                return 3;
            }
        } else if (status == 3) {
            if (!isPassedTime) {
                return 3;
            } else {
                return 4;
            }
        } else {
            return -1;
        }
    }
};

/**
 * 判断是否为最新查询
 * 0:未发布最新查询;1:未到查询时间非登录查询;2:非登录查询;3:登录查询;4:最新查询下线;
 * @returns {boolean}
 */
serv.isLatest = function () {
    if (serv.ptype) {
        var stage = serv.getLatestStage();
        return stage == 1 || stage == 2 || stage == 3;
    }
    return false;
};

serv.checkLatestStage = function () {
    var stage = serv.getLatestStage();
    if (stage == -1 || stage == 0) {
        //历史查询
        return true;
    } else if (stage == 1) {
        if (!serv.latestConfig.STIME) {
            layer.msg("暂未开放查询。");
            return false;
        }
        var checkTimeErr = serv.checkTime(serv.latestConfig.STIME);
        if (checkTimeErr) {
            if (serv.subject == "NTCE_RESULTS") {
                checkTimeErr = "暂未开放查询。";
            }
            layer.msg(checkTimeErr);
            return false;
        }
        return true;
    } else if (stage == 2) {
        return true;
    } else if (stage == 3) {
        if (!$("#welcome").html()) {
            //获取用户信息
            serv.getUserData(true);
            $(function () {
                //重置按钮隐藏
                if ($("#button").length > 0) {
                    $("#button").hide();
                }
                //加载用户欢迎信息
                serv.loadCurrentUser(true);
                var userBean = serv.getUser();

                $("#xm").val(userBean.name);
                $("#sfz").val(userBean.certNo);
                $("#xm").on("input propertychange blur", function () {
                    var xm = $("#xm").val();
                    if (userBean.name === xm) {
                        $("#sfz").removeAttr("disabled");
                        $("#sfz").css("color", "#000000");//注释后发现，ie8会自动变颜色，其它不会。
                    } else {
                        $("#sfz").attr("disabled", "disabled");
                        $("#sfz").css("color", "#c7c3c3");
                    }
                });
                $("#sfz").on("input propertychange blur", function () {
                    var sfz = $("#sfz").val();
                    if (userBean.certNo === sfz) {
                        $("#xm").removeAttr("disabled");
                        $("#xm").css("color", "#000000");
                    } else {
                        $("#xm").attr("disabled", "disabled");
                        $("#xm").css("color", "#c7c3c3");
                    }
                });
            });
        }
        return true;
    } else if (stage == 4) {
        //下线进历史
        return true;
    } else {
        layer.msg("对不起，数据错误！");
        return false;
    }
};

/**
 * 填充最新查询页面
 */
serv.fillLatestPage = function () {
    var isLatest = serv.isLatest();
    if (isLatest) {
        if ($(".zlykuang").length > 0) {
            $(".zlykuang").css({"width": "65%"});
        }
        $("#dcTip").show();
        $("#query_rand").hide();

        serv.checkLatestStage();

        var config = serv.latestConfig;
        if (config["NAME"]) {
            if (serv.subject == "NTCE_RESULTS") {
                $("#parm_sn").html("<p>2018年下半年至2022年下半年</p><p style=\"padding-top: 5px;\">中小学教师资格考试(NTCE)笔试成绩查询</p>");
            } else {
                $("#parm_sn").html(config["NAME"]);
            }
        }
        $("#xm,#sfz").click(function () {
            if (!serv.checkLatestStage()) {
                return;
            }
        });
    } else {
        //加载验证码
        serv.verifys();
        $("#dcTip").hide();
        $("#query_rand").show();
    }
};


/**
 * 查询cet成绩列表
 * @returns {boolean}
 */
serv.queryCetResultCenterList = function () {
    if (!serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};//test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '-q', 1]);
    var url = serv.requestUrl + '/api/results/centerList';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        var subjectName = $("#subject").find("option:selected").text();
        $("#achievement-sn").html(subjectName);
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? "style=\"width: 300px;\"" : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal = bean[code] ? bean[code] : "--";
                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });
            bean.type = 1;
            var _tda = $("<a>查看详情</a>");
            _tda.click(function () {
                serv.pdfData(bean);
                //serv.queryCetResult(bean.subject, bean.tab, bean.exam, bean.token);
            });
            _td = $("<td></td>");
            _tda.appendTo(_td);

            //
            var down = serv.isDown(bean);
            if (down) {
                var tname = serv.getTypeName(bean);
                var _tda = $("<a href=" + down + " style=margin-left:10px;>下载" + (tname == "合格证书" ? "证书" : "成绩单") + "</a>");
                _tda.mouseup(function () {
                    _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
                });
                _tda.appendTo(_td);
            }
            _td.appendTo(_tr);
            _tr.appendTo(achievementTbody);
        });
        if (subject == 'CET4' || subject == 'CET6' || subject == 'CET-SET') {
            $(".cetSetRemark").show();
        } else {
            $(".cetSetRemark").hide();
        }
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'result', subject + '-qs', 1]);
    });
    return false;
};
/**
 * 查询cet成绩列表
 * @returns {boolean}
 */
serv.queryCetResultList = function () {
    if (!serv.checkCondion($("#subject")) || !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};//test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '-q', 1]);
    var url = serv.requestUrl + '/api/results/list';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        var subjectName = $("#subject").find("option:selected").text();
        $("#achievement-sn").html(subjectName);
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? "style=\"width: 300px;\"" : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal = bean[code] ? bean[code] : "--";
                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });
            var _tda = $("<a>查看详情</a>");
            bean.type = 1;
            _tda.click(function () {
                serv.pdfData(bean);
                //serv.queryCetResult(bean.subject, bean.tab, bean.exam, bean.token);
            });
            _td = $("<td></td>");
            _tda.appendTo(_td);

            //
            var down = serv.isDown(bean);
            if (down) {
                var tname = serv.getTypeName(bean);
                var _tda = $("<a href=" + down + " style=margin-left:10px;>下载" + (tname == "合格证书" ? "证书" : "成绩单") + "</a>");
                _tda.mouseup(function () {
                    _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
                });
                _tda.appendTo(_td);
            }
            _td.appendTo(_tr);
            _tr.appendTo(achievementTbody);
        });
        if (subject == 'CET4' || subject == 'CET6' || subject == 'CET-SET') {
            $(".cetSetRemark").show();
        } else {
            $(".cetSetRemark").hide();
        }
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'result', subject + '-qs', 1]);
    });
    return false;
};

/**
 * 查看cet成绩详情
 * @param subject
 * @param tab
 * @param token
 */
serv.queryCetResult = function (subject, tab, exam, token) {
    var url = serv.requestUrl + '/api/results/data';
    var params = {"token": token};
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        var dataBean = result.data;
        if ($.isEmptyObject(dataBean)) {
            layer.msg("获取数据为空错误！");
            return;
        }
        var cjdObjName = dataBean.CJD_TEMPL;
        var cjdObj = $("#" + cjdObjName);
        if (cjdObj) {
            var sn = dataBean.SN;
            $("#schrep-sn").html(sn);
            $.each(dataBean, function (key, val) {
                var obj = $("[code=" + key + "]", cjdObj);
                if (obj.length) {
                    obj.html(val);
                }
            });
            //字段[KY_SCO]“口语等级”（英语四六级）特殊处理
            var kySco = $("[code=KY_SCO]", cjdObj);
            if (kySco.length) {
                if (dataBean["KY_SCO"] != '--') {
                    kySco.html("<strong>" + dataBean["KY_SCO"] + "</strong>");
                } else {
                    kySco.html("--");
                }
            }
            //字段[BEIZHU]“听力免考提示”特殊处理
            var beizhuObj = $("[code=BEIZHU]", cjdObj);
            if (beizhuObj.length) {
                if (dataBean["BEIZHU"]) {
                    beizhuObj.show();
                } else {
                    beizhuObj.hide();
                }
            }
            //字段[ID/SET_ID]“证书编号”或“成绩报告单编号”特殊处理
            var idFieldName = dataBean.hasOwnProperty("CET-SET") ? "SET_ID" : "ID";//subject == 'CET-SET' ? "SET_ID" : "ID";
            var idObj = $("[code=" + idFieldName + "]", cjdObj);
            if (idObj.length) {
                if (dataBean[idFieldName]) {
                    idObj.parent().show();
                } else {
                    idObj.parent().hide();
                }
            }

            var photoObj = $("[code=photo]", cjdObj);
            if (photoObj.length) {
                if (dataBean.poken) {
                    photoObj.attr("src", serv.requestUrl + "/api/results/photo?poken=" + dataBean.poken);
                } else {
                    photoObj.error();
                }
            }

            $(".schrep").show();
            cjdObj.show();
            $(".achievement").hide();
            //详情查询成功统计
            _hmt.push(['_trackEvent', 'data', 'result', subject + '-qs', 1]);
        }
        //layer.alert("<textarea cols=40 rows=8>"+JSON.stringify(result,null,2)+"</textarea>");
    });
};

/**
 * 查询cet其他
 * @returns {boolean}
 */
serv.queryCetOtherResult = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#zsbh")) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    var zsbh = $("#zsbh").val();
    var xm = $("#xm").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "zsbh": zsbh, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //var params = {"subject": encodeURIComponent(subject), "zsbh": encodeURIComponent(zsbh), "xm": encodeURIComponent(xm), "verify": encodeURIComponent(verify)};
    //其他查询统计
    /*_hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'data', 'click', subject+'-qother', 1]);*/
    var url = serv.requestUrl + '/api/results/otherData';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            layer.msg(result.message || result.msg);
            return;
        }
        var dataBean = result.data;
        if ($.isEmptyObject(dataBean)) {
            layer.msg("获取数据为空错误！");
            return;
        }
        var cjdObjName = dataBean.CJD_TEMPL;
        var cjdObj = $("#" + cjdObjName);
        if (cjdObj) {
            var sn = dataBean.SN;
            $("#schrep-sn").html(sn);
            $.each(dataBean, function (key, val) {
                var obj = $("[code=" + key + "]", cjdObj);
                if (obj.length) {
                    obj.html(val);
                }
            });
            //字段[KY_SCO]“口语等级”（英语四六级）特殊处理
            var kySco = $("[code=KY_SCO]", cjdObj);
            if (kySco.length) {
                if (dataBean["KY_SCO"] != '--') {
                    kySco.html("<strong>" + dataBean["KY_SCO"] + "</strong>");
                } else {
                    kySco.html("--");
                }
            }
            //字段[BEIZHU]“听力免考提示”特殊处理
            var beizhuObj = $("[code=BEIZHU]", cjdObj);
            if (beizhuObj.length) {
                if (dataBean["BEIZHU"]) {
                    beizhuObj.show();
                } else {
                    beizhuObj.hide();
                }
            }
            //字段[ID/SET_ID]“证书编号”或“成绩报告单编号”特殊处理
            var idFieldName = dataBean.hasOwnProperty("CET-SET") ? "SET_ID" : "ID";//subject == 'CET-SET' ? "SET_ID" : "ID";
            var idObj = $("[code=" + idFieldName + "]", cjdObj);
            if (idObj.length) {
                if (dataBean[idFieldName]) {
                    idObj.parent().show();
                } else {
                    idObj.parent().hide();
                }
            }

            var photoObj = $("[code=photo]", cjdObj);
            if (photoObj.length) {
                if (dataBean.poken) {
                    photoObj.attr("src", serv.requestUrl + "/api/results/photo?poken=" + dataBean.poken);
                } else {
                    photoObj.error();
                }
            }

            $(".schrep").show();
            cjdObj.show();
            $(".condition").hide();
            //详情查询成功统计
            /*_hmt.push(['_trackEvent', 'data', 'result', subject+'-qsother', 1]);*/
        }
    });
    return false;
};

serv.queryCetOtherResult = function () {
    return serv.pdfOther();
};

/**
 * 查询PETS成绩列表
 * @returns {boolean}
 */
serv.queryPETSResultList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};//test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '-q', 1]);
    var url = serv.requestUrl + '/api/results/list';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? "style=\"width: 300px;\"" : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = '全国英语等级考试(PETS)';
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            //判断是否是当次，如果是当次则红色显示
            if (bean.tab == dq.tab) {
                _tr = $("<tr></tr>");
            } else {
                _tr = $("<tr></tr>");
            }
            if (subjectName == "PETS") {
                if (bean.kszl == "0") bean.ky = null;//口试
                else if (bean.kszl == "1") bean.score = null;//笔试
            }
            $.each(showFields, function (code, name) {
                var fieldVal;
                if (code == "sf") {
                    fieldVal = DICT_SFNAME[bean[code]];
                } else if (code == "bkjb") {
                    fieldVal = dict.getLevelName(bean);
                } else {
                    fieldVal = bean[code] ? bean[code] : "--";
                }

                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });

            bean.type = 1;
            var _tda = $("<a>查看详情</a>");
            _tda.click(function () {
                serv.pdfData(bean);
                //serv.queryPETSResult(bean.subject, bean.tab, bean.exam, bean.token);
            });
            _td = $("<td></td>");
            _tda.appendTo(_td);
            _td.appendTo(_tr);

            var down = serv.isDown(bean);
            var _tda = $("<a href=" + down + " style=margin-left:10px;>下载成绩单</a>");
            _tda.mouseup(function () {
                _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
            });
            _tda.appendTo(_td);
            _td.appendTo(_tr);


            _tr.appendTo(achievementTbody);
        });
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'result', subject + '-qs', 1]);
    });
    return false;
};

/**
 * 移动端查询PETS成绩列表
 * @returns {boolean}
 */
serv.queryPETSResultListMobile = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify}; //test

    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", "Mobile-list", "click", subject + "-q", 1]);
    var url = serv.requestUrl + "/api/results/list";
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }
        //var LIST_QUERY_FIELD_DICT = serv.require(serv.listQueryFieldDictUrl);
        //var showFields = LIST_QUERY_FIELD_DICT.rule_list[subject];
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementTbodyMobile = $("#achievement-tbody-mobile");
        achievementTbodyMobile.html("");
        //var _ul = $("<ul class='ntcetxtUl'></ul>");
        var _ul, _li, _lititle, _hi, _exam, _xi, _km, _kmtitle, _td, _tda, _cz;

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = "全国英语等级考试(PETS)";
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _ul = $("<ul class='table-small txtUl' style='padding-bottom: 2vmin;'></ul>");
            //判断是否是当次，如果是当次则红色显示
            // if (bean.tab == dq.tab) {
            //     _tr = $("<tr></tr>");
            // } else {
            //     _tr = $("<tr></tr>");
            // }
            if (subjectName == "PETS") {
                if (bean.kszl == "0") bean.ky = "--";
                //口试
                else if (bean.kszl == "1") bean.score = "--"; //笔试
            }
            $.each(showFields, function (code, name) {
                if (code == "exam") {
                    _km = $("<li class='km'></li>");
                    _km.appendTo(_ul);
                    _kmtitle = $("<li class='km-title'></li>")
                    _kmtitle.appendTo(_km);
                    _xi = $("<i>1</i>");
                    _xi.appendTo(_km);
                    _hi = $("<li class='title-min'></li>");
                    _hi.appendTo(_kmtitle);
                    _exam = $("<span class='exam-title-min'>" + bean[code] + "</span>");
                    _exam.appendTo(_hi);
                } else if (code == "bkjb") {
                    var fieldVal = dict.getLevelName(bean);
                    _lititle = $("<span style='margin-bottom: 2px;'>" + fieldVal + "</span>");
                    _hi.before(_lititle);
                } else {
                    _li = $("<ol class='toggle'><li class='stext'><span class='lift-t-sec'>" + name + "</span><span class='right-t'>" + bean[code] + "</span></li></ol>");
                    _li.appendTo(_ul);
                }
            });
            _cz = $("<li class='buttonArea'></li>");
            bean.type = 1;
            _tda = $('<a class="button-secondary-tinner">查看详情</a>');
            _tda.click(function () {
                serv.pdfData(bean);
            });
            _tda.appendTo(_cz);

            _tda = $("<a href=" + serv.isDown(bean) + " class='button-main-tinner'>下载成绩单</a>");
            _tda.mouseup(function () {
                _hmt.push(["_trackEvent", "ecert", "down", bean.subject + "-d", 1]);
            });
            _tda.appendTo(_cz);
            _td = $("<ol class='toggle'></ol>");
            _cz.appendTo(_td);
            _td.appendTo(_ul);
            _ul.appendTo(achievementTbodyMobile);

        });
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(["_trackEvent", "Mobile-list", "result", subject + "-qs", 1]);

        $(".txtUl").eq(0).children('.toggle').show();
        $(".txtUl").eq(0).children('.km').children("i").css({transform: "rotate(135deg)"});
        $(".txtUl").eq(0).children('.km').children("i").text(2);
        $(".km").on("click", function () {
            $(this).siblings().slideToggle("fast");
            if ($(this).children("i").text() == 1) {
                $(this).children("i").css({transform: "rotate(135deg)"});
                $(this).children("i").text(2);
            } else {
                $(this).children("i").css({transform: "rotate(-45deg)"});
                $(this).children("i").text(1);
            }
        });
    });
    return false;
};

/**
 * 查看PETS成绩详情
 * @param subject
 * @param tab
 * @param token
 */
serv.queryPETSResult = function (subject, tab, exam, token) {
    var url = "https://ecert.neea.edu.cn/api/pdf/data";
    var params = {tab: tab, token: token, state: 0};
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }
        var dataBean = result.data;
        if ($.isEmptyObject(dataBean)) {
            layer.msg("获取数据为空错误！");
            return;
        }
        var subjectName = $("#subject").val();
        subjectName = '全国英语等级考试(PETS)';

        $("#schrep-sn").html(subjectName);
        $.each(dataBean, function (key, val) {
            var obj = $("[code=" + key + "]");
            if (obj.length) {
                obj.html(val);
            }
        });
        $(".schrep").show();
        $(".achievement").hide();

        //
        params.subject = subject;
        serv.pdf(params, result);

        //详情查询成功统计
        _hmt.push(['_trackEvent', 'data', 'result', subject + '-qs', 1]);

        //layer.alert("<textarea cols=40 rows=8>"+JSON.stringify(result,null,2)+"</textarea>");
    });
};


var subj = {
    PETS: {name: "全国英语等级考试(PETS)", tab: [null, "", "PETS_202103"]},
    WSK: {name: "全国外语水平考试(WSK)", tab: [null, "WSK_1911", "WSK_202105"]},
    CET4: {name: "全国大学英语四级考试(CET4)", tab: [null, "CET4_202106"]},
    CET6: {name: "全国大学英语六级考试(CET6)", tab: [null, "CET6_202106"]},
    CJT4: {name: "全国大学日语四级考试(CJT4)", tab: [null, "CJT4_202106"]},
    CJT6: {name: "全国大学日语六级考试(CJT6)", tab: [null, "CJT6_202106"]},
    CRT4: {name: "全国大学俄语四级考试(CRT4)", tab: [null, "CRT4_202106"]},
    CRT6: {name: "全国大学俄语六级考试(CRT6)", tab: [null, "CRT6_202106"]},
    PHS4: {name: "全国大学德语四级考试(PHS4)", tab: [null, "PHS4_202106"]},
    PHS6: {name: "全国大学德语六级考试(PHS6)", tab: [null, "PHS6_202106"]},
    TFU4: {name: "全国大学法语四级考试(TFU4)", tab: [null, "TFU4_202106"]},
    "CET-SET": {name: "全国大学英语四、六级口语考试(CET-SET)"},
    CBT: {name: "全国大学英语四、六级考试(网考)"},
    NCRE: {name: "全国计算机等级考试(NCRE)", tab: [null, "~", "NCRE_202203"]},
    "NCRE-ZY": {name: "全国计算机等级考试(NCRE)", tab: [null, "~", "NCRE_202203"]},
    NTCE: {name: "中小学教师资格考试(NTCE)", tab: [null, "~", "NTCE_1109"]},
    //NTCE_BS:{name:"中小学教师资格考试笔试(NTCE)",tab:[null,"~"]},
    //NTCE_MS:{name:"中小学教师资格考试面试(NTCE)",tab:[null,"~"]}
    MHK: {name: "中国少数民族汉语水平等级考试(MHK)", tab: [null, "~", "MHK_1305"]},
    NIT_SINGLE: {name: "全国计算机应用水平考试(NIT)", tab: [null, "~", "~"]},
    NIT_ADVANCED: {name: "全国计算机应用水平考试(NIT)", tab: [null, "~", "~"]}
};
if (!window.console) console = {
    log: function () {
    }, error: function () {
    }
};
var CHAR_WIDTH = [295, 312, 435, 638, 586, 889, 870, 256, 333, 333, 455, 741, 240, 432, 240, 427, 586, 586, 586, 586, 586, 586, 586, 586, 586, 586, 240, 240, 741, 741, 741, 482, 1031, 703, 627, 668, 761, 549, 531, 743, 773, 293, 395, 634, 513, 977, 812, 814, 611, 814, 652, 577, 573, 746, 676, 1017, 645, 603, 620, 333, 416, 333, 741, 448, 294, 552, 638, 501, 639, 567, 346, 639, 615, 266, 267, 544, 266, 937, 616, 635, 638, 639, 381, 462, 372, 616, 524, 789, 506, 529, 491, 333, 269, 333, 741, 295];

//什么时候开始提供下载
serv.isDown = function (par) {
    try {
        if(par.tab.indexOf("_9")>0)return false;//NCRE

        var down = par.tab >= subj[par.subject].tab[par.type];
        if (down) return "https://ecert.neea.edu.cn/api/pdf/down.pdf?tab=" + par.tab + "&token=" + par.token + "&type=" + par.type + "&dangci=false";
    } catch (e) {
    }
    return false;
};
serv.getTypeName = function (par) {
    if (par.type == 2) return "合格证书";
    //CET:2021-09-27之前全叫:成绩详情
    if (",CET4,CET6,CET-SET,CBT,".indexOf(par.subject) > 0) return "成绩报告单";
    if (",CJT4,CJT6,PHS4,PHS6,CRT4,CRT6,TFU4,".indexOf(par.subject) > 0) return "合格证书";
    return "成绩详情";
};
serv.pdfData = function (par) {
    var url = "https://ecert.neea.edu.cn/api/pdf/data";
    url = serv.requestUrl + "/api/pdf/data";

    _hmt.push(['_trackEvent', "ecert", 'data', par.subject + '-q', 1]);

    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, {
        tab: par.tab,
        token: par.token,
        type: par.type,
        dangci: par.dangci || false
    }, true, function (ret) {
        layer.close(loadIndex);
        if (!ret) ret = {code: 500, msg: "获取数据错误！"};
        if (ret.code == 401) {
            goLogin();
            return;
        }
        if (ret.code) {
            layer.msg(ret.message || ret.msg);
            return;
        }
        $(".condition,.achievement").hide();
        $(".schrep").show();

        //
        serv.pdf(par, ret);

        //详情查询成功统计
        _hmt.push(['_trackEvent', 'ecert', 'data', par.subject + '-qs', 1]);
    });

};

serv.pdfQuick = function (frm) {
    if (!serv.checkCondion(frm.xm) || !serv.checkCondion(frm.sfz) || !serv.checkVerify()) {
        return false;
    }

    var par = {};//$(frm).serialize()
    for (var i = 0; i < frm.elements.length; i++) {
        if (!frm[i].name) continue;
        par[frm[i].name] = frm[i].value;
    }

    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', "ecert", 'quick', par.subject + '-q', 1]);

    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", "//appquery.neea.edu.cn/api/pdf/quick", par, true, function (ret) {
        layer.close(loadIndex);
        if (serv.showVerify) {
            $("#verify").val("");
            serv.dcverifys();
        }
        if (!ret) ret = {code: 500, msg: "获取数据错误！"};
        if (ret.code) {
            //wx.miniProgram.redirectTo({url:'/pages/ksxm/cetdc/ecertPortal'});
            //wx.miniProgram.navigateBack({delta:1});
            layer.msg(ret.msg);
            return;
        }

        $(".schrep").show();
        $(".condition").hide();

        //隐藏，保留后4位
        var d = ret.data;
        var hide = ["SFZ", "ZSBH", "_CODE"];
        for (var i = 0; i < hide.length; i++) {
            var arr = d[hide[i]].split("");
            for (var j = 0; j < arr.length - 4; j++) {
                if (arr[j] == ' ') continue;
                arr[j] = "*";
            }
            d[hide[i]] = arr.join("");
        }
        d['_QR'] = "";
        serv.pdf(par, ret);
        $(".cbody").hide();

        //查询成功统计
        _hmt.push(['_trackEvent', "ecert", 'quick', par.subject + '-qs', 1]);
    });
    return false;
};

serv.pdf = function (par, ret) {
    var data = ret.data;

    //标题
    $("#schrep-sn").html(subj[par.subject].name);
    $(".ctype").html(serv.getTypeName(par));//成绩详情

    //下载
    if (data._DOWN || serv.isDown(par)) {
        $(".cdown").show();
        //
        if ($(".ctype").html() == "合格证书")//CET小语种:证书
        {
            var abtn = $("a.btn").html();
            if (abtn) $("a.btn").html(abtn.replace("成绩单", '证书'));
        }
    } else
        $(".cdown").hide();

    $("a.btn").attr("href", "https://ecert.neea.edu.cn/api/pdf/down.pdf?token=" + (data._DOWN || par.token) + "&type=" + par.type + "&dangci=false");
    $("a.btn").off().mouseup(function () {
        _hmt.push(['_trackEvent', 'ecert', 'down', par.subject + '-d', 1]);
    }).click(function () {
        layer.load(0, {time: 2000});
        if (layui.device().ios) $(this).removeAttr("target");
        /*
        if(window.__wxjs_environment=='miniprogram'||navigator.userAgent.indexOf('miniProgram')>0)
        {
            var s=$(this).attr('href');
            s=s.substr(s.indexOf('?'));
            wx.miniProgram.navigateTo({url:'/pages/ecert/downloadPdf/ExternalSources'+s});
        }*/
    });

    //内容
    try {
        /*
        var group = dict.QUERYS[data._GROUP];
        //
        var bkjb = data.BKJB || "RESULT";
        if (par.type == 1) {
            if (data._SUBJECT == 'PETS')
                bkjb = "RESULT";//PETS
            else
                bkjb = data.BKJB || "RESULT";//CETSET
        } else if (par.type == 2) {
            bkjb = data.BKJB || data.TESTTYPE || data.JB || data.ZL || data.MKH;//CET, WSK:TESTTYPE, NCRE:JB, MHK:ZL, NIT:MKH
        }
        var li = group[bkjb], d0 = li[0];
        */
        var li=ret.group, d0 = li[0];

        var scale = $(".cbody").removeAttr("style").width() / d0.BGW;
        //if(d0.BG.indexOf(".svg")>0)scale=1;else
        if (scale > 3 && Math.max(d0.BGW, d0.BGH) < 600)//CET放大1.3倍
        {
            scale = 1.3;
        } else
            scale = Math.min(1, scale);

        var htm = ["<div class=scale style='width:" + d0.BGW + "px;height:" + d0.BGH + "px;-webkit-transform:scale(" + scale + ");transform:scale(" + scale + ");"];
        var dev = layui.device();
        if (dev.ie && dev.ie < 9) {
            d0.BG = d0.BG.replace(".svg", ".png");
            htm.push("zoom:" + 100 * scale + "%;");
        }
        htm.push("'><img id=_BG src=//www.neea.edu.cn/query/" + d0.BG + ">");

        var isNew = false;
        for (var i = 0; i < li.length; i++) if (li[i].NAME == '_QR') isNew = true;

        var ALIGN = ["left", "center", "right"];
        for (var i = 0; i < li.length; i++) {
            var d = li[i], v = data[d.NAME], x = d.X, y = d.Y;
            //console.log(d.NAME+", val:"+v+", xy:"+x+"x"+y);
            if (d.NAME == "BSJB") {
                if (par.subject == "CET-SET")//调整标题
                {
                    var str = v.indexOf("四级") == -1 ? "四、" : "、六";
                    str = subj[par.subject].name.replace(str, "");
                    $("#schrep-sn").html(str);
                }
            }
            if (!x||x==999) continue;
            if (d0.MARGIN) {
                var mar = d0.MARGIN.split(",");
                x -= parseFloat(mar[0]);
                y -= parseFloat(mar[1]);
            }
            //if(!dev.mobile&&dev.os=='linux')y-=2;
            htm.push("<div id=" + d.NAME + " style=left:" + x + "px;top:" + (y - (isNew ? 1 : 0)) + "px;width:" + d.WIDTH + "px;");
            if (d.HEIGHT) htm.push("height:" + d.HEIGHT + "px;");
            if (d.ALIGN) htm.push("text-align:" + ALIGN[d.ALIGN] + ";");//对齐

            if (d.NAME == "_PHOTO") {
                //v=v?serv.requestUrl+"/api/results/photo?poken="+v:"//www.neea.edu.cn/query/images/nophoto.jpg";
                v = v ? "https://ecert.neea.edu.cn/api/pdf/photo.jpg?token=" + v : "//www.neea.edu.cn/query/images/nophoto.jpg";
                //v="<img src="+v+" style="+(isNew?"max-width:73.7px;max-height:90.7px":"max-width:90px;max-height:120px")+">";
                v = "<img src=" + v + " onerror=onerror=null;src='/query/images/nophoto.jpg'>";
            } else if (d.NAME == "_QR")//二维码
            {
                if (v) {
                    if (v.indexOf("://") == -1) v = "https://ecert.neea.edu.cn/verify.htm?" + v;

                    var len = 368;//版本:13
                    var ratio = window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI;
                    if (dev.mobile) {
                        ratio = Math.ceil(ratio) / ratio;//微信:2.700000047683716, 小米:2.75
                        if (ratio > 1) len = 272;
                    } else {
                        ratio *= scale;
                        /*
                        var len=424;//版本:14
                        if(ratio>=1.3*1.25)len=1170;
                        else if(ratio>=1.3)len=717;
                        else if(ratio>=1.25)len=643;
                        len+=2;
                        */
                        if (ratio >= 1.3 * 1.25) len = 1004;
                        else if (ratio >= 1.3) len = 645;
                        else if (ratio >= 1.25) len = 587;
                        htm.push("width:200px;height:" + d.HEIGHT * scale + "px;");
                    }
                    for (var j = v.length; j < len; j++) v += " ";
                    v = new AraleQRCode({render: "table", text: v, correctLevel: 0, size: 250}).outerHTML;
                } else
                    htm.push("display:none;");
            } else {
                if (d.NAME == "BKJB" || d.NAME == "TESTTYPE" || d.NAME == "JB")//报考级别,PETS||WSK||NCRE
                {
                    data.exam_id = par.exam_id;//ES,可空
                    //v = dict.getLevelName(data);
                } else if (d.NAME == "ZCJ")//证书等第，NCRE
                {
                    //var ZCJ={'100':['','合格','合格','优秀','4','5','6','7','8','9'],'2GtSbktMd5TVhp95yzc2RF':['','合格','合格','优秀'],'720':['','合格','良好','优秀'],'2SGWSxv6t5nrujpRMlUDZe':['','合格','良好','优秀']};
                    //v=ZCJ[data._GROUP][v];
                    //v = dict.getScoreName(data);
                }

                //if (d.PREFIX) v = d.PREFIX + v;
                //if (d.SUFFIX) v += d.SUFFIX;

                //字号
                var s = d.FSIZE || 12;
                if (d.NAME == "BEIZHU") {
                    if (!v) htm.push("display:none;");
                } else if (d.NAME == "TLMK")//听力残疾
                {
                    if (v == "1")
                        v = "　　该考生为听力残疾，听力部分免考，分数经折算计入笔试总分。";
                    else
                        htm.push("display:none;");
                } else {
                    if (!v) {
                        console.log("无效:" + d.NAME);
                        //continue;
                    }
                    var resize = 0;
                    for (var j = 0; j < v.length; j++) {
                        var cc = v.charCodeAt(j);
                        resize += (cc < 256 ? CHAR_WIDTH[cc - 32] || 500 : 1000);
                    }
                    if ([210330653, 210330658].indexOf(node.id) == -1) resize += v.length * 60;//加粗
                    else resize += v.length * 6;

                    resize = (d.WIDTH * 1000 / resize);
                    if (resize < 9) {
                        s = 9;
                        htm.push("line-height:110%;");//默认130%
                    } else if (resize < s) {
                        s = resize;
                    }
                }
                if (!dev.mobile && s < 12 && layui.device('chrome').chrome)//chrome://settings/fonts
                {
                    var SCALE = [0, 0.07, 0.17, 0.25, 0.333, 0.417, 0.5, 0.583, 0.667, 0.75, 0.834, 0.917];//Safari可以缩小字号
                    //s = SCALE[parseInt(s)];
                    s=SCALE[Math.round(s)];
                    htm.push("transform:scale(" + s + ");width:" + d.WIDTH / s + "px;");
                    s = 12;
                }
                htm.push("font-size:" + s + "px;");
                if (v != '--') {
                    if (d.WEIGHT != -1)//风格
                    {
                        if (d.WEIGHT == 2)
                            htm.push("font-style:italic;");
                        else
                            htm.push("font-weight:" + ["normal", "bold"][d.WEIGHT] + ";");
                    }
                    if (d.COLOR) htm.push("color:" + d.COLOR + ";");
                }
            }
            htm.push(">" + v + "</div>");
        }
        htm.push("</div>");

        $(".cbody").html(htm.join("")).css({width: d0.BGW * scale + "px", height: d0.BGH * scale + "px"});
        $(".cbody").off().bind('selectstart contextmenu dragstart', function () {
            return false
        });
        //浏览器缩放:二维码
        window.onresize();
    } catch (e) {
        console.log(e);
    }
};

window.onresize = function () {
    var qr = $("#_QR");
    var dev = layui.device('firefox');
    if (!qr.length || dev.mobile) return;

    var ratio = window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI;
    var val = Math.max(1, parseInt(ratio));//Math.floor(qr.width()*ratio/$("#_QR tr").length)

    var pos = qr.position();
    if (dev.firefox) {
        $("#_QR table").css({transform: "scale(" + val / ratio + ")", transformOrigin1: "left top"});
    } else//使用transform，会变模糊
    {
        $("#_QR table").css({zoom: val * 100 / ratio + "%"});
    }
    qr.css({left: pos.left + "px", top: pos.top + "px"});
    $(".cbody").append(qr);

    var tips;
    qr.off().hover(function () {
        if (tips) return;
        tips = layer.tips(qr.html().replace(/zoom:|transform:/, ''), this, //不去缩放：会有白边
            {
                tips: [4, "#fff"], time: 0, area: 0 //area:不写会变形
            });
    }, function () {
        layer.close(tips);
        tips = 0;
    });
};

//查询分析报告
serv.pdfReport = function (par) {
    var url = serv.requestUrl + "/api/pdf/report";

    //_hmt.push(['_trackEvent', "ecert", 'data', par.subject+'-q', 1]);

    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, {token: par.token}, true, function (ret) {
        layer.close(loadIndex);
        if (!ret) ret = {code: 500, msg: "获取数据错误！"};
        if (ret.code == 401) {
            goLogin();
            return;
        }
        if (ret.code) {
            layer.msg(ret.message || ret.msg);
            return;
        }
        $(".condition,.achievement").hide();
        $(".schrep").show();

        //
        var d = ret.data;
        console.log("返回",d);

        /*
        //考次+级别: 定位到模版
        dict.getTemp = function (d) {
            var arr = dict.RIGHTS;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].EXAM_ID == d.EXAM_ID && arr[i].BKJB == d.BKJB) return arr[i];
            }
        };
        var temp = dict.getTemp(d);
        var report = dict.REPORTS[temp.TEMPLATE_ID];
        */
        var report = dict.REPORTS[d.TEMPLATE_ID];
        d.TEMPLATE_CONTENT = report.TEMPLATE_CONTENT;
        //d.CJDD = ['不及格', '及格', '良好', '优秀'][d.CJDD]||d.CJDD;
        //d.BKJB = dict.getLevelName({bkjb: d.BKJB, exam_id: d.EXAM_ID});//转小写:取“列表”中级别名

        //得分
        var xf = (d.XF || "0,0,0,0,0,0").split(",");

        //考核内容
        var arr = report.CHILD, labels = [];
        d.ITEM = "", d.LEVEL = "";
        for (var i = 0; i < arr.length; i++) {
            labels.push(arr[i].ITEM_CODE);
            d.ITEM += "<tr><th class=code>" + arr[i].ITEM_CODE + "<td>" + arr[i].ITEM_NAME + "<td class=c>" + arr[i].ITEM_SCORE + "<td class=c>";

            //表现
            var b = arr[i].CHILD;
            for (var j = 0; j < b.length; j++) {
                if (xf[i] >= b[j].ITEM_SCORE) {
                    d.ITEM += b[j].ITEM_CODE;
                    d.LEVEL += "<tr><th class=code>" + arr[i].ITEM_CODE + "<td>" + b[j].ITEM_CODE + "(" + (b[j - 1] || arr[i]).ITEM_SCORE + "-" + b[j].ITEM_SCORE + ")<td>" + b[j].ITEM_NAME;
                    break;
                }
            }

            xf[i] = parseInt(xf[i] * 1000 / arr[i].ITEM_SCORE) / 10;//转为:百分制,保留一个小数
        }

        //高、低于平均分
        var pj = d.PJ.split(",");
        d.LOW = "", d.HIG = "";
        for (var i = 0; i < pj.length; i++) {
            var code = arr[i].ITEM_CODE;
            if (xf[i] < pj[i])
                d.LOW += code + " ";
            else
                d.HIG += code + " ";
        }

        //
        for (var p in d) {
            $(".report ." + p).html(d[p]);
        }

        //var labels=['A','B','C','D','E','F'],pj=[56,91,66,76,57,69],xf=[60,100,85,82.8,86,72];
        //console.log("pj:"+pj+", xf:"+xf);
        //雷达
        $.ajaxSetup({cache: true});
        $.getScript("/tea/script/chart-0.2.0.min.js", function (d) {
            var radarChartData =
                {
                    labels: labels,
                    datasets:
                        [{
                            fillColor: "rgba(151,187,205,0)",
                            strokeColor: "#FF0201",
                            data: pj
                        },
                            {
                                fillColor: "rgba(252,169,23,0.5)",
                                strokeColor: "#FCA917",
                                data: xf
                            }]
                };
            radar.width = 320;
            radar.height = 280;
            var myRadar = new Chart(document.getElementById("radar").getContext("2d")).Radar(radarChartData,
                {
                    scaleShowLabels: true,
                    pointLabelFontSize: 12,//字号
                    pointDot: false,
                    //angleLineColor:"#F4F080",
                    animation: !(parseInt(layui.device().ie) < 9),//动画
                    //比例
                    scaleOverride: true,
                    scaleStepWidth: 20,
                    scaleSteps: 5
                });
        });

        //详情查询成功统计
        _hmt.push(["_trackEvent", "data", "result", "NCRE_CJFXBG-qs", 1]);
    });

};


//CET、NCRE、NTCE 其它查询
serv.pdfOther = function () {
    var par = {};
    var arr = form1.elements;
    for (var i = 0; i < arr.length; i++) {
        if (!arr[i].name) continue;
        if (!serv.checkCondion(arr[i])) return false;
        par[arr[i].name] = arr[i].value;
    }

    //serv.requestUrl="http://appquery.neea.edu.cn";

    var url = serv.requestUrl + '/api/pdf/other';

    _hmt.push(['_trackEvent', 'ecert', 'other', par.subject + '-qother', 1]);

    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, par, true, function (ret) {
        layer.close(loadIndex);
        if (!ret) ret = {code: 500, msg: "获取数据错误！"};
        if (ret.code) {
            serv.verifys();
            layer.msg(ret.message || ret.msg);
            return;
        }
        $(".condition,.achievement").hide();
        $(".schrep").show();
        serv.pdf(par, ret);

        _hmt.push(['_trackEvent', 'ecert', 'other', par.subject + '-qsother', 1]);
    });

    return false;
};


/**
 * 查询PETS证书列表
 * @returns {boolean}
 */
serv.queryPETSCERTList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};//test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '-q', 1]);
    var url = serv.requestUrl + '/api/cert/list';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code != "0") {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }

        var showFields = rule_list["PETS_ZS"];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? "style=\"width: 300px;\"" : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = '全国英语等级考试(PETS)';
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            if (bean.tab == dq.tab) {
                _tr = $("<tr></tr>");
            } else {
                _tr = $("<tr></tr>");
            }
            $.each(showFields, function (code, name) {
                var fieldVal;
                if (code == "sf") {
                    fieldVal = DICT_SFNAME[bean[code]];
                } else if (code == "bkjb") {
                    fieldVal = dict.getLevelName(bean);
                } else {
                    fieldVal = bean[code] ? bean[code] : "--";
                }

                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });

            bean.type = 2;
            var _tda = $("<a href=#>查看证书</a>");
            _tda.click(function () {
                serv.pdfData(bean);
                //serv.queryPETSCERT(bean.subject, bean.tab, bean.exam, bean.token);
            });
            _td = $("<td></td>");
            _tda.appendTo(_td);
            _td.appendTo(_tr);

            var down = serv.isDown(bean);
            if (down) {
                var _tda = $("<a href=" + down + " style=margin-left:10px;>下载合格证书</a>");
                _tda.mouseup(function () {
                    _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
                });

                _tda.appendTo(_td);
                _td.appendTo(_tr);
            }
            _tr.appendTo(achievementTbody);
        });
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'result', subject + '-qs', 1]);
    });
    return false;
};
/**
 * 查看PETS证书详情
 * @param subject
 * @param tab
 * @param token
 */
serv.queryPETSCERT = function (subject, tab, exam, token) {
    var url = "https://ecert.neea.edu.cn/api/pdf/data";
    var params = {tab: tab, token: token, state: 1, dangci: false};
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }
        var dataBean = result.data;
        if ($.isEmptyObject(dataBean)) {
            layer.msg("获取数据为空错误！");
            return;
        }
        var subjectName = $("#subject").val();
        subjectName = '全国英语等级考试(PETS)';

        $("#schrep-sn").html(subjectName);
        $.each(dataBean, function (key, val) {
            var obj = $("[code=" + key + "]");
            if (obj.length) {
                obj.html(val);
            }
        });

        $(".schrep").show();
        $(".achievement").hide();

        //
        params.subject = subject;
        serv.pdf(params, result);

        //详情查询成功统计
        _hmt.push(['_trackEvent', 'data', 'result', subject + '-qs', 1]);

        //layer.alert("<textarea cols=40 rows=8>"+JSON.stringify(result,null,2)+"</textarea>");
    });
};
/**
 * 查询WSK成绩列表
 * @returns {boolean}
 */
serv.queryWSKResultList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '-q', 1]);
    var url = serv.requestUrl + '/api/results/list';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? "style=\"width: 300px;\"" : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = '全国外语水平考试(WSK)';
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal;
                if (code == "bkjb") {
                    fieldVal = dict.getLevelName(bean);
                } else {
                    fieldVal = bean[code] ? bean[code] : "--";
                }

                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });
            _td = $("<td></td>");
            _td.appendTo(_tr);
            _tr.appendTo(achievementTbody);

            if (bean.tab < "WSK_1911") {
                _td.append("--");
                return;
            }
            bean.type = 1;
            var _tda = $("<a>查看详情</a>");
            _tda.click(function () {
                serv.pdfData(bean);
                //serv.queryWSKResult(bean.subject, bean.tab, bean.exam, bean.token);
            });
            _tda.appendTo(_td);

            var down = serv.isDown(bean);
            var _tda = $("<a href=" + down + " style=margin-left:10px;>下载成绩单</a>");
            _tda.mouseup(function () {
                _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
            });
            _tda.appendTo(_td);
        });
        $(".cetSetRemark").hide();
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'result', subject + '-qs', 1]);
    });
    return false;
};
/**
 * 移动端查询WSK成绩列表
 * @returns {boolean}
 */
serv.queryWSKResultListMobile = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify};
    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", "Mobile-list", "click", subject + "-q", 1]);
    var url = serv.requestUrl + "/api/results/list";
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        //var LIST_QUERY_FIELD_DICT = serv.require(serv.listQueryFieldDictUrl);
        //var showFields = LIST_QUERY_FIELD_DICT.rule_list[subject];
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementTbodyMobile = $("#achievement-tbody-mobile");
        achievementTbodyMobile.html("");
        var _kmtitle, _km, _li, _ul, _exam, _lititle, _xi, _hi, _td, _tda, _cz;

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = "全国外语水平考试(WSK)";
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _ul = $("<ul class='table-small txtUl' style='padding-bottom: 2vmin;'></ul>");
            $.each(showFields, function (code, name) {
                if (code == "exam") {
                    _km = $("<li class='km'></li>");
                    _km.appendTo(_ul);
                    _kmtitle = $("<li class='km-title'></li>");
                    _kmtitle.appendTo(_km);
                    _xi = $("<i>1</i>");
                    _xi.appendTo(_km);
                    _hi = $("<li class='title-min'></li>");
                    _hi.appendTo(_kmtitle);
                    _exam = $("<span class='exam-title-min'>" + bean[code] + "</span>");
                    _exam.appendTo(_hi);
                } else if (code == "bkjb") {
                    _lititle = $("<span style='margin-bottom: 2px;'>" + bean[code] + "</span>");
                    _hi.before(_lititle);
                } else {
                    var fieldVal = bean[code] ? bean[code] : "--";
                    _li = $("<ol class='toggle'><li class='stext'><span class='lift-t-sec'>" + name + "</span><span class='right-t'>" + fieldVal + "</span></li></ol>");
                    _li.appendTo(_ul);
                }
            });

            _cz = $("<li class='buttonArea'></li>");
            if (bean.tab < "WSK_1911") {
                _cz.append("--");
                return;
            }

            bean.type = 1;
            _tda = $('<a class="button-secondary-tinner">查看详情</a>');
            _tda.click(function () {
                serv.pdfData(bean);
            });
            _tda.appendTo(_cz);

            _tda = $("<a href=" + serv.isDown(bean) + " class='button-main-tinner'>下载成绩单</a>");
            _tda.mouseup(function () {
                _hmt.push(["_trackEvent", "ecert", "down", bean.subject + "-d", 1]);
            });
            _tda.appendTo(_cz);
            _td = $("<ol class='toggle'></ol>");
            _cz.appendTo(_td);
            _td.appendTo(_ul);
            _ul.appendTo(achievementTbodyMobile);
        });
        $(".cetSetRemark").hide();
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(["_trackEvent", "Mobile-list", "result", subject + "-qs", 1]);

        $(".txtUl").eq(0).children('.toggle').show();
        $(".txtUl").eq(0).children('.km').children("i").css({transform: "rotate(135deg)"});
        $(".txtUl").eq(0).children('.km').children("i").text(2);
        $(".km").on("click", function () {
            $(this).siblings().slideToggle("fast");
            if ($(this).children("i").text() == 1) {
                $(this).children("i").css({transform: "rotate(135deg)"});
                $(this).children("i").text(2);
            } else {
                $(this).children("i").css({transform: "rotate(-45deg)"});
                $(this).children("i").text(1);
            }
        });
    });
    return false;
};


/**
 * 查看WSK成绩详情
 * @param subject
 * @param tab
 * @param token
 */
serv.queryWSKResult = function (subject, tab, exam, token) {
    var url = "https://ecert.neea.edu.cn/api/pdf/data";
    var params = {tab: tab, token: token, state: 0, dangci: false};
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }
        var dataBean = result.data;
        if ($.isEmptyObject(dataBean)) {
            layer.msg("获取数据为空错误！");
            return;
        }
        var subjectName = $("#subject").val();
        subjectName = '全国外语水平考试(WSK)';

        $("#schrep-sn").html(subjectName);
        $.each(dataBean, function (key, val) {
            var obj = $("[code=" + key + "]");
            if (obj.length) {
                obj.html(val);
            }
        });

        $(".schrep").show();
        $(".achievement").hide();

        //
        params.subject = subject;
        serv.pdf(params, result);

        //详情查询成功统计
        _hmt.push(['_trackEvent', 'data', 'result', subject + '-qs', 1]);

        //layer.alert("<textarea cols=40 rows=8>"+JSON.stringify(result,null,2)+"</textarea>");
    });
};


/**
 * 查看WSK证书列表
 * @param subject
 * @param tab
 * @param token
 */
serv.queryWSKCERTList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};//test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '-q', 1]);
    var url = serv.requestUrl + '/api/cert/list';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code != "0") {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }

        var showFields = rule_list["WSK_ZS"];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? "style=\"width: 300px;\"" : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = '全国外语水平考试(WSK)';
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal;
                if (code == "bkjb") {
                    fieldVal = dict.getLevelName(bean);
                } else {
                    fieldVal = bean[code] ? bean[code] : "--";
                }

                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });
            _td = $("<td></td>");
            _td.appendTo(_tr);
            _tr.appendTo(achievementTbody);

            bean.type = 2;
            var _tda = $("<a href=#>查看证书</a>");
            _tda.click(function () {
                serv.pdfData(bean);
                //serv.queryWSKCERT(bean.subject, bean.tab, bean.exam, bean.token);
            });
            _tda.appendTo(_td);

            //if(bean.tab<"WSK_202105")return;
            var down = serv.isDown(bean);
            if (down) {
                var _tda = $("<a href=" + down + " style=margin-left:10px;>下载合格证书</a>");
                _tda.mouseup(function () {
                    _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
                });
                _tda.appendTo(_td);
            }
        });
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'result', subject + '-qs', 1]);
    });
    return false;
};

/**
 * 查看WSK证书详情
 * @param subject
 * @param tab
 * @param token
 */
serv.queryWSKCERT = function (subject, tab, exam, token) {
    var url = "https://ecert.neea.edu.cn/api/pdf/data";
    var params = {tab: tab, token: token, state: 1, dangci: false};
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }
        var dataBean = result.data;
        if ($.isEmptyObject(dataBean)) {
            layer.msg("获取数据为空错误！");
            return;
        }
        var subjectName = $("#subject").val();
        subjectName = '全国外语水平考试(WSK)';

        $("#schrep-sn").html(subjectName);
        $.each(dataBean, function (key, val) {
            var obj = $("[code=" + key + "]");
            if (obj.length) {
                obj.html(val);
            }
        });

        $(".schrep").show();
        $(".achievement").hide();

        //
        params.subject = subject;
        serv.pdf(params, result);

        //详情查询成功统计
        _hmt.push(['_trackEvent', 'data', 'result', subject + '-qs', 1]);

        //layer.alert("<textarea cols=40 rows=8>"+JSON.stringify(result,null,2)+"</textarea>");
    });
};

/**
 * 查询TDXL成绩列表
 * @returns {boolean}
 */
 serv.queryTDXLResultList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = { subject: subject, xm: xm, sfz: sfz, verify: verify };
    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", "list", "click", subject + "-q", 1]);
    var url = serv.requestUrl + "/api/results/list";
    var loadIndex = layer.load(0, { shade: 0.1 });
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        //var LIST_QUERY_FIELD_DICT = serv.require(serv.listQueryFieldDictUrl);
        //var showFields = LIST_QUERY_FIELD_DICT.rule_list[subject];
        //console.log(code + ":" + name);
        var showFields = rule_list[subject];
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $('<tr style="background:rgb(13, 163, 226);color:#FFFFFF;"></tr>');
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? 'style="width: 300px;"' : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = "同等学力申请硕士学位考试";
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal = bean[code] ? bean[code] : "--";
                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });
            _td.appendTo(_tr);
            _tr.appendTo(achievementTbody);
        });
        $(".cetSetRemark").hide();
        $(".achievement").show();
        $(".condition").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(["_trackEvent", "list", "result", subject + "-qs", 1]);
    });
    return false;
};
/**
 * 移动端查询TDXL成绩列表
 * @returns {boolean}
 */
 serv.queryTDXLResultListMobile = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = { subject: subject, xm: xm, sfz: sfz, verify: verify };
    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", "list", "click", subject + "-q", 1]);
    var url = serv.requestUrl + "/api/results/list";
    var loadIndex = layer.load(0, { shade: 0.1 });
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        //var LIST_QUERY_FIELD_DICT = serv.require(serv.listQueryFieldDictUrl);
        //var showFields = LIST_QUERY_FIELD_DICT.rule_list[subject];
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementTbodyMobile = $("#achievement-tbody-mobile");
        achievementTbodyMobile.html("");
        var _kmtitle, _km, _li, _ul, _exam, _lititle, _xi,_hi , _hg ;

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = "同等学力申请硕士学位考试";
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _ul = $("<ul class='table-small txtUl' style='padding-bottom: 2vmin;'></ul>");
            $.each(showFields, function (code, name) {
                if (code == "exam") {
                    _km = $("<li class='km'></li>");
                    _km.appendTo(_ul);
                    _kmtitle = $("<li class='km-title'></li>");
                    _kmtitle.appendTo(_km);
                    _xi = $("<i>1</i>");
                    _xi.appendTo(_km);
                    _hi = $("<li class='title-min'></li>");
                    _hi.appendTo(_kmtitle);
                    _exam = $("<span class='exam-title-min'>" + bean[code] + "</span>");
                    _exam.appendTo(_hi);
                } else if (code == "km") {
                    _lititle = $("<span style='margin-bottom: 2px;'>" + bean[code] + "</span>");
                    _hi.before(_lititle);
                } else if(code == "hg"){
                    if (bean[code] == "合格") {
                        _hg = $("<span class='rank qualified'>" + bean[code] + "</span>");
                    } else if (bean[code] == "不合格") {
                        _hg = $("<span class='rank unqualified'>" + bean[code] + "</span>");
                    } else if (bean[code] == "缺考") {
                        _hg = $("<span class='rank miss'>" + bean[code] + "</span>");
                    }
                    _hg.appendTo(_hi);
                } else {
                    var fieldVal = bean[code] ? bean[code] : "--";
                    _li = $("<ol class='toggle'><li class='stext'><span class='lift-t-sec'>" + name + "</span><span class='right-t'>" + fieldVal + "</span></li></ol>");
                    _li.appendTo(_ul);
                }
            });
            _ul.appendTo(achievementTbodyMobile);
        });
        $(".cetSetRemark").hide();
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(["_trackEvent", "list", "result", subject + "-qs", 1]);

        $(".txtUl").eq(0).children('.toggle').show();
        $(".txtUl").eq(0).children('.km').children("i").css({ transform: "rotate(135deg)" });
        $(".txtUl").eq(0).children('.km').children("i").text(2);
        $(".km").on("click", function () {
            $(this).siblings().slideToggle("fast");
            if ($(this).children("i").text() == 1) {
                $(this).children("i").css({ transform: "rotate(135deg)" });
                $(this).children("i").text(2);
            } else {
                $(this).children("i").css({ transform: "rotate(-45deg)" });
                $(this).children("i").text(1);
            }
        });
    });
    return false;
};

/**
 * 查询NTCE成绩列表
 * @returns {boolean}
 */
serv.queryNTCECERTList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};//test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '-q', 1]);
    var url = serv.requestUrl + '/api/cert/list';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? "style=\"width: 190px;\"" : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        var subjectName = $("#subject").val();
        var hre = '';
        if (subjectName == 'NTCE') {
            subjectName = '中小学教师资格考试(NTCE)';
            $("#tit-xm").html(data.xm);
            $("#tit-sfz").html(data.sfz);
        }
        $("#achievement-sn").html(subjectName);
        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal;
                if (code == "yxq") {
                    fieldVal = bean[code];
                    _td = $("<td>" + fieldVal + "</td>");
                } else {
                    fieldVal = bean[code] ? bean[code] : "--";
                    _td = $("<td>" + fieldVal + "</td>");
                }

                _td.appendTo(_tr);
            });
            /*
            //拼接下载pdf链接
            hre = "&psid=&subjectId=660&subjectCode=NTCE&examId="+bean.exam_id+"&name="+bean.xm+"&sfzh="+bean.sfz+"&zkzh="+bean.zkzh+"&sf="+bean.sf+"&bkjb="+bean.bkjb+"&pdfName=NTCE";
            var href = "http://search.neea.edu.cn/QueryDataAction.do?act=downQueryPdf&pram=certi"+hre;
            var _tdad = $("<a target='_blank' href=\""+href+"\" style=\"padding-right: 10px;\">下载证书</a>");
            _td = $("<td></td>");
            _tdad.appendTo(_td);
            _td.appendTo(_tr);
            */
            _td = $("<td></td>");
            _td.appendTo(_tr);
            _tr.appendTo(achievementTbody);

            bean.type = 2;
            var _tda = $("<a href=\"#\">查看合格证明</a>");
            _tda.click(function () {
                serv.pdfData(bean);
                //serv.queryNTCECERT(bean.subject, bean.tab, bean.exam, bean.token,bean.exam_id);
            });
            _tda.appendTo(_td);

            var down = serv.isDown(bean);
            if (down) {
                var _tda = $("<a href=" + down + " style=margin-left:10px;>下载合格证明</a>");
                _tda.mouseup(function () {
                    _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
                });
                _tda.appendTo(_td);
            }
        });

        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'CERT', subject + '-qs', 1]);
    });
    return false;
};
/**
 * 移动端查询NTCE成绩列表
 * @returns {boolean}
 */
serv.queryNTCECERTListMobile = function () {
    //获取参数
    var subject = $("#subject").val();

    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify}; //test

    var url = serv.requestUrl + "/api/results/list";
    var ptype = serv.getUrlParam("ptype");
    var isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify();
    var dcResultsObj = true;//util.findObjByKey(dc_results_subject_list, "code", "NTCE_RESULTS");
    var trackType = "Mobile-list";
    if (dcResultsObj) {
        if (ptype == "ntcecachecloud") {
            url = "//cachecloud.neea.cn/api/latest/results/ntce";
            subject = "NTCE_BS";
            params = {subject: subject, xm: xm, sfz: sfz};
            isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true);
            trackType = "Mobile-dcCloud-list";
        } else if (ptype == "ntcecache") {
            url = "//cache.neea.edu.cn/api/latest/results/ntce";

            subject = "NTCE_BS";
            params = {subject: subject, xm: xm, sfz: sfz};
            isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true);
            trackType = "Mobile-dcCache-list";
        } else if (ptype == "ms") {
            url = "//cache.neea.edu.cn/api/latest/results/ntce";

            subject = "NTCE_MS";
            params = {subject: subject, xm: xm, sfz: sfz};
            isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true);
            trackType = "Mobile-dcMs-list";
        }
    } else {
        _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
        _hmt.push(["_trackEvent", "Mobile-list", "click", subject + "-q", 1]);
    }
    if (isVerify) {
        return false;
    }

    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", trackType, "click", subject + "-q", 1]);

    var loadIndex = layer.load(0, {shade: 0.1});

    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }
        //console.log(result)
        //var LIST_QUERY_FIELD_DICT = serv.require(serv.listQueryFieldDictUrl);
        //var showFields_bs = LIST_QUERY_FIELD_DICT.rule_list["NTCE_BS"];
        //var showFields_ms = LIST_QUERY_FIELD_DICT.rule_list["NTCE_MS"];
        var showFields_bs = rule_list["NTCE_BS"];
        var showFields_ms = rule_list["NTCE_MS"];
        //console.log(showFields_bs);
        //console.log(showFields_ms);
        //console.log(code + ":" + name);
        //笔试成绩
        var achievementTbodyMobile = $("#achievement-tbody-mobile");
        achievementTbodyMobile.html("");

        if (result.data.bs) {
            $(".ntcebscj-con").show();
            $("#ntceTip-bs").show();
            $("#ntceTip-msxh").text("2. ");

            var _bgf, _hg, _li, _ul, _exam, _lititle, _xi, _hi;

            var data = result.data.bs.list;
            if (data.length != 0) {
                $("#tit-xm").html(result.data.xm);
                $("#tit-sfz").html(result.data.sfz);
            }

            $.each(data, function (index, bean) {
                _ul = $("<ul class='txtUl'></ul>");
                $.each(showFields_bs, function (code, name) {
                    if (code == "km") {
                        _li = $("<li class='km'></li>");
                        _li.appendTo(_ul);
                        _lititle = $("<li class='km-title'><span style='margin-bottom: 2px;'>" + bean[code] + "</span></li>");
                        _lititle.appendTo(_li);
                        _hi = $("<li class='title-min'></li>");
                        _hi.appendTo(_lititle);
                        _xi = $("<i>1</i>");
                        _xi.appendTo(_li);
                    } else if (code == "exam") {
                        _exam = $("<span class='exam-title-min'>" + bean[code] + "</span>");
                        _exam.appendTo(_hi);
                    } else if (code == "hg") {
                        if (bean[code] == "合格") {
                            _li = $("<span class='rank qualified'>" + bean[code] + "</span>");
                        } else if (bean[code] == "不合格") {
                            _li = $("<span class='rank unqualified'>" + bean[code] + "</span>");
                        } else if (bean[code] == "缺考") {
                            _li = $("<span class='rank miss'>" + bean[code] + "</span>");
                        }
                        _li.appendTo(_hi);
                    } else {
                        _li = $("<ol class='toggle'><li class='stext'><span class='lift-t-sec'>" + name + "</span><span class='right-t'>" + bean[code] + "</span></li></ol>");
                        _li.appendTo(_ul);
                    }
                });
                _ul.appendTo(achievementTbodyMobile);
            });
            $("#bscj").show();
            $("#bscjbz").show();
        } else {
            $("#bscj").hide();
            $("#bscjbz").hide();
            $(".ntcebscj-con").hide();
            $("#ntceTip-bs").hide();
            $("#ntceTip-msxh").text("1. ");
        }

        if (result.data.ms) {
            $(".ntcemscj-con").show();
            $("#ntceTip-ms").show();
            var data = result.data.ms.list;
            //面试成绩
            var achievementTbodyMMobile = $("#achievement-tbody-m-mobile");
            achievementTbodyMMobile.html("");
            $("#mscj").html("面试成绩");
            $("#bz").html("备注：");
            $("#bzcon").html("面试合格与否由各省教育行政部门确定。");

            var _bgf, _hg, _li, _ul, _exam, _lititle, _xi, _hi;

            $("#tit-xm").html(result.data.xm);
            $("#tit-sfz").html(result.data.sfz);

            $.each(data, function (index, bean) {
                _ul = $("<ul class='txtUl'></ul>");
                $.each(showFields_ms, function (code, name) {
                    if (code == "km") {
                        _li = $("<li class='km'></li>");
                        _li.appendTo(_ul);
                        _lititle = $("<li class='km-title'><span style='margin-bottom: 2px;'>" + bean[code] + "</span></li>");
                        _lititle.appendTo(_li);
                        _hi = $("<li class='title-min'></li>");
                        _hi.appendTo(_lititle);
                        _xi = $("<i>1</i>");
                        _xi.appendTo(_li);
                    } else if (code == "exam") {
                        _exam = $("<span class='exam-title-min'>" + bean[code] + "</span>");
                        _exam.appendTo(_hi);
                    } else if (code == "hg") {
                        if (bean[code] == "合格") {
                            _li = $("<span class='rank qualified'>" + bean[code] + "</span>");
                        } else if (bean[code] == "不合格") {
                            _li = $("<span class='rank unqualified'>" + bean[code] + "</span>");
                        } else if (bean[code] == "缺考") {
                            _li = $("<span class='rank miss'>" + bean[code] + "</span>");
                        }
                        _li.appendTo(_hi);
                    } else {
                        _li = $("<ol class='toggle'><li class='stext'><span class='lift-t-sec'>" + name + "</span><span class='right-t'>" + bean[code] + "</span></li></ol>");
                        _li.appendTo(_ul);
                    }
                });
                _ul.appendTo(achievementTbodyMMobile);
            });
        } else {
            var achievementTbodyMMobile = $("#achievement-tbody-m-mobile");
            achievementTbodyMMobile.html("");
            $("#mscj").html("");
            $("#bz").html("");
            $("#bzcon").html("");
            $(".ntcemscj-con").hide();
            $("#ntceTip-ms").hide();
        }

        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(["_trackEvent", trackType, "result", subject + "-qs", 1]);

        // $("#achievement-tbody-mobile .ntcetxtUl").eq(0).find("li").show().siblings(".km").find("i").css({ transform: "rotate(135deg)" }).text(2);
        // $("#achievement-tbody-m-mobile .ntcetxtUl").eq(0).find("li").show().siblings(".km").find("i").css({ transform: "rotate(135deg)" }).text(2);

        // $(".ntcetxtUl").eq(0).children('.ntcetoggle').show();
        // $(".ntcetxtUl").eq(0).children('.km').children("i").css({ transform: "rotate(135deg)" });
        // $(".ntcetxtUl").eq(0).children('.km').children("i").text(2);
        $(".km").on("click", function () {
            $(this).siblings().slideToggle("fast");
            if ($(this).children("i").text() == 1) {
                $(this).children("i").css({transform: "rotate(135deg)"});
                $(this).children("i").text(2);
            } else {
                $(this).children("i").css({transform: "rotate(-45deg)"});
                $(this).children("i").text(1);
            }
        });
    });
    return false;
};
/**
 * 查询NTCE证书列表
 * @returns {boolean}
 */
serv.queryNTCEResultList = function () {
    //获取参数
    var subject = $("#subject").val();

    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify}; //test

    var url = serv.requestUrl + "/api/results/list";
    var ptype = serv.getUrlParam("ptype");
    var isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify();
    var dcResultsObj = util.findObjByKey(dc_results_subject_list, "code", "NTCE_RESULTS");
    var trackType = "list";
    if (dcResultsObj) {
        if (ptype == "ntcecachecloud") {
            url = "//cachecloud.neea.cn/api/latest/results/ntce";
            subject = "NTCE_BS";
            params = {subject: subject, xm: xm, sfz: sfz};
            isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true);
            trackType = "dcCloud-list";
        } else if (ptype == "ntcecache") {
            url = "//appquery.neea.edu.cn/api/latest/results/ntce";
            subject = "NTCE_BS";
            params = {subject: subject, xm: xm, sfz: sfz};
            isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true);
            trackType = "dcCache-list";
        } else if (ptype == "ms") {
            url = "//appquery.neea.edu.cn/api/latest/results/ntce";
            subject = "NTCE_MS";
            params = {subject: subject, xm: xm, sfz: sfz};
            isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true);
            trackType = "dcMs-list";
        }
    }
    if (isVerify) {
        return false;
    }

    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", trackType, "click", subject + "-q", 1]);

    var loadIndex = layer.load(0, {shade: 0.1});

    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }
        //console.log(result)

        var showFields_bs = rule_list["NTCE_BS"];
        var showFields_ms = rule_list["NTCE_MS"];
        //console.log(code + ":" + name);
        //笔试成绩
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");

        if (result.data.bs) {
            var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
            var _th, _td;
            $.each(showFields_bs, function (code, name) {
                var width;
                switch (code) {
                    case "km":
                        width = "20%";
                        break;
                    case "bgf":
                        width = "6%";
                        break;
                    case "hg":
                        width = "7%";
                        break;
                    case "zkzh":
                        width = "15%";
                        break;
                    case "exam":
                        width = "10%";
                        break;
                    case "yxq":
                        width = "15%";
                        break;
                    case "sf":
                        width = "10%";
                        break;
                    case "yqyx":
                        width = "8%";
                        break;
                }
                _th = $("<th style=\"width: " + width + ";\">" + name + "</th>");
                _th.appendTo(_tr);
            });
            _th.appendTo(_tr);
            _tr.appendTo(achievementThead);

            var data = result.data.bs.list;
            if (data.length != 0) {
                $("#tit-xm").html(result.data.xm);
                $("#tit-sfz").html(result.data.sfz);
            }

            $.each(data, function (index, bean) {
                _tr = $("<tr style='height=\"25\"'></tr>");
                $.each(showFields_bs, function (code, name) {
                    var fieldVal = bean[code] ? bean[code] : "--";
                    _td = $("<td>" + fieldVal + "</td>");
                    _td.appendTo(_tr);
                });

                _td.appendTo(_tr);
                _tr.appendTo(achievementTbody);
            });
            $("#bscj").show();
            $("#bscjbz").show();
        } else {
            $("#bscj").hide();
            $("#bscjbz").hide();
        }

        if (result.data.ms) {
            var data = result.data.ms.list;
            //面试成绩
            var achievementTheadM = $("#achievement-thead-m");
            var achievementTbodyM = $("#achievement-tbody-m");
            achievementTheadM.html("");
            achievementTbodyM.html("");
            $("#mscj").html("面试成绩");
            $("#bz").html("备注：");
            $("#bzcon").html("面试合格与否由各省教育行政部门确定。");

            var _tr = $("<tr style=\"background: #c0a274 !important;color:#FFFFFF;\"></tr>");
            var _th, _td;
            $.each(showFields_ms, function (code, name) {
                var width;
                switch (code) {
                    case "km":
                        width = "25%";
                        break;
                    case "hg":
                        width = "";
                        break;
                    case "zkzh":
                        width = "30%";
                        break;
                    case "exam":
                        width = "15%";
                        break;
                    case "sf":
                        width = "10%";
                        break;
                }
                _th = $("<th style=\"width: " + width + ";\">" + name + "</th>");
                _th.appendTo(_tr);
            });
            _th.appendTo(_tr);
            _tr.appendTo(achievementTheadM);

            $("#tit-xm").html(result.data.xm);
            $("#tit-sfz").html(result.data.sfz);

            $.each(data, function (index, bean) {
                _tr = $("<tr style='height=\"25\"'></tr>");
                $.each(showFields_ms, function (code, name) {
                    var fieldVal = bean[code] ? bean[code] : "--";
                    _td = $("<td>" + fieldVal + "</td>");
                    _td.appendTo(_tr);
                });

                _td.appendTo(_tr);
                _tr.appendTo(achievementTbodyM);
            });
        } else {
            var achievementTheadM = $("#achievement-thead-m");
            var achievementTbodyM = $("#achievement-tbody-m");
            achievementTheadM.html("");
            achievementTbodyM.html("");
            $("#mscj").html("");
            $("#bz").html("");
            $("#bzcon").html("");
        }

        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(["_trackEvent", trackType, "result", subject + "-qs", 1]);
    });
    return false;
};

/**
 * 查看证书详情
 * @param subject
 * @param tab
 * @param token
 */
serv.queryNTCECERT = function (subject, tab, exam, token, exam_id) {
    //获取成绩详情
    var url = serv.requestUrl + '/api/cert/data';
    var params = {"token": token};
    //获取照片路径
    var getPhotoUrl = 'http://appquery.neea.edu.cn/api/cert/photo';


    var loadIndex = layer.load(0, {shade: 0.1});


    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }
        var dataBean = result.data;
        if ($.isEmptyObject(dataBean)) {
            layer.msg("获取数据为空错误！");
            return;
        }

        //获取照片路径
        var photoObj = $("#photo");
        if (dataBean.poken) {
            photoObj.attr("src", "http://appquery.neea.edu.cn/api/cert/photo?poken=" + dataBean.poken);
        } else {
            photoObj.attr("src", "http://www.neea.edu.cn/query/images/nophoto.jpg");
        }

        var subjectName = $("#subject").val();
        if (subjectName == 'NTCE') {
            subjectName = '中小学教师资格考试合格证明(NTCE)';

            $("#act").val("downQueryPdf");
            $("#pram").val("certi");
            $("#psid").val("");
            $("#subjectId").val("660");
            $("#subjectCode").val("NTCE");
            $("#examId").val(exam_id);
            $("#name").val(dataBean.XM);
            $("#sfzh").val(dataBean.SFZH);
            $("#zkzh").val(dataBean.ZKZH);
            $("#sf").val(dataBean.SF);
            $("#bkjb").val(dataBean.JB);
            $("#pdfName").val("NTCE");
        }
        $("#schrep-sn").html(subjectName);
        $.each(dataBean, function (key, val) {
            var obj = $("[code=" + key + "]");
            if (obj.length) {
                obj.html(val);
            }
        });


        $(".schrep").show();
        $(".achievement").hide();
        //详情查询成功统计
        _hmt.push(['_trackEvent', 'data', 'CERT', subject + '-qs', 1]);

        //layer.alert("<textarea cols=40 rows=8>"+JSON.stringify(result,null,2)+"</textarea>");
    });
};

/**
 * 查询NCRE成绩列表
 * @returns {boolean}
 */
serv.queryNCREResultList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};//test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '-q', 1]);
    var url = serv.requestUrl + '/api/results/list';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            //layer.msg(result.message);
            layer.msg(result.msg);
            return;
        }
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? "style=\"width: 300px;\"" : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;

        var subjectName = $("#subject").val();
        var title = '全国计算机等级考试(NCRE)';
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);
        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal;
                if (code == "bkjb") {
                    fieldVal = dict.getLevelName(bean);//serv.bkjb(subjectName,bean[code],"");
                } else if (code == "cjdd") {
                    fieldVal = serv.cjdd(subjectName, bean[code], "");
                } else {
                    fieldVal = bean[code] ? bean[code] : "--";
                }

                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });

            if (bean.is_report && bean.xf) {

                var _tda = $("<a href=\"#\">查看成绩分析报告</a>");
                _tda.click(function () {
                    //serv.queryNCREResult(bean.subject_id, bean.exam_id, bean.sf, bean.bkjb,bean.xm,bean.zkzh);
                    serv.pdfReport({token: bean.token});
                });
                _td = $("<td></td>");
                _tda.appendTo(_td);
            }
            if (bean.cuowu && bean.cuowu != '--') {

                var _tda = $("<p>" + bean.cuowu + "</p>");
                _td = $("<td></td>");
                _tda.appendTo(_td);
            }
            if (!bean.is_report && !bean.cuowu) {
                var _tda = $("");
                _td = $("<td>--</td>");
                _tda.appendTo(_td);
            }
            _td.appendTo(_tr);
            _tr.appendTo(achievementTbody);
        });
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'result', subject + '-qs', 1]);
    });
    return false;
};
/**
 * 查看NCRE成绩详情
 * @param subject
 * @param tab
 * @param token
 */
serv.queryNCREResult = function (selectsub, selectyear, selectprovince, selectbkjb, name, zkzh) {

    $("#schrep-sn").html("全国计算机等级考试(NCRE)");
    var src = "//search.neea.edu.cn/QueryDataAction.do?act=doPostCont&pram=results&reportPram=1&selectsub=" + selectsub + "" +
        "&selectyear=" + selectyear + "&selectprovince=" + selectprovince + "&selectbkjb=" + selectbkjb + "" +
        "&name=" + name + "&zkzh=" + zkzh + "&nexturl=//cjcx.neea.edu.cn/res/Home/structure/17099828.png";
    $("#query_report").attr("src", src);
    $("#query_report").css({"height": "824px!important", "width": "99%", "border": "none"});
    $(".schrep").show();
    $(".achievement").hide();
    //详情查询成功统计
    _hmt.push(['_trackEvent', 'data', 'result', 'NCRE_CJFXBG-qs', 1]);

    //layer.alert("<textarea cols=40 rows=8>"+JSON.stringify(result,null,2)+"</textarea>");
};
/**
 * 查询NCRE证书列表
 * @returns {boolean}
 */
serv.queryNCRECertList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};//test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '_CERTI-q', 1]);
    var url = serv.requestUrl + '/api/cert/list';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code != "0") {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }

        var showFields = rule_list["NCRE_ZS"];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            var style = "";
            if (code == "bkjb") {
                style = "style='width: 400px;'";
            } else if (code == "cjdd") {
                style = "style='width: 200px;'";
            }

            _th = $("<th " + style + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = '全国计算机等级考试(NCRE)';
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);
        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal;
                if (code == "bkjb") {
                    fieldVal = dict.getLevelName(bean); //serv.bkjb(subjectName,bean[code],"");
                } else if (code == "cjdd") {
                    fieldVal = dict.getScoreName(bean); //serv.cjdd(subjectName,bean[code],"");
                } else {
                    fieldVal = bean[code] ? bean[code] : "--";
                }

                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });

            bean.type = 2;
            var _tda = $("<a href=# title=\"" + (bean.cuowu || "") + "\">查看证书</a>");
            _tda.click(function () {
                serv.pdfData(bean);
            });
            _td = $("<td></td>");
            _tda.appendTo(_td);
            _td.appendTo(_tr);

            var down = serv.isDown(bean);
            if(bean.tab.startsWith("NCRE_9")){
                 down = false;
            }
            if (down) {
                var _tda = $("<a href=" + down + " style=margin-left:10px;>下载证书</a>");
                _tda.mouseup(function () {
                    _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
                });

                _tda.appendTo(_td);
                _td.appendTo(_tr);
            }

            _tr.appendTo(achievementTbody);
        });
        $(".achievement").show();
        $(".condition").hide();

        $(".schrep").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'result', subject + '_CERTI-qs', 1]);
    });
    return false;
};


/**
 * 获取考次时间数字
 * @param tab
 * @returns {null|number}
 */
serv.getKcnum = function (tab) {
    try {
        if (tab && tab.indexOf("_") != -1) {
            return parseInt(tab.substring(tab.indexOf("_") + 1));
        }
    } catch (e) {
    }
    return null;
};

/**
 * 获取考试时间
 * @param tab
 * @returns {string|null}
 */
serv.queryCetDt = function (tab) {
    var kcnum = serv.getKcnum(tab);
    if (kcnum == null) {
        return null;
    }
    var kcnumStr = kcnum < 100 ? ("0" + kcnum) : (kcnum + "");
    if (kcnumStr.length != 3) {
        return null;
    }
    var yearShort = kcnumStr.substring(0, 2);
    var haftYearNum = kcnumStr.charAt(2);
    return "20" + yearShort + "年" + (haftYearNum == 1 ? "上" : "下") + "半年";
};

// 封装get请求
function $get(url, data, async, successCallback, errorCallback, timeoutSeconds) {
    jQuery.support.cors = true;//浏览器支持跨域访问
    $.ajax({
        url: url,
        timeout: timeoutSeconds ? 1000 * timeoutSeconds : 1000 * 10,
        type: 'get',
        async: async,
        data: data,
        //允许请求携带cookie信息
        xhrFields: {withCredentials: true},
        success: function (data) {
            if (successCallback) {
                try {
                    successCallback(data);
                } catch (e) {
                    console.log(e);
                }
            }
        },
        error: function (xhr) {
            if (errorCallback) {
                errorCallback(xhr);
            } else {
                var msg = "网络超时，请稍后再试！";
                if (window.layer) {
                    layer.closeAll();
                    layer.msg(msg);
                } else {
                    alert(msg);
                }
            }
        }
    })
}

// 封装get jsonp请求
function $getp(url, data, async, successCallback, errorCallback, timeoutSeconds) {
    $.ajax({
        url: url,
        timeout: timeoutSeconds ? 1000 * timeoutSeconds : 1000 * 10,
        type: 'get',
        async: async,
        data: data,
        dataType: 'jsonp',
        jsonp: "cb",
        success: function (data) {
            if (successCallback) {
                try {
                    successCallback(data);
                } catch (e) {
                    console.log(e);
                }
            }
        },
        error: function (xhr) {
            if (errorCallback) {
                errorCallback(xhr);
            } else {
                var msg = "网络超时，请稍后再试！";
                if (window.layer) {
                    layer.closeAll();
                    layer.msg(msg);
                } else {
                    alert(msg);
                }
            }
        }
    })
}

// 封装post请求
function $post(url, data, async, successCallback, errorCallback, timeoutSeconds) {
    jQuery.support.cors = true;//浏览器支持跨域访问
    $.ajax({
        url: url,
        timeout: timeoutSeconds ? 1000 * timeoutSeconds : 1000 * 10,
        type: 'post',
        async: async,
        data: data,
        //允许请求携带cookie信息
        xhrFields: {withCredentials: true},
        success: function (data) {
            if (successCallback) {
                try {
                    successCallback(data);
                } catch (e) {
                    console.log(e);
                }
            }
        },
        error: function (xhr) {
            if (errorCallback) {
                errorCallback(xhr);
            } else {
                var msg = "网络超时，请稍后再试！";
                if (window.layer) {
                    layer.closeAll();
                    layer.msg(msg);
                } else {
                    alert(msg);
                }
            }
        }
    })
}

function $ajax(type, url, data, async, successCallback, errorCallback, timeout) {
    type = type == null ? "get" : type;
    if (serv.IEVersion > 0 && serv.IEVersion < 10) {
        $getp(url, data, async, successCallback, errorCallback, timeout);
    } else {
        if (type.toLowerCase() == "get") {
            $get(url, data, async, successCallback, errorCallback, timeout);
        } else if (type.toLowerCase() == "post") {
            $post(url, data, async, successCallback, errorCallback, timeout);
        }
    }
}


//带ContentType的post请求
function $ajaxPostContentType(type, url, data,contentType, async, successCallback, errorCallback, timeout) {
    type = type == null ? "get" : type;
    if (serv.IEVersion > 0 && serv.IEVersion < 10) {
        $getp(url, data, async, successCallback, errorCallback, timeout);
    } else {
        if (type.toLowerCase() == "get") {
            $get(url, data, async, successCallback, errorCallback, timeout);
        } else if (type.toLowerCase() == "post") {
            $postContentType(url, data, contentType, async, successCallback, errorCallback, timeout);
        }
    }
}
// 封装post请求
function $postContentType(url, data,contentType, async, successCallback, errorCallback, timeoutSeconds) {
    jQuery.support.cors = true;//浏览器支持跨域访问
    $.ajax({
        url: url,
        timeout: timeoutSeconds ? 1000 * timeoutSeconds : 1000 * 10,
        type: 'post',
        async: async,
        data: data,
        contentType: contentType,
        //允许请求携带cookie信息
        xhrFields: {withCredentials: true},
        success: function (data) {
            if (successCallback) {
                try {
                    successCallback(data);
                } catch (e) {
                    console.log(e);
                }
            }
        },
        error: function (xhr) {
            if (errorCallback) {
                errorCallback(xhr);
            } else {
                var msg = "网络超时，请稍后再试！";
                if (window.layer) {
                    layer.closeAll();
                    layer.msg(msg);
                } else {
                    alert(msg);
                }
            }
        }
    })
}

function $ajaxStandby(type, masterUrl, slaveUrl, data, async, callback) {
    var timeoutSeconds = slaveUrl ? 3 : 10;
    $ajax(
        type,
        masterUrl,
        data,
        async,
        callback,
        function (error) {
            if (slaveUrl) {
                $ajax(type, slaveUrl, data, async, callback, function (error) {
                    var msg = "网络超时，请稍后再试！";
                    if (window.layer) {
                        layer.closeAll();
                        layer.msg(msg);
                    } else {
                        alert(msg);
                    }
                });
            } else {
                var msg = "网络超时，请稍后再试！";
                if (window.layer) {
                    layer.closeAll();
                    layer.msg(msg);
                } else {
                    alert(msg);
                }
            }
        },
        timeoutSeconds
    );
}


/**
 * 替换字符串中可能包含的xss攻击的脚本
 *
 * @param str
 *            传入的字符串
 * @returns
 */
function cleanXSS(str) {
    str = str.replace(/<script>(.*?)<\/script>/g, "");
    str = str.replace(/<\/script>/g, "");
    str = str.replace(/<script(.*?)>/g, "");
    str = str.replace(/eval\((.*?)\)/g, "");
    str = str.replace(/e-xpression\((.*?)\)/g, "");
    str = str.replace(/javascript:/g, "");
    str = str.replace(/vbscript:/g, "");
    str = str.replace(/onload(.*?)=/g, "");
    return str;
}

function goLogin() {
    // 防止DOM的XSS攻击
    var redirectUrl = encodeURIComponent(cleanXSS(location.href));
    var returnUrl = encodeURIComponent(serv.requestUrl + "/api/login/validateMemberUser?redirectUrl=" + redirectUrl);
    var loginUrl = serv.memberLoginUrl + "/login/new?threeView=requirePrams&returnUrl=" + returnUrl;
    location.href = loginUrl;
}

// 判断IE浏览器版本
function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if (isEdge) {
        return 'edge';//edge
    } else if (isIE11) {
        return 11; //IE11
    } else {
        return -1;//不是ie浏览器
    }
}

/**
 * 补办CET查询用
 */
serv.queryReappleCetResult = function (vid) {
    vid = BASE64.urlsafe_decode(vid);
    var item = vid.split("&");
    var subject, tab, exam, token;
    subject = item[0];
    tab = item[1];
    exam = item[2];
    token = item[3];

    $(".condition").hide();//隐藏查询条件div
    $(".imgpag").hide();//隐藏导航
    $(".cjdBtn").hide();//隐藏返回按钮
    $(".outlogin").hide();//隐藏用户信息
    $(".cdown").hide();//隐藏PDF下载按钮
    //serv.queryCetResult(subject,tab,exam,token);
    var par = {};
    par.tab = tab;
    par.token = token;
    par.type = 1;
    par.subject = subject;
    serv.pdfData(par);
};
/**
 * 补办WSK查询用
 */
serv.queryReappleWskResult = function (vid) {
    vid = BASE64.urlsafe_decode(vid);
    var item = vid.split("&");
    var subject, tab, exam, token;
    subject = item[0];
    tab = item[1];
    exam = item[2];
    token = item[3];

    $(".condition").hide();//隐藏查询条件div
    $(".imgpag").hide();//隐藏导航
    $(".cjdBtn").hide();//隐藏返回按钮
    $(".outlogin").hide();//隐藏用户信息
    serv.queryWSKResult(subject, tab, exam, token);
};

serv.getUrlParam = function (name) {
    var dv = "";
    var url;
    if (url) {
        var i = url.indexOf("#");
        if (i != -1) url = url.substring(0, i)
    } else url = location.search;
    i = url.indexOf("?");
    if (i == -1) return dv;
    url = url.substring(i + 1);
    name += "=";
    var ps = url.split("&");
    for (var i = 0; i < ps.length; i++) {
        if (ps[i].indexOf(name) != 0) continue;
        return decodeURIComponent(ps[i].substring(name.length).replace(/[+]/g, " "));
    }
    ;
    return dv
}


/**
 * 移动端查询NTCE成绩列表
 * @returns {boolean}
 */
serv.queryNTCEResultListMobile = function () {
    //获取参数
    var subject = $("#subject").val();

    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify}; //test

    var url = serv.requestUrl + "/api/results/list";
    var ptype = serv.getUrlParam("ptype");
    var isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify();
    var dcResultsObj = util.findObjByKey(dc_results_subject_list, "code", "NTCE_RESULTS");
    var trackType = "Mobile-list";
    if (dcResultsObj) {
        if (ptype == "ntcecachecloud") {
            url = "//cachecloud.neea.cn/api/latest/results/ntce";
            subject = "NTCE_BS";
            params = {subject: subject, xm: xm, sfz: sfz};
            isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true);
            trackType = "Mobile-dcCloud-list";
        } else if (ptype == "ntcecache") {
            url = "//appquery.neea.edu.cn/api/latest/results/ntce";
            subject = "NTCE_BS";
            params = {subject: subject, xm: xm, sfz: sfz};
            isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true);
            trackType = "Mobile-dcCache-list";
        } else if (ptype == "ms") {
            url = "//appquery.neea.edu.cn/api/latest/results/ntce";
            subject = "NTCE_MS";
            params = {subject: subject, xm: xm, sfz: sfz};
            isVerify = !serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true);
            trackType = "Mobile-dcMs-list";
        }
    }
    if (isVerify) {
        return false;
    }

    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", trackType, "click", subject + "-q", 1]);

    var loadIndex = layer.load(0, {shade: 0.1});

    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.msg);
            return;
        }
        //console.log(result)

        var showFields_bs = rule_list["NTCE_BS"];
        var showFields_ms = rule_list["NTCE_MS"];
        //console.log(code + ":" + name);
        //笔试成绩
        var achievementTbodyMobile = $("#achievement-tbody-mobile");
        achievementTbodyMobile.html("");

        if (result.data.bs) {
            $(".ntcebscj-con").show();
            $("#ntceTip-bs").show();
            $("#ntceTip-msxh").text("2. ");

            var _bgf, _hg, _li, _ul, _exam, _lititle, _xi, _hi;

            var data = result.data.bs.list;
            if (data.length != 0) {
                $("#tit-xm").html(result.data.xm);
                $("#tit-sfz").html(result.data.sfz);
            }

            $.each(data, function (index, bean) {
                _ul = $("<ul class='ntcetxtUl'></ul>");
                $.each(showFields_bs, function (code, name) {
                    var item = bean[code] ? bean[code] : "--";
                    if (code == "km") {
                        _li = $("<li class='km'></li>");
                        _li.appendTo(_ul);
                        _lititle = $("<li class='km-title bgf'><span style='margin-bottom: 2px;'>" + item + "</span></li>");
                        _lititle.appendTo(_li);
                        _hi = $("<li class='title-min bgf'></li>");
                        _hi.appendTo(_lititle);
                        _xi = $("<i>1</i>");
                        _xi.appendTo(_li);
                    } else if (code == "exam") {
                        _exam = $("<span class='km-title-min'>" + item + "</span>");
                        _exam.appendTo(_hi);
                    } else if (code == "hg") {
                        if (item == "合格") {
                            _hg = $("<span class='hg hhg'>" + item + "</span>");
                        } else if (item == "不合格") {
                            _hg = $("<span class='hg bhg'>" + item + "</span>");
                        } else if (item == "缺考") {
                            _hg = $("<span class='hg qk'>" + item + "</span>");
                        }
                        _hg.appendTo(_hi);
                    } else {
                        _li = $("<li class='ntcetoggle'><span class='ntcecj_l'>" + name + "</span><span class='ntcecj_r'>" + item + "</span></li>");
                        _li.appendTo(_ul);
                    }
                });
                _ul.appendTo(achievementTbodyMobile);
            });
            $("#bscj").show();
            $("#bscjbz").show();
        } else {
            $("#bscj").hide();
            $("#bscjbz").hide();
            $(".ntcebscj-con").hide();
            $("#ntceTip-bs").hide();
            $("#ntceTip-msxh").text("1. ");
        }

        if (result.data.ms) {
            $(".ntcemscj-con").show();
            $("#ntceTip-ms").show();
            var data = result.data.ms.list;
            //面试成绩
            var achievementTbodyMMobile = $("#achievement-tbody-m-mobile");
            achievementTbodyMMobile.html("");
            $("#mscj").html("面试成绩");
            $("#bz").html("备注：");
            $("#bzcon").html("面试合格与否由各省教育行政部门确定。");

            var _bgf, _hg, _li, _ul, _exam, _lititle, _xi, _hi;

            $("#tit-xm").html(result.data.xm);
            $("#tit-sfz").html(result.data.sfz);

            $.each(data, function (index, bean) {
                _ul = $("<ul class='ntcetxtUl'></ul>");
                $.each(showFields_ms, function (code, name) {
                    var item = bean[code] ? bean[code] : "--";
                    if (code == "km") {
                        _li = $("<li class='km'></li>");
                        _li.appendTo(_ul);
                        _lititle = $("<li class='km-title bgf'><span style='margin-bottom: 2px;'>" + item + "</span></li>");
                        _lititle.appendTo(_li);
                        _hi = $("<li class='title-min bgf'></li>");
                        _hi.appendTo(_lititle);
                        _xi = $("<i>1</i>");
                        _xi.appendTo(_li);
                    } else if (code == "exam") {
                        _exam = $("<span class='km-title-min'>" + item + "</span>");
                        _exam.appendTo(_hi);
                    } else if (code == "hg") {
                        if (item == "合格") {
                            _li = $("<span class='ntcecj_r mshg'>" + item + "</span>");
                        } else if (item == "不合格") {
                            _li = $("<span class='ntcecj_r msbhg'>" + item + "</span>");
                        } else if (item == "缺考") {
                            _li = $("<span class='ntcecj_r msqk'>" + item + "</span>");
                        }
                        _li.appendTo(_hi);
                    } else {
                        _li = $("<li class='ntcetoggle'><span class='ntcecj_l'>" + name + "</span><span class='ntcecj_r'>" + item + "</span></li>");
                        _li.appendTo(_ul);
                    }
                });
                _ul.appendTo(achievementTbodyMMobile);
            });
        } else {
            var achievementTbodyMMobile = $("#achievement-tbody-m-mobile");
            achievementTbodyMMobile.html("");
            $("#mscj").html("");
            $("#bz").html("");
            $("#bzcon").html("");
            $(".ntcemscj-con").hide();
            $("#ntceTip-ms").hide();
        }

        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(["_trackEvent", trackType, "result", subject + "-qs", 1]);

        // $("#achievement-tbody-mobile .ntcetxtUl").eq(0).find("li").show().siblings(".km").find("i").css({ transform: "rotate(135deg)" }).text(2);
        // $("#achievement-tbody-m-mobile .ntcetxtUl").eq(0).find("li").show().siblings(".km").find("i").css({ transform: "rotate(135deg)" }).text(2);

        $(".km").on("click", function () {
            $(this).siblings().slideToggle("fast");
            if ($(this).children("i").text() == 1) {
                $(this).children("i").css({transform: "rotate(135deg)"});
                $(this).children("i").text(2);
            } else {
                $(this).children("i").css({transform: "rotate(-45deg)"});
                $(this).children("i").text(1);
            }
        });
    });
    return false;
};

/**
 * 查看ntce成绩详情
 */
serv.queryNtceResult = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true)) {
        return false;
    }
    var isLatest = serv.isLatest();
    var trackType;
    var masterUrl;
    var slaveUrl;
    if (isLatest) {
        masterUrl = serv.latestMasterUrl + "/api/latest/results/ntce";
        slaveUrl = serv.latestSlaveUrl ? serv.latestSlaveUrl + "/api/latest/results/ntce" : null;
        trackType = "results-list-dc-" + serv.source;
        if (!serv.checkLatestStage()) {
            return false;
        }
    } else {
        trackType = "results-list-" + serv.source;
        masterUrl = serv.requestUrl + "/api/results/list";
        if (!serv.checkVerify()) {
            return false;
        }
    }
    //获取参数
    var subject = $("#subject").val();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var source = serv.source;
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify, source: source};

    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", trackType, "click", subject + "-q", 1]);

    var loadIndex = layer.load(0, {shade: 0.1});
    $ajaxStandby("post", masterUrl, slaveUrl, params, true, function (result) {
        layer.close(loadIndex);
        if (!isLatest) {
            serv.verifys();
        }
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if ($.isEmptyObject(result)) {
            layer.msg("获取数据为空错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.msg);
            return;
        }
        if (serv.source == "mb") {
            serv.handleNtceResultMobile(result);
        } else {
            serv.handleNtceResultPc(result);
        }
        _hmt.push(["_trackEvent", trackType, "result", subject + "-qs", 1]);
    });
    return false;
};

/**
 * 查看ntce成绩详情-pc版
 */
serv.handleNtceResultPc = function (result) {
    try {
        var showFields_bs = rule_list["NTCE_BS"];
        var showFields_ms = rule_list["NTCE_MS"];
        //console.log(code + ":" + name);
        //笔试成绩
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");

        if (result.data.bs) {
            var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
            var _th, _td;
            $.each(showFields_bs, function (code, name) {
                var width;
                switch (code) {
                    case "km":
                        width = "20%";
                        break;
                    case "bgf":
                        width = "6%";
                        break;
                    case "hg":
                        width = "7%";
                        break;
                    case "zkzh":
                        width = "15%";
                        break;
                    case "exam":
                        width = "10%";
                        break;
                    case "yxq":
                        width = "15%";
                        break;
                    case "sf":
                        width = "10%";
                        break;
                    case "yqyx":
                        width = "8%";
                        break;
                }
                _th = $("<th style=\"width: " + width + ";\">" + name + "</th>");
                _th.appendTo(_tr);
            });
            _th.appendTo(_tr);
            _tr.appendTo(achievementThead);

            var data = result.data.bs.list;
            if (data.length != 0) {
                $("#tit-xm").html(result.data.xm);
                $("#tit-sfz").html(result.data.sfz);
            }

            $.each(data, function (index, bean) {
                _tr = $("<tr style='height=\"25\"'></tr>");
                $.each(showFields_bs, function (code, name) {
                    var fieldVal = bean[code] ? bean[code] : "--";
                    _td = $("<td>" + fieldVal + "</td>");
                    _td.appendTo(_tr);
                });

                _td.appendTo(_tr);
                _tr.appendTo(achievementTbody);
            });
            $("#bscj").show();
            $("#bscjbz").show();
        } else {
            $("#bscj").hide();
            $("#bscjbz").hide();
        }

        if (result.data.ms) {
            var data = result.data.ms.list;
            //面试成绩
            var achievementTheadM = $("#achievement-thead-m");
            var achievementTbodyM = $("#achievement-tbody-m");
            achievementTheadM.html("");
            achievementTbodyM.html("");
            $("#mscj").html("面试成绩");
            $("#bz").html("备注：");
            $("#bzcon").html("面试合格与否由各省教育行政部门确定。");

            var _tr = $("<tr style=\"background: #c0a274 !important;color:#FFFFFF;\"></tr>");
            var _th, _td;
            $.each(showFields_ms, function (code, name) {
                var width;
                switch (code) {
                    case "km":
                        width = "25%";
                        break;
                    case "hg":
                        width = "";
                        break;
                    case "zkzh":
                        width = "30%";
                        break;
                    case "exam":
                        width = "15%";
                        break;
                    case "sf":
                        width = "10%";
                        break;
                }
                _th = $("<th style=\"width: " + width + ";\">" + name + "</th>");
                _th.appendTo(_tr);
            });
            _th.appendTo(_tr);
            _tr.appendTo(achievementTheadM);

            $("#tit-xm").html(result.data.xm);
            $("#tit-sfz").html(result.data.sfz);

            $.each(data, function (index, bean) {
                _tr = $("<tr style='height=\"25\"'></tr>");
                $.each(showFields_ms, function (code, name) {
                    var fieldVal = bean[code] ? bean[code] : "--";
                    _td = $("<td>" + fieldVal + "</td>");
                    _td.appendTo(_tr);
                });

                _td.appendTo(_tr);
                _tr.appendTo(achievementTbodyM);
            });
        } else {
            var achievementTheadM = $("#achievement-thead-m");
            var achievementTbodyM = $("#achievement-tbody-m");
            achievementTheadM.html("");
            achievementTbodyM.html("");
            $("#mscj").html("");
            $("#bz").html("");
            $("#bzcon").html("");
        }

        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
    } catch (e) {
        console.log(e);
    }
};

/**
 * 查看ntce成绩详情-手机版
 */
serv.handleNtceResultMobile = function (result) {
    try {
        var showFields_bs = rule_list["NTCE_BS"];
        var showFields_ms = rule_list["NTCE_MS"];
        //笔试成绩
        var achievementTbodyMobile = $("#achievement-tbody-mobile");
        achievementTbodyMobile.html("");

        if (result.data.bs) {
            $(".ntcebscj-con").show();
            $("#ntceTip-bs").show();
            $("#ntceTip-msxh").text("2. ");

            var _bgf, _hg, _li, _ul, _exam, _lititle, _xi, _hi;

            var data = result.data.bs.list;
            if (data.length != 0) {
                $("#tit-xm").html(result.data.xm);
                $("#tit-sfz").html(result.data.sfz);
            }

            $.each(data, function (index, bean) {
                _ul = $("<ul class='txtUl'></ul>");
                $.each(showFields_bs, function (code, name) {
                    if (code == "km") {
                        _li = $("<li class='km'></li>");
                        _li.appendTo(_ul);
                        _lititle = $("<li class='km-title'><span style='margin-bottom: 2px;'>" + bean[code] + "</span></li>");
                        _lititle.appendTo(_li);
                        _hi = $("<li class='title-min'></li>");
                        _hi.appendTo(_lititle);
                        _xi = $("<i>1</i>");
                        _xi.appendTo(_li);
                    } else if (code == "exam") {
                        _exam = $("<span class='exam-title-min'>" + bean[code] + "</span>");
                        _exam.appendTo(_hi);
                    } else if (code == "hg") {
                        if (bean[code] == "合格") {
                            _li = $("<span class='rank qualified'>" + bean[code] + "</span>");
                        } else if (bean[code] == "不合格") {
                            _li = $("<span class='rank unqualified'>" + bean[code] + "</span>");
                        } else if (bean[code] == "缺考") {
                            _li = $("<span class='rank miss'>" + bean[code] + "</span>");
                        }
                        _li.appendTo(_hi);
                    } else {
                        _li = $("<ol class='toggle'><li class='stext'><span class='lift-t-sec'>" + name + "</span><span class='right-t'>" + bean[code] + "</span></li></ol>");
                        _li.appendTo(_ul);
                    }
                });
                _ul.appendTo(achievementTbodyMobile);
            });
            $("#bscj").show();
            $("#bscjbz").show();
        } else {
            $("#bscj").hide();
            $("#bscjbz").hide();
            $(".ntcebscj-con").hide();
            $("#ntceTip-bs").hide();
            $("#ntceTip-msxh").text("1. ");
        }

        if (result.data.ms) {
            $(".ntcemscj-con").show();
            $("#ntceTip-ms").show();
            var data = result.data.ms.list;
            //面试成绩
            var achievementTbodyMMobile = $("#achievement-tbody-m-mobile");
            achievementTbodyMMobile.html("");
            $("#mscj").html("面试成绩");
            $("#bz").html("备注：");
            $("#bzcon").html("面试合格与否由各省教育行政部门确定。");

            var _bgf, _hg, _li, _ul, _exam, _lititle, _xi, _hi;

            $("#tit-xm").html(result.data.xm);
            $("#tit-sfz").html(result.data.sfz);

            $.each(data, function (index, bean) {
                _ul = $("<ul class='txtUl'></ul>");
                $.each(showFields_ms, function (code, name) {
                    if (code == "km") {
                        _li = $("<li class='km'></li>");
                        _li.appendTo(_ul);
                        _lititle = $("<li class='km-title'><span style='margin-bottom: 2px;'>" + bean[code] + "</span></li>");
                        _lititle.appendTo(_li);
                        _hi = $("<li class='title-min'></li>");
                        _hi.appendTo(_lititle);
                        _xi = $("<i>1</i>");
                        _xi.appendTo(_li);
                    } else if (code == "exam") {
                        _exam = $("<span class='exam-title-min'>" + bean[code] + "</span>");
                        _exam.appendTo(_hi);
                    } else if (code == "hg") {
                        if (bean[code] == "合格") {
                            _li = $("<span class='rank qualified'>" + bean[code] + "</span>");
                        } else if (bean[code] == "不合格") {
                            _li = $("<span class='rank unqualified'>" + bean[code] + "</span>");
                        } else if (bean[code] == "缺考") {
                            _li = $("<span class='rank miss'>" + bean[code] + "</span>");
                        }
                        _li.appendTo(_hi);
                    } else {
                        _li = $("<ol class='toggle'><li class='stext'><span class='lift-t-sec'>" + name + "</span><span class='right-t'>" + bean[code] + "</span></li></ol>");
                        _li.appendTo(_ul);
                    }
                });
                _ul.appendTo(achievementTbodyMMobile);
            });
        } else {
            var achievementTbodyMMobile = $("#achievement-tbody-m-mobile");
            achievementTbodyMMobile.html("");
            $("#mscj").html("");
            $("#bz").html("");
            $("#bzcon").html("");
            $(".ntcemscj-con").hide();
            $("#ntceTip-ms").hide();
        }

        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        $(".km").on("click", function () {
            $(this).siblings().slideToggle("fast");
            if ($(this).children("i").text() == 1) {
                $(this).children("i").css({transform: "rotate(135deg)"});
                $(this).children("i").text(2);
            } else {
                $(this).children("i").css({transform: "rotate(-45deg)"});
                $(this).children("i").text(1);
            }
        });
    } catch (e) {
        console.log(e);
    }
};


/**
 * 查询CCPT成绩列表
 * @returns {boolean}
 */
serv.queryCCPTResultList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '-q', 1]);
    var ptype = serv.getUrlParam("ptype");
    var url = serv.requestUrl + '/api/results/list';


    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? "style=\"width: 180px;\"" : code == "dd" ? "style=\"width: 100px;\"" : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _tr.appendTo(achievementThead);

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = '书画等级考试(CCPT)';
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal = bean[code] ? bean[code] : "--";
                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });
            _tr.appendTo(achievementTbody);
        });
        $(".cetSetRemark").show();
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'result', subject + '-qs', 1]);
    });
    return false;
};
/**
 * 移动端查询CCPT成绩列表
 * @returns {boolean}
 */
serv.queryCCPTResultListMobile = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};//test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'Mobile-list', 'click', subject + '-q', 1]);
    var ptype = serv.getUrlParam("ptype");
    var url = serv.requestUrl + '/api/results/list';

    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        //var LIST_QUERY_FIELD_DICT = serv.require(serv.listQueryFieldDictUrl);
        //var showFields = LIST_QUERY_FIELD_DICT.rule_list[subject];
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementTbodyMobile = $("#achievement-tbody-mobile");
        achievementTbodyMobile.html("");
        var _km, _hg, _li, _ul, _exam, _lititle, _xi, _hi;

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = '书画等级考试(CCPT)';
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _ul = $("<ul class='txtUl'></ul>");
            $.each(showFields, function (code, name) {
                if (code == "exam") {
                    _hi = $("<li class='title-min'></li>");
                    _exam = $("<span class='exam-title-min'>" + bean[code] + "</span>");
                    _exam.appendTo(_hi);
                } else if (code == "kmmc") {
                    _km = $("<li class='km'></li>");
                    _li.before(_km);
                    _lititle = $("<li class='km-title'><span style='margin-bottom: 2px;'>" + bean[code] + "</span></li>");
                    _lititle.appendTo(_km);

                    _hi.appendTo(_lititle);
                    _xi = $("<i>1</i>");
                    _xi.appendTo(_km);
                } else if (code == "dd") {
                    if (bean[code] == "合格") {
                        _hg = $("<span class='rank qualified'>" + bean[code] + "</span>");
                    } else if (bean[code] == "不合格") {
                        _hg = $("<span class='rank unqualified'>" + bean[code] + "</span>");
                    } else if (bean[code] == "缺考") {
                        _hg = $("<span class='rank miss'>" + bean[code] + "</span>");
                    } else if (bean[code] == "优秀") {
                        _hg = $("<span class='rank excellent'>" + bean[code] + "</span>");
                    } else if (bean[code] == "良好") {
                        _hg = $("<span class='rank good'>" + bean[code] + "</span>");
                    }
                    _hg.appendTo(_hi);
                } else {
                    var fieldVal = bean[code] ? bean[code] : "--";
                    _li = $("<ol class='toggle'><li class='stext'><span class='lift-t-sec'>" + name + "</span><span class='right-t'>" + fieldVal + "</span></li></ol>");
                    _li.appendTo(_ul);
                }

            });
            _ul.appendTo(achievementTbodyMobile);
        });
        $(".cetSetRemark").show();
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'Mobile-list', 'result', subject + '-qs', 1]);

        $(".km").on("click", function () {
            $(this).siblings().slideToggle("fast");
            if ($(this).children("i").text() == 1) {
                $(this).children("i").css({transform: "rotate(135deg)"});
                $(this).children("i").text(2);
            } else {
                $(this).children("i").css({transform: "rotate(-45deg)"});
                $(this).children("i").text(1);
            }
        });
    });
    return false;
};
/**
 * 查看CCPT成绩详情
 * @param subject
 * @param tab
 * @param token
 */
serv.queryCCPTResult = function (subject, tab, exam, token) {
    var url = serv.requestUrl + '/api/results/data';
    var params = {"token": token};
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        var dataBean = result.data;
        if ($.isEmptyObject(dataBean)) {
            layer.msg("获取数据为空错误！");
            return;
        }
        var subjectName = $("#subject").val();
        subjectName = '书画等级考试(CCPT)';

        $("#schrep-sn").html(subjectName);
        $.each(dataBean, function (key, val) {
            var obj = $("[code=" + key + "]");
            if (obj.length) {
                obj.html(val);
            }
        });


        $(".schrep").show();
        $(".achievement").hide();
        //详情查询成功统计
        _hmt.push(['_trackEvent', 'data', 'result', subject + '-qs', 1]);

        //layer.alert("<textarea cols=40 rows=8>"+JSON.stringify(result,null,2)+"</textarea>");
    });
};

/**
 * 查询MHK成绩列表
 * @returns {boolean}
 */
serv.queryMHKResultList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify}; //test
    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", "list", "click", subject + "-q", 1]);
    var url = serv.requestUrl + '/api/results/list';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $('<tr style="background:rgb(13, 163, 226);color:#FFFFFF;"></tr>');
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? 'style="width: 300px;"' : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = "中国少数民族汉语水平等级考试(MHK)";
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);

        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal;
                if (code == "sf") {
                    fieldVal = DICT_SFNAME_MHK[bean[code]];
                } else if (code == "bkjb") {
                    fieldVal = serv.bkjb(subjectName, bean[code], "");
                } else {
                    fieldVal = bean[code] ? bean[code] : "--";
                }

                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });
            var bkjb = "bkjb";
            var _tda = $('<span>--</span>');
            if (3 != bean[bkjb]) {
                var _tda = $('<a>查看详情</a>');
                _tda.click(function () {
                    serv.queryMHKResult(bean.subject, bean.tab, bean.exam, bean.token);
                });
            }

            _td = $("<td></td>");
            _tda.appendTo(_td);
            _td.appendTo(_tr);
            _tr.appendTo(achievementTbody);
        });
        $(".cetSetRemark").hide();
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(["_trackEvent", "list", "result", subject + "-qs", 1]);
    });
    return false;
};

/**
 * 移动端查询MHK成绩列表
 * @returns {boolean}
 */
serv.queryMHKResultListMobile = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify}; //test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", "Mobile-list", "click", subject + "-q", 1]);
    var url = serv.requestUrl + "/api/results/list";
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        //var LIST_QUERY_FIELD_DICT = serv.require(serv.listQueryFieldDictUrl);
        //var showFields = LIST_QUERY_FIELD_DICT.rule_list[subject];
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementTbodyMobile = $("#achievement-tbody-mobile");
        achievementTbodyMobile.html("");
        var _km, _zh, _kmtitle, _li, _sf, _ul, _exam, _lititle, _xi, _hi, _fieldVal, _cz, _td, _tda;

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = "中国少数民族汉语水平等级考试(MHK)";
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _ul = $("<ul class='table-small txtUl' style='padding-bottom: 2vmin;'></ul>");
            $.each(showFields, function (code, name) {
                if (code == "exam") {
                    _km = $("<li class='km'></li>");
                    _km.appendTo(_ul);
                    _kmtitle = $("<li class='km-title'></li>")
                    _kmtitle.appendTo(_km);
                    _xi = $("<i>1</i>");
                    _xi.appendTo(_km);
                    _hi = $("<li class='title-min'></li>");
                    _hi.appendTo(_kmtitle);
                    _exam = $("<span class='exam-title-min'>" + bean[code] + "</span>");
                    _exam.appendTo(_hi);
                } else if (code == "zh") {
                    _zh = $("<span class='rank default' style='width: 26vmin;'>总分：" + bean[code] + "</span>");
                    _zh.appendTo(_hi);
                } else if (code == "dj") {
                    if(bean[code]){
                    _lititle = $("<span style='margin-bottom: 2px;'>" + bean[code] + "</span>");
                    }else{
                    _lititle = "";
                    }
                    _hi.before(_lititle);
                } else {
                    var fieldVal1 = bean[code] ? bean[code] : "--";
                    _li = $("<ol class='toggle'><li class='stext'><span class='lift-t-sec'>" + name + "</span><span class='right-t'>" + fieldVal1 + "</span></li></ol>");
                    _li.appendTo(_ul);
                }

            });

            var bkjb = "bkjb";
            // _tda = $("<span class='ntcecj_l'>操作</span><span class='ntcecj_r'><a href='#'>--</a></span>");
            // console.log("bean[bkjb]="+bean[bkjb]);
            if (3 != bean[bkjb]) {
                _cz = $("<li class='buttonArea'></li>");
                _tda = $("<a class='button-secondary-tinner'>查看详情</a>");
                _tda.click(function () {
                    serv.queryMHKResult(bean.subject, bean.tab, bean.exam, bean.token);
                });
                _tda.appendTo(_cz);
                _td = $("<ol class='toggle'></ol>");
                _cz.appendTo(_td);
                _td.appendTo(_ul);
            }

            _ul.appendTo(achievementTbodyMobile);

        });
        $(".cetSetRemark").hide();
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(["_trackEvent", "Mobile-list", "result", subject + "-qs", 1]);

        $(".txtUl").eq(0).children('.toggle').show();
        $(".txtUl").eq(0).children('.km').children("i").css({transform: "rotate(135deg)"});
        $(".txtUl").eq(0).children('.km').children("i").text(2);
        $(".km").on("click", function () {
            $(this).siblings().slideToggle("fast");
            if ($(this).children("i").text() == 1) {
                $(this).children("i").css({transform: "rotate(135deg)"});
                $(this).children("i").text(2);
            } else {
                $(this).children("i").css({transform: "rotate(-45deg)"});
                $(this).children("i").text(1);
            }
        });
    });
    return false;
};

/**
 * 查看MHK成绩详情
 * @param subject
 * @param tab
 * @param token
 */
serv.queryMHKResult = function (subject, tab, exam, token) {
    var url = serv.requestUrl + "/api/results/data";
    var params = {token: token};
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        var dataBean = result.data;
        if ($.isEmptyObject(dataBean)) {
            layer.msg("获取数据为空错误！");
            return;
        }
        var subjectName = $("#subject").val();

        subjectName = "中国少数民族汉语水平等级考试(MHK)";
        //口语笔试
        if (dataBean.ZL == 1) {
            $("#ky").hide();
            $("#bs").hide();
            $("#kybs").show();
        } else if (dataBean.ZL == 2) {
            //笔试
            $("#ky").hide();
            $("#bs").show();
            $("#kybs").hide();
        } else if (dataBean.ZL == 3) {
            //口语
            $("#ky").show();
            $("#bs").hide();
            $("#kybs").hide();
        }

        $("#schrep-sn").html(subjectName);
        $.each(dataBean, function (key, val) {
            var obj = $("[code=" + key + "]");
            if (key == 'SFDM') {
                val = DICT_SFNAME_MHK[val];
            }
            if (obj.length) {
                obj.html(val);
            }
        });

        $(".schrep").show();
        $(".achievement").hide();
        //详情查询成功统计
        _hmt.push(["_trackEvent", "data", "result", subject + "-qs", 1]);

        //layer.alert("<textarea cols=40 rows=8>"+JSON.stringify(result,null,2)+"</textarea>");
    });
};

/**
 * 查看MHK证书列表
 * @param subject
 * @param tab
 * @param token
 */
serv.queryMHKCERTList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};//test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '-q', 1]);
    var url = serv.requestUrl + '/api/cert/list';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code != "0") {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }

        var showFields = rule_list["MHK_ZS"];
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? "style=\"width: 300px;\"" : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        var subjectName = $("#subject").val();
        var title = '中国少数民族汉语水平等级考试(MHK)';
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                //var fieldVal ;
                //if(code=="bkjb"){
                //fieldVal = dict.getLevelName(bean);
                //fieldVal = serv.bkjb(subjectName,bean[code],"");
                //}else{
                var fieldVal = bean[code] ? bean[code] : "--";
                //}

                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });
            _td = $("<td></td>");
            _td.appendTo(_tr);
            _tr.appendTo(achievementTbody);

            bean.type = 2;
            var _tda = $("<a href=#>查看证书</a>");
            _tda.click(function () {
                serv.pdfData(bean);
            });
            _tda.appendTo(_td);

            var down = serv.isDown(bean);
            if (down) {
                var _tda = $("<a href=" + down + " style=margin-left:10px;>下载证书</a>");
                _tda.mouseup(function () {
                    _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
                });
                _tda.appendTo(_td);
            }
        });
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'result', subject + '-qs', 1]);
    });
    return false;
};


/**
 * 查看NIT证书列表
 * @param subject
 * @param tab
 * @param token
 */
serv.queryNITERTList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {"subject": subject, "xm": xm, "sfz": sfz, "verify": verify};//test
    //列表查询统计
    _hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
    _hmt.push(['_trackEvent', 'list', 'click', subject + '-q', 1]);
    var url = serv.requestUrl + '/api/cert/list';
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code != "0") {
            //如果为未登录，则跳转到登录页
            /*if (result.code == 401) {
                goLogin();
                return;
            }*/
            layer.msg(result.message || result.msg);
            return;
        }
        var showFields = rule_list[subject];
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $("<tr style=\"background:rgb(13, 163, 226);color:#FFFFFF;\"></tr>");
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? "style=\"width: 300px;\"" : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        var title = '全国计算机应用水平考试(NIT)';
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);

        $.each(data.list, function (index, bean) {
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal = bean[code] ? bean[code] : "--";
                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });
            _td = $("<td></td>");
            _td.appendTo(_tr);
            _tr.appendTo(achievementTbody);


            bean.type = 2;
            var _tda = $("<a href=\"#\" style=\"padding-right: 10px;\">查看证书</a>");
            _tda.click(function () {
                serv.pdfData(bean);
            });
            _tda.appendTo(_td);

            var down = serv.isDown(bean);
            if (down) {
                var _tda = $("<a href=" + down + " style=margin-left:10px;>下载证书</a>");
                _tda.mouseup(function () {
                    _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
                });
                _tda.appendTo(_td);
            }
        });
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".cjd").hide();
        //列表查询成功统计
        _hmt.push(['_trackEvent', 'list', 'result', subject + '-qs', 1]);
    });
    return false;
};

/**
 * 补办合格证明查看详情
 */
serv.queryReappleBBHGZMResult = function (vid) {

    vid = BASE64.urlsafe_decode(vid);
    var item = vid.split("&");
    var subject, tab, exam, token;
    subject = item[0];
    tab = item[1];
    exam = item[2];
    token = item[3];

    $(".condition").hide(); //隐藏查询条件div
    $(".imgpag").hide(); //隐藏导航
    $(".cjdBtn").hide(); //隐藏返回按钮
    $(".outlogin").hide(); //隐藏用户信息
    $(".cdown").hide(); //隐藏PDF下载按钮
    //serv.queryCetResult(subject,tab,exam,token);
    var par = {};
    par.tab = tab;
    par.token = token;
    par.type = 2;
    par.subject = subject;
    serv.pdfData(par);
};

/**
 * 查询NTCE当次证书列表
 * @returns {boolean}
 */
serv.queryNTCEDCCERTList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify}; //test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", "list", "click", subject + "-q", 1]);
    var url = serv.requestUrl + "/api/cert/dclist";
    //var url = "http://appquerytest.neea.edu.cn/api/cert/dclist";
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        var showFields = rule_list[subject];
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $('<tr style="background:rgb(13, 163, 226);color:#FFFFFF;"></tr>');
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? 'style="width: 300px;"' : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;
        var subjectName = $("#subject").val();
        var hre = "";
        if (subjectName == "NTCE") {
            subjectName = "中小学教师资格考试(NTCE)";
            $("#tit-xm").html(data.xm);
            $("#tit-sfz").html(data.sfz);
        }
        $("#achievement-sn").html(subjectName);
        if (data.list.length > 1) {
            //多条展示列表
            $.each(data.list, function (index, bean) {
                _tr = $("<tr></tr>");
                $.each(showFields, function (code, name) {
                    var fieldVal;
                    if (code == "yxq") {
                        fieldVal = bean[code];
                        _td = $("<td>" + fieldVal + "</td>");
                    } else {
                        fieldVal = bean[code] ? bean[code] : "--";
                        _td = $("<td>" + fieldVal + "</td>");
                    }

                    _td.appendTo(_tr);
                });
                //拼接下载pdf链接
                hre =
                    "&psid=&subjectId=660&subjectCode=NTCE&examId=" +
                    bean.exam_id +
                    "&name=" +
                    bean.xm +
                    "&sfzh=" +
                    bean.sfz +
                    "&zkzh=" +
                    bean.zkzh +
                    "&sf=" +
                    bean.sf +
                    "&bkjb=" +
                    bean.bkjb +
                    "&pdfName=NTCE";
                var href = "http://search.neea.edu.cn/QueryDataAction.do?act=downQueryPdf&pram=certi" + hre;
                var _tdad = $("<a target='_blank' href=\"" + href + '" style="padding-right: 10px;">下载证书</a>');
                _td = $("<td></td>");
                //_tdad.appendTo(_td);
                _td.appendTo(_tr);
                _tr.appendTo(achievementTbody);

                bean.type = 2;
                var _tda = $('<a href="#">查看合格证明</a>');
                _tda.click(function () {
                    serv.pdfData(bean);
                    //serv.queryNTCECERT(bean.subject, bean.tab, bean.exam, bean.token,bean.exam_id);
                });
                _tda.appendTo(_td);

                var down = serv.isDown(bean);
                if (down) {
                    var _tda = $("<a href=" + down + " style=margin-left:10px; target=_ajax>下载合格证明</a>");
                    _tda.mouseup(function () {
                        _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
                    });
                    _tda.appendTo(_td);
                }
            });
            $("#ntcedcback").click(function () {
                    serv.gotoQueryAchievement();
                }
            );

            $(".achievement").show();
            $(".condition").hide();
            $(".schrep").hide();
            $(".cjd").hide();
            $(".imgpag").show();
            //列表查询成功统计
            _hmt.push(["_trackEvent", "list", "CERT", subject + "-qs", 1]);
        } else {
            data.list[0].type = 2;
            //单条展示详情
            serv.pdfData(data.list[0]);
            //隐藏详情步骤图
            $(".imgpag").hide();
            $("#ntcedcback").click(function () {
                    serv.gotoQueryCondition();
                }
            );

        }

    });
    return false;
};
/**
 * 移动端查询NTCE当次证书列表
 * @returns {boolean}
 */
serv.queryNTCEDCCERTListMobile = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify}; //test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", "Mobile-list", "click", subject + "-q", 1]);
    var url = serv.requestUrl + "/api/cert/dclist";
    //var url = "http://appquerytest.neea.edu.cn/api/cert/dclist";
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            layer.msg(result.message || result.msg);
            return;
        }
        var showFields = rule_list[subject];
        var achievementTbodyMobile = $("#achievement-tbody-mobile");
        achievementTbodyMobile.html("");
        var _km, _ul, _li, _lititle, _hi, _xi, _exam, _cz, _kmtitle;

        var data = result.data;
        var subjectName = $("#subject").val();
        var hre = "";
        if (subjectName == "NTCE") {
            subjectName = "中小学教师资格考试(NTCE)";
            $("#tit-xm").html(data.xm);
            $("#tit-sfz").html(data.sfz);
        }
        $("#achievement-sn").html(subjectName);
        if (data.list.length > 1) {
            //多条展示列表
            $.each(data.list, function (index, bean) {
                _ul = $("<ul class='ntcetxtUl'></ul>");
                $.each(showFields, function (code, name) {
                    if (code == "exam") {
                        _km = $("<li class='km'></li>");
                        _km.appendTo(_ul);
                        _kmtitle = $("<li class='km-title bgf'></li>");
                        _kmtitle.appendTo(_km);
                        _hi = $("<li class='title-min bgf'></li>");
                        _hi.appendTo(_kmtitle);
                        _exam = $("<span class='km-title-min'>" + bean[code] + "</span>");
                        _exam.appendTo(_hi);
                        _xi = $("<i>1</i>");
                        _xi.appendTo(_km);
                    } else if (code == "kslb") {
                        _lititle = $("<li class='km-title bgf'><span style='margin-bottom: 2px;'>" + bean[code] + "</span></li>");
                        _hi.before(_lititle);
                    } else {
                        var fieldVal = bean[code] ? bean[code] : "--";
                        _li = $("<li class='ntcetoggle'><span class='ntcecj_l'>" + name + "</span><span class='ntcecj_r'>" + fieldVal + "</span></li>");
                        _li.appendTo(_ul);
                    }
                });
                _cz = $("<li class='ntcetoggle czmake'></li>");
                _cz.appendTo(_ul);
                _ul.appendTo(achievementTbodyMobile);
                //拼接下载pdf链接
                hre =
                    "&psid=&subjectId=660&subjectCode=NTCE&examId=" +
                    bean.exam_id +
                    "&name=" +
                    bean.xm +
                    "&sfzh=" +
                    bean.sfz +
                    "&zkzh=" +
                    bean.zkzh +
                    "&sf=" +
                    bean.sf +
                    "&bkjb=" +
                    bean.bkjb +
                    "&pdfName=NTCE";
                var href = "http://search.neea.edu.cn/QueryDataAction.do?act=downQueryPdf&pram=certi" + hre;
                var _tdad = $("<a target='_blank' href=\"" + href + '" style="padding-right: 10px;">下载证书</a>');

                bean.type = 2;
                var _tda = $('<a class="czlook">查看合格证明</a>');
                _tda.click(function () {
                    serv.pdfData(bean);
                });
                _tda.appendTo(_cz);

                var down = serv.isDown(bean);
                if (down) {
                    var _tda = $("<a href=" + down + " style=margin-left:10px; class=czdown>下载合格证明</a>");
                    _tda.mouseup(function () {
                        _hmt.push(['_trackEvent', 'ecert', 'down', subject + '-d', 1]);
                    });
                    _tda.appendTo(_cz);
                }
            });
            $("#ntcedcback").click(function () {
                serv.gotoQueryAchievement();
            });

            $(".achievement").show();
            $(".condition").hide();
            $(".schrep").hide();
            $(".cjd").hide();
            $(".imgpag").show();
            //列表查询成功统计
            _hmt.push(["_trackEvent", "Mobile-list", "CERT", subject + "-qs", 1]);

            $(".ntcetxtUl").eq(0).children('.ntcetoggle').show();
            $(".ntcetxtUl").eq(0).children('.km').children("i").css({transform: "rotate(135deg)"});
            $(".ntcetxtUl").eq(0).children('.km').children("i").text(2);
            $(".km").on("click", function () {
                $(this).siblings().slideToggle("fast");
                if ($(this).children("i").text() == 1) {
                    $(this).children("i").css({transform: "rotate(135deg)"});
                    $(this).children("i").text(2);
                } else {
                    $(this).children("i").css({transform: "rotate(-45deg)"});
                    $(this).children("i").text(1);
                }
            });
        } else {
            data.list[0].type = 2;
            //单条展示详情
            serv.pdfData(data.list[0]);
            //隐藏详情步骤图
            $(".imgpag").hide();
            $("#ntcedcback").click(function () {
                    serv.gotoQueryCondition();
                }
            );

        }

    });
    return false;
};

/**
 * 查询NCRE当次成绩列表
 * @returns {boolean}
 */
serv.queryNCREDCResultList = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify}; //test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", "dc-list", "click", subject + "-q", 1]);
    var url = serv.requestUrl + "/api/results/dclist";
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            //layer.msg(result.message);
            layer.msg(result.message || result.msg);
            return;
        }
        //var LIST_QUERY_FIELD_DICT = serv.require(serv.listQueryFieldDictUrl);
        //var showFields = LIST_QUERY_FIELD_DICT.rule_list[subject];
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementThead = $("#achievement-thead");
        var achievementTbody = $("#achievement-tbody");
        achievementThead.html("");
        achievementTbody.html("");
        var _tr = $('<tr style="background:rgb(13, 163, 226);color:#FFFFFF;"></tr>');
        var _th, _td;
        $.each(showFields, function (code, name) {
            _th = $("<th " + (code == "exam" ? 'style="width: 300px;"' : "") + ">" + name + "</th>");
            _th.appendTo(_tr);
        });
        _th = $("<th>操作</th>");
        _th.appendTo(_tr);
        _tr.appendTo(achievementThead);

        var data = result.data;

        var subjectName = $("#subject").val();
        var title = "全国计算机等级考试 (NCRE) ";
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);
        $.each(data.list, function (index, bean) {
            var cjddStr = "";
            _tr = $("<tr></tr>");
            $.each(showFields, function (code, name) {
                var fieldVal;
                if (code == "bkjb") {
                    fieldVal = dict.getLevelName(bean); //serv.bkjb(subjectName,bean[code],"");
                } else if (code == "cjdd") {
                    cjddStr = fieldVal = serv.cjdd(subjectName, bean[code], "");
                } else {
                    fieldVal = bean[code] ? bean[code] : "--";
                }

                _td = $("<td>" + fieldVal + "</td>");
                _td.appendTo(_tr);
            });

            if (bean.is_report && bean.xf) {
                //if(cjddStr == '不及格'){
                //var _tda = $("");
                //_td = $("<td>--</td>");
                //_tda.appendTo(_td);
                //}else{
                var _tda = $('<a href="#">查看成绩分析报告</a>');
                _tda.click(function () {
                    //serv.queryNCREResult(bean.subject_id, bean.exam_id, bean.sf, bean.bkjb, bean.xm, bean.zkzh);
                    serv.pdfReport({token: bean.token});
                });
                _td = $("<td></td>");
                _tda.appendTo(_td);
                //}
            }
            if (bean.cuowu) {

                var _tda = $("<p>" + bean.cuowu + "</p>");
                _td = $("<td></td>");
                _tda.appendTo(_td);
            }
            if (!bean.is_report && !bean.cuowu) {
                var _tda = $("");
                _td = $("<td>--</td>");
                _tda.appendTo(_td);
            }
            _td.appendTo(_tr);
            _tr.appendTo(achievementTbody);
        });
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".condition-right").hide();
        //列表查询成功统计
        _hmt.push(["_trackEvent", "dc-list", "result", subject + "-qs", 1]);
    });
    return false;
};
/**
 * 移动端查询NCRE当次成绩列表
 * @returns {boolean}
 */
serv.queryNCREDCResultListMobile = function () {
    if (!serv.checkCondion($("#xm")) || !serv.checkCondion($("#sfz"), true) || !serv.checkVerify()) {
        return false;
    }
    //获取参数
    var subject = $("#subject").val();
    //var xm = $("#_xm").text();
    var xm = $("#xm").val();
    var sfz = $("#sfz").val();
    var verify = $("#verify").val();
    var params = {subject: subject, xm: xm, sfz: sfz, verify: verify}; //test
    //right var params = {"subject": subject, "sfz": sfz, "verify": verify};
    //var params = "subject=" + encodeURIComponent(subject) + "&xm=" + encodeURIComponent(xm) + "&sfz=" + encodeURIComponent(sfz) + "&verify=" + encodeURIComponent(verify);
    //var params = {"subject": encodeURIComponent(subject), "xm": encodeURIComponent(xm), "sfz": encodeURIComponent(sfz), "verify": encodeURIComponent(verify)};
    //111var params = {"subject": encodeURIComponent(subject), "sfz": encodeURICo83mponent(sfz), "verify": encodeURIComponent(verify)};
    //列表查询统计
    _hmt.push(["_setAccount", "dc1d69ab90346d48ee02f18510292577"]);
    _hmt.push(["_trackEvent", "Mobile-dc-list", "click", subject + "-q", 1]);
    var url = serv.requestUrl + "/api/results/dclist";
    var loadIndex = layer.load(0, {shade: 0.1});
    $ajax("post", url, params, true, function (result) {
        layer.close(loadIndex);
        serv.verifys();
        if (!result) {
            layer.msg("获取数据错误！");
            return;
        }
        if (result.code) {
            //如果为未登录，则跳转到登录页
            if (result.code == 401) {
                goLogin();
                return;
            }
            //layer.msg(result.message);
            layer.msg(result.message || result.msg);
            return;
        }
        //var LIST_QUERY_FIELD_DICT = serv.require(serv.listQueryFieldDictUrl);
        //var showFields = LIST_QUERY_FIELD_DICT.rule_list[subject];
        var showFields = rule_list[subject];
        //console.log(code + ":" + name);
        var achievementTbodyMobile = $("#achievement-tbody-mobile");
        achievementTbodyMobile.html("");
        var _km, _zh, _kmtitle, _li, _ul, _exam, _lititle, _xi, _hi, _cz, _td, _tda;

        var data = result.data;

        var subjectName = $("#subject").val();
        var title = "全国计算机等级考试 (NCRE) ";
        $("#tit-xm").html(data.xm);
        $("#tit-sfz").html(data.sfz);
        $("#achievement-sn").html(title);
        $.each(data.list, function (index, bean) {
            var cjddStr = "";
            _ul = $("<ul class='table-small txtUl' style='padding-bottom: 2vmin;'></ul>");
            $.each(showFields, function (code, name) {
                if (code == "exam") {
                    _km = $("<li class='km'></li>");
                    _km.appendTo(_ul);
                    _kmtitle = $("<li class='km-title'></li>")
                    _kmtitle.appendTo(_km);
                    _xi = $("<i>1</i>");
                    _xi.appendTo(_km);
                    _hi = $("<li class='title-min'></li>");
                    _hi.appendTo(_kmtitle);
                    _exam = $("<span class='exam-title-min'>" + bean[code] + "</span>");
                    _exam.appendTo(_hi);
                } else if (code == "cjdd") {
                    var fieldVal1 = serv.cjdd(subjectName, bean[code], "");
                    cjddStr = serv.cjdd(subjectName, bean[code], "");
                    if (fieldVal1 == "及格") {
                        _zh = $("<span class='rank qualified'>" + fieldVal1 + "</span>");
                    } else if (fieldVal1 == "不及格") {
                        _zh = $("<span class='rank unqualified'>" + fieldVal1 + "</span>");
                    } else if (fieldVal1 == "缺考") {
                        _zh = $("<span class='rank miss'>" + fieldVal1 + "</span>");
                    } else if (fieldVal1 == "优秀") {
                        _hg = $("<span class='rank excellent'>" + fieldVal1 + "</span>");
                    } else if (fieldVal1 == "良好") {
                        _hg = $("<span class='rank good'>" + fieldVal1 + "</span>");
                    }
                    _zh.appendTo(_hi);
                } else if (code == "bkjb") {
                    var fieldVal = dict.getLevelName(bean);
                    _lititle = $("<span style='margin-bottom: 2px;'>" + fieldVal + "</span>");
                    _hi.before(_lititle);
                } else {
                    var fieldVal2 = bean[code] ? bean[code] : "--";
                    _li = $("<ol class='toggle'><li class='stext'><span class='lift-t-sec'>" + name + "</span><span class='right-t'>" + fieldVal2 + "</span></li></ol>");
                    _li.appendTo(_ul);
                }
            });

            if (bean.is_report && bean.xf) {
                //if(cjddStr == '不及格'){
                //}else{
                _cz = $("<li class='buttonArea'></li>");
                _tda = $("<a class='button-secondary-tinner'>查看成绩分析报告</a>");
                _tda.click(function () {
                    //serv.queryNCREResult(bean.subject_id, bean.exam_id, bean.sf, bean.bkjb, bean.xm, bean.zkzh);
                    serv.pdfReport({token: bean.token});
                });
                _tda.appendTo(_cz);
                _td = $("<ol class='toggle'></ol>");
                _cz.appendTo(_td);
                _td.appendTo(_ul);
                //}
            }
            if (bean.cuowu) {
                _cz = $("<li class='buttonArea'></li>");
                _tda = $("<span class='msgtext' style='margin-top: 1.5vmin;'>" + bean.cuowu + "</span>");
                //var _tda = $("<p>" + bean.cuowu + "</p>");
                //_td = $("<td></td>");
                //_tda.appendTo(_td);
                _tda.appendTo(_cz);
                _td = $("<ol class='toggle'></ol>");
                _cz.appendTo(_td);
                _td.appendTo(_ul);
            }
            //if (!bean.cuowu && !bean.is_report) {
            //    var _tda = $("");
            //    _td = $("<td>--</td>");
            //    _tda.appendTo(_td);
            //}
            // _td.appendTo(_tr);
            _ul.appendTo(achievementTbodyMobile);
        });
        $(".achievement").show();
        $(".condition").hide();
        $(".schrep").hide();
        $(".condition-right").hide();
        //列表查询成功统计
        _hmt.push(["_trackEvent", "Mobile-dc-list", "result", subject + "-qs", 1]);

        $(".txtUl").eq(0).children('.toggle').show();
        $(".txtUl").eq(0).children('.km').children("i").css({transform: "rotate(135deg)"});
        $(".txtUl").eq(0).children('.km').children("i").text(2);
        $(".km").on("click", function () {
            $(this).siblings().slideToggle("fast");
            if ($(this).children("i").text() == 1) {
                $(this).children("i").css({transform: "rotate(135deg)"});
                $(this).children("i").text(2);
            } else {
                $(this).children("i").css({transform: "rotate(-45deg)"});
                $(this).children("i").text(1);
            }
        });

    });
    return false;
};