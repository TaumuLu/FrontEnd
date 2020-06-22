// 加载完成执行
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        };
    }
}

// 重复bind函数
Function.prototype.bind = function () {
    var shift = Array.prototype.shift
    var slice = Array.prototype.slice
    var concat = Array.prototype.concat
    var self = this.self || this;
    var context = shift.call(arguments)
    var args = slice.call(arguments)
    var bindFunc = function() {
        return self.apply(context, concat.call(args, slice.call(arguments)))
    }
    bindFunc.self = this
    return bindFunc
}

// 获取后缀
String.prototype.getSuffix = function(hasDot) {
    var sign = '.'
    var list = this.split(sign)
    var suffix = list.pop()
    if (hasDot) {
        return sign + suffix
    }
    return suffix
}

// 格式化日期
function formatDate(fDate, separator) {
    fDate = fDate || new Date();
    separator = separator || '-'
    const dateList = [
        fDate.getFullYear(),
        (fDate.getMonth() + 1).toString().replace(/(^\d{0,1}$)/g, '0$&'),
        fDate.getDate().toString().replace(/(^\d{0,1}$)/g, '0$&'),
    ];
    return dateList.join(separator);
}

// 获取地址栏查询参数
function parseSearch(decode) {
    var search = window.location.search;
    search = search.replace(/^\?/, "");
    if (search === "") return {};
    var split_array = search.split("&");
    var size = split_array.length;
    var search_param = {};
    for (var i = 0; i < size; i++) {
        var temp = split_array[i];
        var param = temp.split("=");
        var param_name = param[0];
        var param_value = param[1];
        search_param[param_name] = decode ? window.decodeURIComponent(param_value) : param_value;
    }
    return search_param;
}

// 分块数组
const getChunkList = (list, size = 2) => {
    if (list.length === 0) return []
    const chunk = [list.slice(0, size)]
    const remain = list.slice(size)
    const nextChunk = getChunkList(remain, size)
    return chunk.concat(nextChunk)
}

// 秒整转换分时天
function switchTime(value, unit = 1, reInfo = {}) {
    if (unit === 3 && value % 24 === 0) {
        return { unit: 'day', time: value / 24 };
    } else if (value % 60 === 0) {
        switch (unit) {
            case 1:
                return switchTime(value / 60, unit + 1, { unit: 'minute', time: value / 60 });
            case 2:
                return switchTime(value / 60, unit + 1, { unit: 'time', time: value / 60 });
        }
    } else if (unit === 1) {
        return { unit: 'second', time: value };
    }
    return reInfo;
}

// 二进制文件下载
var blob = new Blob([res.data], {type: "application/vnd.ms-excel"}),
    fileName = '下载.xls';
function downFile(blob, fileName) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
    } else {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }
}


const getType = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

const toArray = (path, separator = '.') => {
  const type = getType(path)
  return type === 'Array' ? path : path.split(separator)
}

// 归并取对象深层值
const get = (object, path, defaultValue) => {
  const pathArray = toArray(path)

  return pathArray.reduce((obj, key) => {
    return (obj && obj[key]) ? obj[key] : null
  }, object) || defaultValue
}

// 归并设置对象深层值
const set = (object, path, value) => {
  const pathArray = toArray(path)
  const len = pathArray.length

  return pathArray.reduce((obj, key, ind) => {
    if (obj && ind === len - 1) {
      obj[key] = value
    }
    return obj ? obj[key] : null
  }, object)
}

// 图片转base64
function getBase64(img) { // 传入图片路径，返回base64
  function getBase64Image(image, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width || image.width;
    canvas.height = height || image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL();
    return dataURL;
  }
  return new Promise((resolve, reject) => {
    if (img) {
      const image = new Image();
      image.crossOrigin = '';
      image.src = img;
      image.onload = function (e) {
        console.log(e, image);
        resolve(getBase64Image(image));// 将base64传给done上传处理
      };
    } else {
      reject(img);
    }
  });
}

getBase64(imgUrl).then((base64) => {
  console.log(base64.length);
}, (err) => {
  console.log(err);
});

// 计算样式
function getStyle(element, attr) {
    if (element.currenStyle) {
        return element.currenStyle[attr];
    } else {
        return window.getComputedStyle(element, false)[attr];
    }
}

