<<<<<<< HEAD
=======
 

>>>>>>> master
class Acceleration{
    constructor(){
        

        this.bindEvents();
        this.init();
    }

    init(){
    }

    sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      }

    bindEvents(){
        var boole=true
        if(boole) {
            window.addEventListener("devicemotion", function (){
                var x = event.accelerationIncludingGravity.x;
                var y = event.accelerationIncludingGravity.y;
                var z = event.accelerationIncludingGravity.z;
                if (z<3){
                    console.log("je tombe")
                    boole=false
                }else{
                    document.getElementById("log").innerHTML = "<ul><li>X : " + x + "</li><li>Y : " + y + "</li><li>Z : " + z + "</li></ul>";
                }

            }, false);
          } else {
            // Le navigateur ne supporte pas l'événement devicemotion
          }
    }

    //Chute?
    chute_bool(){
    }


}

export default Acceleration;