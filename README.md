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
    var eldObjParent = eldObj.parent();         // get parent EldObject for EldObject  
    var eldObjChildren = eldObj.children();     // get children EldObject for EldObject

### EldObject Functions
#### text
    eldObj.text();            // get
    eldObj.text("text");      // set

#### val
    eldObj.val();               // get
    eldObj.val("value text");   // set
    
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
    eldObj.style({"color": "red", "font-size": "20px"});    // set

#### attr
    eldObj.attr("id");          // get
    eldObj.attr("id", "input-text");  // set
    eldObj.attr({"id": "input-text", "name": "uesrname"});     // set

    
#### prop
    eldObj.prop("required");    // has attribute (return boolean)
    eldObj.prop("required", true);  // set
    eldObj.prop("required", false); // remove

#### class
    eldObj.class();         // get
    eldObj.class("css");    // has class (return boolean)
    eldObj.class("css", true);      // add
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
    
Arguments
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

Arguments

| args | Type | Description | default |
|:-----|:-----|:------------|:--------|
| xhr | objcet | your created XHRHttpRequest instance | new XHRHttpRequest() |
| url | string | request url | - |
| method | string | request method | POST |
| param | object | request search parameter | - |
| header | object | request header | {"Content-Type": "application/json;charset=UTF-8"} |
| responseType | string | response type | json |
| timeout | number | time until the time-out | - |
| timeoutFunction| function | executed at the time of time-out | - |
| data| - | send data | - |
| success | function | executed at the time of communication success | - |
| error | function | executed when the error occurred | - |
| complete | function | executed at the end of communication | - |


abort

    var eldAjax = eld.ajax({
        url: "http://example.com/",
        ...
    });
    eldAjax.abort();


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
* Fade Animation
* Slide Animation
* Repeat Animation
* etc...

### Event
* load
* focus
* blur

### Get EldObject
* first
* last

### Others
Thinking.

## Author
mya-ake

web:http://mya-ake.com/

Twitter:https://twitter.com/mya_ake

## Version

0.12.1 (April 22, 2016)

## License
The MIT License (MIT)

Copyright (c) 2016 mya-ake
