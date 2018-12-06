
import Example from './components/Example'
import {getBrowser} from './utils/environment'


const App = {

    init(){
        document.addEventListener('DOMContentLoaded', this.ready.bind(this), false);
        if(window.DeviceMotionEvent) {
            window.addEventListener("devicemotion", process, false);
          } else {
            // Le navigateur ne supporte pas l'événement devicemotion
          }
    },

    ready(){
        this.initComponents();
        this.bindEvent();

        console.log(getBrowser());
        new Example();
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