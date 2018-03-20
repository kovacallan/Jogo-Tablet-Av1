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

        this.posicaoXvideo = 570; // muda posicionamento x do icone de video clipe;
        this.posicaoYvideo = 510; // muda posicionamento y do icone de video clipe;

        this.add.sprite(-185,-135,"background");

        this.createAnimation( 50,250,"fred",  1,1);
        this.createAnimation(145,290,"poly",  1,1);
        this.createAnimation(  0,350,"junior",1,1);
        this.createAnimation( 70,375,"bumba", 1,1);

        this.createButton(220,450,0.7,0.7, this.clickButton1, "icone1",  BasicGame.OfflineAPI.isLevelOpen(1), BasicGame.OfflineAPI.isLevelFinished(1));
        this.createButton(350,400,0.6,0.6, this.clickButton2, "icone2",  BasicGame.OfflineAPI.isLevelOpen(2), BasicGame.OfflineAPI.isLevelFinished(2));
        this.createButton(460,360,0.4,0.4, this.clickButton3, "icone3",  BasicGame.OfflineAPI.isLevelOpen(3), BasicGame.OfflineAPI.isLevelFinished(3));
        this.createButton(600,400,0.35,0.35, this.clickButton4, "icone4",BasicGame.OfflineAPI.isLevelOpen(4), BasicGame.OfflineAPI.isLevelFinished(4));
        this.createButton(675,430,0.4,0.4, this.clickButton5, "icone5",  BasicGame.OfflineAPI.isLevelOpen(5), BasicGame.OfflineAPI.isLevelFinished(5));
        this.createButton(810,475,0.5,0.5, this.clickButton6, "icone6",  BasicGame.OfflineAPI.isLevelOpen(6), BasicGame.OfflineAPI.isLevelFinished(6));

    }

};

