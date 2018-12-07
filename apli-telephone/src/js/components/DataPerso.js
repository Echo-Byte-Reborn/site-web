import $ from 'jquery';
var verifMort=false;
class DataPerso{
    constructor(){
        this.$bpm = document.querySelector(".bpm");
        setInterval(function(){
            var bp = Math.floor((Math.random() * 60) + 60);
            document.querySelector(".bpm").innerHTML=bp;
            $.post("http://51.68.87.119:8080/bpm",{"value":bp},function(data){console.log(data)});
        },1000);
        this.bindEvents();
        this.init();
    }

    init(){
        
    }

    bindEvents(){
        
    }

}



export default DataPerso;