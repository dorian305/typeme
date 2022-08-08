class Timer{constructor(a,b,c=!1){this.callback=a,this.remainingTime=b,this.startedTime=0,this.pausedTime=0,this.timerId=0,c&&this.start()}pause(){this.pausedTime=new Date,this.destroy(),this.remainingTime=this.remainingTime-(this.pausedTime-this.startedTime)}resume(){this.startedTime=new Date,this.destroy(),this.timerId=setTimeout(()=>this.callback(),this.remainingTime)}start(){this.startedTime=new Date,this.timerId=setTimeout(()=>this.callback(),this.remainingTime)}destroy(){clearTimeout(this.timerId)}}class TypeMe{constructor({elem:c,strings:d,properties:a,cursorProperties:b}){if(c){if("string"==typeof c)this.elem=document.querySelectorAll(c);else if(c instanceof Element)this.elem=[c];else if(c instanceof NodeList)this.elem=c;else throw`Error: first argument ${c} is not a valid HTML Element or NodeList`}else throw"Error: Element to animate on is not defined";this.strings=d||["Hello, I'm TypeMe.","I am a JavaScript typing animation plugin that can type out strings, just like this one!",],this.typeSpeed=void 0!==a?.typeSpeed?a.typeSpeed:70,this.backspaceSpeed=void 0!==a?.backspaceSpeed?a.backspaceSpeed:20,this.pauseAfterFullstop=void 0!==a?.pauseAfterFullstop?a.pauseAfterFullstop:500,this.loop=void 0!==a?.loop&&a.loop,this.stopOnLastString=void 0===a?.stopOnLastString||a.stopOnLastString,this.animationStartDelay=void 0!==a?.animationStartDelay?a.animationStartDelay:750,this.typeStartDelay=void 0!==a?.typeStartDelay?a.typeStartDelay:500,this.backspaceStartDelay=void 0!==a?.backspaceStartDelay?a.backspaceStartDelay:500,this.onBegin=a?.onBegin,this.onStringFinished=a?.onStringFinished,this.onComplete=a?.onComplete,this.cursorID=void 0!==b?.cursorID?b.cursorID:"",this.cursorClass=void 0!==b?.cursorClass?b.cursorClass:"",this.cursor=void 0!==b?.cursor?b.cursor:"|",this.cursorRemoveOnAnimationComplete=void 0!==b?.cursorRemoveOnAnimationComplete&&b.cursorRemoveOnAnimationComplete,this.cursorAnimationSpeed=b?.cursorAnimationSpeed||2,this.typingCursors=[],this.opacity=1,this.animationPaused=!1,this.animationRunning=!1,this.currentString=0,this.currentLetterIndex=0,this.typingTimerID=null,this.cursorStepValue=.1,this.cursorStepValueSign=-1,this.typingCursorAnimationTimerID=null,this.#a()} #a(){this.elem.forEach(a=>{if("input"===a.tagName.toLowerCase()&&"text"===a.getAttribute("type")||"textarea"===a.tagName.toLowerCase())a.value="";else{let c=document.createElement("span");a.insertAdjacentElement("beforeend",c);let b=document.createElement("span");b.textContent=this.cursor,b.style.opacity=`${this.opacity}`,this.cursorID&&b.setAttribute("id",this.cursorID),this.cursorClass&&b.setAttribute("class",this.cursorClass),this.typingCursors.push(b),a.insertAdjacentElement("beforeend",b),this.#b()}})}start(){this.animationRunning?console.warn("Animation already running! Did you mean to use .restart() ?"):(this.animationRunning=!0,this.elem.forEach(a=>{"input"===a.tagName.toLowerCase()&&"text"===a.getAttribute("type")||"textarea"===a.tagName.toLowerCase()?a.value="":(a.querySelector("span:first-child").textContent="",this.typingCursors.forEach(a=>a.style.display=""))}),this.onBegin?.(),this.typingTimerID=new Timer(()=>this.#c(),this.animationStartDelay,!0))} #d(){this.#e(),this.cursorRemoveOnAnimationComplete&&this.typingCursors.forEach(a=>a.style.display="none"),this.onComplete?.(),this.loop&&(this.stopOnLastString?this.typingTimerID=new Timer(()=>this.restart(),this.backspaceStartDelay,!0):this.restart())}pause(a){this.animationRunning?this.animationPaused?console.warn("Animation is already paused! Did you mean to use .resume() or toggle() ?"):(this.animationPaused=!0,this.typingTimerID.pause(),a?.()):console.warn("Animation isn't running!")}resume(a){this.animationRunning?this.animationPaused?(this.animationPaused=!1,this.typingTimerID.resume(),a?.()):console.warn("Animation is already resumed! Did you mean to use .pause() or toggle() ?"):console.warn("Animation isn't running!")}toggle(a){this.animationRunning?(this.animationPaused?this.typingTimerID.resume():this.typingTimerID.pause(),this.animationPaused=!this.animationPaused,a?.()):console.warn("Animation isn't running!")}restart(a){this.elem.forEach(a=>{"input"===a.tagName.toLowerCase()&&"text"===a.getAttribute("type")||"textarea"===a.tagName.toLowerCase()?a.value="":a.querySelector("span:first-child").textContent=""}),this.#e(),this.start(),a?.()} #e(){this.currentString=0,this.currentLetterIndex=0,this.animationPaused=!1,this.animationRunning=!1,this.typingTimerID?.destroy(),this.typingTimerID=null,this.elem.forEach(a=>a.querySelector("span:nth-child(2)").textContent=this.cursor)} #b(){this.opacity<=0?this.cursorStepValueSign=1:this.opacity>=1&&(this.cursorStepValueSign=-1),this.opacity+=this.cursorStepValueSign*this.cursorStepValue,this.typingCursors.forEach(a=>a.style.opacity=`${this.opacity}`),this.typingCursorAnimationTimerID=new Timer(()=>this.#b(),1e3/this.cursorAnimationSpeed/20,!0)} #c(){this.elem.forEach(a=>{"input"===a.tagName.toLowerCase()&&"text"===a.getAttribute("type")||"textarea"===a.tagName.toLowerCase()?a.value+=this.strings[this.currentString][this.currentLetterIndex]:a.querySelector("span:first-child").textContent+=this.strings[this.currentString][this.currentLetterIndex],a.scrollLeft=a.scrollWidth,a.scrollTop=a.scrollHeight}),this.currentLetterIndex+1>=this.strings[this.currentString].length?this.currentString+1>=this.strings.length&&this.stopOnLastString?(this.onStringFinished?.(),this.#d()):this.typingTimerID=new Timer(()=>{this.#f(),this.currentLetterIndex=this.strings[this.currentString].length-1},this.backspaceStartDelay,!0):this.typingTimerID=new Timer(()=>{this.currentLetterIndex++,this.#c()},"."===this.strings[this.currentString][this.currentLetterIndex]?this.pauseAfterFullstop+this.typeSpeed:this.typeSpeed,!0)} #f(){this.elem.forEach(a=>{if("input"===a.tagName.toLowerCase()&&"text"===a.getAttribute("type")||"textarea"===a.tagName.toLowerCase())a.value=a.value.substring(0,this.currentLetterIndex);else{let b=a.querySelector("span:first-child");b.textContent=b.textContent.substring(0,this.currentLetterIndex)}a.scrollLeft=a.scrollWidth,a.scrollTop=a.scrollHeight}),this.currentLetterIndex+1<=0?this.currentString+1>=this.strings.length?(this.onStringFinished?.(),this.#d()):(this.typingTimerID=new Timer(()=>{this.currentString++,this.currentLetterIndex=0,this.#c()},this.typeStartDelay,!0),this.onStringFinished?.()):this.typingTimerID=new Timer(()=>{this.currentLetterIndex--,this.#f()},this.backspaceSpeed,!0)}}