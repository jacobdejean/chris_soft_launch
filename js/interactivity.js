// MENU

let menuLinkBlock1 = document.getElementById('menu-link-block-1');
let menuLinkBlock2 = document.getElementById('menu-link-block-2');
let menuLinkBlock3 = document.getElementById('menu-link-block-3');
let menuLinkBlock4 = document.getElementById('menu-link-block-4');
let menuWrapper = document.getElementById('menu-clickout-wrapper');
let clickoutItems = [menuLinkBlock1, menuLinkBlock2, menuLinkBlock3, menuLinkBlock4, menuWrapper];
let menuButton = document.getElementById('menu-button');
function clickoutOfMenu(evt) {
    evt.preventDefault();
    menuButton.click();
}
clickoutItems.forEach(item => {
    item.addEventListener('click', clickoutOfMenu);
    item.addEventListener('touchstart', clickoutOfMenu);
});
menuLinkBlock1.addEventListener('click', (evt) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// FORM

function setModifierClass(element, mod) {
    if (mod.length > 0 && !element.classList.contains(mod))
        element.classList.add(mod);
}

function removeModifierClass(element, mod) {
    if (element.classList.contains(mod))
        element.classList.remove(mod);
}

function removeClassModifiers(element) {
    let classes = element.className.split(' ');

    if (classes.length > 1)
        element.className = classes[0];
}

class ValidatableInputField {

    //  name: [string] name of field. eg. 'email'
    //  validationTypes: [string] space separated list of validation methods to use. eg. 'empty' or 'empty email'
    //  container: [HTMLElement] input-div that contains the fields and the error elements
    //  input: [HTMLElement] text field element
    constructor(name, validationTypes, container, input, errorMessage) {
        this.name = name;
        this.validationTypes = validationTypes;
        this.container = container;
        this.input = input;
        this.errorMessage = errorMessage;

        this.validationState = true;
    }

    validate() {
        this.resetValidationState();

        this.validationTypes.includes('empty') ? this.validateEmpty() : null;
        this.validationTypes.includes('email') ? this.validateEmail() : null;
    }

    validateEmpty() {
        let value = this.input.value.trim();

        this.setValidationState(value.length != 0);

        if (!this.isValid())
            this.errorMessage.innerText = 'This field is required';
    }

    validateEmail() {
        var tester = document.createElement('input');

        tester.type = 'email';
        tester.value = this.input.value.trim();

        this.setValidationState(typeof tester.checkValidity === 'function' ? tester.checkValidity()
            : /\S+@\S+\.\S+/.test(tester.value));

        if (!this.isValid())
            this.errorMessage.innerText = 'Enter a valid email address';
    }

    setValidationState(valid) {
        this.validationState = valid;

        if (!valid)
            setModifierClass(this.container, 'error');
    }

    resetValidationState() {
        this.validationState = true;

        removeModifierClass(this.container, 'error');
    }

    isValid() {
        return this.validationState;
    }
}

class ValidatableInputGroup {
    constructor(group) {
        this.group = group;
    }

    validate() {
        this.group.forEach(field => {
            field.validate();
        });
    }

    reset() {
        this.group.forEach(field => {
            field.resetValidationState();
            field.input.value = '';
        });
    }

    allAreValid() {
        let result = true;

        this.group.forEach(field => {
            if (!field.isValid())
                result = false;
        });

        return result;
    }
}

let nameLabel = document.getElementById('visible-name-label');
let emailLabel = document.getElementById('visible-email-label');
let messageLabel = document.getElementById('visible-message-label');

let nameInput = document.getElementById('visible-name');
let emailInput = document.getElementById('visible-email');
let messageInput = document.getElementById('visible-message');

let nameInputDiv = document.getElementById('name-input-div');
let emailInputDiv = document.getElementById('email-input-div');
let messageInputDiv = document.getElementById('message-input-div');

let nameErrorMessage = document.getElementById('name-error-message');
let emailErrorMessage = document.getElementById('email-error-message');
let messageErrorMessage = document.getElementById('message-error-message');

let submitButton = document.getElementById('visible-submit-button');
let submitButtonLoadingIcon = document.getElementById('visible-submit-button-icon-loading');
let submitButtonCompleteIcon = document.getElementById('visible-submit-button-icon-complete');
let submitButtonText = document.getElementById('visible-submit-button-text');
let formErrorMessage = document.getElementById('form-error');
let form = document.getElementById('email-form');

let nameInputField = new ValidatableInputField("name", "empty", nameInputDiv, nameInput, nameErrorMessage);
let emailInputField = new ValidatableInputField("email", "empty email", emailInputDiv, emailInput, emailErrorMessage);
let messageInputField = new ValidatableInputField("message", "empty", messageInputDiv, messageInput, messageErrorMessage);

let inputGroup = new ValidatableInputGroup([nameInputField, emailInputField, messageInputField]);

function visibleSubmitClick(evt) {
    evt.preventDefault();

    setButtonState('loading', "INITIALIZING...", 'initializing');
    
    formErrorMessage.style.display = 'none';
    inputGroup.validate();
    inputGroup.allAreValid() ? setTimeout(send, 1200) : setButtonState('def', 'SEND', '');
}

function send() {
    emailjs.sendForm('service_lb1roui', 'template_7mjogek', form)
    .then(function(response) {
        console.log('Successfully submitted form: ', response);
        showSuccessState();
    }, function(error) {
        console.log('Failed to submit form: ', error);
        showErrorState();
    });
}

function setButtonState(state, copy, style) {
    submitButtonLoadingIcon.style.display = state === 'loading' ? 'inline-block' : 'none';
    submitButtonCompleteIcon.style.display = state === 'complete' ? 'inline-block' : 'none';
    submitButtonText.style.transform = state === 'loading' ? 'translate(0px, -25%)' : 'translate(0px, 0px)';

    submitButtonText.innerText = copy;

    removeClassModifiers(submitButton);
    setModifierClass(submitButton, style);
}

function onFocusOut(label, inputField) {
    if (changed) {
        inputField.validate();
        removeClassModifiers(label);
        setModifierClass(label, inputField.input.value.length > 0 ? 'filled' : 'placeholder');
    }
}

setModifierClass(nameLabel, 'placeholder');
setModifierClass(emailLabel, 'placeholder');
setModifierClass(messageLabel, 'placeholder');

let changed = false;

nameInput.addEventListener('change', () => { changed = true; });
emailInput.addEventListener('change', () => { changed = true; });
messageInput.addEventListener('change', () => { changed = true; });

nameInput.addEventListener('focusout', () => { onFocusOut(nameLabel, nameInputField); });
emailInput.addEventListener('focusout', () => { onFocusOut(emailLabel, emailInputField); });
messageInput.addEventListener('focusout', () => { onFocusOut(messageLabel, messageInputField); });

submitButton.addEventListener('click', visibleSubmitClick);
submitButton.addEventListener('touchend', visibleSubmitClick);

function showErrorState() {
    formErrorMessage.style.display = 'block';
    setButtonState('def', 'SEND', '');
}

function showSuccessState() {
    setButtonState('complete', 'MESSAGE SENT', '');
    inputGroup.reset();
    changed = false;
}


// SLIDER

//const testimonialUrl = 'https://uploads-ssl.webflow.com/62b632a343e2852836af0565/62d4f6ac727756947b8f3c98_testimonials.txt';
const testimonialUrl = 'documents/testimonials.txt';
let testimonials = {};
let currentSlideIndex = 0;
let nextQuote = document.getElementById('next-quote');
let nextAuthor = document.getElementById('next-author');
let testimonialContainer = document.getElementById('testimonial-container');
let mobileDetector = document.getElementById('mobile-detector');
let sliderSection = document.getElementById('slider-section');
let threshholdMatrix = document.getElementById('threshholdMatrix');
let gaussianBlur = document.getElementById('gaussianBlur');
let controlIndicatorDiv = document.getElementById('control-indicator-div');
let maxBlur = 7;
let blurIndex = 1;
let blurIntensity = 0;
let blurDirection = 0.02;
let transitionDone = false;
let swappedStates = false;
let blurIncreasing = true;
let onMobile = false;
let autoslideCooldown = 5000;
let autoslideTimeoutID = 0;
fetch(testimonialUrl).then((res) => {
    res.json().then((json) => {
        testimonials = json.testimonials;
        onLoad();
    });
});
function onLoad() {
    currentSlideIndex = testimonials.length - 1;
    nextQuote.innerText = testimonials[currentSlideIndex].quote;
    nextAuthor.innerText = testimonials[currentSlideIndex].author;
    for (let i = 0; i < testimonials.length; i++) {
        let indicator = document.createElement('div');
        indicator.className = 'control-indicator' + ((i == testimonials.length - 1) ? ' last-indicator' : '');
        indicator.id = 'indicator-' + i;
        controlIndicatorDiv.appendChild(indicator);
    }
    onMobile = $('#mobile-detector').css('display') === 'none';
    setActiveIndicatorColor('white');
    tryAutoslide();
    startAnimation();
}
function goNext(fromAutoslide) {
    setActiveIndicatorColor('#3A3645');
    if (currentSlideIndex >= testimonials.length - 1)
        currentSlideIndex = 0;
    else
        currentSlideIndex++;
    setActiveIndicatorColor('white');
    if (fromAutoslide) {
        tryAutoslide(1);
    } else {
        cancelAutoslide();
    }
    startAnimation();
}
function goPrevious() {
    setActiveIndicatorColor('#3A3645');
    if (currentSlideIndex <= 0)
        currentSlideIndex = testimonials.length - 1;
    else
        currentSlideIndex--;
    setActiveIndicatorColor('white');
    cancelAutoslide();
    startAnimation();
}
function startAnimation() {
    transitionDone = false;
    blurIntesity = 0;
    blurDirection = 0.02;
    swappedStates = false;
    if (!onMobile)
        testimonialContainer.classList.add('desktop-filter');
    animate();
}
function animate() {
    if (!transitionDone) {
        requestAnimationFrame(animate);
        //gaussianBlur.setAttribute('stdDeviation', "" + easeInOutQuad(blurIntensity / maxBlur) * maxBlur);
        //gaussianBlur.setAttribute('stdDeviation', "" + easeInOutQuad(0.7 / maxBlur) * maxBlur);
        blurIndex += 2;
        //blurIntensity = easeInQuart(Math.sin(blurIndex) / 100);
        blurIntensity = easeInQuart(Math.sin(blurIndex / 50));
        if (!swappedStates && blurIntensity >= 0.99) {
            swapState();
        }
        if (swappedStates && blurIntensity <= 0.016) {
            stopTransition();
            blurIndex = 1;
        }
        if (!onMobile)
            gaussianBlur.setAttribute('stdDeviation', "" + (blurIntensity * maxBlur));
        else
            testimonialContainer.style.opacity = ((-blurIntensity + 1) * 100) + '%';
    }
}
function swapState() {
    swappedStates = true;
    nextQuote.innerText = testimonials[currentSlideIndex].quote;
    nextAuthor.innerText = testimonials[currentSlideIndex].author;
}
function tryAutoslide(multiplier) {
    autoslideTimeoutID = setTimeout(() => { goNext(true); }, autoslideCooldown * multiplier);
}
function cancelAutoslide() {
    if (autoslideTimeoutID != -1) {
        clearTimeout(autoslideTimeoutID);
    }
    tryAutoslide(2);
}
function stopTransition() {
    transitionDone = true;
    if (!onMobile)
        testimonialContainer.classList.remove('desktop-filter');
}
function easeInOutQuint(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}
function easeInQuart(x) {
    return x * x * x * x;
}
function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function setActiveIndicatorColor(color) {
    document.getElementById('indicator-' + currentSlideIndex).style.backgroundColor = color;
}