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
        this.$apliTel.href = this.root.defaultRoot+"https://stackoverflow.com/questions/1232793/javascript-set-img-src"
        this.$apliSoutien.href =this.root.defaultRoot+"https://stackoverflow.com/questions/1232793/javascript-set-img-src"
    }

    bindEvents(){
        // Bind every events here
    }

}

export default MainRedirect;