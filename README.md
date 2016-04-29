# Eld.js

## About
Eld.js is a library that is similar to jQuery.

## Usage
### Selector
    var eldObj = eld.select(query, [element]);             // Query ex: tagName #id .className etc...
    var eldObj = eld.selectId(id);                         // id
    var eldObj = eld.selectName(name, [element]);          // name
    var eldObj = eld.selectTag(tagName, [element]);        // Tag Name
    var eldObj = eld.selectClass(className, [element]);    // Class
    
### Create
    var eldObj = eld.create(tagName, [element]);    // Create DOM and EldObject
    var eldObj = eld.createEldObject(element);      // Create EldObject

### Get Elements
    var element = eldObj.elems[index];          // elements
    var element = eldObj.get(index);            // elements
    var eldObjNumber = eldObj.getEld(index);    // get index EldObject for EldObject
    var eldObjFind = eldObj.find(query);        // get query EldObject for EldObject (The same as the eld.select)
    var eldObjParent = eldObj.parent();         // get parent EldObject for EldObject  
    var eldObjChildren = eldObj.children();     // get children EldObject for EldObject
    var eldObjFirst = eldObj.first();           // get first EldObject for EldObject
    var eldObjLast = eldObj.last();             // get last EldObject for EldObject
    
### Eld Functions
#### width
    eld.width();        // get window width 
    
#### height
    eld.height();       // get window height
    
#### load
window onload event

    eld.load(func);

#### resize
    eld.resize(func);   // add resize event
    
#### scroll
    eld.scroll(func);   // add scroll event
    
#### scrollTop
    eld.scrollTop(duration, adjustTop, easing);     // scroll to window top
    
easing
* ease-out (default)
* linear

#### blur
    eld.blur();         // all element

#### interval
    eld.interval(args);

args(Object)

| args | Type | Description | required |
|:-----|:-----|:------------|:--------|
| func | function | processing function | true |
| time | number | processing interval | true |
| count | number | repeat count | false |
| callback | function | callback function | false |

    
### EldObject Functions
#### text
    eldObj.text();            // get
    eldObj.text("text");      // set
    eldObj.text(function(element, index) {return "text"});    // set

#### val
    eldObj.val();               // get
    eldObj.val("value text");   // set
    eldObj.val(function(element, index) {return "value text"});    // set
    
#### nval
    eldObj.nval();              //get return number or NaN

   
#### gval
For Select List, Radio, Checkbox

    eldObj.gval();            // get
    eldObj.gval("value");     // set
    eldObj.gval(["value1", "value2"]);  // set
    eldObj.gval("value1,value2");       // set
    
#### style
    eldObj.style();                 // get all
    eldObj.style("color");          // get
    eldObj.style("color", "red");   // set
    eldObj.style("color", function(element, index) {return "red"});   // set
    eldObj.style({"color": "red", "font-size": "20px"});    // set

#### attr
    eldObj.attr("id");          // get
    eldObj.attr("id", "input-text");  // set
    eldObj.attr("id", function(element, index) { return "input-text"});  // set
    eldObj.attr({"id": "input-text", "name": "uesrname"});     // set

    
#### prop
    eldObj.prop("required");    // has attribute (return boolean)
    eldObj.prop("required", true);  // set
    eldObj.prop("required", function(element, index) {return true});      // set
    eldObj.prop("required", false); // remove

#### class
    eldObj.class();         // get
    eldObj.class("css");    // has class (return boolean)
    eldObj.class("css", true);      // add
    eldObj.class("css", function(element, index) {return true});      // add
    eldObj.class("css", false);     // remove
    eldObj.class({                  // add
        "css": true,
        "css2": true,
    });
    eldObj.class({                  // add and remove
        "css": true,
        "css2": false,
    });
    eldObj.class("css", "toggle");  // add or remove

#### animate
    eldObj.animate(args);
    
args(Object)
* param (required)
* duration
* easing
* delay
* callback
* frame

Example

    eldOjb.animate({
        param: {
            "backgroud-color": "blue"
        },
        duration: 2000,         // millisecond or second + "s"
        easing: "ease-in-out",
        delay: "2s",            // millisecond or second + "s"
        callback: function() {
            /** Process after animation **/
        },
        frame: function() {
            /** Processing to be executed in the rendering **/
        }
    });

easing(css animation-timing-function property)
* ease  (default)
* linear
* ease-in
* ease-out
* ease-in-out
* cubic-bezier(num, num, num, num)


#### event
    eldObj.event("click", clickEventFunction, true);    // add event
    eldObj.event("click", clickEventFunction);          // add event
    eldObj.event("click", clickEventFunction, false);   // remove event

 Bubbling cancellation
 
    eldObj.event("click", function() {
        /** processing **/
        return false;
    });
 
 #### trigger
    eldObj.trigger("click");            // trigger of the event
 
#### html
Rewrite innerHTML.

    eldObj.html(html);

