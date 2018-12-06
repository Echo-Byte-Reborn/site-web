import Root from "../components/Root";

class MainRedirect{
    constructor(){
        this.$apliTel = document.querySelector('.apliTel a');
        this.$apliSoutien = document.querySelector('.apliSoutien a');
        this.root = new Root();

        this.bindEvents();
        this.init();
    }

    init(){
        this.$apliTel.href = this.root.defaultRoot+"/apli-telephone/dist/index.html"
        this.$apliSoutien.href =this.root.defaultRoot+"/vue/dist/index.html"
    }

    bindEvents(){
        // Bind every events here
    }

}

export default MainRedirect;