// 计算元素上下左右
function getBoundingClientRect(ele) {
    if (typeof arguments.callee.offst != 'number') {
        var scrollTop = document.documentElement.scrollTop;
        var temp = document.createElement('div');
        temp.style.cssText = "position:absolute;top:0;left:0;";
        document.body.appendChild(temp);
        arguments.callee.offset = -temp.getBoundingClientRect().top;
        document.body.removeChild(temp);
        temp = null;
    }
    var rect = ele.getBoundingClientRect();
    var offset = arguments.callee.offset;
    return {
        left: rect.left + offset,
        right: rect.right + offset,
        top: rect.top + offset,
        bottom: rect.bottom + offset
    };
}

// 计算元素页面偏移
function getOffset(ele) {
    var top = ele.offsetTop,
        left = ele.offsetLeft,
        oParent = ele.offsetParent;
    while (oParent !== null) {
        top += oParent.offsetTop;
        left += oParent.offsetLeft;
        oParent = oParent.offsetParent;
    }
    return {
        top,
        left
    };
}

// 计算速度
function speed(element, json) {
    var start = {},
        end = {};
    for (var name in json) {
        start[name] = parseFloat(getComputedStyle(element, false)[name]);
        // switch(name){
        //     case 'left':
        //         start[name]=element.offsetLeft;
        //     break;
        //     case 'top':
        //         start[name]=element.offsetTop;
        //     break;
        // }
        // debugger;
        // console.log(start[name]);
        end[name] = json[name] - start[name];
    }
    var con = 10,
        n = 0;
    clearInterval(element.timer);
    element.timer = setInterval(function() {
        n++;
        for (var name in json) {
            var a = n / con;
            var cur = start[name] + end[name] * a;
            element.style[name] = cur + 'px';
        }
        if (n == con) {
            clearInterval(element.timer);
        }
    }, 25);
}

// 转化为驼峰式
function camelCase(str) {
    // var str = "my-string-example";
    return str.split('-').map((value) => {
        return value.charAt(0).toUpperCase() + value.substr(1);
    }).join('');
}

// 数组去重
function uniq(arr) {
    let reArr = [],
        len = arr.length;

    for (let i = 0; i < len; i++) {
        k = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[i] === arr[j]) {
                ++i;
            }
        }
        if (!reArr.includes(arr[i])) {
            reArr.push(arr[i]);
        }
    }
    return reArr;
}

// 数组slice实现原理
Array.prototype.slice = function(start, end) {
    var result = new Array(),
        start = start || 0,
        // this指向调用的对象，当用了call后，改变this的指向
        end = end || this.length;
    for (var i = start; i < end; i++) {
        result.push(this[i]);
    }
    return result;
};

// 非构造函数深拷贝
function deepCopy(obj, clo) {　　　　
    var clo = clo || {};　　　　
    for (var i in obj) {　　　　　　
        if (typeof obj[i] === 'object') {　　　　　　　　
            clo[i] = (obj[i].constructor === Array) ? [] : {};　　　　　　　　
            deepCopy(obj[i], clo[i]);　　　　　　
        } else {　　　　　　　　　
            clo[i] = obj[i];　　　　　　
        }　　　　
    }　　　　
    return clo;　　
}

// Polyfill代码，bind函数。
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            // 与 ECMAScript 5 最接近的
            // 内部 IsCallable 函数
            throw new TypeError(
                "Function.prototype.bind - what is trying " +
                "to be bound is not callable"
            );
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(
                    (
                        this instanceof fNOP && oThis ? this : oThis
                    ),
                    aArgs.concat(
                        Array.prototype.slice.call(arguments)
                    )
                );
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

// 软绑定
if (!Function.prototype.softBind) {
    Function.prototype.softBind = function(obj) {
        var fn = this;
        // 捕获所有 curried 参数
        var curried = Array.prototype.slice.call(arguments, 1);
        var bound = function() {
            return fn.apply(
                (!this || this === (window || global)) ?
                obj : this,
                curried.concat.apply(curried, arguments)
            );
        };
        bound.prototype = Object.create(fn.prototype);
        return bound;
    };
}

// 简单bind函数
function bind(fn, context) {
    return function() {
        return fn.apply(context);
    };
}
// 复杂bind函数
function bind(fn, context) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function() {
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArgs = args.concat(innerArgs);
        return fn.apply(context, finalArgs);
    };
}
// 通用函数柯里化
function curry(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArgs = args.concat(innerArgs);
        return fn.apply(null, finalArgs);
    };
}

