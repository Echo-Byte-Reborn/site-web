
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
        new Acceleration ();
        new News();
    },

    bindEvent(){

    },
    

    initComponents(){


    },


};

App.init();