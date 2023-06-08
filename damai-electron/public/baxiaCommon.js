baxiaCommon = (function () {
  "use strict";
  var win = window,
    BAXIA_KEY = "__baxia__",
    getStore = function (e, t) {
      var n = win[BAXIA_KEY] || {};
      return e ? n[e] || t : n;
    },
    setStore = function (e, t) {
      (win[BAXIA_KEY] = win[BAXIA_KEY] || {}), (win[BAXIA_KEY][e] = t);
    },
    includes = function (e, t) {
      return !!e && e.indexOf(t) > -1;
    },
    isObjectString = function (e) {
      var t = !0;
      try {
        JSON.parse(e);
      } catch (n) {
        t = !1;
      }
      return t;
    },
    isEmptyObject = function (e) {
      if (!e) return !0;
      for (var t in e) return !1;
      return !0;
    },
    toArray = function (e) {
      for (var t = Array(e.length), n = 0; t.length > n; ++n) t[n] = e[n];
      return t;
    },
    addQueryString = function (e, t, n) {
      return includes(e, t)
        ? e
        : e.indexOf("?") > -1
        ? e + "&" + t + "=" + n
        : e + "?" + t + "=" + n;
    },
    addFormUrlEncoded = function (e, t, n) {
      return includes(e, t) ? e : e + "&" + t + "=" + n;
    },
    isMobile = function () {
      return navigator.userAgent.match(
        /.*(iPhone|iPad|Android|ios|SymbianOS|Windows Phone).*/i
      );
    },
    isRendered = function (e) {
      if (e && !document.getElementById(e.id)) return !1;
      var t = e && e.querySelector(".nc_wrapper"),
        n = e && e.querySelector("._nc");
      return !!t || !!n;
    };
  function addVersionToUrl(e) {
    return getStore("options", {}).addVersionToUrl
      ? !e || endsWith(e, ".js") || endsWith(e, ".css") || includes(e, "_bx-v")
        ? e
        : addQueryString(e, "_bx-v", version)
      : e;
  }
  function endsWith(e, t) {
    return !!e && e.substring(e.length - t.length) === t;
  }
  function formatJsonp(e) {
    return (
      void 0 === e && (e = ""),
      e.substring(e.indexOf("{"), e.lastIndexOf("}") + 1)
    );
  }
  var formatInjectOptions = function (options) {
      if ("string" == typeof options.checkApiPath) {
        var reg_1 = options.checkApiPath + "";
        options.checkApiPath = function (e) {
          return RegExp(reg_1).test(e);
        };
      }
      if (
        ("string" == typeof options.renderTo &&
          (options.renderTo = document.querySelector(options.renderTo)),
        "string" == typeof options.renderNC &&
          (options.renderNC = "true" === options.renderNC),
        "string" == typeof options.awscTimeout &&
          (options.awscTimeout = +options.awscTimeout),
        "string" == typeof options.showCallback)
      ) {
        var _showCallback_1 = options.showCallback + "";
        options.showCallback = function () {
          eval(_showCallback_1);
        };
      }
      if ("string" == typeof options.hideCallback) {
        var _hideCallback_1 = options.hideCallback + "";
        options.hideCallback = function () {
          eval(_hideCallback_1);
        };
      }
      return options;
    },
    isGray = function () {
      var e = document.currentScript && document.currentScript.src;
      if (e && e.indexOf("ratio") > -1) {
        var t = e.match(/ratio=([^&]+)/),
          n = +encodeURIComponent(t && t[1]);
        return Math.random() <= n;
      }
      return !0;
    };
  function getCurrentJSDomain() {
    var e = getCurrentScript(),
      t = e && e.src ? e.src.match(/https\:\/\/([^&]+).alicdn/) : null;
    t ||
      (t = e && e.src ? e.src.match(/https\:\/\/([^&]+).slatic.net/) : [, "g"]);
    var n = t && t[1],
      r = "";
    return (
      -1 ===
        ["laz-g-cdn", "aeis", "assets", "lazada-slatic-g", "lzd-g"].indexOf(
          n
        ) && (n = "g"),
      "lzd-g" === n
        ? (r = "https://" + n + ".slatic.net/g/")
        : ((r = "https://" + n + ".alicdn.com/"),
          "assets" === n && (r += "g/")),
      r
    );
  }
  function getCurrentScript() {
    if (document.currentScript) return document.currentScript;
    var e = null,
      t = document.getElementsByTagName("script"),
      n = null;
    try {
      throw Error();
    } catch (a) {
      var r,
        o = (/.*at [^\(]*\((.*):.+:.+\)$/gi.exec(a.stack) || [!1])[1];
      for (r in t)
        if ((n = t[r]).src == o || "interactive" == n.readyState)
          return (e = t[r]), t[r];
    }
    return e;
  }
  function getDomain(e) {
    var t = e.match(/(https?:\/\/)?((([\w-]+\.)+\w+)|localhost)(:\d{1,5})?/g);
    return (t && t[0]) || "";
  }
  function crossOrigin(e) {
    try {
      return (
        !e ||
        (e.url
          ? (e = e.url)
          : e.href
          ? (e = e.href)
          : "[object Array]" === Object.prototype.toString.call(e) &&
            (e = e[0]),
        "/" !== e.substring(0, 1)
          ? host !== getDomain(e)
          : "//" === e.substring(0, 2) &&
            host !== getDomain(location.protocol + e))
      );
    } catch (t) {
      return log("跨域校验异常，message：" + t, 1, 1), !0;
    }
  }
  var host = location.protocol + "//" + location.host,
    version = "2.5.0",
    loc = location,
    doc = document,
    log = function (e, t, n) {
      (void 0 === t && (t = 1),
      void 0 === n && (n = 0.1),
      0 >= n || Math.random() < n) &&
        _send(
          {
            code: t,
            msg: (e + "").substr(0, 1000) + ";v:" + version,
            pid: "baxia",
            page: loc.href.split(/[#?]/)[0],
            query: loc.search.substr(1),
            hash: loc.hash,
            referrer: doc.referrer,
            title: doc.title,
            ua: navigator.userAgent,
          },
          "//gm.mmstat.com/fsp.1.1?"
        );
    };
  function importantLog(e) {
    log(e, 13, 0.1);
  }
  function veryImportantLog(e) {
    log(e, 16, 1);
  }
  function _send(e, t) {
    var n = [];
    for (var r in e) n.push(r + "=" + encodeURIComponent(e[r]));
    new Image().src = t + n.join("&");
  }
  var addEvent = function (e, t, n, r) {
      if ((void 0 === r && (r = !1), t.addEventListener))
        t.addEventListener(e, n, r);
      else if (t.attachEvent) return t.attachEvent("on" + e, n), !1;
    },
    isSupportedHookProperty = (function () {
      var e = {
        test: "true",
      };
      try {
        return (
          Object.defineProperty(e, "test", {
            enumerable: !1,
            value: e,
          }),
          Object.getOwnPropertyDescriptor(
            XMLHttpRequest.prototype,
            "readyState"
          ) && e.test == e.test
        );
      } catch (t) {
        return !1;
      }
    })(),
    hookFunctionAndArguments = function (e, t, n, r) {
      var o = e[t];
      e[t] = function () {
        var e = toArray(arguments);
        if (n && !r && !1 === n.apply(this, e)) return;
        return r && (e = n.apply(this, e)), o.apply(this, e);
      };
    },
    hookFunction = function (e, t, n) {
      var r = e[t];
      e[t] = function () {
        var e = toArray(arguments);
        if (n && !1 === n.apply(this, e)) return;
        return r.apply(this, e);
      };
    },
    hookProperty = function (e, t, n, r) {
      if (Object.getOwnPropertyDescriptor) {
        var o = Object.getOwnPropertyDescriptor(e, t);
        if ((isSupportedHookProperty && !o) || !o)
          importantLog("错误：不支持 hookProperty");
        else {
          var a = o.set,
            i = o.get;
          isSupportedHookProperty &&
            Object.defineProperty(e, t, {
              set: function () {
                var e = toArray(arguments);
                if (n) {
                  var t = n && n.apply(this, e);
                  e = t ? [t] : e;
                }
                a && a.apply(this, e);
              },
              get: function () {
                var e = i && i.apply(this);
                return r ? r.call(this, e) : e;
              },
            });
        }
      }
    },
    resetReadonlyProperty = function (e, t, n) {
      Object.defineProperty(e, t, {
        writable: !0,
      }),
        (e[t] = n);
    },
    validate = function (e) {
      void 0 === e && (e = "");
      var t = {
          valid: !1,
          type: "",
          checkjs_flag: !1,
        },
        n = {};
      if ("string" != typeof e && "object" != typeof e)
        return (t.valid = !0), t;
      if ("string" == typeof e) {
        if (e.length > 50000) return (t.valid = !0), t;
        if (
          !includes(e, "rgv587_flag") &&
          !includes(e, "RGV587_ERROR::SM") &&
          !includes(e, "CHECKJS_FLAG")
        )
          return (t.valid = !0), t;
        try {
          n = JSON.parse(e);
        } catch (i) {
          try {
            (e = formatJsonp(e)), (n = JSON.parse(e));
          } catch (i) {
            return (t.valid = !0), t;
          }
        }
      } else n = e;
      if (n && n._bx_upgrade_) return (t.valid = !0), t;
      var r,
        o = n && "sm" === n.rgv587_flag && n.url,
        a =
          n &&
          n.ret &&
          n.data &&
          n.ret.indexOf("RGV587_ERROR::SM") &&
          n.data.url;
      return (
        n.CHECKJS_FLAG &&
          n.uuid &&
          n.serid &&
          (log("triggerCheckJsFlag"), (t.checkjs_flag = !0), (r = !0)),
        o || a || r ? t : ((t.valid = !0), t)
      );
    };
  function handleAutoResponse(e) {
    var t = e;
    try {
      if (includes(e, "rgv587_flag:sm") && includes(e, "window._config_")) {
        var n = "";
        (t = e.replace(/\s+/g, "").match(/window\.\_config_\=([^;]+)/)) &&
          t[1] &&
          (n = t[1]),
          ((t = n && JSON.parse(n)).rgv587_flag = "sm"),
          t.url || (t.url = "renderIframe"),
          (t.data = e),
          (t._bx_upgrade_ = "true" === t.isUpgrade);
      }
    } catch (r) {}
    return t;
  }
  var handlerSecdata = [];
  function isBaxiaBlockByCookie() {
    var e = document.cookie.match(/x5secdata=([^;]+)/),
      t = e && e[1];
    return (
      !(!e || document.hidden) &&
      -1 >= handlerSecdata.indexOf(t) &&
      "__bx__" !== t &&
      -1 >= t.indexOf("mtop.") &&
      (clearX5SecData(),
      (!window._config_ || !window._config_.action) &&
        (handlerSecdata.push(t), t))
    );
  }
  function clearCookie(e) {
    var t = new Date();
    t.setTime(t.getTime() + -100);
    var n =
      "x5secdata=;maxAge=-100;expires=" +
      t.toUTCString() +
      ";path=/;domain=" +
      e +
      ";";
    (document.cookie = n), (document.cookie = n + "Secure;SameSite=None");
  }
  function clearX5SecData() {
    try {
      if (-1 >= document.cookie.indexOf("x5secdata")) return;
      var e = location.host,
        t = e.split("."),
        n = t.length > 5 ? 5 : t.length;
      (1 !== n && 2 !== n) || clearCookie(e), (e = t.pop());
      for (var r = 2; n > r; r++) clearCookie((e = "." + t.pop() + "." + e));
    } catch (o) {
      importantLog("x5secdata clear error");
    }
  }
  var XHRPrototype = XMLHttpRequest.prototype,
    _event = null,
    HookBX = function (e) {
      var t = e.done;
      try {
        isSupportedHookProperty &&
          hookProperty(XHRPrototype, "readyState", null, function (e) {
            try {
              var n = e,
                r = this;
              this._onreadystatechange =
                this._onreadystatechange || this.onreadystatechange;
              var o = getResponse(r);
              if (3 !== n || validate(o).valid) {
                if (4 === n && "json" === r.responseType && !validate(o).valid)
                  return void t({
                    response: o,
                    readyState: n,
                    xhr: this,
                    eventKey: "onreadystatechange",
                  });
              } else
                this.onreadystatechange = function (e) {
                  var a = this;
                  (_event = window.event || e || _event),
                    (o = getResponse(r)),
                    t(
                      {
                        response: o,
                        readyState: n,
                        xhr: r,
                        eventKey: "onreadystatechange",
                        event: _event,
                      },
                      function () {
                        a._onreadystatechange !== a.onreadystatechange &&
                          a._onreadystatechange(_event);
                      }
                    );
                };
              return n;
            } catch (a) {
              throw (
                (veryImportantLog(
                  "【Response Step】Xhr readyState error, message: " +
                    a.message +
                    ", stack: " +
                    a.stack
                ),
                Error(a))
              );
            }
          });
      } catch (n) {
        importantLog("Hook xhr readyState error, message:" + n.message);
      }
      hookFunction(XHRPrototype, "send", function () {
        var e = this;
        try {
          this.sendParams = arguments;
          var r = toArray(this.openParams || []);
          if (!crossOrigin(r[1] || ""))
            try {
              this.setRequestHeader("bx-v", version);
            } catch (n) {
              log("xhr添加版本号失败，message：" + n + "，url：" + r[1], 1, 1);
            }
          this._onload || (this._onload = this.onload),
            this.onload &&
              (this.onload = function (e) {
                var n = this;
                _event = window.event || e;
                var r = getResponse(this, function (e) {
                  t(
                    {
                      response: e,
                      readyState: 3,
                      xhr: n,
                      eventKey: "onload",
                    },
                    function () {
                      n._onload && n._onload(_event);
                    }
                  );
                });
                "bx blob handled" !== r &&
                  t(
                    {
                      response: r,
                      readyState: 3,
                      xhr: this,
                      eventKey: "onload",
                    },
                    function () {
                      n._onload && n._onload(_event);
                    }
                  );
              }),
            !isSupportedHookProperty &&
              addEvent("readystatechange", this, function () {
                var n = getResponse(e);
                t({
                  response: n,
                  readyState: e.readyState,
                  xhr: e,
                  eventKey: "readystatechange",
                });
              }),
            this._onloadend || (this._onloadend = this.onloadend),
            this.onloadend &&
              (this.onloadend = function (e) {
                var n = this;
                _event = window.event || e;
                var r = getResponse(this, function (e) {
                  t(
                    {
                      response: e,
                      readyState: 3,
                      xhr: n,
                      eventKey: "onloadend",
                    },
                    function () {
                      n._onloadend && n._onloadend(_event);
                    }
                  );
                });
                "bx blob handled" !== r &&
                  t(
                    {
                      response: r,
                      readyState: 3,
                      xhr: this,
                      eventKey: "onloadend",
                    },
                    function () {
                      n._onloadend && n._onloadend(_event);
                    }
                  );
              });
        } catch (n) {
          throw (
            (veryImportantLog(
              "【Request Step】Xhr send error, message: " +
                n.message +
                ", stack: " +
                n.stack
            ),
            Error(n))
          );
        }
      }),
        hookFunction(XHRPrototype, "setRequestHeader", function (e, t) {
          (this._header_ = this._header_ || {}), (this._header_[e] = t);
        }),
        hookFunctionAndArguments(
          XHRPrototype,
          "open",
          function () {
            try {
              this.openParams = arguments;
              var e = toArray(arguments);
              return (e[1] = addVersionToUrl(e[1])), e;
            } catch (n) {
              throw (
                (veryImportantLog(
                  "【Request Step】Xhr open error, message: " +
                    n.message +
                    ", stack: " +
                    n.stack
                ),
                Error(n))
              );
            }
          },
          !0
        );
    };
  function getResponse(e, t) {
    var n = "";
    try {
      if (
        (n = handleAutoResponse((n = e.response || e.responseText))) instanceof
          Blob &&
        t
      ) {
        if (n.size > 10000) return n;
        var r = new FileReader();
        (r.onload = function () {
          try {
            var e = JSON.parse(this.result);
            t(e);
          } catch (n) {
            t("");
          }
        }),
          r.readAsText(n),
          (n = "bx blob handled");
      }
    } catch (o) {
      n = "";
    }
    return n;
  }
  var doc$1 = document,
    loadJS = function (e, t, n) {
      if (!e) return t();
      var r = doc$1.getElementsByTagName("script")[0],
        o = doc$1.createElement("script");
      if (
        ((o.async = !0),
        (o.src = e),
        e.indexOf("alicdn") > -1 && (o.crossOrigin = !0),
        (o.onerror = function (t) {
          log(
            "function:loadJS. msg:" +
              e +
              "load error。props：" +
              JSON.stringify(n)
          ),
            (o.onerror = null);
        }),
        t)
      ) {
        var a = !1;
        o.onload = o.onreadystatechange = function () {
          a ||
            (o.readyState && !/loaded|complete/.test(o.readyState)) ||
            ((o.onload = o.onreadystatechange = null), (a = !0), t());
        };
      }
      r.parentNode.insertBefore(o, r);
    },
    loadCSS = function (e) {
      var t = document.getElementsByTagName("head")[0],
        n = document.createElement("link");
      (n.type = "text/css"),
        (n.rel = "stylesheet"),
        (n.href = e),
        t.appendChild(n);
    },
    getHandlerPath = function (e, t) {
      return t && t.result && t.result.jsPath
        ? t.result.jsPath
        : "" +
            getStore(
              "cdnPath",
              "https://g.alicdn.com/sd/baxia/" + version + "/"
            ) +
            e +
            ".js";
    },
    _handlerQueue = [],
    pluginInstance,
    handler = function (e, t) {
      void 0 === e && (e = "Xhr"), void 0 === t && (t = {});
      try {
        if (pluginInstance) {
          var n = getStore("options", {});
          return (
            (n.renderTo || n.autoDestroy) && pluginInstance.destroy(),
            pluginInstance.handler(t)
          );
        }
        _handlerQueue.push({
          pluginName: e,
          props: t,
        });
        var r = _handlerQueue[0],
          o = "baxia" + r.pluginName + "Handler",
          a = getHandlerPath(o, r.props);
        loadJS(a, function () {
          if (!pluginInstance) {
            pluginInstance = new window[o]();
            for (var e = 0; _handlerQueue.length > e; e++)
              try {
                pluginInstance.handler(_handlerQueue[e].props);
              } catch (t) {
                (pluginInstance = null),
                  veryImportantLog(
                    "【Handler Step】handler error, type: " +
                      _handlerQueue[e].pluginName +
                      ", action: " +
                      _handlerQueue[e].props.result.action +
                      ", url: " +
                      _handlerQueue[e].props.result.url +
                      ", message:" +
                      t.message +
                      ", stack:" +
                      t.stack
                  );
                break;
              }
            _handlerQueue = [];
          }
        });
      } catch (i) {
        throw (
          ((pluginInstance = null),
          veryImportantLog(
            "【Handler Step】handler error, type: " +
              e +
              ", action: " +
              t.result.action +
              ", url: " +
              t.result.url +
              ", message:" +
              i.message +
              ", stack:" +
              i.stack
          ),
          Error(i))
        );
      }
    };
  function init() {
    try {
      HookBX({
        done: function (e, t) {
          var n = e.response,
            r = e.readyState,
            o = e.xhr,
            a = e.eventKey;
          if ((n || (n = getResponse$1(o)), !o._processing)) {
            var i = validate(n);
            o._processing || 3 > r || i.valid
              ? t && t()
              : ((o._processing = !0),
                "onreadystatechange" === a && (o.onload = o._onload),
                clearX5SecData(),
                handler("Xhr", {
                  result: n,
                  checkJsFlag: i.checkjs_flag,
                  config: {
                    xhr: o,
                    url: o.responseURL,
                    fail: function () {
                      var e = o.onerror || o.onabort || o.ontimeout;
                      e ? e() : (resetReadonlyProperty(o, "status", 500), t());
                    },
                  },
                }));
          }
        },
      });
    } catch (e) {
      importantLog("Hook xhr error, message:" + e.message);
    }
  }
  var xhrPrompt = {
    version: version,
    init: init,
  };
  function getResponse$1(e) {
    var t = "";
    try {
      t = e.response || e.responseText;
    } catch (n) {
      t = "";
    }
    return t;
  }
  function initXHR() {
    var e = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      if (this.addEventListener)
        this.addEventListener("readystatechange", function () {
          if (
            4 === this.readyState &&
            200 === this.status &&
            !this._processing
          ) {
            var e = "";
            try {
              e = handleAutoResponse((e = this.response || this.responseText));
            } catch (t) {
              e = "";
            }
            (validate(e).valid && "" !== e) || handler$1("xhr");
          }
        });
      else if (this.attachEvent) {
        var t = "";
        try {
          t = handleAutoResponse((t = this.response || this.responseText));
        } catch (n) {
          t = "";
        }
        (validate(t).valid && "" !== t) || handler$1("xhr-ie");
      }
      e.apply(this, toArray(arguments));
    };
  }
  function handler$1(e) {
    setTimeout(function () {
      var t = isBaxiaBlockByCookie();
      if (t) {
        var n = new XMLHttpRequest();
        n.open("GET", getPunishUrlBySecData(t, e)), n.send(null);
      }
    }, 500);
  }
  function getPunishUrlBySecData(e, t) {
    return (
      "https://" +
      decodeURIComponent(e).split("__bx__")[1] +
      "/_____tmd_____/punish?reqeust=getpunishpage&source=" +
      t +
      "&x5secdata=" +
      e
    );
  }
  function init$1() {
    try {
      handler$1("cookie"), initXHR();
    } catch (e) {
      importantLog("Hook cookie error, message:" + e.message);
    }
  }
  var cookiePrompt = {
      init: init$1,
    },
    HookBX$1 = function (e) {
      var t = e.done,
        n = window.fetch;
      n &&
        (window.fetch = function () {
          var e = arguments;
          return new window.Promise(function (r, o) {
            var a = e[1] || {};
            if (
              ((a.credentials && "omit" !== a.credentials) ||
                (a.credentials = "same-origin"),
              !crossOrigin(e[0] || ""))
            )
              try {
                e[1] || e[0].url
                  ? ((a.headers = e[1] ? a.headers || {} : e[0].headers || {}),
                    a.headers.has
                      ? a.headers.set("bx-v", version)
                      : (a.headers["bx-v"] = version))
                  : ((e.length = 2),
                    (e[1] = {
                      headers: {
                        "bx-v": version,
                      },
                    }));
              } catch (i) {
                log("fetch添加版本号失败，message：" + i, 1, 1);
              }
            e[0].url
              ? getStore("options", {}).addVersionToUrl &&
                (e[0] = new Request(addVersionToUrl(e[0].url), e[0]))
              : e[0].href
              ? (e[0].href = addVersionToUrl(e[0].href))
              : (e[0] = addVersionToUrl(e[0]));
            n.apply(window, e)
              .then(function (n) {
                try {
                  var s = n.headers.get("content-type");
                  if (
                    (-1 >= s.indexOf("json") && -1 >= s.indexOf("text")) ||
                    s.indexOf("event-stream") > -1
                  )
                    return r(n);
                  n.clone()
                    .text()
                    .then(function (i) {
                      return t
                        ? t({
                            parentConfig: a,
                            parentArguments: e,
                            response: n,
                            data: i,
                            resolve: r,
                            reject: o,
                          })
                        : (r(n), i);
                    })
                    ["catch"](function (e) {
                      o(e);
                    });
                } catch (i) {
                  return r(n);
                }
              })
              ["catch"](function (e) {
                o(e);
              });
          });
        });
    };
  function init$2() {
    try {
      HookBX$1({
        done: function (e) {
          var t = e.parentConfig,
            n = e.parentArguments,
            r = e.response,
            o = e.data,
            a = e.resolve,
            i = e.reject;
          try {
            var s = (o && o.config) || {};
            s && ((s = t).url = (n[0] && (n[0].url || n[0].href)) || n[0]);
            var c = void 0;
            o = handleAutoResponse(o);
            var u = validate(o);
            return u.valid
              ? ((c = s.baxiaData && s.baxiaData.defer) ? c.resolve(r) : a(r),
                o)
              : ((s.baxiaData = {
                  defer: (c = {
                    resolve: a,
                    reject: i,
                  }),
                  response: r,
                }),
                clearX5SecData(),
                handler("Fetch", {
                  result: o,
                  config: s,
                  checkJsFlag: u.checkjs_flag,
                }),
                c.promise);
          } catch (d) {
            throw (
              (veryImportantLog(
                "【Response Step】Fetch response done error, message: " +
                  d.message +
                  ", stack: " +
                  d.stack
              ),
              Error(d))
            );
          }
        },
      });
    } catch (e) {
      importantLog("Hook fetch error, message:" + e.message);
    }
  }
  var fetchPrompt = {
      init: init$2,
    },
    init$3 = function () {
      xhrPrompt.init(), cookiePrompt.init(), fetchPrompt.init();
    },
    CONST_BAXIA_PROMPT_INIT = "baxiaPromptInit",
    CONST_BAXIA_INIT = "baxiaInit",
    CONST_OPTIONS = "options",
    SEA_DOMAIN = /lazada|alibaba.com|aliexpress|localhost/,
    isEffectUrl = function (e, t) {
      if (
        !e ||
        "string" != typeof e ||
        e.indexOf("ynuf.aliapp.org/service/um.json") > -1
      )
        return !1;
      var n = e + t,
        r = getStore("handleEffectUrl", {});
      if ("boolean" == typeof r[e + "fetch"] && "xhr" === t) return !1;
      var o = !1,
        a = getStore(CONST_OPTIONS, {}).checkApiPath;
      return (
        a && a(e) && (o = !0), (r[n] = o), setStore("handleEffectUrl", r), o
      );
    };
  function canSubmit(e) {
    var t = getStore() || {},
      n = t.options,
      r = void 0 === n ? {} : n,
      o = t.ncData,
      a = r.canSubmit;
    if (!r.renderNC) return !0;
    if (a) {
      var i = a(e.url, o);
      return !i && _unVerifiedCallback(), i;
    }
    return !(!o || 0 === o.length) || (_unVerifiedCallback(), !1);
  }
  function _unVerifiedCallback() {
    var e = (getStore() || {}).options;
    (
      (void 0 === e ? {} : e).unVerifiedCallback ||
      function () {
        alert("请先完成验证后再进行操作");
      }
    )();
  }
  var hookRewriteArgumentsAndApply = function (e, t, n) {
      var r = e[t];
      e[t] = function () {
        var e = toArray(arguments);
        n.call(this, e, r);
      };
    },
    getPostUA = function () {
      var e = getStore("postFYModule", {});
      return e && e.getFYToken ? e.getFYToken() : "not_loaded";
    },
    getUA = function () {
      return getPostUA();
    },
    getGetUA = function () {
      var e = getStore("getFYModule", {});
      return e && e.getFYToken ? e.getFYToken() : "not_loaded";
    },
    getUmidToken = function () {
      var e = getStore("getFYModule", {});
      return e && e.getUidToken ? e.getUidToken() : "not_loaded";
    },
    getDefaultLocation = function () {
      var e = document.currentScript ? document.currentScript.src : "";
      return e
        ? e.indexOf("laz-g-cdn") > -1 || e.indexOf("lzd-g.slatic.net")
          ? "sea"
          : includes(e, "assets.")
          ? "us"
          : "cn"
        : "cn";
    },
    emit = {},
    events = getStore("events", {}),
    _emit = {
      on: function (e, t) {
        return (
          (events[e] || (events[e] = [])).push(t),
          setStore("events", events),
          emit
        );
      },
      once: function (e, t) {
        var n = this,
          r = function () {
            t.apply(n, toArray(arguments)), n.off(e, r);
          };
        return this.on(e, r), emit;
      },
      off: function (e, t) {
        if (!e && !t) return (events = {}), emit;
        var n = events[e];
        if (n)
          if (t)
            for (var r = n.length - 1; r >= 0; r--)
              n[r] === t && n.splice(r, 1);
          else delete events[e];
        return emit;
      },
      fire: function (e, t) {
        var n = (events = getStore("events", {}))[e];
        if (n) for (var r = 0, o = (n = n.slice()).length; o > r; r++) n[r](t);
        return emit;
      },
    },
    NC_PARAM_UMIDTOKEN = "bx-umidtoken",
    NC_PARAM_UA = "bx-ua",
    NC_PARAM_ASAC = "bx-asac",
    EVENT_AWSC_READY = "event:awscReady@baxia",
    SubmitType;
  !(function (e) {
    (e[(e.Null = 0)] = "Null"),
      (e[(e.QueryString = 1)] = "QueryString"),
      (e[(e.JSONString = 2)] = "JSONString"),
      (e[(e.FormData = 3)] = "FormData"),
      (e[(e.FormUrlEncoded = 4)] = "FormUrlEncoded"),
      (e[(e.Form = 5)] = "Form"),
      (e[(e.XHRHeader = 6)] = "XHRHeader"),
      (e[(e.FetchHeader = 7)] = "FetchHeader");
  })(SubmitType || (SubmitType = {}));
  var getUA$1 = function (e) {
      return e === SubmitType.QueryString ? getGetUA() : getPostUA();
    },
    addASACParamToRequest = function (e) {
      if (!e) return e;
      var t = getStore("options", {}).asac;
      return t
        ? (e = addParamToRequest(getASACSubmitType(e), e, [
            {
              key: NC_PARAM_ASAC,
              value: t,
            },
          ]))
        : e;
    },
    addNCParamToRequest = function (e) {
      try {
        var t = getNCSubmitType(e),
          n = getUA$1(t),
          r = getUmidToken(),
          o = getStore("options", {}),
          a = o.uabOptions,
          i = void 0 === a ? {} : a,
          s = o.umOptions,
          c = void 0 === s ? {} : s,
          u = [
            {
              key: NC_PARAM_UA,
              value: n,
            },
          ];
        o.needUmidToken &&
          u.push({
            key: NC_PARAM_UMIDTOKEN,
            value: r,
          });
        var d = getStore("ncData");
        d && d.length > 0 && (u = u.concat(d));
        try {
          SEA_DOMAIN.test(location.host) &&
            (i.location ||
              c.location ||
              (console && console.log("umOptions.location not set")),
            (u = u.concat([
              {
                key: "bx-sys",
                value:
                  "ua-l:" +
                  (i.location || "no") +
                  "__um-l:" +
                  (c.serviceLocation || "no") +
                  "__js:" +
                  getCurrentJSDomain(),
              },
            ])));
        } catch (l) {}
        e = addParamToRequest(t, e, u);
      } catch (l) {
        log("addParamToRequest:" + l.message);
      }
      return e;
    },
    getNCSubmitType = function (e) {
      var t = getCustomSubmitType(e);
      if (t) return t;
      var n = e.params;
      return (
        isObjectString(n)
          ? (t = SubmitType.JSONString)
          : n instanceof FormData
          ? (t = SubmitType.FormData)
          : "string" == typeof n && n.indexOf("=") > -1
          ? (t = SubmitType.FormUrlEncoded)
          : n instanceof HTMLFormElement && (t = SubmitType.Form),
        t
      );
    },
    getASACSubmitType = function (e) {
      return getCustomSubmitType(e) || SubmitType.QueryString;
    },
    getCustomSubmitType = function (e) {
      var t = getStore("options", {}).appendTo,
        n = null;
      return (
        "header" === t
          ? e.request && (e.request instanceof XMLHttpRequest || e.request.send)
            ? (n = SubmitType.XHRHeader)
            : e.request &&
              "object" == typeof e.request &&
              (n = SubmitType.FetchHeader)
          : ("get" !== e.method && "querystring" !== t) ||
            (n = SubmitType.QueryString),
        n
      );
    };
  function preRequest(e) {
    var t = getStore("options", {}),
      n = t.asac,
      r = t.awscTimeout,
      o = Math.random() + "".substring(1, 10),
      a = EVENT_AWSC_READY + o;
    if (
      (_emit.once(a, function (e) {
        e.isAppend() ||
          (n && (e = addASACParamToRequest(e)), (e = addNCParamToRequest(e))),
          canSubmit(e) ? e.process(e) : e.canNotSubmit && e.canNotSubmit();
      }),
      !isAwscReady())
    ) {
      var i = setInterval(function () {
          isAwscReady() &&
            (clearInterval(i), clearTimeout(s), _emit.fire(a, e));
        }, 200),
        s = setTimeout(function () {
          clearInterval(i), _emit.fire(a, e);
        }, r + 200);
      return e;
    }
    _emit.fire(a, e);
  }
  function isAwscReady() {
    var e = getStore("options", {}).needUmidToken,
      t = getUmidToken();
    return !(
      (e &&
        (-1 !== t.indexOf("defaultToken1") ||
          -1 !== t.indexOf("defaultToken3"))) ||
      (!getStore("getFYModule") && !getStore("postFYModule"))
    );
  }
  function addParamToRequest(e, t, n) {
    switch (e) {
      case SubmitType.XHRHeader:
        addParam(t.params, n, function (e) {
          t.request.setRequestHeader(e.key, e.value);
        });
        break;
      case SubmitType.FetchHeader:
        var r = t.headers || {};
        addParam(t.params, n, function (e) {
          var t = e.key,
            n = e.value;
          r.append ? r.append(t, n) : (r[t] = n);
        }),
          (t.headers = r);
        break;
      case SubmitType.Form:
        addParam(t.params, n, function (e) {
          addInput(t.params, e.key, e.value);
        });
        break;
      case SubmitType.QueryString:
        addParam(t.params, n, function (e) {
          t.url = addQueryString(t.url, e.key, encodeURIComponent(e.value));
        });
        break;
      case SubmitType.FormUrlEncoded:
        addParam(t.params, n, function (e) {
          t.params = addFormUrlEncoded(t.params, e.key, e.value);
        });
        break;
      case SubmitType.FormData:
        addParam(t.params, n, function (e) {
          t.params.append(e.key, e.value);
        });
        break;
      case SubmitType.JSONString:
        var o = t.params ? JSON.parse(t.params) : {};
        addParam(o, n, function (e) {
          o[e.key] = e.value;
        }),
          (t.params = JSON.stringify(o));
    }
    return t;
  }
  function addParam(e, t, n) {
    for (var r = t.length, o = 0; r > o; o++) n(t[o]);
    return e;
  }
  function addInput(e, t, n) {
    var r = document.createElement("input");
    (r.type = "hidden"), (r.name = t), (r.value = n), e.appendChild(r);
  }
  var initFetch = function () {
      try {
        var e = window.fetch;
        if (!e) return;
        window.fetch = function () {
          var t = arguments;
          return new window.Promise(function (n, r) {
            var o = t[0],
              a = t[1] || {},
              i = function () {
                e.apply(window, t)
                  .then(function (e) {
                    return n(e);
                  })
                  ["catch"](function (e) {
                    r(e);
                  });
              };
            if ("string" != typeof o) return i();
            if (!isEffectUrl(o, "fetch")) return i();
            var s = a.headers,
              c = a.body,
              u = void 0 === c ? "{}" : c,
              d = a.method;
            preRequest({
              url: o,
              params: u,
              method: void 0 === d ? "get" : d,
              headers: s,
              request: {},
              isAppend: function () {
                return (
                  !(!s || !s["bx-ua"]) ||
                  !!(s && s.has && s.has("bx-ua")) ||
                  ("string" == typeof u
                    ? u && u.indexOf("bx-ua") > -1
                    : u && u.has && u.has("bx-ua"))
                );
              },
              process: function (e) {
                var n = e.headers,
                  r = e.params;
                (t[0] = e.url),
                  isEmptyObject(n) || (a.headers = n),
                  r && "{}" !== r && (a.body = r),
                  (t[1] = a),
                  i();
              },
            });
          });
        };
      } catch (t) {
        importantLog("fetch token" + t.message);
      }
    },
    XHRPrototype$1 = XMLHttpRequest.prototype,
    initXhr = function () {
      try {
        hookRewriteArgumentsAndApply(XHRPrototype$1, "send", function (e, t) {
          var n = this;
          if (!this.effectUrl || this.handleToken) return t.apply(this, e);
          (this.handleToken = !0),
            preRequest({
              url: this.effectUrl,
              request: this,
              params: e[0],
              headers: null,
              isAppend: function () {
                return n.appended;
              },
              process: function (e) {
                t.call(n, e.params);
              },
            });
        }),
          hookFunctionAndArguments(
            XHRPrototype$1,
            "open",
            function () {
              var e = toArray(arguments),
                t = e[1];
              if (!isEffectUrl(t, "xhr") || this.effectUrl)
                return (this.appended = !0), e;
              this.effectUrl = e[1];
              var n = getStore("options", {}).appendTo,
                r = (e[0] + "").toLocaleLowerCase();
              return "header" === n
                ? e
                : (("querystring" !== n && "get" !== r) ||
                    (t = addNCParamToRequest({
                      url: t,
                      method: r,
                      request: null,
                      params: null,
                      headers: null,
                    }).url),
                  (t = addASACParamToRequest({
                    url: t,
                    request: null,
                    params: null,
                    headers: null,
                  }).url),
                  (e[1] = t),
                  e);
            },
            !0
          );
      } catch (e) {
        importantLog("xhr token" + e.message);
      }
    },
    initJsonp = function () {
      var e = HTMLScriptElement.prototype;
      hookFunctionAndArguments(
        e,
        "setAttribute",
        function () {
          var e = toArray(arguments),
            t = e[1];
          "src" === e[0] &&
            isEffectUrl(t, "script") &&
            preRequest({
              url: t,
              method: "get",
              request: {},
              isAppend: function () {
                return t && t.indexOf("bx-ua") > -1;
              },
              process: function (t) {
                e[1] = t.url;
              },
            });
          return e;
        },
        !0
      ),
        hookProperty(e, "src", function (e) {
          isEffectUrl(e, "script") &&
            (preRequest({
              url: e,
              method: "get",
              request: {},
              isAppend: function () {
                return e && e.indexOf("bx-ua") > -1;
              },
              process: function (t) {
                e = t.url;
              },
            }),
            e.indexOf("bx-ua") > -1 ||
              (e = addQueryString(e, "bx-ua", "fast-load")));
          return e;
        });
    },
    initForm = function () {
      try {
        var e = !1,
          t = function (t) {
            if ("submit" === t.type) {
              var n = t.target || t.srcElement,
                r = n.getAttribute("action") || location.href;
              if (!isEffectUrl(r, "form")) return;
              if (!0 === e) return void t.preventDefault();
              (e = t.formSubmit),
                preRequest({
                  url: r,
                  params: n,
                  headers: {},
                  request: {},
                  isAppend: function () {
                    return !!n["bx-ua"];
                  },
                  canNotSubmit: function () {
                    t.preventDefault();
                  },
                  process: function (e) {
                    var t = e.url;
                    r !== t && n.setAttribute("action", t);
                  },
                });
            }
          };
        addEvent("submit", document, t);
        var n = window.HTMLFormElement;
        n &&
          hookFunction(n.prototype, "submit", function () {
            (e = !1),
              t({
                type: "submit",
                target: this,
                formSubmit: !0,
                preventDefault: function () {
                  throw "未完成验证";
                },
              });
          });
      } catch (r) {
        importantLog("form token" + r.message);
      }
    },
    init$4 = function () {
      var e = getStore(CONST_OPTIONS, {});
      initGetAWSC(e),
        initPostAWSC(e),
        initFetch(),
        initXhr(),
        initForm(),
        initJsonp();
    };
  function initPostAWSC(e) {
    var t = window.AWSC,
      n = e.uabOptions || {};
    (n.location = n.location || getDefaultLocation()),
      t.configFYEx(
        function (e) {
          setStore("postFYModule", e);
        },
        n || {},
        e.awscTimeout
      );
  }
  function initGetAWSC(e) {
    var t = window.AWSC,
      n = e.uabOptions || {};
    (n.MaxMTLog = n.MaxMTLog || 20),
      (n.MaxNGPLog = n.MaxNGPLog || 10),
      (n.MaxKSLog = n.MaxKSLog || 5),
      (n.MaxFocusLog = n.MaxFocusLog || 3),
      (n.location = n.location || getDefaultLocation()),
      t.configFYEx(
        function (e) {
          setStore("getFYModule", e);
        },
        n || {},
        e.awscTimeout
      );
  }
  var noCaptcha = null,
    isMobile$1 = isMobile(),
    renderNC = function (e) {
      if (
        ((e.renderNC = e.renderNC || location.search.indexOf("renderNC") > -1),
        e.renderNC)
      )
        if (isRendered(e.renderTo)) console.log("已经渲染或者 DOM 元素不存在");
        else {
          var t = "";
          e.cssLink && loadCSS(e.cssLink),
            isMobile$1
              ? ((t = "register_h5"),
                loadJS("//g.alicdn.com/sd/nch5/index.js", function () {
                  (noCaptcha = window.NoCaptcha),
                    (i.bannerHidden = !1),
                    noCaptcha.init(i),
                    noCaptcha.setEnabled(!0);
                }))
              : ((t = "register"),
                loadJS("//g.alicdn.com/sd/ncpc/nc.js", function () {
                  noCaptcha = new window.noCaptcha(i);
                }));
          var n = e.verifiedCallback,
            r = e.showCallback,
            o = e.ncAppkey,
            a = e.ncToken,
            i = {
              renderTo: "#" + e.renderTo.id,
              appkey: void 0 === o ? "NCAPPKEY" : o,
              token: void 0 === a ? "NCTOKENSTR" : a,
              bannerHidden: !1,
              scene: t,
              replaceCallback: function (e, t, r) {
                var o,
                  a = [];
                isMobile$1
                  ? (o = r.bind(this, "ok"))
                  : ((o = e.success), (t = e.data)),
                  a.push({
                    key: "bx-nc-ua",
                    value: t.n,
                  }),
                  setStore("ncData", a),
                  setStore("ncSlideData", t),
                  o({
                    success: !0,
                    result: {
                      code: 0,
                    },
                  }),
                  n && n();
              },
              language: e.ncLanguage,
            };
          r && r();
        }
    },
    NC = {
      reset: function () {
        if (isMobile$1) return noCaptcha.reset();
        noCaptcha.reload();
      },
      show: function () {
        noCaptcha.show();
      },
      hide: function () {
        noCaptcha.hide();
      },
      setTrans: function (e) {
        noCaptcha.setTrans(e);
      },
      upLang: function (e, t) {
        noCaptcha.upLang(e, t);
      },
    },
    _isGray = isGray();
  !getStore(CONST_BAXIA_PROMPT_INIT) &&
    _isGray &&
    (setStore(CONST_BAXIA_PROMPT_INIT, !0), init$3());
  var init$5 = function (e) {
      void 0 === e && (e = {}),
        _isGray &&
          (((e = formatInjectOptions(e)).awscTimeout = e.awscTimeout || 3000),
          setStore(CONST_OPTIONS, e),
          renderNC(e),
          getStore(CONST_BAXIA_INIT) ||
            (setStore(CONST_BAXIA_INIT, !0), e.checkApiPath && init$4()));
    },
    BaxiaCommon = (function () {
      return function (e) {
        (this.set = setStore),
          (this.version = version),
          (this.getUA = getUA),
          (this.NC = NC),
          init$5(e);
      };
    })();
  return (
    (BaxiaCommon.set = setStore),
    (BaxiaCommon.version = version),
    (BaxiaCommon.getUA = getUA),
    (BaxiaCommon.NC = NC),
    (BaxiaCommon.init = function (e) {
      void 0 === e && (e = {}), (e.needUmidToken = !0), init$5(e);
      return;
    }),
    log("i,c", 11, 0.01),
    BaxiaCommon
  );
})();
