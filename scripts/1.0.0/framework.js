/*

List of features (As of July 16, 2019):
1. jQuery rippoff. (Early Ver.)
2. Checkbox (Early Ver.)
3. SwitchBox (Early Ver.)
4. DatePicker (Early Ver.)
5. InputMoney (Under Dev.)
6. TextField (Under Dev.)
7. Modal (Early Ver.)
8. H-Division (Early Ver.)
9. V-Division (Early Ver.)
10. ListTable (Early Ver.)
11. ClearForm (Early Ver.)
12. DataFormBind (Early Ver.)
13. DataSelectBind (Early Ver.)

*/

var x = function (selector) {
    return new class {
        constructor() {
            this.el = null;

            var nodeType = selector.nodeType,
                isNodeList = (selector.constructor.name == "NodeList"),
                isHtml = /(<[^\s].*>)/i.test(selector);

            if (nodeType == 1 || nodeType == 9 || isNodeList) {
                this.el = selector;
            } else {
                var dom = null;

                if (isHtml) {
                    var parser = new DOMParser(),
                        doc = parser.parseFromString(selector, "text/html");

                    dom = doc.body.childNodes;
                } else {
                    dom = document.querySelectorAll(selector);
                }

                this.el = dom.length == 1 ? dom[0] : dom;
            }
        };

        find(selector) {
            var dom = this.el.querySelectorAll(selector),
                el = dom.length == 1 ? dom[0] : dom;

            return x(el);
        };

        clone(deep) {
            var el = this.el.cloneNode(deep || false);
            return x(el);
        };

        empty(){
            this.el.innerHTML = null;
            this.el.innerText = null;
        }

        html(markup) {
            this.el.innerHTML = markup;
            return this;
        };

        append(child) {
            // Shall be improved...
            this.el.appendChild(child.el);
            return this;
        };

        replace(child) {
            // Shall be improved...
            this.el.replaceWith(child.el);
            return this;
        };

        each(callback) {
            var el = this.el,
                isNodeList = (el.constructor.name == "NodeList");

            if (isNodeList) {
                el.forEach(callback);
            } else {
                callback(el, 1);
            }
        };

        addClass(selector) {
            this.el.classList.add(selector);
            return this;
        };

        removeClass(selector) {
            this.el.classList.remove(selector);
            return this;
        };

        replaceClass(old, _new) {
            this.el.classList.replace(old, _new);
            return this;
        }

        hasClass(selector) {
            return this.el.classList.contains(selector);
        };

        attr(name, value) {
            if (value == undefined) {
                return this.el.getAttribute(name);
            } else {
                this.el.setAttribute(name, value);
                return this;
            }
        };

        on(e, callback) {
            this.el.addEventListener(e, callback);
            return this;
        };

        click(callback) {
            this.el.addEventListener("click", callback);
            return this;
        };

        val(val) {
            if (val == undefined) {
                return this.el.value;
            } else {
                this.el.value = val;
                return this;
            }
        };

        // Framework specific goodness ;)

        modal (title) {
            var base = this;

            return new class {

                constructor() {
                    this.modal = x(
                        `<div class='control-modal'>
                        <div class="modal-box">
                            <div class="modal-header">
                                <p class="mh-title">${title}</p>
                                <div class="mh-close">
                                    <button>&times;</button>
                                </div>
                            </div>
                        </div>
                    </div>`
                    );
                    this.foot = x("<div class='modal-footer'>");
                    this.actions = [];

                    var modal = this,
                        box = this.modal.find(".modal-box"),
                        el = x(base.el).clone(true);

                    el.addClass("modal-body");
                    box.append(el);

                    visibleModals.push(modal);
                    $(base.el).remove();
                    $("body").append(this.modal.el);

                    this.modal.find(".mh-close button").on("click", function () {
                        modal.hide();
                    });

                    this.modal.on("mousedown", function () {
                        modal.hide();
                    });

                    box.on("mousedown", function (e) {
                        e.stopPropagation();
                    });
                };

                changeTitle(newTit) {
                    this.modal.find(".mh-title").html(newTit);
                    return this;
                }

                addAction (text, callback) {
                    var action = x(`<button class='modal-action'>${text}</button>`),
                        actions = this.actions,
                        foot = this.foot;

                    if (actions.length == 0)
                        this.modal.find(".modal-box").append(foot);

                    if (callback != undefined)
                        action.click(callback);

                    actions.push(action);
                    foot.append(action);

                    return action.el;
                };

                show () {
                    this.modal.addClass("active");
                    visibleModals.push(this);
                    return this;
                };

                hide () {
                    this.modal.removeClass("active");
                    visibleModals.pop();
                    return this;
                }
            };
        };
    };
}

