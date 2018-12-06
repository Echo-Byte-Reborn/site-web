
import News from './components/News'
import {getBrowser} from './utils/environment'
import Acceleration from './components/Acceleration'


const App = {
    

    init(){
        document.addEventListener('DOMContentLoaded', this.ready.bind(this), false);
    },

    ready(){
        this.initComponents();
        this.bindEvent();
        console.log(getBrowser());
        new Example();
        new Acceleration ();
        new News();
    },

    bindEvent(){

    },
    

    initComponents(){


    },

    process(event) {
        var x = event.accelerationIncludingGravity.x;
        var y = event.accelerationIncludingGravity.y;
        var z = event.accelerationIncludingGravity.z;
        document.getElementById("log").innerHTML = "<ul><li>X : " + x + "</li><li>Y : " + y + "</li><li>Z : " + z + "</li></ul>";
      }

};





App.init();