BasicGame.Preloader = function (game) {

    this.initExtends();

    BasicGame.PreloaderBase.call(game);
};

BasicGame.Preloader.prototype = Object.create(BasicGame.PreloaderBase.prototype);
BasicGame.Preloader.prototype.constructor = BasicGame.Preloader;

BasicGame.Preloader.prototype.initExtends = function() {
    for(var name in this.extends) {
        BasicGame.Preloader.prototype[name] = this.extends[name];
    }
};

BasicGame.Preloader.prototype.extends = {

	preload: function () {

		this.initPreloaderBase();

        //this.load.image('arrow', '../../../../GLOBAL/images/arrow.png');
        //this.load.atlas('clickAnimation', '../../../../GLOBAL/images/click_animation.png', '../../../../GLOBAL/images/click_animation.json');
		//INITIAL

		this.caminho = getPathFile(UV1AV1UD6OA06);

		this.load.image('initialText', this.caminho+'texto_intro.png');
		// END GAME
		this.load.image('background', this.caminho+'background_2.png');
		
		// BATERIES
		this.load.atlas('CA', this.caminho+'UV1AV1UD6OA006_CA.png', this.caminho+'UV1AV1UD6OA006_CA.json');
		this.load.atlas('CO', this.caminho+'UV1AV1UD6OA006_CO.png', this.caminho+'UV1AV1UD6OA006_CO.json');
		this.load.atlas('ES', this.caminho+'UV1AV1UD6OA006_ES.png', this.caminho+'UV1AV1UD6OA006_ES.json');
		this.load.atlas('FI', this.caminho+'UV1AV1UD6OA006_FI.png', this.caminho+'UV1AV1UD6OA006_FI.json');
		this.load.atlas('GA', this.caminho+'UV1AV1UD6OA006_GA.png', this.caminho+'UV1AV1UD6OA006_GA.json');
		this.load.atlas('LA', this.caminho+'UV1AV1UD6OA006_LA.png', this.caminho+'UV1AV1UD6OA006_LA.json');
		this.load.atlas('MA', this.caminho+'UV1AV1UD6OA006_MA.png', this.caminho+'UV1AV1UD6OA006_MA.json');
		this.load.atlas('SA', this.caminho+'UV1AV1UD6OA006_SA.png', this.caminho+'UV1AV1UD6OA006_SA.json');
		this.load.atlas('PA', this.caminho+'UV1AV1UD6OA006_PA.png', this.caminho+'UV1AV1UD6OA006_PA.json');
		this.load.atlas('PO', this.caminho+'UV1AV1UD6OA006_PO.png', this.caminho+'UV1AV1UD6OA006_PO.json');
		this.load.atlas('TA', this.caminho+'UV1AV1UD6OA006_TA.png', this.caminho+'UV1AV1UD6OA006_TA.json');
		this.load.atlas('TE', this.caminho+'UV1AV1UD6OA006_TE.png', this.caminho+'UV1AV1UD6OA006_TE.json');
		this.load.atlas('TO', this.caminho+'UV1AV1UD6OA006_TO.png', this.caminho+'UV1AV1UD6OA006_TO.json');
		this.load.atlas('ES', this.caminho+'UV1AV1UD6OA006_ES.png', this.caminho+'UV1AV1UD6OA006_ES.json');
		this.load.image('glow', this.caminho+'batteryGlow.png');
		
		//Holder
		this.load.image('three_holder', this.caminho+'three_holder.png');
		this.load.image('two_holder', this.caminho+'two_holder2.png');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('imgResumo2', this.caminho+'texto_resumo2.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD6OA06);
		
		this.load.audio('soundP1', [this.caminho+'UV1AV1UD6OA6_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD6OA6_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD6OA6_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD6OA6_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD6OA6_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD6OA6_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD6OA6_INTRO.mp3']);
		
		this.load.audio('CA_sound', [this.caminho+'UV1AV1UD6OA6_P1_CA.mp3']);
		this.load.audio('MA_sound', [this.caminho+'UV1AV1UD6OA6_P1_MA.mp3']);
		this.load.audio('LA_sound', [this.caminho+'UV1AV1UD6OA6_P1_LA.mp3']);
		this.load.audio('FI_sound', [this.caminho+'UV1AV1UD6OA6_P2_FI.mp3']);
		this.load.audio('TA_sound', [this.caminho+'UV1AV1UD6OA6_P2_TA.mp3']);
		this.load.audio('CO_sound', [this.caminho+'UV1AV1UD6OA6_P3_CO.mp3']);
		this.load.audio('PA_sound', [this.caminho+'UV1AV1UD6OA6_P3_PA.mp3']);
		this.load.audio('TO_sound', [this.caminho+'UV1AV1UD6OA6_P3_TO.mp3']);
		this.load.audio('TE_sound', [this.caminho+'UV1AV1UD6OA6_P3_TE.mp3']);
		this.load.audio('ES_sound', [this.caminho+'UV1AV1UD6OA06_ES.mp3']);
		this.load.audio('SA_sound', [this.caminho+'UV1AV1UD6OA06_SA.mp3']);
		this.load.audio('CAMA', [this.caminho+'UV1AV1UD6OA6_P1_CAMA.mp3']);
		this.load.audio('MACA', [this.caminho+'UV1AV1UD6OA6_P1_MACA.mp3']);
		this.load.audio('MALA', [this.caminho+'UV1AV1UD6OA6_P1_MALA.mp3']);
		this.load.audio('LAMA', [this.caminho+'UV1AV1UD6OA6_P1_LAMA.mp3']);
		this.load.audio('CALA', [this.caminho+'UV1AV1UD6OA6_P1_CALA.mp3']);
		this.load.audio('FITA', [this.caminho+'UV1AV1UD6OA6_P2_FITA.mp3']);
		this.load.audio('LATA', [this.caminho+'UV1AV1UD6OA6_P2_LATA.mp3']);
		this.load.audio('TALA', [this.caminho+'UV1AV1UD6OA6_P2_TALA.mp3']);
		this.load.audio('FILA', [this.caminho+'UV1AV1UD6OA6_P2_FILA.mp3']);
		this.load.audio('ESCOLA', [this.caminho+'UV1AV1UD6OA6_P3_ESCOLA.mp3']);
		this.load.audio('PACOTE', [this.caminho+'UV1AV1UD6OA6_P3_PACOTE.mp3']);
		this.load.audio('SAPATO', [this.caminho+'UV1AV1UD6OA6_P3_SAPATO.mp3']);
		this.load.audio('ESTOLA', [this.caminho+'UV1AV1UD6OA6_P3_ESTOLA.mp3']);
		this.load.audio('PATOLA', [this.caminho+'UV1AV1UD6OA6_P3_PATOLA.mp3']);
		this.load.audio('SACOLA', [this.caminho+'UV1AV1UD6OA6_P3_SACOLA.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
