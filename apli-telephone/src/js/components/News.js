import $ from 'jquery';
var verifMort=false;
class News{
    constructor(){
        this.$button = document.querySelector(".buttonNews");
        this.$textbox = document.querySelector('.textBoxNews');
        this.news ="";
        this.$envoieNews = document.querySelector('.envoieNews');
        verifMort=true;
        document.querySelector('.envoieNews').style.opacity='1';
        setInterval(function(){
            if(verifMort==true)
            {
                $.post("http://51.68.87.119:8080/message",{"message":"ALERT IL EST MORT"},function(data){console.log(data)});
                this.$envoieNews.style.opacity='0';
            }
        },300000)
        var myVar = setInterval(function(){
                                    verifMort=true;
                                    document.querySelector('.envoieNews').style.opacity='1';
                                    setInterval(function(){
                                        if(verifMort==true)
                                        {
                                            $.post("http://51.68.87.119:8080/message",{"message":"ALERT IL EST MORT"},function(data){console.log(data)});
                                            this.$envoieNews.style.opacity='1';
                                        }
                                    },300000);
                                },600000);
        this.bindEvents();
        this.init();
    }

    init(){
        
    }

    bindEvents(){
        this.$button.addEventListener("click",function(){
            this.news=document.querySelector('.textBoxNews').value;
            $.post("http://51.68.87.119:8080/message",{"message":this.news},function(data){console.log(data)});
            this.$envoieNews.style.opacity='0';
            verifMort=false;
        });
    }

}



export default News;