var framework = new class {
    constructor() {
        this.checkbox = new class {
            constructor() {
                this.ids = 0;
                this.collection = [];

                this.draw();
            };

            draw() {
                var cbo = this;
                x("input[type=checkbox].c_checkbox").each(function (node) {
                    var coll = cbo.collection,
                        node = x(node),
                        id = node.attr("id") || `dbo_${++cbo.ids}`,
                        drawn = (coll.indexOf(id) > -1);

                    if (!drawn) {
                        var el = node.clone().attr("id", id),
                            cont = x(`<div class="control-checkbox"><label class="cbo-active-area" for="${id}"></label></div>`),
                            contEl = cont.el,
                            fc = contEl.firstChild;

                        contEl.insertBefore(el.el, fc);
                        node.replace(cont);
                        coll.push(id);
                    }
                });
            }
        };

        this.switch = new class {
            constructor() {
                this.ids = 0;
                this.collection = [];

                this.draw();
            };

            draw() {
                var swtch = this;

                x("input[type=checkbox].c_switch").each(function (node) {
                    var coll = swtch.collection,
                        node = x(node),
                        id = node.attr("id") || `swtch_${++swtch.ids}`,
                        drawn = (coll.indexOf(id) > -1);

                    if (!drawn) {
                        var el = node.clone().attr("id", id),
                            cont = x(`<div class="control-switch"><label class="switch-active-area" for="${id}"></label></div>`),
                            contEl = cont.el,
                            fc = contEl.firstChild;

                        contEl.insertBefore(el.el, fc);
                        node.replace(cont);
                        coll.push(id);
                    }
                });
            }
        };

        // Components
        this.textfield = new class {
            constructor(){
                this.draw();
            };

            draw(){
                x(".control-textfield").each(function(node){
                    node = x(node);
                    node.find("input").on("input", function(){
                        if(node.hasClass("has-error")){
                            node.removeClass("has-error");
                            node.find(".ctf-error").empty();
                        }
                    });
                });
            }
        }
    };

    ListTable = class {
        // Note: I'm not ready to use the jQuery rip-off yet.
        constructor(table){
            var table = document.querySelector(table);
    
            this.body = new class {
                constructor(){
                    let body = table.querySelector("tbody");
                    
                    if(!body){ // Info: Then adds new "tbody".
                        body = document.createElement("tbody");
                        table.appendChild(body);
                    }
    
                    this.self = body;
                }
    
                empty(){
                    this.self.innerHTML = null;
                    this.self.innerText = null;
                }
    
                addRow(){
                    let root = this.self;
    
                    return new class {
                        constructor(){
                            var row = document.createElement("tr");
                            root.appendChild(row);
                            this.row = row;
                        }
    
                        addColumn(content, colspan, rowspan){
                            colspan = colspan || 1;
                            rowspan = rowspan || 1;
    
                            var column = document.createElement("td");
                            column.setAttribute("colspan", colspan);
                            column.setAttribute("rowspan", rowspan);
    
                            if(content.nodeType == 1){
                                column.appendChild(content);
                            }else{
                                column.innerHTML = content;
                            }
                            
                            this.row.appendChild(column);
                            return column;
                        }
                    }
                }
            }
    
            let body = this.body.self; // Note: So noisy.
            this.head = new class {
                constructor(){
                    let head = table.querySelector("thead");
                    
                    if(!head){ // Info: Then adds new "thead".
                        head = document.createElement("thead");
                        table.insertBefore(head, body);
                    }
    
                    this.self = head;
                }
    
                empty(){
                    this.self.innerHTML = null;
                    this.innerText = null;
                }
    
                addRow(){
                    let root = this.self;
    
                    return new class {
                        constructor(){
                            var row = document.createElement("tr");
                            root.appendChild(row);
                            this.row = row;
                        }
    
                        addColumn(content, colspan, rowspan){
                            colspan = colspan || 1;
                            rowspan = rowspan || 1;
    
                            var column = document.createElement("th");
                            column.setAttribute("colspan", colspan);
                            column.setAttribute("rowspan", rowspan);
    
                            if(content.nodeType == 1){
                                column.appendChild(content);
                            }else{
                                column.innerHTML = content;
                            }
                            
                            this.row.appendChild(column);
                            return column;
                        }
                    }
                }
            }
    
            this.table = table;
            this.emptyMessage = "No rows to show.";
        }
    
        ignoreColumns(...columns){
            this.ignoredColumns = columns;
        }
    
        isIgnored(column){
            return (this.ignoredColumns.indexOf(column) > -1)
        }
    
        empty(){
            this.head.empty();
            this.body.empty();
        }
    }

    // Info: Clear all fields in any form, 
    // regardless if generated using framework.js
    clearForm(form){
        let inputs = form.querySelectorAll("input, textarea"),
            selects = form.querySelectorAll("select");
    
        inputs.forEach((ipt)=>{
            ipt.value = ipt.type != "number" ? null : ipt.min || 0;
        });
    
        selects.forEach((slct) => {
            var opts = slct.querySelector("option");
            opts.selected = true;
        });
    }
    
    // Info: Binds data to form, 
    // regardless if either two was generated using framework.js
    DataFormBind = class {
        constructor(map, form){
            this.map = map;
            this.form = form;
        };

        bind(data){
            let inputs = form.querySelectorAll("input, textarea"),
                selects = form.querySelectorAll("select");

            for(let key in this.map){
                if(data.hasOwnProperty(key)){
                    inputs.forEach((ipt)=>{
                        if(ipt.name == this.map[key]) ipt.value = data[key];
                    });

                    selects.forEach((slcts)=>{
                        if(slcts.name == this.map[key]){
                            slcts.querySelectorAll("option")
                                .forEach((opt)=>{
                                    if(opt.value == data[key]) opt.selected = true;
                            });
                        }
                    });
                }
            }
        }
    }

    // Info: Binds data to form, 
    // regardless if either two was generated using framework.js
    DataSelectBind = class {
        constructor(select, map){
            this.map = map;
            this.select = select;
        };

        bind(data){
            let slct = this.select;

            // Info: Empties select el.
            slct.innerHTML = null;
            slct.innerText = null;

            data.forEach((row)=>{
                let valKey = this.map["value"],
                    textKey = this.map["text"];

                let opt = document.createElement("option");
                opt.value = row[valKey];
                opt.innerText = row[textKey];
                slct.appendChild(opt);
            });
        }
    }
}

