
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

		this.game.canvas.className = "visible";
		this.createPreloadEffect();

		this.caminho = getPathFile(GLOBAL);

		this.load.atlas('hudMapa', this.caminho+'hud_mapa.png', this.caminho+'hud_mapa.json');
		this.load.image('iconeVideo', this.caminho+'icon_video_fixo.png');
		this.load.atlas('videoIcon', this.caminho+'icon_video_mapa.png', this.caminho+'icon_video_mapa.json');
		

		//this.load.atlas('hudMapa', '../../../../GLOBAL/images/hud_mapa.png', '../../../../GLOBAL/images/hud_mapa.json');


		//this.load.image('hudBg', this.caminho+'hud_bg.png');
		//this.load.atlas('videoIcon', '../../../../GLOBAL/images/icon_video_mapa.png', '../../../../GLOBAL/images/icon_video_mapa.json');
		this.caminho = getPathFile(UV1AV1UD4MAPA);

		this.load.image('icone1', this.caminho+'icone1.png');
		this.load.image('icone2', this.caminho+'icone2.png');
		this.load.image('icone3', this.caminho+'icone3.png');
		this.load.image('icone4', this.caminho+'icone4.png');
		this.load.image('icone5', this.caminho+'icone5.png');
		this.load.image('icone6', this.caminho+'icone6.png');
		
		
		this.load.atlas('fred', this.caminho+'fred.png', this.caminho+'fred.json');
		this.load.atlas('bumba', this.caminho+'bumba.png', this.caminho+'bumba.json');
		this.load.atlas('junior', this.caminho+'junior.png', this.caminho+'junior.json');
		this.load.atlas('poly', this.caminho+'poly.png', this.caminho+'poly.json');
		
		this.load.atlas('red1', this.caminho+'red1.png', this.caminho+'red1.json');

		this.load.atlas('pi1', this.caminho+'pi1.png', this.caminho+'pi1.json');
		this.load.atlas('pi2', this.caminho+'pi2.png', this.caminho+'pi2.json');
		this.load.atlas('pi3', this.caminho+'pi3.png', this.caminho+'pi3.json');
		this.load.atlas('pi4', this.caminho+'pi4.png', this.caminho+'pi4.json');
		this.load.atlas('pi5', this.caminho+'pi5.png', this.caminho+'pi5.json');
		for(var i=1; i<7;i++){
			this.load.image('n'+i, '../../../../ASSETS/GLOBAL/images/numeros/'+i+'.png');
		}

		// SCENE
		this.load.image('background', this.caminho+'background.png');



		this.load.image('buttonAlpha', this.caminho+'button_alpha.png');
		this.load.image('buttonBg', this.caminho+'button_bg.png');
		this.load.image('buttonIcon', this.caminho+'icon_chip.png');

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
