

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    preload: function () {

        this.stage.backgroundColor = "#FFFFFF";

        this.caminho = getPathFile(GLOBAL);

        console.log("GLOBAL "+this.caminho);
        
        
        this.load.atlas('preloader', this.caminho+'preloader.png', this.caminho+'preloader.json');

    },

    create: function () {

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = false;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.setMinMax( 250, 150, 1000, 600);

        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.scale.refresh();

        console.log("execute Boot");

        
        BasicGame.isOnline = BasicGame.OfflineAPI.isOnlineMode();

        BasicGame.OnlineAPI.initialize(BasicGame.isOnline);
        BasicGame.OfflineAPI.setInitialLevel();

        if(BasicGame.isOnline) {
            BasicGame.OfflineAPI.cleanCookie();
            BasicGame.OfflineAPI.cleanVideos();
            BasicGame.OfflineAPI.setInitialLevel();
        
            this.verificaAcessos();
        }
        

        if(!BasicGame.isOnline) {       
            this.initPreloader();
        }
    },

    verificaAcessos: function() {

        var _this = this;

        BasicGame.OnlineAPI.verificarAcessoObjetoAprendizagem (
            function(resposta) {

                console.log(resposta);
                
                for(var i = 0; i < resposta.objetosAprendizagemAcessiveis.length; i++) {
                    var curr = resposta.objetosAprendizagemAcessiveis[i];
                    if(BasicGame.OnlineAPI.isVideo( curr )) {
                        var _vid = BasicGame.OnlineAPI.getVideoByName( curr );
                        console.log("video", _vid);
                        BasicGame.OfflineAPI.saveVideo( _vid );
                    } else {
                        var _obj = BasicGame.OnlineAPI.getOAByName( curr );
                        console.log("Abrir", curr, _obj+1);
                        BasicGame.OfflineAPI.unlockLevel( _obj );
                    }
                }
                _this.verificaConclusoes();
            },
            function(erro) {
                console.log(erro);
            }
        );
    },

    verificaConclusoes: function() {

        var _this = this;

        BasicGame.OnlineAPI.verificarConclusoesObjetosAprendizagem (
            function(resposta) {

                console.log(resposta);
                
                for(var i = 0; i < resposta.objetosConcluidos.length; i++) {
                    
                    var curr = resposta.objetosConcluidos[i];

                    if(BasicGame.OnlineAPI.isVideo( curr )) {
                        var _vid = BasicGame.OnlineAPI.getVideoByName( curr );
                        console.log("video", _vid);
                        BasicGame.OfflineAPI.saveVideo( _vid );
                    } else {
                        var _obj = BasicGame. OnlineAPI.getOAByName( curr );
                        console.log("Abrir", curr, _obj+1);
                        BasicGame.OfflineAPI.setFinished( _obj );
                    }
                }
                _this.initPreloader();
            },
            function(erro) {
                console.log(erro);
            }
        );
    },

    initPreloader: function() {
        this.add.tween(this).to({}, 400, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.game.canvas.className = "visible";
            this.state.start('Preloader');
        }, this);
    }

};