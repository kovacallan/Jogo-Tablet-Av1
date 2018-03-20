
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

		this.caminho = getPathFileMapaAventura(UV1AV1MAPA);


		// SCENE
		this.load.image('background', this.caminho+'background.png');


		this.load.image('over1', this.caminho+'over1.png');
		this.load.image('over2', this.caminho+'over2.png');
		this.load.image('over3', this.caminho+'over3.png');
		this.load.image('over4', this.caminho+'over4.png');
		this.load.image('over5', this.caminho+'over5.png');
		this.load.image('over6', this.caminho+'over6.png');
		this.load.image('over7', this.caminho+'over7.png');
		this.load.image('over8', this.caminho+'over8.png');


		this.load.image('botaoLocked', this.caminho+'botao_locked.png');
		this.load.image('botaoOpen', this.caminho+'botao_aberto.png');
		this.load.image('botaoOver', this.caminho+'botao_over.png');
		this.load.image('iconeLocked', this.caminho+'icone_locked.png');

		this.load.image('logo','../../../ASSETS/GLOBAL/images/conectLogo.png');

		this.load.spritesheet('nivel1', this.caminho+'nivel1.png',  96, 68);
		this.load.spritesheet('nivel2', this.caminho+'nivel2.png', 110,118);
		this.load.spritesheet('nivel3', this.caminho+'nivel3.png', 148,117);
		this.load.spritesheet('nivel4', this.caminho+'nivel4.png', 168,104);
		this.load.spritesheet('nivel5', this.caminho+'nivel5.png', 201,128);
		this.load.spritesheet('nivel6', this.caminho+'nivel6.png', 128,156);
		this.load.spritesheet('nivel7', this.caminho+'nivel7.png', 210,140);
		this.load.spritesheet('nivel8', this.caminho+'nivel8.png', 133,228);
		this.load.spritesheet('btVoltarUv', this.caminho+'bt_voltar_uv.png', 108,118);



		this.load.atlas('raio', this.caminho+'raio.png', this.caminho+'raio.json');



		//this.load.audio('soundIntro', ['sound/JC-UV1AV1UD1OA1-Mat-INTRO.mp3']);
	},

	create: function () {
		this.preloadBar.cropEnabled = true;
		this.state.start('Game');
	},

	update: function () {

		if (this.cache.isSoundDecoded('soundIntro') && this.ready == false && this.effectFinished)
		{
			this.ready = true;
			this.state.start('Game');
		}

	}

};
