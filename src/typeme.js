class Timer {
    constructor(callback, delay, autostart = false) {
        this.callback = callback;     // Function that will execute when the timer expires
        this.remainingTime = delay;   // Time until the timer expires, in milliseconds
        this.startedTime = 0;         // Date when the timer was started, in milliseconds
        this.pausedTime = 0;          // Date when the timer was paused, in milliseconds
        this.timerId = 0;             // The ID of the timer
        
        // Automatically start timer upon instantiation
        if (autostart) this.start();
    }

    // Pausing the timer
    pause() {
        this.pausedTime = new Date();
        this.destroy();
        this.remainingTime = this.remainingTime - (this.pausedTime - this.startedTime);
    }

    // Resuming the timer
    resume() {
        this.startedTime = new Date();
        this.destroy();
        this.timerId = setTimeout(() => this.callback(), this.remainingTime);
    }

    // Start the timer
    start() {
        this.startedTime = new Date();
        this.timerId = setTimeout(() => this.callback(), this.remainingTime);
    }

    // Destroy the timer
    destroy() {
        clearTimeout(this.timerId);
    }
}

class TypeMe {
    constructor({elem, strings, properties, cursorProperties}){
        /**
         * Which element the animation will execute on.
         * passed the id of the element, fetches the element by its ID
         * passed the class of the element, fetches all the elements with that class and mirrors animation on each of them
         * passed the DOM element directly
         * passed NodeList directly
         */
        if (!elem){
            throw `Error: Element to animate on is not defined`;
        }
        else if (typeof elem === "string"){
            this.elem = document.querySelectorAll(elem);
        }
        else if (elem instanceof Element){
            this.elem = [elem];
        }
        else if (elem instanceof NodeList) {
            this.elem = elem;
        }
        else {
            throw `Error: first argument ${elem} is not a valid HTML Element or NodeList`;
        }

        /**
         * Strings the animation will type out
         */
        this.strings = strings || [
            "Hello, I'm TypeMe.",
            "I am a JavaScript typing animation plugin that can type out strings, just like this one!",
        ];
        
        /**
         * Animation custom properties
         */
        this.typeSpeed = (typeof properties?.typeSpeed !== "undefined") ? properties.typeSpeed : 70; // Animation typing speed (keyboard presses per minute)
        this.backspaceSpeed = (typeof properties?.backspaceSpeed !== "undefined") ? properties.backspaceSpeed : 20; // Animation backspacing speed (keyboard presses per minute)
        this.pauseAfterFullstop = (typeof properties?.pauseAfterFullstop !== "undefined") ? properties.pauseAfterFullstop : 500; // Amount of time the animation will wait after full stop in a string
        this.loop = (typeof properties?.loop !== "undefined") ? properties.loop : false; // Loop animation
        this.stopOnLastString = (typeof properties?.stopOnLastString !== "undefined") ? properties.stopOnLastString : true ;// Skip backspacing last string after finished typing
        this.animationStartDelay = (typeof properties?.animationStartDelay !== "undefined") ? properties.animationStartDelay : 750;  // Delay before the animation starts
        this.typeStartDelay = (typeof properties?.typeStartDelay !== "undefined") ? properties.typeStartDelay : 500; // Delay before each sentence starts being typed out
        this.backspaceStartDelay = (typeof properties?.backspaceStartDelay !== "undefined") ? properties.backspaceStartDelay : 500; // Delay before each sentence starts being backspaced (in miliseconds)
        this.onBegin = properties?.onBegin; // Callback function that runs after the animation has started
        this.onStringFinished = properties?.onStringFinished; // Callback function that runs after typing out each String
        this.onComplete = properties?.onComplete; // Callback function that runs after the animation is complete

        /**
         * Cursor custom properties
         */
        this.cursorID = (typeof cursorProperties?.cursorID !== "undefined") ? cursorProperties.cursorID : ""; // Cursor element ID
        this.cursorClass = (typeof cursorProperties?.cursorClass !== "undefined") ? cursorProperties.cursorClass : ""; // Cursor element class name
        this.cursor = (typeof cursorProperties?.cursor !== "undefined") ? cursorProperties.cursor : "|"; // The cursor character
        this.cursorRemoveOnAnimationComplete = (typeof cursorProperties?.cursorRemoveOnAnimationComplete !== "undefined") ? cursorProperties.cursorRemoveOnAnimationComplete : false; // Removes the cursor on animation complete
        this.cursorAnimationSpeed = cursorProperties?.cursorAnimationSpeed || 2;   // Number of times cursor blinks in a second

        /**
         * Animation default properties
         */
        this.typingCursors = [];                                // Array that will hold the typing cursors
        this.opacity = 1;                                       // Starting opacity of typing cursors
        this.animationPaused = false;                           // Is the typing animation paused or not
        this.animationRunning = false;                          // Is the typing animation running or not
        this.currentString = 0;                                 // Keeps track of the current string that is being typed out
        this.currentLetterIndex = 0;                            // Keeps track of the current letter being typed out in the string
        this.typingTimerID = null;                              // Typing animation timerID

        /**
         * Cursor default properties
         */
        this.cursorStepValue = 0.1;                             // The value that will be incremented or decremented
        this.cursorStepValueSign = -1;                          // Changes step value to increment or decrement
        this.typingCursorAnimationTimerID = null;               // Typing cursors animation timerID

        /**
         * Initialize TypeMe
         */
        this.#initTypeMe();
    }

