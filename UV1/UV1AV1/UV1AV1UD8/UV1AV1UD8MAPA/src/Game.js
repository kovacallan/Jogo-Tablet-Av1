BasicGame.Game = function (game) {

    this.initExtends();

    BasicGame.GameBase.call(game);
};

BasicGame.Game.prototype = Object.create(BasicGame.GameBase.prototype);
BasicGame.Game.prototype.constructor = BasicGame.Game;

BasicGame.Game.prototype.initExtends = function() {
    for(var name in this.extends) {
        BasicGame.Game.prototype[name] = this.extends[name];
    }
};

BasicGame.Game.prototype.extends = {
    create: function () {
        console.log("create map");

        this.createMap();
        console.log("***> create map" + this.verificaVideo());
        if(!this.verificaVideo()) {
            this.initGameMap();
            this.gameStarted = true;
        }

    },

    createScene: function() {

        //this.sound.play('backgroundMusic', 0.75, true);

        this.posicaoXvideo = 400; // muda posicionamento x do icone de video clipe;
        this.posicaoYvideo = 500; // muda posicionamento y do icone de video clipe;

        this.add.sprite(-103,-1117,"background");

        this.createAnimation(254,477,"fred",  1,1);
        this.createAnimation(302,497,"poly",  1,1);
        this.createAnimation(230,528,"junior",1,1);
        this.createAnimation(264,540,"bumba", 1,1);
        this.createAnimation(454,255,"robo", 1,1);

        this.createButton(130,400,0.4,0.4, this.clickButton1, "icone1", BasicGame.OfflineAPI.isLevelOpen(1), BasicGame.OfflineAPI.isLevelFinished(1),true,130,415);
        this.createButton(160,500,0.4,0.4, this.clickButton2, "icone2", BasicGame.OfflineAPI.isLevelOpen(2), BasicGame.OfflineAPI.isLevelFinished(2));
        this.createButton(290,460,0.3,0.3, this.clickButton3, "icone3", BasicGame.OfflineAPI.isLevelOpen(3), BasicGame.OfflineAPI.isLevelFinished(3),true,299.7,450);
        this.createButton(760,360,0.4,0.4, this.clickButton4, "icone4", BasicGame.OfflineAPI.isLevelOpen(4), BasicGame.OfflineAPI.isLevelFinished(4),true,760,370);
        this.createButton(780,460,0.5,0.5, this.clickButton5, "icone5", BasicGame.OfflineAPI.isLevelOpen(5), BasicGame.OfflineAPI.isLevelFinished(5));
        this.createButton(915,400,0.4,0.4, this.clickButton6, "icone6", BasicGame.OfflineAPI.isLevelOpen(6), BasicGame.OfflineAPI.isLevelFinished(6));

        

    }

};


