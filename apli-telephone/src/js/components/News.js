
class News{
    constructor(){
        this.$button = document.querySelector(".buttonNews");
        this.$textbox = document.querySelector('.textBoxNews');
        this.news ="";
        this.bindEvents();
        this.init();
    }

    init(){
        
    }

    bindEvents(){
        this.$button.addEventListener("click",function(){
            this.news=document.querySelector('.textBoxNews').value;
            xhttp.open("POST", "http://51.68.87.119/message", {"message":this.news});
            xhttp.send();
        });
    }

}

export default News;