import $ from 'jquery';
var verifMort=false;
var tempsBPM =0;
class DataPerso{
    constructor(){
        this.$bpm = document.querySelector(".bpm");
        setInterval(function(){
            tempsBPM=Math.floor((Math.random() * 60) + 60)
            document.querySelector(".bpm").innerHTML=tempsBPM;
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