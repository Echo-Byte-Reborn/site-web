
import Example from './components/Example'
import {getBrowser} from './utils/environment'
import MainRedirect from './components/MainRedirect'

const App = {


    init(){
        document.addEventListener('DOMContentLoaded', this.ready.bind(this), false);
    },

    ready(){
        this.initComponents();
        this.bindEvent();

        console.log(getBrowser());
        new Example();
        new MainRedirect();
    },

    bindEvent(){

    },

    initComponents(){


    }
    

};


App.init();