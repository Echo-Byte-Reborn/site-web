import News from './components/News'
import Example from './components/Example'
import {getBrowser} from './utils/environment'
import Acceleration from './components/Acceleration'
import DataPerso from './components/DataPerso';
import ChatBot from './components/ChatBot';
import Distance from './components/Distance';


const App = {


    init() {
        document.addEventListener('DOMContentLoaded', this.ready.bind(this), false);
    },

    ready() {
        this.initComponents();
        this.bindEvent();
        console.log(getBrowser());
        new Acceleration ();
        new Example();
        new Acceleration();
        //new Distance();
        new News();
        new DataPerso();
        new ChatBot();
    },

    bindEvent() {

    },


    initComponents() {

    },


};

<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
App.init();