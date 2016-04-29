/*
Copyright (c) 2016 mya-ake
Released under the MIT license
http://mya-ake.ccm/license/mit.html

version: 0.13.5
*/

var eld = (function() {
"use strict";
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

function Eld() {
}
Eld.prototype = {
  create: function(tag, targetElem) {
    var e = document.createElement(tag);
    if (targetElem) {
      targetElem.appendChild(e);
    } else {
      document.getElementsByTagName("body")[0].appendChild(e);
    }
    return new EldObject([e]);
  },

  createEldObject: function(dom) {
    var e = !dom ? [document.createElement("div")] : typeof dom.length === "number" ? dom : [dom];
    return new EldObject(e);
  },

  selectId: function(id) {
    return new EldObject([document.getElementById(id)||document.createElement("div")]);
  },

  selectName: function(name, targetElem) {
    if (!targetElem) {
      targetElem = document;
    }
    return new EldObject(targetElem.getElementsByName(name)||[document.createElement("div")]);
  },
  
  selectTag: function(tagName, targetElem) {
    if (!targetElem) {
      targetElem = document;
    }
    return new EldObject(targetElem.getElementsByTagName(tagName)||[document.createElement("div")]);
  },

  selectClass: function(className, targetElem) {
    if (!targetElem) {
      targetElem = document;
    }
    return new EldObject(targetElem.getElementsByClassName(className)||[document.createElement("div")]);
  },

  select: function(query, targetElem) {
    if (!targetElem) {
      targetElem = document;
    }
    return new EldObject(targetElem.querySelectorAll(query)||[document.createElement("div")]);
  },

  isNumber: function(s) {
    return /^(-)?[0-9]+(\.[0-9]+)?$/.test(s);
  },
  
  removeNotNumber: function(s) {
    return s.replace(/[^0-9\.]/g, "");
  },
  
  mergeArray: function() {
    var newAry = [];
    var arg;
    for (var i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      for (var j = 0; j < arg.length; j++) {
        newAry.push(arg[j]);
      }
    }
    return newAry;
  },
  
  containsArray: function(ary, value) {
    for (var i = ary.length -1; i >= 0; i--) {
      if (ary[i] === value) {
        return true;
      }
    }
    return false;
  },

  ajax: function(args) {
    var xhr = args.xhr || new XMLHttpRequest();
    if (args.url) {
      if (args.param && typeof args.param === "object") {
        var counter = 0;
        Object.keys(args.param).forEach(function(key) {
          args.url += counter === 0 ? "?" : "&";
          args.url += key + "=" + args.param[key];
          counter++;
        });
      }
      xhr.open(args.method || "POST", args.url, args.async || true, args.username || "", args.password || "");
    }

    if (args.header && typeof args.header === "object") {
      Object.keys(args.header).forEach(function(k) {
        xhr.setRequestHeader(k, args.header[k]);
      });
    } else {
      xhr.setRequestHeader("Content-Type" , "application/json;charset=UTF-8");
    }
    xhr.responseType = xhr.responseType || args.responseType || "json";

    if (typeof args.timeout === "number" && typeof args.timeoutFunction === "function") {
      xhr.ontimeout = function() {
        args.timeoutFunction();
      };
      xhr.timeout = args.timeout;
    }
    
    xhr.onreadystatechange = function () {
      switch(xhr.readyState){
        case 3:
          break;
        case 4:
          if ( (200 <= xhr.status && xhr.status < 300) || (xhr.status == 304) ) {
            if (typeof args.success === "function") {
              args.success(xhr.response, xhr);
            }
          } else {
            if (typeof args.error === "function") {
              args.error(xhr);
            }
          }
          if (typeof args.complete === "function") {
            args.complete(xhr);
          }
          break;
      }
    };

    if (args.data) {
      xhr.send(args.data);
    } else {
      xhr.send();
    }
    return xhr;
  },
  
  blur: function() {
    if (document.activeElement) document.activeElement.blur();
  },
  
  load: function(func) {
    window.addEventListener("load", func, false);
  },

  interval: function(args) {
    if (typeof args.count !== "number") {
      return setInterval(args.func, args.time);
    }
    var c = 1;
    var id = setInterval(function() {
      args.func(c++);
      if (c > args.count) {
        clearInterval(id);
        if (typeof args.callback === "function") {
          args.callback();
        }
      }
    }, args.time);
    return id;
  },
};

function EldObject(elems) {
  this.elems = elems;
  this.length = elems.length;
  this.eld = true;
}

EldObject.prototype = {
  get: function(num) {
    return this.elems[num];
  },
  
  getEld: function(num) {
    return new EldObject([this.elems[Math.min(num, this.length - 1)]]);
  },
  
  find: function(query) {
    var ret = [];
    for (var i = 0; i < this.length; i++) {
      ret = eld.mergeArray(ret, this.elems[i].querySelectorAll(query));
    }
    return new EldObject(ret);
  },

  parent: function() {
    var elems = [];
    for (var i = 0; i < this.length; i++) {
      elems.push(this.elems[i].parentElement);
    }
    return new EldObject(elems);
  },

  children: function() {
    var elems = [];
    for (var i = 0; i < this.length; i++) {
      for (var j = 0; j < this.elems[i].children.length; j++) {
        elems.push(this.elems[i].children[j]);
      }
    }
    return new EldObject(elems);
  },
  
  first: function() {
    return new EldObject([this.elems[0]]);
  },
  
  last: function() {
    return new EldObject([this.elems[this.length - 1]]);
  },

  text: function(text) {
    var i;
    if (typeof text === "string" || typeof text === "number") {
      for (i = this.length - 1; i >= 0; i--) {
        this.elems[i].textContent = text;
      }
      return this;
    } else if (typeof text === "function") {
      for (i = this.length - 1; i >= 0; i--) {
        this.elems[i].textContent = text(this.elems[i], i);
      }
      return this;
    }
    if (this.length === 1) {
      return this.elems[0].textContent;
    }
    var ret = [];
    for (i = 0; i < this.length; i++) {
      ret.push(this.elems[i].textContent);
    }
    return ret;
  },
  
  val: function(value) {
    var i;
    if (typeof value === "string" || typeof value === "number") {
      for (i = this.length - 1; i >= 0; i--) {
        this.elems[i].value = value;
      }
      return this;
    } else if (typeof value === "function") {
      for (i = this.length - 1; i >= 0; i--) {
        this.elems[i].value = value(this.elems[i], i);
      }
      return this;
    }
    if (this.length === 1) {
      return this.elems[0].value;
    }
    var ret = {};
    for (i = 0; i < this.length; i++) {
      ret[this.elems[i].name || i] = this.elems[i].value;
    }
    return ret;
  },
  
  nval: function() {
    return this.val() * 1;
  },
  
  gval: function(value) {
    var t = this;
    if (value !== undefined) {
      if (this.length === 1) {
        setOne(value);
      } else {
        setMulti(value);
      }
      return this;
    }
    if (this.length === 1) {
      return getOne();
    }
    return getMulti();
    
    function getOne() {
      return getVal(getElems(t.elems[0]));
    }
    
    function getMulti() {
      var ret = {};
      var name;
      var names = [];
      for (var i = 0; i < t.length; i++) {
        if (isInput(t.elems[i])) {
          name = t.elems[i].name;
          if (eld.containsArray(names, name)) {
            continue;
          }
          names.push(name);
          ret[name] = getVal(document.getElementsByName(name));
        } else {
          ret[i] = getVal(t.elems[i].children);
        }
      }
      return Object.keys(ret).length === 1 ? ret[Object.keys(ret)[0]] : ret;
    }
    
    function getVal(elems) {
      var target = "checked";
      if (elems[0].tagName.toLowerCase() === "option") {
        target = "selected";
      }
      var value = null;
      for (var i = 0; i < elems.length; i++) {
        if (elems[i][target] === true) {
          if (value !== null) {
            value += "," + elems[i].value;
          } else {
            value = elems[i].value;
          }
        }
      }
      return value;
    }
    
    function setOne(value) {
      setVal(getElems(t.elems[0]), value);
    }
    
    function setMulti(value) {
      var name;
      var names = [];
      for (var i = t.length - 1; i >= 0; i--) {
        if (isInput(t.elems[i])) {
          name = t.elems[i].name;
          if (eld.containsArray(names, name)) {
            continue;
          }
          names.push(name);
          setVal(document.getElementsByName(name), value);
        } else {
          setVal(t.elems[i].children, value);
        }
      }
    }
    
    function setVal(elems, value) {
      var target = "checked";
      if (elems[0].tagName.toLowerCase() === "option") {
        target = "selected";
      }
      var i = elems.length - 1;
      if (typeof value.length !== "number") {
        value = value.split(/,/);
      }
      for (; i >= 0; i--) {
        if (eld.containsArray(value, elems[i].value)) {
          elems[i][target] = true;
        } else {
          elems[i][target] = false;
        }
      }
    }
    
    function isInput(elem) {
      return elem.tagName.toLowerCase() === "input";
    }
    
    function getElems(elem) {
      if (isInput(elem)) {
        return document.getElementsByName(elem.name);
      }
      return elem.children;
    }
  },
  
  style: function() {
    var t = this;
    switch (arguments.length) {
      case 1:
        return f1(arguments[0]);
      case 2:
        return f2(arguments[0], arguments[1]);
      default:
        return f0();
    }
  
    function f0() {
      var ret = [];
      for (var i = 0; i < t.length; i++) {
        ret.push(t.elems[i].style);
      }
      return ret;
    }
    
    function f1(args) {
      switch (typeof args) {
        case "object":
          return fObj(args);
        case "string":
          return fStr(args);
      }
      return t;
      
      function fObj(obj) {
        var i = 0;
        Object.keys(obj).forEach(function(name) {
          f2(name, obj[name]);
        });
        return t;
      }
      function fStr(name) {
        if (typeof name !== "string") {
          return "";
        }
        if (t.length === 1) {
          return getStyle(t.elems[0], name);
        }
        var ret = [];
        for (var i = 0; i < t.length; i++) {
          ret.push(getStyle(t.elems[i], name));
        }
        return ret;
      }
    }
    
    function f2(name, value) {
      if (typeof name !== "string") {
        return t;
      }
      for (var i = t.length - 1; i >= 0; i--) {
        switch (typeof value) {
          case "function":
            t.elems[i].style[name] = value(t.elems[i], i);
            break;
          default:
            t.elems[i].style[name] = value;
        }
      }
      return t;
    }
  },
  
  attr: function() {
    var t = this;
    switch (arguments.length) {
      case 1:
        return f1(arguments[0]);
      case 2:
        return f2(arguments[0], arguments[1]);
      default:
        return f0();
    }
  
    function f0() {
      return t;
    }
    
    function f1(args) {
      switch (typeof args) {
        case "object":
          return fObj(args);
        case "string":
          return fStr(args);
      }
      return t;
      
      function fObj(obj) {
        var i = 0;
        Object.keys(obj).forEach(function(name) {
          f2(name, obj[name]);
        });
        return t;
      }
      function fStr(name) {
        if (typeof name !== "string") {
          return "";
        }
        if (t.length === 1) {
          return t.elems[0].getAttribute(name);
        }
        var ret = [];
        for (var i = 0; i < t.length; i++) {
          ret.push(t.elems[i].getAttribute(name));
        }
        return ret;
      }
    }
    
    function f2(name, value) {
      if (typeof name !== "string") {
        return t;
      }
      for (var i = t.length - 1; i >= 0; i--) {
        switch (typeof value) {
          case "function":
            t.elems[i].setAttribute(name, value(t.elems[i], i));
            break;
          default:
            t.elems[i].setAttribute(name, value);
            break;
        }
      }
      return t;
    }
  },
  
  prop: function() {
    var t = this;
    switch (arguments.length) {
      case 1:
        return f1(arguments[0]);
      case 2:
        return f2(arguments[0], arguments[1]);
      default:
        return f0();
    }
  
    function f0() {
      return t;
    }
    
    function f1(args) {
      switch (typeof args) {
        case "object":
          return fObj(args);
        case "string":
          return fStr(args);
      }
      return t;
      
      function fObj(obj) {
        var i = 0;
        Object.keys(obj).forEach(function(name) {
          f2(name, obj[name]);
        });
        return t;
      }
      function fStr(name) {
        if (typeof name !== "string") {
          return false;
        }
        if (t.length === 1) {
          return t.elems[0].getAttribute(name) !== null;
        }
        var ret = [];
        for (var i = 0; i < t.length; i++) {
          ret.push(t.elems[i].getAttribute(name) !== null);
        }
        return ret;
      }
    }
    
    function f2(name, flg) {
      if (typeof name !== "string") {
        return t;
      }
      var i = t.length - 1;
      if (flg === true) {
        for (; i >= 0; i--) {
          t.elems[i].setAttribute(name, "");
        }
      } else if (flg === false) {
        for (; i >= 0; i--) {
          t.elems[i].removeAttribute(name, "");
        }
      } else if (typeof flg === "function") {
        for (; i >= 0; i--) {
          if (flg(t.elems[i], i)) {
            t.elems[i].setAttribute(name, "");
          } else {
            t.elems[i].removeAttribute(name, "");
          }
        }
      }
    }
  },
  
  class: function() {
    var t = this;
    switch (arguments.length) {
      case 1:
        return f1(arguments[0]);
      case 2:
        return f2(arguments[0], arguments[1]);
      default:
        return f0();
    }
  
    function f0() {
      if (t.length === 1) {
        return t.elems[0].className;
      }
      var ret = [];
      for (var i = 0; i < t.length; i++) {
        ret.push(t.elems[i].className);
      }
      return ret;
    }
    
    function f1(args) {
      switch (typeof args) {
        case "object":
          return fObj(args);
        case "string":
          return fStr(args);
      }
      return t;
      
      function fObj(obj) {
        var i = 0;
        Object.keys(obj).forEach(function(name) {
          f2(name, obj[name]);
        });
        return t;
      }
      function fStr(name) {
        if (typeof name !== "string") {
          return "";
        }
        var reg = new RegExp("[^a-zA-Z0-9\\-_]?" + name + "[^a-zA-Z0-9\\-_]?");
        if (t.length === 1) {
          return reg.test(t.elems[0].className);
        }
        var ret = [];
        for (var i = 0; i < t.length; i++) {
          ret.push(reg.test(t.elems[i].className));
        }
        return ret;
      }
    }
    
    function f2(name, flg) {
      if (typeof name !== "string") {
        return t;
      }
      var reg = new RegExp("[^a-zA-Z0-9\\-_]?" + name + "[^a-zA-Z0-9\\-_]?");
      var i = t.length - 1;
      if (flg === true) {
        for (; i >= 0; i--) {
          if (reg.test(t.elems[i].className) === false) {
            t.elems[i].className = (t.elems[i].className + " " + name).trim();
          }
        }
      } else if(flg === false) {
        for (; i >= 0; i--) {
          if (typeof t.elems[i].className === "string") {
            t.elems[i].className = t.elems[i].className.replace(reg, "").trim();
          }
        }
      } else if("toggle") {
        for (; i >= 0; i--) {
          if (reg.test(t.elems[i].className) === false) {
            t.elems[i].className = (t.elems[i].className + " " + name).trim();
          } else {
            t.elems[i].className = t.elems[i].className.replace(reg, "").trim();
          }
        }
      } else if (typeof flg === "function") {
        for (; i >= 0; i--) {
          if (flg(t.elems[i], i)) {
            t.elems[i].className = (t.elems[i].className + " " + name).trim();
          } else {
            t.elems[i].className = t.elems[i].className.replace(reg, "").trim();
          }
        }
      }
      return t;
    }
  },
  
  animate: function(args) {
    var t = this;
    var param = args.param;
    var duration = args.duration;
    var easing = args.easing || "ease";
    var delay = args.delay;
    var stepFunc = typeof args.frame === "function" 
    ? function() {
      args.frame();
      if (t.animate.s === false) {
        requestAnimationFrame(stepFunc);
      }
    }
    : function(){};
    
    var origin = {
      duration: [],
      easing: [],
      delay: [],
    };
    var durationTimeout = formatTimeForTimeout(duration) + formatTimeForTimeout(delay);
    duration = formatTime(duration);
    delay = formatTime(delay);
    getOrigin();
    for (var i = t.length - 1; i >= 0; i--) {
      t.elems[i].style.transition = "all " + duration;
      t.elems[i].style.animationTimingFunction = easing;
      t.elems[i].style.transitionDelay = delay;
    }
    wh(param);

    if (t.animate === undefined) {
      t.animate = {t1: null, t2: null, s: false};
    } else {
      clearTimeout(t.animate.t1);
    }
    t.animate.s = true;
    t.animate.t1 = setTimeout(function() {
      t.animate.s = false;
      stepFunc();
      set(param);
      clearTimeout(t.animate.t2);
      t.animate.t2 = setTimeout(function() {
        setOrigin();
        t.animate.s = true;
        if (typeof args.callback === "function") {
          args.callback();
        }
      }, durationTimeout);
    }, 2);
    
    return t;
    
    function getOrigin() {
      for (var i = t.length - 1; i >= 0; i--) {
        origin.duration[i] = t.elems[i].style.transition;
        origin.easing[i] = t.elems[i].style.animationTimingFunction;
        origin.delay[i] = t.elems[i].style.transitionDelay;
      }
    }
    
    function setOrigin() {
      for (var i = t.length - 1; i >= 0; i--) {
        t.elems[i].style.transition = origin.duration[i];
        t.elems[i].style.animationTimingFunction = origin.easing[i];
        t.elems[i].style.transitionDelay = origin.delay[i];
      }
    }
    
    function wh(param) {
      var i;
      if (param["width"] !== undefined) {
        for (i = t.length - 1; i >= 0; i--) {
          t.elems[i].style.width = getStyle(t.elems[i], "width");
        }
      }
      if (param["height"] !== undefined) {
        for (i = t.length - 1; i >= 0; i--) {
          t.elems[i].style.height = getStyle(t.elems[i], "height");
        }
      }
    }
    
    function set(param) {
      Object.keys(param).forEach(function(name) {
        for (var i = t.length - 1; i >= 0; i--) {
          if (typeof param[name] === "function") {
            t.elems[i].style[name] = param[name](t.elems[i], i);
          } else {
            t.elems[i].style[name] = param[name];
          }
        }
      });
    }
  },
  
  event: function(name, func, flg) {
    var i = this.length - 1;
    if (flg === false) {
      for (; i >= 0; i--) {
        this.elems[i].removeEventListener(name, func, false);
      }
    } else {
      var eldfunc = function(e) {
        if (func(e) === false) {
          e.preventDefault();
        }
      };
      for (; i >= 0; i--) {
        this.elems[i].addEventListener(name, eldfunc, false);
      }
    }
    return this;
  },
  
  trigger: function(eventName) {
    var i = 0;
    var e;
    if (document.createEvent) {
      e = document.createEvent("HTMLEvents");
      e.initEvent(eventName, true, true);
      for (; i < this.length; i++) {
        this.elems[i].dispatchEvent(e);
      }
      return this;
    }
    e = document.createEventObject();
    eventName = "on" + eventName;
    for (; i < this.length; i++) {
      this.elems[i].fireEvent(eventName, e);
    }
    return this;
  },
  
  insertInner: function(html, position) {
    if (typeof html !== "string") {
      return this;
    }
    if (typeof position !== "string") {
      position = "beforeend";
    } else {
      switch (position) {
        case "before":
          position = "afterbegin";
          break;
        case "after":
          position = "beforeend";
          break;
      }
    }
    for (var i = this.length - 1; i >= 0; i--) {
      this.elems[i].insertAdjacentHTML(position, html);
    }
    return this;
  },
  
  insertBefore: function(html) {
    if (typeof html !== "string") {
      return this;
    }
    for (var i = this.length - 1; i >= 0; i--) {
      this.elems[i].insertAdjacentHTML("beforebegin", html);
    }
    return this;
  },
  
  insertAfter: function(html) {
    if (typeof html !== "string") {
      return this;
    }
    for (var i = this.length - 1; i >= 0; i--) {
      this.elems[i].insertAdjacentHTML("afterend", html);
    }
    return this;
  },
  
  html: function(html) {
    var i;
    if (typeof html !== "string") {
      if (this.length === 1) {
        return this.elems[0].innerHTML;
      }
      var ret = [];
      for (i = 0; i < this.length; i++) {
        ret.push(this.elems[i].innerHTML);
      }
      return ret;
    }
    for (i = this.length - 1; i >= 0; i--) {
      this.elems[i].innerHTML = html;
    }
    return this;
  },
  
  createChild: function(tag, params) {
    if (typeof tag !== "string") {
      tag = "div";
    }
    var elems = [];
    var e;
    var i;
    if (typeof params !== "object") {
      for (i = 0; i < this.length; i++) {
        e = document.createElement(tag);
        this.elems[i].appendChild(e);
        elems.push(e);
      }
      return new EldObject(elems);
    }
    for (i = 0; i < this.length; i++) {
      for (var j = 0; j < params.length; j++) {
        e = document.createElement(tag);
        this.elems[i].appendChild(e);
        elems.push(e);
        exeParam(new EldObject([e]), params[j]);
      }
    }
    return new EldObject(elems);
    
    function exeParam(eldObj, param) {
      Object.keys(param).forEach(function(key) {
        if (typeof eldObj[key] === "function") {
          eldObj[key](param[key]);
        }
      });
    }
  },
  
  merge: function() {
    var newElems = [];
    var i;
    for (i = 0; i < this.length; i++) {
      newElems.push(this.elems[i]);
    }
    var elems;
    for (i = 0; i < arguments.length; i++) {
      elems = arguments[i].elems;
      for (var j = 0; j < elems.length; j++) {
        newElems.push(elems[j]);
      }
    }
    return new EldObject(newElems);
  },
  
  width: function(type) {
    if (this.length === 1) {
      return get(this.elems[0]);
    }
    var ret = [];
    for (i = 0; i < this.length; i++) {
      ret.push(get(this.elems[i]));
    }
    return ret;
    
    function get(elem) {
      var style = getStyle(elem);
      var w = eld.removeNotNumber(style.width) * 1;
      if (typeof type !== "string") {
        return w;
      }
      if (!/c/i.test(type)) {
        w = 0;
      }
      if (/p/i.test(type)) {
        w += (eld.removeNotNumber(style["padding-right"]) * 1 + eld.removeNotNumber(style["padding-left"]) * 1);
      }
      if (/b/i.test(type)) {
        w += (eld.removeNotNumber(style["border-right-width"]) * 1 + eld.removeNotNumber(style["border-left-width"]) * 1);
      }
      if (/m/i.test(type)) {
        w += (eld.removeNotNumber(style["margin-right"]) * 1 + eld.removeNotNumber(style["margin-left"]) * 1);
      }
      return w;
    }
  },

  height: function(type) {
    if (this.length === 1) {
      return get(this.elems[0]);
    }
    var ret = [];
    for (i = 0; i < this.length; i++) {
      ret.push(get(this.elems[i]));
    }
    return ret;
    
    function get(elem) {
      var style = getStyle(elem);
      var h = eld.removeNotNumber(style.height) * 1;
      if (typeof type !== "string") {
        return h;
      }
      if (!/c/i.test(type)) {
        h = 0;
      }
      if (/p/i.test(type)) {
        h += (eld.removeNotNumber(style["padding-top"]) * 1 + eld.removeNotNumber(style["padding-bottom"]) * 1);
      }
      if (/b/i.test(type)) {
        h += (eld.removeNotNumber(style["border-top-width"]) * 1 + eld.removeNotNumber(style["border-bottom-width"]) * 1);
      }
      if (/m/i.test(type)) {
        h += (eld.removeNotNumber(style["margin-top"]) * 1 + eld.removeNotNumber(style["margin-bottom"]) * 1);
      }
      return h;
    }
  },
  
  offset: function() {
    if (this.length === 1) {
      return {
        top: this.elems[0].offsetTop,
        left: this.elems[0].offsetLeft
      };
    }
    var ret = [];
    for (var i = 0; i < this.length; i++) {
      ret.push({
        top: this.elems[i].offsetTop,
        left: this.elems[i].offsetLeft
      });
    }
    return ret;
  },
  
  click: function(func) {
    if (typeof func === "function") {
      this.event("click", func);
      return this;
    }
    this.trigger("click");
    return this;
  },
  
  focus: function(num) {
    this.elems[Math.min(num, this.length - 1) || this.length - 1].focus();
    return this;
  },
  
  blur: function() {
    for (var i = this.length - 1; i >= 0; i--) {
      this.elems[i].blur();
    }
    return this;
  },
  
  show: function(disp) {
    this.style("display", function(e) {
      return disp || e.getAttribute("eld-display") || "block";
    });
    this.prop("eld-display", false);
  },
  
  hide: function() {
    this.attr("eld-display", function(e) {
      return getStyle(e, "display");
    })
    .style("display", "none");
  },
  
  fadeIn: function(duration) {
    var t = this;
    t.style("opacity", 0);
    t.animate({
      param: {
        opacity: 1
      },
      duration: duration,
    });
    return t;
  },
  
  fadeOut: function(duration) {
    var t = this;
    t.style("opacity", 1);
    t.animate({
      param: {
        opacity: 0
      },
      duration: duration
    });
    return t;
  },

  slideIn: function(args) {
    var t = this;
    t.style({
      transform: "translate(" + addUnitPx(args.x, args.unit) + "," + addUnitPx(args.y, args.unit) + ")",
      display: function(e) {
        if (getStyle(e, "display") === "inline") {
          e.setAttribute("eld-slide", "inline");
          return "inline-block";
        }
        return e.style.display;
      }
    });
    t.animate({
      param: {
        transform: "translate(0,0)"
      },
      duration: args.duration,
      easing: "ease-in-out",
      callback: function() {
        t.style({
          transform: "",
          display: function(e) {
            if (e.getAttribute("eld-slide")) {
              e.removeAttribute("eld-slide");
              return "inline";
            }
            return e.style.display;
          }
        });
      }
    });
    return t;
  },
  
  slideOut: function(args) {
    var t = this;
    t.style({
      transform: "translate(0,0)",
      display: function(e) {
        if (getStyle(e, "display") === "inline") {
          e.setAttribute("eld-slide", "inline");
          return "inline-block";
        }
        return e.style.display;
      }
    });
    t.animate({
      param: {
        transform: "translate(" + addUnitPx(args.x, args.unit) + "," + addUnitPx(args.y, args.unit) + ")"
      },
      duration: args.duration,
      easing: "linear"
    });
    return t;
  },
};

function getStyle(elem, name) {
  var style = window.getComputedStyle(elem, null);
  return name ? style.getPropertyValue(name) : style; 
}
function formatTime(t) {
  if (!/^[0-9]+s?$/.test(t)) {
    return "0s";
  }
  if (/^[0-9]+$/.test(t)) {
    return t / 1000 + "s";
  }
  return t;
}
function formatTimeForTimeout(t) {
  if (!/^[0-9]+s?$/.test(t)) {
    return 0;
  }
  if (/^[0-9]+s$/.test(t)) {
    return t.replace(/s/, "") * 1000;
  }
  return t * 1;
}
function addUnitPx(v, unit) {
  if (!eld.isNumber(v)) {
    return 0;
  }
  return v + (unit || "px");
}

return new Eld();

})();
