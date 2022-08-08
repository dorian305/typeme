let terminal = document.querySelector("#terminalDiv");

const p = document.createElement("p");
p.textContent = "$ ";
terminal.insertAdjacentElement("beforeend", p);
const mytypeme = new TypeMe({
    elem: p,
    strings: ["TypeMe.about()"],
    properties: {
        stopOnLastString: true,
        pauseAfterFullstop: 0,
        animationStartDelay: 1000,
        onComplete: terminalAnimation,
    },
    cursorProperties: {
        cursorRemoveOnAnimationComplete: true,
    }
});
mytypeme.start();

function terminalAnimation(){
    const p = document.createElement("p");
    terminal.insertAdjacentElement("beforeend", p);
    const mytypeme = new TypeMe({
        elem: p,
        strings: [
            "TypeMe.js is a JavaScript plugin which animates the effect of typing a sentence as if it were typed by a person.",
            "Select the element, or elements, which you wish to animate typing on, pass the array of strings you want typed out, and watch the plugin do the magic for you.",
            "The plugin can be extended with custom properties which allow you to tailor the animation experience to your needs.",
        ],
        stopOnLastString: true,
        properties: {
            pauseAfterFullstop: 0,
            backspaceStartDelay: 1000,
        },
        cursorProperties: {
            cursorRemoveOnAnimationComplete: true,
        }
    });
    mytypeme.start();
}

//Animation instance
let tryIt_animationInstance = new TypeMe({
    elem: "#tryIt_p",
    strings: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Nam vel congue lacus. Duis a nisl nec dui sollicitudin condimentum a pellentesque ante.",
        "Etiam viverra sit amet tortor non maximus.",
        "Pharetra vulputate ex, eu convallis lectus posuere eu.",
    ],
    properties: {
        typeSpeed: 70,
        backspaceSpeed: 20,
        pauseAfterFullstop: 500,
        loop: false,
        stopOnLastString: true,
        animationStartDelay: 250,
        typeStartDelay: 500,
        backspaceStartDelay: 500,
    },
    cursorProperties: {
        cursorID: "typingCursorID",
        cursorClass: "typingCursorClass",
        cursor: "|",
    },
});
tryIt_animationInstance.start();

//Sliders value change
document.querySelectorAll("#typeSpeed_slider, #backspaceSpeed_slider, #fullstopPause_slider, #animationStartDelay_slider, #backspaceStartDelay_slider, #typeStartDelay_slider, #loop_checkbox, #stopOnLastString_checkbox, #cursorRemoveOnAnimationComplete_checkbox, #cursor_input, #cursorAnimationSpeed_slider").forEach(element => {
    element.addEventListener("input", () => {
        // Input values
        let typeSpeed_value = parseInt(document.querySelector("#typeSpeed_slider").value);
        let backspaceSpeed_value = parseInt(document.querySelector("#backspaceSpeed_slider").value);
        let fullstopPause_value = parseInt(document.querySelector("#fullstopPause_slider").value);
        let animationStartDelay_value = parseInt(document.querySelector("#animationStartDelay_slider").value);
        let typeStartDelay_value = parseInt(document.querySelector("#typeStartDelay_slider").value);
        let backspaceStartDelay_value = parseInt(document.querySelector("#backspaceStartDelay_slider").value);
        let cursor_value = document.querySelector("#cursor_input").value;
        let cursorAnimationSpeed_value = document.querySelector("#cursorAnimationSpeed_slider").value;
        
        //Updating span element values
        document.querySelector("#tryIt_typeSpeedValueSpan").textContent = typeSpeed_value;
        document.querySelector("#tryIt_backspaceSpeedValueSpan").textContent = backspaceSpeed_value;
        document.querySelector("#tryIt_fullstopPauseValueSpan").textContent = fullstopPause_value;
        document.querySelector("#tryIt_animationStartDelayValueSpan").textContent = animationStartDelay_value;
        document.querySelector("#tryIt_typeStartDelayValueSpan").textContent = typeStartDelay_value;
        document.querySelector("#tryIt_backspaceStartDelayValueSpan").textContent = backspaceStartDelay_value;
        document.querySelector("#tryIt_cursorValueSpan").textContent = cursor_value;
        document.querySelector("#tryIt_cursorAnimationSpeedValueSpan").textContent = cursorAnimationSpeed_value;

        // Updating animation properties
        tryIt_animationInstance.typeSpeed = typeSpeed_value;
        tryIt_animationInstance.backspaceSpeed = backspaceSpeed_value;
        tryIt_animationInstance.pauseAfterFullstop = fullstopPause_value;
        tryIt_animationInstance.loop = document.querySelector("#loop_checkbox").checked;
        tryIt_animationInstance.stopOnLastString = document.querySelector("#stopOnLastString_checkbox").checked;
        tryIt_animationInstance.animationStartDelay = animationStartDelay_value;
        tryIt_animationInstance.typeStartDelay = typeStartDelay_value;
        tryIt_animationInstance.backspaceStartDelay = backspaceStartDelay_value;

        // Updating cursor properties
        tryIt_animationInstance.cursor = cursor_value;
        tryIt_animationInstance.cursorAnimationSpeed = cursorAnimationSpeed_value;
        tryIt_animationInstance.cursorRemoveOnAnimationComplete = document.querySelector("#cursorRemoveOnAnimationComplete_checkbox").checked;

        //Restart an instance
        tryIt_animationInstance.restart();
        
        //Updating syntax code in code wrapper
        document.querySelector("#tryIt_codeWrapper").textContent = `
            let tryIt_animationInstance = new TypeMe({
                elem: "#tryIt_p",
                strings: [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    "Nam vel congue lacus. Duis a nisl nec dui sollicitudin condimentum a pellentesque ante.",
                    "Etiam viverra sit amet tortor non maximus.",
                    "Pharetra vulputate ex, eu convallis lectus posuere eu.",
                ],
                properties: {
                    typeSpeed: ${typeSpeed_value},
                    backspaceSpeed: ${backspaceSpeed_value},
                    pauseAfterFullstop: ${fullstopPause_value},
                    loop: ${document.querySelector("#loop_checkbox").checked},
                    stopOnLastString: ${document.querySelector("#stopOnLastString_checkbox").checked},
                    animationStartDelay: ${animationStartDelay_value},
                    typeStartDelay: ${typeStartDelay_value},
                    backspaceStartDelay: ${backspaceStartDelay_value},
                },
                cursorProperties: {
                    cursor: "${cursor_value}",
                    cursorRemoveOnAnimationComplete: ${document.querySelector("#cursorRemoveOnAnimationComplete_checkbox").checked},
                    cursorAnimationSpeed: ${cursorAnimationSpeed_value},
                },
            });
        `;
    });
});

