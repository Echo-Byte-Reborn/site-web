class Distance{
    constructor(){

        this.bindEvents();
        this.init();
        this.requete();
    }

    init(){
        
    }


    requete(){
    
        $.post(
            'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', // Le fichier cible côté serveur.
            {
                "aggregateBy": [{
                  "dataTypeName": "com.google.step_count.delta",
                  "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                }],
                "bucketByTime": { "durationMillis": 86400000 },
                "startTimeMillis": 1438705622000,
                "endTimeMillis": 1439310422000
            },
            
            
            this.retour(), // Nous renseignons uniquement le nom de la fonction de retour.
            'text' // Format des données reçues.
        );
        
        function retour(texte_recu){
            //afficher le nombre de pas sur index.html
        }

    }

    retour(texte_recu){
        document.getElementById("pas").innerHTML = texte_recu;

    }
}



export default Distance;