// Init. for hdivisions
x(".control-hdivision").each(function (hdNode) {
    var hdWidth = parseInt(hdNode.clientWidth),
        divs = x(hdNode).find(".control-hdivision > .division"),
        dWidth = hdWidth / (divs.el.length || 1);

    divs.each(function (dNode, i) {
        dNode.style.width = `${dWidth}px`;

        if (i < divs.el.length - 1) {

            var knob = x("<button class='width-knob'>");
            x(dNode).append(knob);
            
            listenKnob(knob, dNode, divs.el[i + 1], 'h');
        }
    });
});
// End of hdivisions

//Init. for vdivisions
x(".control-vdivision").each(function (hdNode) {
    var hdHeight = parseInt(hdNode.clientHeight),
        divs = x(hdNode).find(".control-vdivision > .division"),
        dHeight = hdHeight / (divs.el.length || 1);

    divs.each(function (dNode, i) {
        dNode.style.height = `${dHeight}px`;

        if (i < divs.el.length - 1) {

            var knob = x("<button>").addClass("height-knob");
            x(dNode).append(knob);

            listenKnob(knob, dNode, divs.el[i + 1], 'v');
        }
    });
});
// End of vdivisions

function listenKnob(knob, node, nxtNode, orientation) {
    var hori = (orientation == 'h'),
        active = false,
        iniCoord = 0,
        divDimen1 = 0,
        divDimen2 = 0;

    knob.on("mousedown", function (e) {
        iniCoord = hori ? e.pageX : e.pageY;
        active = true;

        divDimen1 = hori ? node.clientWidth : node.clientHeight;
        divDimen2 = hori ? nxtNode.clientWidth : nxtNode.clientHeight;

        x(node).addClass("active");
        x(nxtNode).addClass("active");
    });

    x(document).on("mouseup", function () {
        if (active) {
            active = false;

            x(node).removeClass("active");
            x(nxtNode).removeClass("active");
        }
    });
    
    x(document).on("mousemove", function (e) {
        if (active) {
            var coord = hori ? e.pageX : e.pageY,
                off = iniCoord - coord,
                d1 = divDimen1 - off,
                d2 = divDimen2 + off;

            if (hori) {
                node.style.width = `${d1}px`;
                nxtNode.style.width = `${d2}px`;
            } else {
                node.style.height = `${d1}px`;
                nxtNode.style.height = `${d2}px`;
            }
        }
    });
}