//Updating slider max value
document.querySelectorAll("#typeSpeed_maxValue, #backspaceSpeed_maxValue, #fullstopPause_maxValue, #animationStartDelay_maxValue, #typeStartDelay_maxValue, #backspaceStartDelay_maxValue, #cursorAnimationSpeed_maxValue").forEach(element => {
    element.addEventListener("input", e => {
        e.target.previousElementSibling.setAttribute("max", e.target.value);
    });
});

let methods_animationInstance = new TypeMe({
    elem: "#methods_p",
    strings: [
        "Click on various methods to test them.",
    ],
    properties: {
        loop: true,
        stopOnLastString: false,
    },
});
methods_animationInstance.start();

// //Fetching elements
let methods_codeWrapper = document.querySelector("#methods_codeWrapper");
let methods_pauseButton = document.querySelector("#methods_pauseButton");
let methods_resumeButton = document.querySelector("#methods_resumeButton");
let methods_toggleButton = document.querySelector("#methods_toggleButton");
let methods_restartButton = document.querySelector("#methods_restartButton");

[methods_pauseButton, methods_resumeButton, methods_toggleButton, methods_restartButton].forEach(button => {
    button.addEventListener("click", e => {
        // Pause button
        if (e.target === methods_pauseButton){
            methods_animationInstance.pause(() => console.log("Animation paused"));
            methods_codeWrapper.textContent = `
                methods_animationInstance.pause(() => {
                    console.log("Animation paused");
                });
            `;
        }
        // Resume button
        if (e.target === methods_resumeButton){
            methods_animationInstance.resume(() => console.log("Animation resumed"));
            methods_codeWrapper.textContent = `
                methods_animationInstance.resume(() => {
                    console.log("Animation resumed");
                });
            `;
        }
        // Toggle button
        if (e.target === methods_toggleButton){
            methods_animationInstance.toggle(() => console.log(`Animation ${methods_animationInstance.animationPaused ? "paused" : "resumed"}`));
            methods_codeWrapper.textContent = `
                methods_animationInstance.toggle(() => {
                    console.log("Animation paused / resumed");
                });
            `;
        }
        // Restart button
        if (e.target === methods_restartButton){
            methods_animationInstance.restart(() => console.log(`Animation restarted`));
            methods_codeWrapper.textContent = `
                methods_animationInstance.restart(() => {
                    console.log("Animation restarted");
                });
            `;
        }
    });
});

/**
 * Dragging terminal window by the toolbar (::before)
 */
let dragging = false;
let mouseOnToolbar = false;
const header = document.querySelector("header");
header.addEventListener("mousemove", e => {
    const terminalLeft = terminal.offsetLeft;
    const terminalTop = terminal.offsetTop;
    const mouse = {x: e.pageX, y: e.pageY};
    
    // 35 is the height of the terminal toolbar
    mouseOnToolbar = !(mouse.x < terminalLeft || mouse.x > terminalLeft + terminal.clientWidth || mouse.y < terminalTop || mouse.y > terminalTop + 35) ? true : false;

    // Updating toolbar position on dragging
    if (dragging){
        terminal.style.position = "absolute";
        terminal.style.left = terminalLeft + e.movementX + "px";
        terminal.style.top = terminalTop + e.movementY + "px";
    }
});
header.addEventListener("mousedown", e => dragging = mouseOnToolbar ? true : false);
header.addEventListener("mouseup", e => dragging = false);
header.addEventListener("mouseleave", e => dragging = false);

/**
 * Centering terminal
 */

//Updating footer copyright year
document.querySelector("#currentYear").innerHTML = new Date().getFullYear();