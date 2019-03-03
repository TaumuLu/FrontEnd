function EventPattern(){
    this.eventList = {};
}
EventPattern.prototype = {
    constructor: EventPattern,
    addEvent : function(event, func){
        if(typeof eventList[event] === 'undefined'){
            this.eventList[event] = [];
        }
        this.eventList[event].push(func);
    },
    removeEvent: function(event, func){
        if(this.eventList[event] instanceof Array){
            var arr = this.eventList[event],
                len = arr.length;
            for(var i=0; i<len; i++){
                if(func === arr[i]){
                    break;
                }
            }
            arr.splice(i,1);
        }
    },
    eventTrigger: function(event, data){
        if(this.eventList[event] instanceof Array){
            var arr = this.eventList[event],
                len = arr.length;
            for(var i=0; i<len; i++){
                arr[i](data);
            }
        }
    }
}
var pieEvent = new EventPattern();



function EventTarget() {
    this.handlers = {};
}
EventTarget.prototype = {
    constructor: EventTarget,
    addHandler: function(type, handler) {
        if (typeof this.handlers[type] == "undefined") {
            this.handlers[type] = [];
        }
        this.handlers[type].push(handler);
    },
    fire: function(event) {
        if (!event.target) {
            event.target = this;
        }
        if (this.handlers[event.type] instanceof Array) {
            var handlers = this.handlers[event.type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i](event);
            }
        }
    },
    removeHandler: function(type, handler) {
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i] === handler) {
                    break;
                }
            }
            handlers.splice(i, 1);
        }
    }
};

function handleMessage1(event) {
    console.log('Message received: ' + event.message);
}
//创建一个新对象
var target = new EventTarget();
//添加一个事件处理程序
target.addHandler("message", handleMessage1);
//触发事件
target.fire({
    type: "message",
    message: "Hello world!"
});
//删除事件处理程序
target.removeHandler("message", handleMessage1);
//再次，应没有处理程序
target.fire({
    type: "message",
    message: "Hello world!"
});

function Person(name, age) {
    EventTarget.call(this);
    this.name = name;
    this.age = age;
}
function inheritPrototype(subType, superType) {
    var prototype = Object(superType.prototype); //创建对象
    prototype.constructor = subType; //增强对象
    subType.prototype = prototype; //指定对象
}
inheritPrototype(Person, EventTarget);
Person.prototype.say = function(message) {
    this.fire({
        type: "message",
        message: message
    });
};

function handleMessage(event) {
    console.log(event.target.name + " says: " + event.message);
}
//创建新 person
var person = new Person("Nicholas", 29);
//添加一个事件处理程序
person.addHandler("message", handleMessage);
//在该对象上调用 1 个方法，它触发消息事件
person.say("Hi there.");




var DragDrop = function() {
    var dragdrop = new EventTarget(),
        dragging = null,
        diffX = 0,
        diffY = 0;

    function handleEvent(event) {
        //获取事件和对象
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        //确定事件类型
        switch (event.type) {
            case "mousedown":
                if (target.className.indexOf("draggable") > -1) {
                    dragging = target;
                    diffX = event.clientX - target.offsetLeft;
                    diffY = event.clientY - target.offsetTop;
                    dragdrop.fire({
                        type: "dragstart",
                        target: dragging,
                        x: event.clientX,
                        y: event.clientY
                    });
                }
                break;
            case "mousemove":
                if (dragging !== null) {
                    //指定位置
                    dragging.style.left = (event.clientX - diffX) + "px";
                    dragging.style.top = (event.clientY - diffY) + "px";
                    // 触发自定义事件
                    dragdrop.fire({
                        type: "drag",
                        target: dragging,
                        x: event.clientX,
                        y: event.clientY
                    });
                }
                break;
            case "mouseup":
                dragdrop.fire({
                    type: "dragend",
                    target: dragging,
                    x: event.clientX,
                    y: event.clientY
                });
                dragging = null;
                break;
        }
    };
    //公共接口
    dragdrop.enable = function() {
        EventUtil.addHandler(document, "mousedown", handleEvent);
        EventUtil.addHandler(document, "mousemove", handleEvent);
        EventUtil.addHandler(document, "mouseup", handleEvent);
    };
    dragdrop.disable = function() {
        EventUtil.removeHandler(document, "mousedown", handleEvent);
        EventUtil.removeHandler(document, "mousemove", handleEvent);
        EventUtil.removeHandler(document, "mouseup", handleEvent);
    };
    return dragdrop;
}();