// Init. for modals
var visibleModals = [];
x(document).on("keyup", function (e) {
    if (e.key == "Escape") {
        var len = visibleModals.length;
        if (len > 0)
            visibleModals[len-1].hide();
    }
});
// End of modals

// Note: UPPER PART WILL BE DEPRICATED SOON...
//       WILL USE THIS PART IN THE FUTURE...

var frameworkCSS = document.createElement("link");
frameworkCSS.setAttribute("rel", "stylesheet");
frameworkCSS.setAttribute("href", "http://framework.garyantier.com/styles/1.0.0/framework.css");
document.head.appendChild(frameworkCSS);

// Info: A little easter egg.
var frameworkCredits = document.createComment("Framework 👨🏻‍💻 with ❤ by Gary Antier");
document.appendChild(frameworkCredits);

// DATE PICKER
class DatePicker extends HTMLElement{
    constructor(){
        super();

        // Adding shadow (View)...
        var shadow = this.attachShadow({mode: "closed"});

        // Style (CSS)
        var style = document.createElement("style");
        // Yep! Long!
        style.innerText = `
        :host,
        #-afo-date-container,
        #-afo-date-display{
            align-items: center;
            display: inline-flex;
        }

        :host{
            border: solid 1px #9e9e9e;
            box-sizing: border-box;
            font-family: "Poppins", sans-serif;
            font-size: 13px;
            user-select: none;
            min-height: 22px;
            min-width: 132px;
        }

        #-afo-date-container{
            padding: 0 5px;
            position: relative;
            width: 100%;
        }

        #-afo-date-pick-button{
            position: absolute;
            right: 5px;
        }
    
        #-afo-date-picker{
            border-radius: 5px;
            box-shadow: rgba(0, 0, 0, 0.18) 0px 6.8px 20px 0px;
            box-sizing: border-box;
            display: none;
            left: 0;
            overflow: hidden;
            position: absolute;
            top: 23px;
            user-select: none;
            visibility: hidden;
            z-index: 400;
        }

        #-afo-date-picker.visible{
            display: flex;
        }
        
        #-afo-dp-preview{
            background: rgb(117, 156, 183);
            padding: 12px;
            padding-top: 16px;
            width: 130px;
        }
    
        #-afo-dpp-year{
            color: rgba(255, 255, 255, .8);
            margin: 0;
            margin-bottom: 5px;
        }
    
        #-afo-dpp-date{
            color: #fff;
            font-size: 26px;
            margin: 0;
        }
    
        #-afo-dpi-header{
            display: block;
            padding: 0 12px;
        }
    
        #-afo-dpi-header
        div:first-child{
            align-items: center;
            display: flex;
            margin: 8px 0;
            width: 100%;
        }
        
        #-afo-dpih-year-month{
            font-size: 14px;
            font-weight: 500;
            margin-left: 10px !important;
        }
    
        #-afo-dpih-nav{
            display: flex;
        }
    
        #-afo-dpih-nav
        button{
            align-items: center;
            background: #fff;
            border: none;
            cursor: pointer;
            display: flex;
            height: 24px;
            justify-content: center;
            padding: 0;
            position: relative;
            width: 24px;
        }
    
        #-afo-dpih-nav
        button::before{
            box-sizing: border-box;
            content: "\\2513";
            display: block;
            font-size: 15px;
            font-weight: 600;
            line-height: 15px;
            width: 15px;
        }
    
        #-afo-dpihn-backward{
            margin-right: 4px;
        }
    
        #-afo-dpihn-backward::before{
            transform: rotate(-135deg);
        }
    
        #-afo-dpihn-forward::before{
            transform: rotate(45deg);
        }
    
        #-afo-dpih-days{
            border-bottom: solid 1px #e0e0e0;
            box-sizing: border-box;
            display: flex;
            padding-bottom: 8px;
        }
    
        #-afo-dpih-days 
        span{
            align-items: center;
            color: #bdbdbd;
            display: flex;
            font-size: 13px;
            font-weight: 500;
            height: 14px;
            justify-content: center;
            margin: 0 2px;
            width: 28px;
        }
    
        #-afo-dpi-calendar{
            padding: 14 12px 12px 12px;
        }
    
        #-afo-dpi-calendar
        ul{
            margin: 0;
            list-style-type: none;
            padding: 0;
        }
    
        #-afo-dpi-calendar
        ul li{
            display: flex;
        }
    
        #-afo-dpi-calendar
        ul li a{
            align-items: center;
            border-radius: 50%;
            box-sizing: border-box;
            color: #575757;
            cursor: pointer;
            display: flex;
            font-size: 14px;
            font-weight: 500;
            height: 28px;
            justify-content: center;
            margin: 2px;
            width: 28px;
        }
    
        #-afo-dpi-calendar
        ul li a:not(.disabled):hover{
            border: solid 1.5px #bdbdbd;
        }
    
        #-afo-dpi-calendar
        ul li a.active{
            border: solid 1.5px #bdbdbd;
            color: rgb(117, 156, 183);
            font-weight: 600;
        }

        #-afo-dpi-calendar
        ul li a.disabled{
            pointer-events: none;
        }
        `;
        shadow.appendChild(style);

        // DOM
        var dom = `
        <div id="-afo-date-container">
            <!-- INPUT -->
            <div id="-afo-date-display">
                <span id="-afo-date-month">mm</span>
                <span class="-afo-date-separator">/</span>
                <span id="-afo-date-date">dd</span>
                <span class="-afo-date-separator">/</span>
                <span id="-afo-date-year">yyyy</span>
            </div>
            <button id='-afo-date-pick-button'>...</button>

            <!-- PICKER -->
            <div id="-afo-date-picker">
                <div id="-afo-dp-preview">
                    <p id="-afo-dpp-year">2019</p>
                    <p id="-afo-dpp-date">Fri, Dec. 23</p>
                </div>
                <div id="-afo-dp-picker">
                    <div id="-afo-dpi-header">
                        <div>
                            <div id="-afo-dpih-year-month">June 2019</div>
                            <div id="-afo-dpih-nav">
                                <button id="-afo-dpihn-backward"></button>
                                <button id="-afo-dpihn-forward"></button>
                            </div>
                        </div>
                        <div id="-afo-dpih-days">
                            <span>S</span>
                            <span>M</span>
                            <span>T</span>
                            <span>W</span>
                            <span>T</span>
                            <span>F</span>
                            <span>S</span>
                        </div>
                    </div>
                    <div id="-afo-dpi-calendar">
                        <ul></ul>
                    </div>
                </div>
            </div>
        </div>`;

        var parser = new DOMParser(),
            doc = parser.parseFromString(dom, "text/html");
            dom = doc.body.childNodes[0];
        shadow.appendChild(dom);

        // HANDLERS
        this.dom = dom;
        this.visible = false;
        this.val = this.getAttribute("value"); // Initial value...
        this.date = this.val ? new Date(this.val) : new Date(); // Initial date...
        
        var picker = dom.querySelector("#-afo-date-picker"),
            showBtn = dom.querySelector("#-afo-date-pick-button"),
            backwardBtn = dom.querySelector("#-afo-dpihn-backward"),
            forwardBtn =  dom.querySelector("#-afo-dpihn-forward"),
            date = this.date,
            ths = this;

        this.drawDate(); // Initial set...

        showBtn.addEventListener("click", function(e){

            if(!ths.visible){
                var pickers = document.querySelectorAll("date-picker");
                pickers.forEach(function(picker){
                    picker.hidePicker();
                });
            }

            picker.classList.toggle("visible");
            ths.visible = !ths.visible;

            if(ths.visible){
                var delay = setInterval(function(){ // Makes sure DOM has loaded...
                    var rect = dom.getBoundingClientRect(),
                        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                        scrollTop = window.pageYOffset || document.documentElement.scrollTop,
                        top = rect.top + scrollTop,
                        left = rect.left + scrollLeft,
                        height = picker.offsetHeight,
                        width = picker.offsetWidth,
                        docWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                        docHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

                    if((left+width) >= docWidth){
                        picker.style.left = `-${width-dom.offsetWidth}px`;
                    }else{
                        picker.style.left = "0px";
                    }

                    if((top+height) >= docHeight){
                        picker.style.top = `-${height+10}px`;
                    }else{
                        picker.style.top = "30px";
                    }

                    picker.style.visibility = "visible";

                    clearInterval(delay);
                }, 5);

                ths.drawCalendar();
                ths.drawDate(true);
            }
        });

        backwardBtn.addEventListener("click", function(){
            date.setMonth(date.getMonth() - 1);
            ths.drawCalendar();
            ths.drawDate();
        });

        forwardBtn.addEventListener("click", function(){
            date.setMonth(date.getMonth() + 1);
            ths.drawCalendar();
            ths.drawDate();
        });

        dom.addEventListener("click", function(e){
            e.stopPropagation();
        });

        document.addEventListener("click", function(){
            if(ths.visible){
                picker.classList.remove("visible");
                picker.style.visibility = "hidden";
                ths.visible = false;
            }
        });
    }

