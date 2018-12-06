
import Example from './components/Example'
import News from './components/News'
import {getBrowser} from './utils/environment'


const App = {

    init(){
        document.addEventListener('DOMContentLoaded', this.ready.bind(this), false);
    },

    ready(){
        this.initComponents();
        this.bindEvent();
        console.log(getBrowser());
        new Example();
        new News();
    },

    bindEvent(){

    },

    initComponents(){


    },


};





App.init();