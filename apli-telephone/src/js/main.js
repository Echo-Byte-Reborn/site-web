
import News from './components/News'
import Example from './components/Example'
import {getBrowser} from './utils/environment'
import Acceleration from './components/Acceleration'
import DataPerso from './components/DataPerso';


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
        new DataPerso();
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