    set value(date){
        this.val = date;
        this.dispatchEvent(new CustomEvent("change"));
    }

    get value(){
        return this.val;
    }

    drawCalendar(){
        // For DOM
        var dom = this.dom,
            calendar = dom.querySelector("#-afo-dpi-calendar ul");
        calendar.innerHTML = "";

        // For COMPUTATION
        var date = this.date,
            year = date.getFullYear(),
            month = date.getMonth(),
            _date = date.getDate(),
            startDay = new Date(year, month, 1).getDay(), // Of the week...
            totalDays = new Date(year, month+1, 0).getDate(),
            days = 0;
        
        for(var week=0; week<6; week++){  // Total of 6 weeks maximum in a month...
            let weekEl = document.createElement("li");
            for(var day=0; day<7; day++){ // Total of 7 days in a week...
                let dayEl = document.createElement("a");
                weekEl.appendChild(dayEl);

                if(!(week == 0 && day < startDay) && days != totalDays){
                     days++;
                     if(days == _date) dayEl.setAttribute("class", "active");
                     dayEl.innerHTML = days;
                }
                else {
                    dayEl.classList.add("disabled");
                }
            }
            calendar.appendChild(weekEl);
        }

        // Update date btn handlers..
        var dateBtns = dom.querySelectorAll("#-afo-dpi-calendar a"),
            ths = this;

        dateBtns.forEach(function(dateBtn){
            dateBtn.addEventListener("click", function(){
                // Replace active btn..
                dom.querySelector("#-afo-dpi-calendar a.active").classList.remove("active");
                this.classList.add("active");

                var selectedDate = parseInt(this.innerText);

                date.setDate(selectedDate);
                ths.drawDate();
            });
        });
    };

