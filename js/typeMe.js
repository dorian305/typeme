function typeMe(x){
    //Saving interval and timeout instances for manipulation
    let typeInterval;
    let delInterval;
    let typeTimeout;
    let delTimeout;
    
    //Creating vertical line and span for typing
    let typingSpan = document.createElement("span");
    let verticalLineDiv = document.createElement("div");
    verticalLineDiv.id = "verticalLine";
    setTimeout(() => verticalLineDiv.style.height = typingSpan.offsetHeight + "px", 10);
    x.element.appendChild(typingSpan);
    x.element.appendChild(verticalLineDiv);
    
    //Adjusting properties
    let properties = {
        //Mandatory properties
        element: typingSpan, //Element to type in
        strings: (typeof x.strings === "string") ? [x.strings] : x.strings, //Strings to type (if single string provided, convert to array)
        
        //Core funtionality properties
        paused: false, //Animation paused flag
        stringCounter: 0, //Keeping track of which string is being animated
        letterCounter: 0, //Keeping track of which letter in a string is being typed
        typingSpan : typingSpan, //The span in which animation takes place
        verticalLine: verticalLineDiv, //The vertical line element
        numOfString: x.strings.length, //Number of strings
        
        //Custom values
        typingSpeed: (typeof x.typingSpeed === "undefined" || !Number.isInteger(x.typingSpeed) || x.typingSpeed == 0) ? 70 : Math.abs(x.typingSpeed),
        deletingSpeed: (typeof x.deletingSpeed === "undefined" || !Number.isInteger(x.deletingSpeed) || x.deletingSpeed == 0) ? 30 : Math.abs(x.deletingSpeed),
        loop: (typeof x.loop === "undefined" || (x.loop != true && x.loop != false)) ? false : x.loop,
        stopOnLastString: (typeof x.stopOnLastString === "undefined" || (x.stopOnLastString != true && x.stopOnLastString != false)) ? false : x.stopOnLastString,
        stringBackspaceDelay: (typeof x.stringBackspaceDelay === "undefined" || !Number.isInteger(x.stringBackspaceDelay)) ? 1000 : x.stringBackspaceDelay,
        stringTypeDelay: (typeof x.stringTypeDelay === "undefined" || !Number.isInteger(x.stringTypeDelay)) ? 0 : x.stringTypeDelay,
        animationStartDelay: (typeof x.animationStartDelay === "undefined" || !Number.isInteger(x.animationStartDelay)) ? 0 : x.animationStartDelay,
        destroyVerticalLine: (typeof x.destroyVerticalLine === "undefined" || (x.destroyVerticalLine != true && x.destroyVerticalLine != false)) ? false : x.destroyVerticalLine,
        
        //Function calls on animation states
        onAnimationComplete: x.onAnimationComplete,
    }

    //Starting animation
    setTimeout(() => type(properties), x.animationStartDelay);
    
    // Object methods //////////////
    //Pausing/resuming the animation instance
    this.toggle = f => {
        
        //Toggling pause flag
        properties.paused = (!properties.paused) ? true : false;
        
        //Run callback function
        callback(f);
    }
    
    //Restarting the instance
    this.restart = f => {
        //Clearing any intervals or timeouts queued for the target instance
        clearInterval(typeInterval);
        clearInterval(delInterval);
        clearTimeout(typeTimeout);
        clearTimeout(delTimeout);
        
        //Reseting properties of the instance
        properties.stringCounter = 0;
        properties.paused = false;
        properties.letterCounter = 0;
        properties.element.innerHTML = "";
        
        //Restarting the instance
        type(properties);
        
        //Run callback function
        callback(f);
    }
    
    //Destroying the instance
    this.destroy = f => {
        //Clearing any intervals or timeouts queued for the target instance
        clearInterval(typeInterval);
        clearInterval(delInterval);
        clearTimeout(typeTimeout);
        clearTimeout(delTimeout);
        
        //Deleting target instance's elements from DOM
        properties.element.remove();
        properties.verticalLine.remove();
        
        //Destroying an object
        for(let x in this){
            if(this.hasOwnProperty(x)){
                delete this[x];
            }
        }
        
        //Run callback function
        callback(f);
    }
    
    //Callback function
    function callback(f){
        if(f){
            f();
        }
    }
    
    // Animation functions /////////////////
    // Typing out the string //
    function type(x){
        typeInterval = setInterval(() => {
            //Animation is not paused
            if(!x.paused){
                //Updating the elem innerHTML
                x.element.innerHTML = x.strings[x.stringCounter].substr(0, x.letterCounter);
                //If whole string has been typed out
                if(x.letterCounter >= x.strings[x.stringCounter].length){
                    //If its the last string in the array of strings
                    if(x.stringCounter == x.strings.length - 1){
                        //stopOnLastString flag is false, delete the last string
                        if(!x.stopOnLastString){
                            typeTimeout = setTimeout(() => del(x), x.stringBackspaceDelay);
                        }
                        //stopOnLastString flag is true, stop the animation without deleting last string
                        else {
                            //Callback function on animation finish
                            if(x.onAnimationComplete){
                                x.onAnimationComplete();
                            }
                            
                            //Destroy vertical line if flag is set to true
                            if(x.destroyVerticalLine){
                                x.verticalLine.remove();
                            }
                            
                            clearInterval(typeInterval);
                        }
                    }
                    //Not the last instance of array of strings, run erasing the string
                    else {
                        typeTimeout = setTimeout(() => del(x), x.stringBackspaceDelay);
                    }

                    //Destroy the interval
                    clearInterval(typeInterval);
                }
                //String still typing out, increment the letter counter
                else {
                    x.letterCounter++;
                }
            }
        }, x.typingSpeed);
    }
    
    // Deleting the string //
    function del(x){
        delInterval = setInterval(() => {
            //Animation is not paused
            if(!x.paused){
                //Updating the elem innerHTML
                x.element.innerHTML = x.strings[x.stringCounter].substr(0, x.letterCounter);
                //If whole string has been erased out
                if(x.letterCounter <= 0){
                    //If its the last string in the array of strings
                    if(x.stringCounter == x.strings.length - 1){
                        //If loop flag is enabled, repeat the typing
                        if(x.loop){
                            delTimeout = setTimeout(() => type(x), x.stringTypeDelay);
                        }
                        //Else destroy animation elements if flag is set to true
                        else {
                            clearInterval(delInterval);
                            if(x.destroyVerticalLine){
                                x.typingSpan.remove()
                                x.verticalLine.remove();
                            }
                        }

                        //Reset string counter back to first string in an array
                        x.stringCounter = 0;
                        
                        //Function to run when animation is completed
                        if(x.onAnimationComplete){
                            x.onAnimationComplete();
                        }
                    }
                    //The string has been erased, increment the string counter and run the typing of the next string
                    else {
                        x.stringCounter++;
                        delTimeout = setTimeout(() => type(x), x.stringTypeDelay);
                    }

                    //Destroy the interval
                    clearInterval(delInterval);
                }
                //String not erased, decrement the letter counter
                else {
                    x.letterCounter--;
                }
            }
        }, x.deletingSpeed);
    }
}