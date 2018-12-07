import $ from 'jquery';
var verifMort=false;
class DataPerso{
    constructor(){
        this.$bpm = document.querySelector(".bpm");
        setInterval(function(){
            console.log(Math.floor((Math.random() * 60) + 60));
            document.querySelector(".bpm").innerHTML=Math.floor((Math.random() * 60) + 60);
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