export default class LoadButton {

    static classes = {
        hidden: 'hidden',
    }

    constructor(button) {
        const {selector, isHidden = true} = button;
        this.button = this.getButton(selector);
        if(isHidden) {
            this.hideButton;
        }
    }

    getButton(selector) {
        return document.querySelector(selector);
    }

    hideButton() {
        this.button.classList.add(LoadButton.classes.hidden);
    }

    showButton() {
        this.button.classList.remove(LoadButton.classes.hidden);
    }

    disableButton() {
        this.button.disabled = true;
        this.button.textContent = "Loading....";
    }

    enableButton() {
        this.button.disabled = false;
        this.button.textContent = "Load More";
    }


}