import News from './components/News'
import Example from './components/Example'
import {getBrowser} from './utils/environment'
import Acceleration from './components/Acceleration'
import DataPerso from './components/DataPerso';
import ChatBot from './components/ChatBot';


const App = {


    init() {
        document.addEventListener('DOMContentLoaded', this.ready.bind(this), false);
    },

    ready() {
        this.initComponents();
        this.bindEvent();
        console.log(getBrowser());
        new Example();
        new Acceleration();
        new News();
        new DataPerso();
        new ChatBot();
    },

    bindEvent() {

    },


    initComponents() {


    },


};


App.init();