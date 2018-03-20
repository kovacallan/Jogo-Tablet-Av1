BasicGame = {
    score: 0,
    music: null,
    orientated: false,
    UV: 1,
    AV: 1,
    LEVELS: 8 // numero de niveis existente no mapa
};


BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    preload: function () {

        this.stage.backgroundColor = "#FFFFFF";

        this.caminho = getPathFileMapaAventura(GLOBAL_MAPA); 

        console.log("caminho: "+this.caminho);
        
        this.load.atlas('preloader', this.caminho+'preloader.png', this.caminho+'preloader.json');

    },

    create: function () {

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.setMinMax( 250, 150, 1000, 600);

        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.scale.refresh();




        BasicGame.isOnline = BasicGame.OfflineAPI.isOnlineMode();

        BasicGame.OnlineAPI.initialize(BasicGame.isOnline);
        BasicGame.OfflineAPI.setInitialLevel();

        BasicGame.unidades = [];

        var _this = this;

        BasicGame.OnlineAPI.verificarAcessoUnidade (
            function(resposta) {

                console.log(resposta);
                BasicGame.maxUnidade = 0;
                var n = 0;
                
                for(var i = 0; i < resposta.unidadesAcessiveis.length; i++) {
                    n = BasicGame.OnlineAPI.getUDByName( resposta.unidadesAcessiveis[ i ] );

                    console.log(resposta.unidadesAcessiveis[ i ], n);

                    BasicGame.unidades[n-1] = true;
                }
                _this.initPreloader();
            },
            function(erro) {
                console.log(erro);
            }
        );

        if(!BasicGame.isOnline) {
            //BasicGame.maxUnidade = 8;            
            for(var i = 0; i < BasicGame.LEVELS; i++) {
                BasicGame.unidades[i] = true;
            }
            this.initPreloader();
        }

    },
    initPreloader: function() {
        this.add.tween(this).to({}, 400, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.state.start('Preloader');
        }, this);
    }

};