// 类/ID选择器
var $$ = function(selector) {
    var cl, id, ele,
        arrEle = [];
    if (/^\./.test(selector)) {
        cl = selector.replace(".", "");
        ele = document.getElementsByTagName("*");
        var len = ele.length;
        for (var i = 0; i < len; i++) {
            var name = ele[i].className,
                arrName = [];
            if (name) {
                arrName = name.split(" ");
                var arrlen = arrName.length;
                for (var j = 0; j < arrlen; j++) {
                    if (arrName[j] === cl) {
                        arrEle.push(ele[i]);
                    }
                }
            }
        }
    } else if (/^#/.test(selector)) {
        id = selector.replace("#", "");
        ele = document.getElementById(id);
        if (ele) {
            arrEle.push(ele);
        }
    }
    return arrEle;
};

// 判断鼠标进入方向
function mouseDir(e) {
    // jQuery 判断
    var w = $(this).width();
    var h = $(this).height();
    var x = (e.pageX - this.getBoundingClientRect().left - (w / 2)) * (w > h ? (h / w) : 1);
    var y = (e.pageY - getBoundingClientRect(this).top - (h / 2)) * (h > w ? (w / h) : 1);
    var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
    console.log(direction);

    // 原生判断
    var tar = event.target || event.srcElement,
        eventType = event.type,
        offsetW = tar.offsetWidth,
        offsetH = tar.offsetHeight,
        offsetL = tar.offsetLeft,
        offsetT = tar.offsetTop,
        dirName = ['上', '右', '下', '左'],
        dirX = (event.clientX - offsetL - (offsetW / 2)) * (offsetW > offsetH ? (offsetH / offsetW) : 1),
        dirY = (event.clientY - offsetT - (offsetH / 2)) * (offsetH > offsetW ? (offsetW / offsetH) : 1),
        direction = Math.round((((Math.atan2(dirY, dirX) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
    console.log(dirName[direction]);
}

//上传图片预览
function handleFiles(files, parDom) {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /^image\//;

        if (!imageType.test(file.type)) {
            continue;
        }
        var img = document.createElement("img");
        img.classList.add("obj");
        img.file = file;

        parDom.appendChild(img);
        var reader = new FileReader();
        reader.onload = (function(aImg) {
            return function(e) {
                aImg.src = e.target.result;
            };
        })(img);
        reader.readAsDataURL(file);
    }
}


// 进入全屏
function fullScreen() {
    var el = document.documentElement;
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    } else if (typeof window.ActiveXObject != "undefined") {
        // for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}
// 退出全屏
function exitFullScreen() {
    var el = document,
        cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
        wscript;
    if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
        return;
    }
    if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}



//js分页实现
/**
 * js分页实现
 * @param  {[number]} currentPage [初始页]
 * @param  {[number]} pageCount   [总页数]
 * @param  {[Dom]} parentDom   [父级Dom]
 * @param  {[Function]} callBack   [点击触发函数，传入页码]
 * @return {[null]}             [null]
 */
function paging(currentPage, pageCount, parentDom, callBack) {
    var pageClick;
    // 根据传入页数判断如何生成分页
    queuePage(currentPage);
    // 生成页面
    function generatePage(startPage, endPage, ind) {
        var pageHtml = "<ul class='bottomPage'><a class='pageFirst'>首页</a><a class='pagePrev'>上一页</a>";
        for (var i = startPage; i <= endPage; i++) {
            pageHtml += "<li>" + i + "</li>";
        }
        pageHtml += "<a class='pageNext'>下一页</a><a class='pageLast'>末页</a><input type='text' class='jumpInput'><a class='jumpBtn'>跳转</a></ul>";
        $(parentDom).html(pageHtml);
        // $('.bottomPage').css();
        pageClick = parseInt($(".bottomPage li").eq(ind).text());
        $(".bottomPage li").eq(ind).css({ "background-color": "#5c95c1", "color": "#fff", "border-color": "#5c95c1" });
    }
    // 点击指定页
    $(document).off('click', '.bottomPage li');
    $(document).on('click', '.bottomPage li', function() {
        var pageNum = parseInt($(this).text());
        if (pageNum == pageClick) return;
        queuePage(pageNum);
        // 传入当前触发页数给回调函数
        if (callBack) {
            callBack(pageClick);
        }
        console.log(pageClick);
    });
    // 跳转指定页
    $(document).off('click', '.bottomPage .jumpBtn');
    $(document).on('click', '.bottomPage .jumpBtn', function() {
        var pageNum = parseInt($('.bottomPage .jumpInput').val());
        if (pageNum == pageClick) return;
        if (/^[1-9]\d*$/.test(pageNum) && pageNum <= pageCount) {
            queuePage(pageNum);
        } else {
            alert('请输入正确的数字');
        }
        // 传入当前触发页数给回调函数
        if (callBack) {
            callBack(pageClick);
        }
        console.log(pageClick);
    });
    //点击上一页触发
    $(document).off('click', '.bottomPage .pagePrev');
    $(document).on('click', '.bottomPage .pagePrev', function(e) {
        e.preventDefault();
        var pageNum = parseInt(pageClick) - 1 <= 0 ? 1 : parseInt(pageClick) - 1;
        if (pageNum == pageClick) return;
        queuePage(pageNum);
        // 传入当前触发页数给回调函数
        if (callBack) {
            callBack(pageClick);
        }
        console.log(pageClick);
    });
    //点击下一页触发
    $(document).off('click', '.bottomPage .pageNext');
    $(document).on('click', '.bottomPage .pageNext', function(e) {
        e.preventDefault();
        var pageNum = parseInt(pageClick) + 1 > pageCount ? pageCount : parseInt(pageClick) + 1;
        if (pageNum == pageClick) return;
        queuePage(pageNum);
        // 传入当前触发页数给回调函数
        if (callBack) {
            callBack(pageClick);
        }
        console.log(pageClick);
    });
    // 点击跳转至首页
    $(document).off('click', '.bottomPage .pageFirst');
    $(document).on('click', '.bottomPage .pageFirst', function(e) {
        e.preventDefault();
        if (pageClick == 1) return;
        if (pageCount > 5) {
            generatePage(1, 5, 0);
        } else {
            generatePage(1, pageCount, 0);
        }
        // 传入当前触发页数给回调函数
        if (callBack) {
            callBack(pageClick);
        }
        console.log(pageClick);
    });
    // 点击跳转至末页
    $(document).off('click', '.bottomPage .pageLast');
    $(document).on('click', '.bottomPage .pageLast', function(e) {
        e.preventDefault();
        if (pageClick == pageCount) return;
        if (pageCount > 5) {
            generatePage(pageCount - 4, pageCount, 4);
        } else {
            generatePage(1, pageCount, pageCount - 1);
        }
        // 传入当前触发页数给回调函数
        if (callBack) {
            callBack(pageClick);
        }
        console.log(pageClick);
    });
    /**
     * 判断对应页面生成
     * @param  {[number]} pageNum [传入点击的页码]
     * @return {[null]}         [null]
     */
    function queuePage(pageNum) {
        if (pageCount > 5) {
            switch (pageNum) {
                case 1:
                    generatePage(1, 5, 0);
                    break;
                case 2:
                    generatePage(1, 5, 1);
                    break;
                case pageCount - 1:
                    generatePage(pageCount - 4, pageCount, 3);
                    break;
                case pageCount:
                    generatePage(pageCount - 4, pageCount, 4);
                    break;
                default:
                    generatePage(pageNum - 2, pageNum + 2, 2);
                    break;
            }
        } else {
            generatePage(1, pageCount, pageNum - 1);
        }
    }
}

// 对比是否相等
equalFunc: function(val1, val2) {
    var type1 = Object.prototype.toString.call(val1).slice(8, -1),
        type2 = Object.prototype.toString.call(val2).slice(8, -1);
    if (type1 === type2) {
        var flag = true;;
        if (type1.toLowerCase() === 'array') {
            var testArr = new Array();
            if (val1.length !== val2.length) return false;
            val1.forEach(function(val, ind) {
                val2.forEach(function(v, i) {
                    if (v === val) {
                        testArr.push(true);
                    }
                })
            })
            if (testArr.length !== val1.length) return false;
        } else if (type1.toLowerCase() === 'object') {
            var key1 = Object.keys(),
                key2 = Object.keys();
            if (key1.length !== key2.length) return false;
            key1.forEach(function(val, ind) {
                if (val1[val] !== val2[val]) flag = false;
            })
        }
        return flag;
    } else {
        throw new Error('类型不同');
    }
}

/*
 * object.watch v0.0.1: Cross-browser object.watch
 *
 * By Elijah Grey, http://eligrey.com
 *
 * A shim that partially implements object.watch and object.unwatch
 * in browsers that have accessor support.
 *
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch
if (!Object.prototype.watch)
    Object.prototype.watch = function(prop, handler) {
        var oldval = this[prop],
            newval = oldval,
            getter = function() {
                return newval;
            },
            setter = function(val) {
                oldval = newval;
                return newval = handler.call(this, prop, oldval, val);
            };
        if (delete this[prop]) { // can't watch constants
            if (Object.defineProperty) // ECMAScript 5
                Object.defineProperty(this, prop, {
                get: getter,
                set: setter
            });
            else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
                Object.prototype.__defineGetter__.call(this, prop, getter);
                Object.prototype.__defineSetter__.call(this, prop, setter);
            }
        }
    };

// object.unwatch
if (!Object.prototype.unwatch)
    Object.prototype.unwatch = function(prop) {
        var val = this[prop];
        delete this[prop]; // remove accessors
        this[prop] = val;
    };



// 单体模式
function Universe() {
    var instance;
    Universe = function Universe() {
        return instance;
    }

    Universe.prototype = this;
    instance = new Universe();
    instance.constructor = Universe;

    instance.start = 0;
    instance.end = 1;

    return instance;
}



// promise实现
function Promise() {
    this.queue = [];
    this.isPromise = true;
}

Promise.prototype.then = function(fulfilledHandler, errorHandler, progressHandler) {
    var handler = [];
    if (typeof fulfilledHandler === 'function') {
        handler.fulfilled = fulfilledHandler;
    }
    if (typeof errorHandler === 'function') {
        handler.error = errorHandler;
    }
    this.queue.push(handler);
    return this;
}


var Deferred = function() {
    this.promise = new Promise();
}
Deferred.prototype.resolve = function(obj) {
    var promise = this.promise;
    var handler;
    while ((handler = promise.queue.shift())) {
        if (handler && handler.fulfilled) {
            var ret = handler.fulfilled(obj);
            if (ret && ret.isPromise) {
                ret.queue = promise.queue;
                this.promise = ret;
                return;
            }
        }
    }
}

Deferred.prototype.reject = function(err) {
    var promise = this.promise;
    var handler;
    while ((handler = promise.queue.shift())) {
        if (handler && handler.error) {
            var ret = handler.error(obj);
            if (ret && ret.isPromise) {
                ret.queue = promise.queue;
                this.promise = ret;
                return;
            }
        }
    }
}

Deferred.prototype.callback = function() {
    var that = this;
    return function(err, file) {
        if (err) {
            return that.reject(err);
        }
        that.resolve(file);
    }
}


function smooth(method) {
    return function() {
        var defferred = new Deferred();
        var args = Array.prototype.slice.call(null, arguments);
        args.push(defferred.callback());
        method.apply(null, args);
        return defferred.promise;
    }
}



var test = function(file, encoding) {
    var defferred = new Deferred();
    fs.readFile(file, encoding, defferred.callback());
    return defferred.promise;
}
var test2 = function(file, encoding) {
    var defferred = new Deferred();
    fs.readFile(file, encoding, defferred.callback());
    return defferred.promise;
}

test('file1', 'utf-8').then(function() {
    return test2('file2', 'utf-8');
}).then(function() {
    console.log('done');
})



function Promise(fn) {
    var state = 'pending';
    var value;
    var deferred = null;

    function resolve(newValue) {
        try {
            if (newValue && typeof newValue.then === 'function') {
                newValue.then(resolve, reject);
                return;
            }
            state = 'resolved';
            value = newValue;

            if (deferred) {
                handle(deferred);
            }
        } catch (e) {
            reject(e);
        }
    }

    function reject(reason) {
        state = 'rejected';
        value = reason;

        if (deferred) {
            handle(deferred);
        }
    }

    function handle(handler) {
        if (state === 'pending') {
            deferred = handler;
            return;
        }

        var handlerCallback;

        if (state === 'resolved') {
            handlerCallback = handler.onResolved;
        } else {
            handlerCallback = handler.onRejected;
        }

        if (!handlerCallback) {
            if (state === 'resolved') {
                handler.resolve(value);
            } else {
                handler.reject(value);
            }

            return;
        }

        var ret;
        try {
            ret = handlerCallback(value);
            handler.resolve(ret);
        } catch (e) {
            handler.reject(e);
        }
    }

    this.then = function (onResolved, onRejected) {
        return new Promise(function (resolve, reject) {
            handle({
                onResolved: onResolved,
                onRejected: onRejected,
                resolve: resolve,
                reject: reject
            });
        });
    };

    fn(resolve, reject);
}

// hex转rgba
const hexToRgba = function(hex, { alpha = 1, isArgb = false, rValue = false } = {}) {
  const d = function(v) {
    return parseInt(v, 16)
  };
  const p = function(v) {
    return parseFloat(parseInt((d(v) / 255) * 1000) / 1000)
  };

  const c = hex.slice(1).match(/.{2}/g)
  let a = alpha
  if (c.length === 4) {
    a = p(isArgb ? c.shift() : c.pop())
  }

  const rgb = c.map(d);
  if(rValue) return rgb.concat(a)
  return `rgba(${rgb.join(', ')}, ${a})`
}
