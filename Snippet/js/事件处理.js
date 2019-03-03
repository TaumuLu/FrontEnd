// 事件处理对象
var EventUtil={
    // 添加事件
    addHandler:function(element,type,handler){
        if(element.addEventListener){
            element.addEventListener(type,handler,false);
        }else if(element.attachEvent){
            element.attachEvent("on"+type,handler);
        }else{
            element["on+type"]=handler;
        }
    },
    // 删除事件
    removeHandler:function(element,type,handler){
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            element.detachEvent("on"+type,handler);
        }else{
            element["on+type"]=handler;
        }
    },
    // 获取事件对象
    getEvent:function(event){
        return event?event:window.event;
    },
    // 获取事件目标
    getTarget:function(event){
        return event.target||event.srcElement;
    },
    // 取消事件默认行为
    preventDefault:function(event){
        if(evnet.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },
    // 阻止事件流
    stopPropagation:function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble=true;
        }
    },
    // 鼠标滑动事件，提供相关元素信息
    getRelatedTarget:function(event){
        if(event.relatedTarget){
            return event.relatedTarget;
        }else if(event.toElement){
            return event.toElement;
        }else if(event.fromElement){
            return event.fromElement;
        }else{
            return null;
        }
    },
    // 鼠标按钮事件，提供所按键信息
    getButton:function(event){
        if(document.implementation.hasFeature("MouseEvents","2.0")){
            return event.button;
        }else{
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    },
    // 鼠标滚动事件，提供滚动信息
    getWheelDelta:function(event){
        if(event.wheelDelta){
            return (client.engine.opera&&client.engine.opera<9.5?
                    -event.wheelDelta:event.wheelDelta);
        }else{
            return -event.detail*40;
        }
    },
    // 键盘事件，提供所按键字符编码信息
    getCharCode:function(event){
        if(typeof event.charCode=="number"){
            return event.charCode;
        }else{
            return event.keyCode;
        }
    },
}
