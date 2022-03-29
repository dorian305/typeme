//Header animation///////////////
window.onload = () => {
    let terminal = document.querySelector("#terminalDiv");
    let p = appendLine(terminal, "$ ");
    p.innerHTML = "$ ";
    new typeMe({
        element: p,
        strings: ["typeme.about()"],
        stopOnLastString: true,
        destroyVerticalLine: true,
        animationStartDelay: 2000,
        onAnimationComplete: () => {
            let p = appendLine(terminal);
            new typeMe({
                element: p,
                strings: "TypeMe.js is a library written in vanilla JS (no dependencies, yay!), which prints strings as if they were written on a keyboard.",
                stopOnLastString: true,
                animationStartDelay: 500,
                destroyVerticalLine: true,
                onAnimationComplete: () => {
                    let p = appendLine(terminal);
                    new typeMe({
                        element: p,
                        strings: "Pass an array of strings which you want to type out, and let the library take care of the rest.",
                        stopOnLastString: true,
                        destroyVerticalLine: true,
                        onAnimationComplete: () => {
                            let p = appendLine(terminal);
                            new typeMe({
                                element: p,
                                strings: "Library offers plenty of options to customize the animations to suit your project's needs.",
                                stopOnLastString: true,
                                destroyVerticalLine: true,
                            });
                        }
                    });
                }
            });
        }
    });
    
    //Creating paragraphs for terminal line
    function appendLine(appendTo, stringToAppend){
        let p = document.createElement("p");
        appendTo.appendChild(p);
        if(stringToAppend) p.innerHTML = stringToAppend;
        return p;
    }
}
/////////////////////////////////

//Try it section///////////////////////////////
//Animation instance
let tryIt_animationInstance;
//Sliders value change
for(x of [document.querySelector("#typingSpeed_slider"), document.querySelector("#deletingSpeed_slider"), document.querySelector("#stringBackspaceDelay_slider"), document.querySelector("#stringTypeDelay_slider"), document.querySelector("#animationStartDelay_slider"), document.querySelector("#loop_checkbox"), document.querySelector("#stopOnLastString_checkbox"), document.querySelector("#destroyVerticalLine_checkbox")]){
    x.oninput = e => {
        //If an instance is already present, destroy it
        if(tryIt_animationInstance) tryIt_animationInstance.destroy();
        
        //Sliders values
        let typingSpeed_value = parseInt(document.querySelector("#typingSpeed_slider").value);
        let deletingSpeed_value = parseInt(document.querySelector("#deletingSpeed_slider").value);
        let stringBackspaceDelay_value = parseInt(document.querySelector("#stringBackspaceDelay_slider").value);
        let stringTypeDelay_value = parseInt(document.querySelector("#stringTypeDelay_slider").value);
        let animationStartDelay_value = parseInt(document.querySelector("#animationStartDelay_slider").value);
        
        //Updating span element values
        document.querySelector("#tryIt_typeSpeedValueSpan").innerHTML = typingSpeed_value;
        document.querySelector("#tryIt_deleteSpeedValueSpan").innerHTML = deletingSpeed_value;
        document.querySelector("#tryIt_stringBackspaceDelayValueSpan").innerHTML = stringBackspaceDelay_value;
        document.querySelector("#tryIt_stringTypeDelayValueSpan").innerHTML = stringTypeDelay_value;
        document.querySelector("#tryIt_animationStartDelayValueSpan").innerHTML = animationStartDelay_value;
        
        //Initiating a new instance
        tryIt_animationInstance = new typeMe({
            element: document.querySelector("#tryIt_p"),
            strings: "Edit animation options to see it in action here.",
            loop: true,
            typingSpeed: typingSpeed_value,
            deletingSpeed: deletingSpeed_value,
            stringBackspaceDelay: stringBackspaceDelay_value,
            stringTypeDelay: stringTypeDelay_value,
            animationStartDelay: animationStartDelay_value,
            loop: document.querySelector("#loop_checkbox").checked,
            stopOnLastString: document.querySelector("#stopOnLastString_checkbox").checked,
            destroyVerticalLine: document.querySelector("#destroyVerticalLine_checkbox").checked,
        });
        
        //Updating syntax code in code wrapper
        document.querySelector("#tryIt_codeWrapper").innerHTML = `
            let myAnimation = new typeMe({
                element: myElement,
                strings: myStringArray,
                typingSpeed: ` + typingSpeed_value + `,
                deletingSpeed: ` + deletingSpeed_value + `,
                stringBackspaceDelay: ` + stringBackspaceDelay_value + `,
                stringTypeDelay: ` + stringTypeDelay_value + `,
                animationStartDelay: ` + animationStartDelay_value + `,
                loop: ` + document.querySelector("#loop_checkbox").checked + `,
                stopOnLastString: ` + document.querySelector("#stopOnLastString_checkbox").checked + `,
                destroyVerticalLine: ` + document.querySelector("#destroyVerticalLine_checkbox").checked + `,
            });
        `;
    };
}

