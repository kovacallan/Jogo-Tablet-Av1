BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;
	this.effectFinished = false;

};

BasicGame.Preloader.prototype = {


	createPreloadEffect: function() {

		var bg = this.add.sprite(this.world.centerX, this.world.centerY, "preloader","loadingBackground");
		bg.anchor.set(0.5,0.5);
		bg.scale.set(0.4,0.4);
		bg.alpha = 0;

		this.add.tween(bg).to({alpha: 1}, 250, Phaser.Easing.Linear.None, true);
		this.add.tween(bg.scale).to({x: 1, y: 1}, 250, Phaser.Easing.Linear.None, true);

		var txt = this.add.sprite(this.world.centerX, this.world.centerY-30, "preloader","loadingText");
		txt.anchor.set(0.5,0.5);
		txt.scale.set(0.4,0.4);
		txt.alpha = 0;

		this.add.tween(txt).to({alpha: 1}, 250, Phaser.Easing.Linear.None, true, 250);
		this.add.tween(txt.scale).to({x: 1, y: 1}, 250, Phaser.Easing.Linear.None, true, 250).onComplete.add(function() {

			this.preloadEmpty.alpha = 1;
			this.preloadBar.alpha = 1;

			this.effectFinished = true;

		}, this);

		this.preloadEmpty = this.add.sprite(this.world.centerX-175, this.world.centerY, "preloader",'preloaderBarEmpty');
		this.preloadEmpty.alpha = 0;

		this.preloadBar = this.add.sprite(this.world.centerX-175, this.world.centerY, "preloader",'preloaderBarFull');
		this.preloadBar.alpha = 0;

		this.load.setPreloadSprite(this.preloadBar);
	},

	preload: function () {

		this.createPreloadEffect();
		

		this.caminho = getPathFile(GLOBAL);

		this.load.atlas('hudMapa', this.caminho+'hud_mapa.png', this.caminho+'hud_mapa.json');
		this.load.image('iconeVideo', this.caminho+'icon_video_fixo.png');
		this.load.atlas('videoIcon', this.caminho+'icon_video_mapa.png', this.caminho+'icon_video_mapa.json');
		
		// SCENE
		this.caminho = getPathFile(UV1AV1UD8MAPA);
		this.load.image('background', this.caminho+'background.png');

		// CHARACTER ANIMATION
		this.load.atlas('bumba', this.caminho+'bumba.png', this.caminho+'bumba.json');
		this.load.atlas('junior', this.caminho+'junior.png', this.caminho+'junior.json');
		this.load.atlas('fred', this.caminho+'fred.png', this.caminho+'fred.json');
		this.load.atlas('poly', this.caminho+'poly.png', this.caminho+'poly.json');
		this.load.atlas('robo', this.caminho+'robo.png', this.caminho+'robo.json');

		this.load.image('buttonAlpha', this.caminho+'button_alpha.png');
		this.load.image('buttonBg', this.caminho+'button_bg.png');
		this.load.image('buttonIcon', this.caminho+'icon_chip.png');

		this.load.image('icone1', this.caminho+'icone1.png');
		this.load.image('icone2', this.caminho+'icone2.png');
		this.load.image('icone3', this.caminho+'icone3.png');
		this.load.image('icone4', this.caminho+'icone4.png');
		this.load.image('icone5', this.caminho+'icone5.png');
		this.load.image('icone6', this.caminho+'icone6.png');
		
		for(var i=1; i<7;i++){
			this.load.image('n'+i, '../../../../ASSETS/GLOBAL/images/numeros/'+i+'.png');
		}
		
		this.load.atlas('feixeAnima', this.caminho+'feixe_anima.png', this.caminho+'feixe_anima.json');

		this.caminho = getPathFileSound(SOUNDS_GLOBAL);

		this.load.audio('showIconVideo', [this.caminho+'aqui_tem_videoclip.mp3']);
		
		this.load.audio('backgroundMusic', [this.caminho+'looping_mapa.mp3']);
	},

	create: function () {
		this.preloadBar.cropEnabled = true;
	},

	update: function () {
		
		if (this.cache.isSoundDecoded('backgroundMusic') && this.ready == false && this.effectFinished)
		{
			this.ready = true;
			this.state.start('Game');
		}

	}
};