#### insertInner
Insert innerHTML.

    eldObj.insertInner(html, [position]);
    
position
* before
* after (default)

#### insertBefore
Insert outerHTML before. 

    eldObj.insertBefore(html);
    

#### insertAfter
Insert outerHTML after.

    eldObj.insertAfter(html);


#### createChild
Create children DOM.

    eldObj.createChild(tagName, [params]);

Example params

JavaSctipt

    var params = [
        {
            "text": "text1",
            "val": "1",
            "prop" {
              "selected": true  
            }
        },
        {
            "text": "text2",
            "val": "2",
        }
    ];
    
    eld.selectId("area-select")
    .createChild("select")
    .createChild("option", params);

Result HTML

    <div id="area-select">
        <select>
            <option value="1" selected>text1</option>
            <option value="2">text2</option>
        </select>
    </div>


#### merge
 
Merge EldObject
 
    eldObj.merge(EldObject...);
 
 
Example
 
    var eldObj1 = eld.create("div");
    var eldObj2 = eld.create("div");
    var eldObj3 = eld.create("div");
    
    var eldObj1And2 = eldObj1.merge(eldObj2);
    var eldObj1And2And3 = eldObj1.merge(eldObj2, eldObj3);

#### width

    eldObj.width();         // get
    eldObj.width("p");      // get padding-right + padding-left 
    eldObj.width("b");      // get border-right-width + border-left-width 
    eldObj.width("cpbm");   // get content + padding + border + margin

#### height

    eldObj.height();         // get
    eldObj.height("m");      // get margin-top + margin-bottom 
    eldObj.height("cp");      // get content + padding 
    eldObj.height("cpbm");   // get content + padding + border + margin

#### offset

    eldObj.offset();        // get return {top: topValue, left: leftValue}

#### ajax

    eld.ajax(args);         // return XHRHttpRequest instance

args(Object)

| args | Type | Description | default |
|:-----|:-----|:------------|:--------|
| xhr | objcet | your created XHRHttpRequest instance | new XHRHttpRequest() |
| url | string | request url | - |
| method | string | request method | "POST" |
| param | object | request search parameter | - |
| header | object | request header | {"Content-Type": "application/json;charset=UTF-8"} |
| responseType | string | response type | "json" |
| timeout | number | time until the time-out | - |
| timeoutFunction| function | executed at the time of time-out | - |
| data| - | send data | - |
| success | function | executed at the time of communication success | - |
| error | function | executed when the error occurred | - |
| complete | function | executed at the end of communication | - |
| username | string | authentication | "" |
| password | string | authentication | "" |


abort

    var eldAjax = eld.ajax({
        url: "http://example.com/",
        ...
    });
    eldAjax.abort();

    
#### click
    
    eldObj.click();         // trigger of the click event for all element
    eldObj.click(func);     // add click event

#### focus
    
    eldObj.focus();         // focus last element
    eldObj.focus(number);   // focus number element


#### blur

    eldObj.blur();      // in element


#### show

    eldObj.show([display]);     // set style display (default "block")

#### hide

    eldObj.hide();              // set style display "none"


#### fadeIn

    eldObj.fadeIn(duration);
    
#### fadeOut
    
    eldObj.fadeOut(duration);


#### slideIn

    eldObj.slideIn({
        duration: 2000,     // (default 0)
        x: 20,              // x-axis (default 0)
        y: 30,              // y-axis (default 0)
        unit: "em",         // (default px)
    });

#### slideOut

    eldObj.slideOut({
        duration: 2000,     // (default 0)
        x: 20,              // x-axis (default 0)
        y: 30,              // y-axis (default 0)
        unit: "em",         // (default px)
    });

#### screen
Run when the element is in the screen
    
    eldObj.screen(func, [overall]);

Example

    eldOjb.screen(function() {
        eld.select("area-iamge").fadeIn(800);
    });

Example Run only once

    eldOjb.screen(function() {
        eld.select("area-iamge").fadeIn(800);
        return false;
    });

#### screenOut
Run when the element is out the screen
    
    eldObj.screenOut(func, [overall]);

Example

    eldOjb.screenOut(function() {
        eld.select("area-iamge").fadeIn(800);
    });

Example Run only once

    eldOjb.screenOut(function() {
        eld.select("area-iamge").fadeIn(800);
        return false;
    });



#### scrollTop
    eldObj.scrollTop(duration, adjustTop, easing);     // scroll to first element top
    
easing
* ease-out (default)
* linear


## Method chaining
    
    eld.create("div")
    .createChild("p")
    .text("Sample Text")
    .style({
        "padding": "0.2em 1em",
        "line-height": "1.5em"
    });

## Future matters

### Animation
* Repeat Animation
* etc...

### SPA

### Others
Thinking.

## Author
mya-ake

web:http://mya-ake.com/

Twitter:https://twitter.com/mya_ake

## Version

0.14.0 (April 30, 2016)

## License
The MIT License (MIT)

Copyright (c) 2016 mya-ake