//Updating slider max value
for(x of [document.querySelector("#typingSpeed_maxValue"), document.querySelector("#deletingSpeed_maxValue"), document.querySelector("#stringBackspaceDelay_maxValue"), document.querySelector("#stringTypeDelay_maxValue"), document.querySelector("#animationStartDelay_maxValue")]){
    x.oninput = e => {
        e.target.previousElementSibling.setAttribute("max", e.target.value);
    };
}
////////////////////////////////

//Methods section//////////////////////
//Animation instance
let methods_animationInstance;

//Fetching elements
let methods_codeWrapper = document.querySelector("#methods_codeWrapper");
let methods_toggleButton = document.querySelector("#methods_toggleButton")
let methods_restartButton = document.querySelector("#methods_restartButton")
let methods_destroyButton = document.querySelector("#methods_destroyButton")

//Toggle methods
function methodToggle(){
    //If animation instance exists, destroy it
    if(methods_animationInstance) methods_animationInstance.destroy();
    
    //Initiate a new instance
    methods_animationInstance = new typeMe({
        element: methods_p,
        strings: "Click the buttons to simulate animation methods, and callback functions.",
        loop: true,
    });
}
methodToggle();

//Button clicks
for(x of [methods_toggleButton, methods_restartButton, methods_destroyButton, document.querySelector("#methods_reset")]){
    x.onclick = e => {
        
        //Which button has been clicked
        switch(e.target){
            //Toggle
            case methods_toggleButton:
                //Changing string color
                methods_animationInstance.toggle(() => methods_p.firstElementChild.style.color = "#"+((1<<24)*Math.random()|0).toString(16));
                
                //Updating code wrapper syntax
                methods_codeWrapper.innerHTML = `
            //Changing text color
            myAnimation.toggle(() => {
                methods_p.firstElementChild.style.color = "#"+((1<<24)*Math.random()|0).toString(16);
            });
            `;
                break;
            //-------
                
            //Restart
            case methods_restartButton:
                methods_animationInstance.restart(() => console.log("The animation has been restated."));
                
                //Updating code wrapper syntax
                methods_codeWrapper.innerHTML = `
            //Logging to console
            myAnimation.restart(() => {
                 console.log("The animation has been restarted.");
            });
            `;
                break;
            //-------
                
            //Destroy
            case methods_destroyButton:
                
                //Alerting on instance destruction
                methods_animationInstance.destroy(() => {
                    alert("The animation instance has been destroyed.");
                });
                
                //Nulling the reference
                methods_animationInstance = null;
                
                //Hiding method buttons and display reset button
                for(x of [methods_toggleButton, methods_restartButton, methods_destroyButton]) x.style.display = "none";
                document.querySelector("#methods_reset").style.display = "";
                
                //Updating code wrapper
                methods_codeWrapper.innerHTML = `
            //Alert window
            myAnimation.destroy(() => {
                alert("The animation instance has been destroyed.");
            });
            `;
                
                break;
                
            //Reset button
            default:
                
                //Creating new animation instance
                methodToggle();
                
                //Displaying method buttons and hiding reset button
                for(x of [methods_toggleButton, methods_restartButton, methods_destroyButton]) x.style.display = "";
                document.querySelector("#methods_reset").style.display = "none";
                
                //Updating code wrapper
                methods_codeWrapper.innerHTML = `
            //Animation instance
            myAnimation
            `;
        }
    }
}

////////////////////////////////

//Updating footer copyright year
document.querySelector("#currentYear").innerHTML = new Date().getFullYear();