DragDrop.addHandler("dragstart", function(event) {
    var status = document.getElementById("status");
    status.innerHTML = "Started dragging " + event.target.id;
});
DragDrop.addHandler("drag", function(event) {
    var status = document.getElementById("status");
    status.innerHTML += "<br/> Dragged " + event.target.id + " to (" + event.x +
        "," + event.y + ")";
});
DragDrop.addHandler("dragend", function(event) {
    var status = document.getElementById("status");
    status.innerHTML += "<br/> Dropped " + event.target.id + " at (" + event.x +
        "," + event.y + ")";
});



//通用代码
var observer = {
    //订阅
    addSubscriber: function (callback) {
        this.subscribers[this.subscribers.length] = callback;
    },
    //退订
    removeSubscriber: function (callback) {
        for (var i = 0; i < this.subscribers.length; i++) {
            if (this.subscribers[i] === callback) {
                delete (this.subscribers[i]);
            }
        }
    },
    //发布
    publish: function (what) {
        for (var i = 0; i < this.subscribers.length; i++) {
            if (typeof this.subscribers[i] === 'function') {
                this.subscribers[i](what);
            }
        }
    },
    // 将对象o具有观察者功能
    make: function (o) {
        for (var i in this) {
            o[i] = this[i];
            o.subscribers = [];
        }
    }
};

var blogger = {
    recommend: function (id) {
        var msg = 'dudu 推荐了的帖子:' + id;
        this.publish(msg);
    }
};

observer.make(blogger);

var tom = {
    read: function (what) {
        console.log('Tom看到了如下信息：' + what)
    }
};

var mm = {
    show: function (what) {
        console.log('mm看到了如下信息：' + what)
    }
};
// 订阅
blogger.addSubscriber(tom.read);
blogger.addSubscriber(mm.show);
blogger.recommend(123); //调用发布

//退订
blogger.removeSubscriber(mm.show);
blogger.recommend(456); //调用发布



// var publisher = {
//     subscribers: {
//         any: []
//     },
//     subscribe: function( fn, type ){
//         type = type || 'any';
//         if( typeof this.subscribers[type] === 'undefined' ){
//             this.subscribers[type] = [];
//         }
//         this.subscribers[type].push( fn );
//     },
//     unsubscribe: function( fn, type ){
//         this.visitSubscribers( 'unsubscribe', fn, type );
//     },
//     publish: function( publication, type ){
//         this.visitSubscribers( 'publish', publication, type );
//     },
//     visitSubscribers: function( action, arg, type ){
//         var pubtype = type || 'any',
//             subscribers = this.subscribers[pubtype],
//             i,
//             max = subscribers.length;
//         for( i=0; i<max; i+=1 ){
//             if( action === 'publish' ){
//                 subscribers[i](arg);
//             } else {
//                 if( subscribers[i] === arg ){
//                     subscribers.splice( i, 1 );
//                 }
//             }
//         }
//     }
// }

// function makePublisher( o ){
//     var i;
//     for( i in publisher ){
//         if( publisher.hasOwnProperty(i) && typeof publisher[i] === 'function' ){
//             o[i] = publisher[i];
//         }
//     }
// }

// var paper = {
//     daily: function(){
//         this.publish("big news today");
//     },
//     monthly: function(){
//         this.publish("interesting analysis", "monthly");
//     }
// }
// makePublisher( paper );

// var joe = {
//     drinkCoffee: function( paper ){
//         console.log('Just read' + paper);
//     },
//     sundayPreNap: function( monthly ){
//         console.log('About to fall asleep reading this ' + monthly);
//     }
// }

// paper.subscribe(joe.drinkCoffee);
// paper.subscribe(joe.sundayPreNap, 'monthly');

// paper.daily()




