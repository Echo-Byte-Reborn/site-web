
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
            console.log(this.news);
        });
    }

}

export default News;