    drawDate(noOverrite){
        var dom = this.dom,
            date = this.date;

        noOverrite = noOverrite || false;

        const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
              weekDays = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

        var year = date.getFullYear(),
            month = date.getMonth(),
            _date = date.getDate(),
            day = date.getDay();
        
        dom.querySelector("#-afo-dpp-year").innerText = year;
        dom.querySelector("#-afo-dpp-date").innerText = `${weekDays[day]} ${months[month]} ${_date}`;
        dom.querySelector("#-afo-dpih-year-month").innerText = `${months[month]} ${year}`;

        if(++month < 10) month = `0${month}`;
        if(_date < 10) _date = `0${_date}`;

        if(!noOverrite){
            // Updates existing value...
            dom.querySelector("#-afo-date-month").innerText = month;
            dom.querySelector("#-afo-date-date").innerText = _date;
            dom.querySelector("#-afo-date-year").innerText = year;
            this.value = `${year}-${month}-${_date}`;
        }
    };

    hidePicker(){
        if(!this.visible) return;

        var picker = this.dom.querySelector("#-afo-date-picker");
        picker.classList.remove("visible");
        picker.style.visibility = "hidden";
        this.visible = false;
    }
}
customElements.define("date-picker", DatePicker);
// END DATE PICKER

// INPUT TYPE MONEY
class InputMoney extends HTMLElement{
    constructor(){
        super();

        var shadow = this.attachShadow({mode: "closed"});

        // Style (CSS)
        var style = document.createElement("style");
        style.innerText = `
        :host,
        #-afo-money-container{
            align-items: center;
            display: inline-flex;
        }

        :host{
            background: #fff;
            border: solid 1px #9e9e9e;
            box-sizing: border-box;
            font-family: "Poppins", sans-serif;
            font-size: 13px;
            /* user-select: none; */
            min-height: 22px;
            min-width: 132px;
            outline: red;
        }

        #-afo-money-container{
            height: 100%;
            position: relative;
            width: 100%;
        }

        #-afo-input-field{
            color: rgba(0, 0, 0, .5);
            background: transparent;
            border: none;
            display: block;
            outline: none;
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
        }

        #-afo-money-display{
            display: flex;
            justify-content: flex-end;
            max-width: 100%;
            width: 100%;
        }

        #-afo-money-display
        span{
            display: block;
        }
        `;

        shadow.appendChild(style);

        var dom = `
        <div id="-afo-money-container">
            <div id="-afo-money-display">
                <span class="-afo-money-integer">0</span>
                <span class="-afo-money-point">.</span>
                <span class="-afo-money-decimal">0</span>
                <span class="-afo-money-decimal">0</span>
            </div>
            <input id="-afo-input-field" value="0.00">
        </div>
        `;

        var parser = new DOMParser(),
            doc = parser.parseFromString(dom, "text/html");
            dom = doc.body.childNodes[0];

        shadow.appendChild(dom);

        var input = this.input = dom.querySelector("#-afo-input-field"),
        display = dom.querySelector("#-afo-money-display"),
        prevVal = "",
        ths = this;
    
        input.addEventListener("input", function(e){
            let numVal = parseFloat(this.value),
                value = numVal.toFixed(2),
                reg = /^-?\d*\.?(\d{1,2})?$/;

            if(value == "NaN" && e.data != "-" || numVal == 0){ // If emptied OR starts with none numbers except - (negate)...
                if(e.data == null) 
                    input.value = "0.00";

                value = prevVal = "0.00";
                ths.setCaretPosition(1);
            }

            if(reg.test(this.value)){
                prevVal = value;
                value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                var parts = value.split("."),
                    int = parts[0].split(","),
                    dec = parts[1];

                display.innerHTML = "";

                int.forEach(function(place, block){
                    var len = place.length;
                    for(var idx=0;idx!=len;idx++){
                        // Insert integer digits...
                        var digit = place[idx],
                            _digit = document.createElement("span");
                        _digit.classList.add("-afo-money-integer");
                        _digit.innerText = digit;
                        display.appendChild(_digit);
                    }

                    if(block < int.length-1){
                        // Add commas...
                        var comma = document.createElement("span");
                        comma.classList.add("-afo-money-comma");
                        comma.innerText = ", ";
                        display.appendChild(comma);
                    }
                });

                // Add points...
                var point = document.createElement("span");
                    point.classList.add("-afo-money-point");
                    point.innerText = ".";
                display.appendChild(point);

                var len = dec.length;
                for(var idx=0;idx!=len;idx++){
                    // Insert integer digits...
                    var digit = dec[idx],
                        _digit = document.createElement("span");
                    _digit.classList.add("-afo-money-decimal");
                    _digit.innerText = digit;
                    display.appendChild(_digit);
                }
            }else{
                var initPos = input.selectionStart-1;
                input.value = prevVal;
                ths.setCaretPosition(initPos);
            }
        });

        input.addEventListener("keyup", function(){
            // console.log(this.selectionStart);
            // console.log(this.selectionEnd);
        });
    };

    setCaretPosition(pos){
        var ipt = this.input;

        if(ipt !== null){
            if(ipt.createTextRange){
                var range = ipt.createTextRange();
                range.move('character', pos);
                range.select();
                return true;
            }else{
                if(ipt.selectionStart || ipt.selectionStart === 0){
                    ipt.focus();
                    ipt.setSelectionRange(pos, pos);
                    return true;
                }else{
                    ipt.focus();
                    return false;
                }
            }
        }
    }
}

customElements.define("input-money", InputMoney);

// END INPUT TYPE MONEY