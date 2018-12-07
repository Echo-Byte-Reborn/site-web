class Chatbot {
    constructor() {
        this.$button = document.querySelector(".buttonChatbot");
        this.$chatbot = document.querySelector(".chatbot");
        this.isopen = false


        this.bindEvents();
        this.init();
    }

    init() {
        this.$chatbot.classList.add("hide")

    }

    bindEvents() {
        this.$button.addEventListener("click", () => {
            if (this.isopen) {
                this.isopen = false
                this.$chatbot.classList.add("hide")
            } else {
                this.isopen = true
                this.$chatbot.classList.remove("hide")
            }
        })
    }

}

export default Chatbot;