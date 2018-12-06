

class Acceleration{
    constructor(){


        this.bindEvents();
        this.init();
    }

    init(){
    }

    bindEvents(){
        if(window.DeviceMotionEvent) {
            window.addEventListener("devicemotion", function (){
                var x = event.accelerationIncludingGravity.x;
                this.console.log(x);
                var y = event.accelerationIncludingGravity.y;
                var z = event.accelerationIncludingGravity.z;
                document.getElementById("log").innerHTML = "<ul><li>X : " + x + "</li><li>Y : " + y + "</li><li>Z : " + z + "</li></ul>";

            }, false);
          } else {
            // Le navigateur ne supporte pas l'événement devicemotion
          }
    }

}

export default Acceleration;