    #initTypeMe(){
        this.elem.forEach(element => {
            if (element.tagName.toLowerCase() === "input" && element.getAttribute("type") === "text" || element.tagName.toLowerCase() === "textarea"){
                element.value = "";
            }
            else {
                /**
                 * Create element where typed content will be in
                 */
                const typedElement = document.createElement("span");
                element.insertAdjacentElement("beforeend", typedElement);
                
                /**
                 * Create typing cursors
                 */
                const typingCursor = document.createElement("span");
                typingCursor.textContent = this.cursor;
                typingCursor.style.opacity = `${this.opacity}`;
                if (this.cursorID) typingCursor.setAttribute("id", this.cursorID);
                if (this.cursorClass) typingCursor.setAttribute("class", this.cursorClass);

                //Adding cursor to the array and appending it after the typing element
                this.typingCursors.push(typingCursor);
                element.insertAdjacentElement("beforeend", typingCursor);
                
                this.#cursorOpacityAnimation(); // Start cursors opacity animation
            }
        });
    }

    /**
     * Start the typing animation
     */
    start(){
        if (!this.animationRunning){
            this.animationRunning = true;
            this.elem.forEach(element => {
                if (element.tagName.toLowerCase() === "input" && element.getAttribute("type") === "text" || element.tagName.toLowerCase() === "textarea"){
                    element.value = "";
                }
                else {
                    element.querySelector('span:first-child').textContent = "";
                    this.typingCursors.forEach(cursor => cursor.style.display = "");
                }
            });
            this.onBegin?.();
            this.typingTimerID = new Timer(() => this.#typeString(), this.animationStartDelay, true);
        }
        else {
            console.warn("Animation already running! Did you mean to use .restart() ?");
        }
    }
    
    #animationComplete(){
        /**
         * Resetting animation properties
         */
        this.#reset();

        if (this.cursorRemoveOnAnimationComplete){
            this.typingCursors.forEach(cursor => cursor.style.display = "none");
        }

        /**
         * Calling complete() on animation complete if defined
         */
        this.onComplete?.();

        /**
         * Loop animation if the flag set to true
         */
        if (this.loop){
            if (this.stopOnLastString){
                this.typingTimerID = new Timer(() => this.restart(), this.backspaceStartDelay, true);
            }
            else {
                this.restart();
            }
        }
    }

    pause(callback){
        if (this.animationRunning){
            if (!this.animationPaused){
                this.animationPaused = true;
                this.typingTimerID.pause();
                callback?.();
            }
            else {
                console.warn("Animation is already paused! Did you mean to use .resume() or toggle() ?");
            }
        }
        else {
            console.warn("Animation isn't running!");
        }
    }

    resume(callback){
        if (this.animationRunning){
            if (this.animationPaused){
                this.animationPaused = false;
                this.typingTimerID.resume();
                callback?.();
            }
            else {
                console.warn("Animation is already resumed! Did you mean to use .pause() or toggle() ?");
            }
        }
        else {
            console.warn("Animation isn't running!");
        }
    }

    toggle(callback){
        if (this.animationRunning){
            !this.animationPaused ? this.typingTimerID.pause() : this.typingTimerID.resume();
            this.animationPaused = !this.animationPaused;
            callback?.();
        }
        else {
            console.warn("Animation isn't running!");
        }
    }

    /**
     * 
     * Restarts animation
     */
    restart(callback){
        this.elem.forEach(element => {
            if (element.tagName.toLowerCase() === "input" && element.getAttribute("type") === "text" || element.tagName.toLowerCase() === "textarea"){
                element.value = "";
            }
            else {
                element.querySelector('span:first-child').textContent = "";
            }
        });
        this.#reset();
        this.start();
        callback?.();
    }

    /**
     * Resets animation properties
     */
    #reset(){
        this.currentString = 0;
        this.currentLetterIndex = 0;
        this.animationPaused = false;
        this.animationRunning = false;
        this.typingTimerID?.destroy();
        this.typingTimerID = null;
        this.elem.forEach(element => element.querySelector("span:nth-child(2)").textContent = this.cursor);
    }

    /**
     * Animating cursor blinking
     */
    #cursorOpacityAnimation(){
        if (this.opacity <= 0){
            this.cursorStepValueSign = 1;
        }
        else if (this.opacity >= 1){
            this.cursorStepValueSign = -1;
        }
        this.opacity += this.cursorStepValueSign * this.cursorStepValue;
        this.typingCursors.forEach(typingCursor => typingCursor.style.opacity = `${this.opacity}`);
        this.typingCursorAnimationTimerID = new Timer(() => this.#cursorOpacityAnimation(), (1000 / this.cursorAnimationSpeed) / 20, true);
    }

    /**
     * Typing animation logic here
     */
     #typeString(){
        /**
         * Animating string typing to the provided elements
         */
        this.elem.forEach(element => {
            /**
             * Checking whether element is input text because input needs attribute value manipulation instead of
             * just appending text to its content
             */
            if (element.tagName.toLowerCase() === "input" && element.getAttribute("type") === "text" || element.tagName.toLowerCase() === "textarea"){
                element.value += this.strings[this.currentString][this.currentLetterIndex];
            }
            else {
                element.querySelector("span:first-child").textContent += this.strings[this.currentString][this.currentLetterIndex];
            }
            element.scrollLeft = element.scrollWidth;
            element.scrollTop = element.scrollHeight;
        });

        /**
         * Checking if the currentLetterIndex has reached the end of the string
         */
         if (this.currentLetterIndex + 1 >= this.strings[this.currentString].length){
             /**
              * If it's last string, check if stopOnLastString is true, and if it is,
              * complete animation, otherwise run backspacing
              */
             if (this.currentString + 1 >= this.strings.length){
                if (this.stopOnLastString){
                     this.onStringFinished?.();
                     this.#animationComplete();
                }
                else {
                    this.typingTimerID = new Timer(() => {
                        this.#backspaceString();
                        this.currentLetterIndex = this.strings[this.currentString].length - 1; // Making sure indexing is right
                    }, this.backspaceStartDelay, true);
                }
            }
            /**
             * Start backspacing this string, and move on to the next string
             */
            else {
                this.typingTimerID = new Timer(() => {
                    this.#backspaceString();
                    this.currentLetterIndex = this.strings[this.currentString].length - 1; // Making sure indexing is right
                }, this.backspaceStartDelay, true);
            }
        }
        /**
         * Continue typing
         */
        else {
            this.typingTimerID = new Timer(() => {
                this.currentLetterIndex++;
                this.#typeString();
            }, ((this.strings[this.currentString][this.currentLetterIndex] === ".") ? this.pauseAfterFullstop + this.typeSpeed : this.typeSpeed), true);
        }
    }

    /**
     * Backspace animation logic here
     */
    #backspaceString(){
        /**
         * Animating string backspacing to the provided elements
         */
        this.elem.forEach(element => {
            /**
             * Checking whether element is input text because input needs attribute value manipulation instead of
             * just removing text to its content
             */
             if (element.tagName.toLowerCase() === "input" && element.getAttribute("type") === "text" || element.tagName.toLowerCase() === "textarea"){
                element.value = element.value.substring(0, this.currentLetterIndex);
            }
            else {
                const span = element.querySelector("span:first-child");
                span.textContent = span.textContent.substring(0, this.currentLetterIndex);
            }
            element.scrollLeft = element.scrollWidth;
            element.scrollTop = element.scrollHeight;
        });

        /**
         * Checking if the currentLetterIndex has backspaced entire string
         */
         if (this.currentLetterIndex + 1 <= 0){
             /**
              * Animation has completed if all strings have been typed out
              */
             if (this.currentString + 1 >= this.strings.length){
                 /**
                  * Run callback function after string finish
                  */
                 this.onStringFinished?.();

                this.#animationComplete();
            }
            /**
             * Move on to the next string, and start typing it
             */
            else {
                this.typingTimerID = new Timer(() => {
                    this.currentString++;
                    this.currentLetterIndex = 0; // Making sure indexing is right
                    this.#typeString();
                }, this.typeStartDelay, true);

                /**
                 * Run callback function after string finish
                 */
                this.onStringFinished?.();
            }
        }
        /**
         * Continue backspacing
         */
        else {
            this.typingTimerID = new Timer(() => {
                this.currentLetterIndex--;
                this.#backspaceString();
            }, this.backspaceSpeed, true);
        }
    }
}