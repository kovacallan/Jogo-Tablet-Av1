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

        this.caminho = getPathFile(UV1AV1UD6OA02);


		this.load.atlas('coruja_roxa',this.caminho+'anim_coruja_roxa.png',this.caminho+'anim_coruja_roxa.json');
		this.load.atlas('coruja_azul',this.caminho+'anim_coruja_azul.png',this.caminho+'anim_coruja_azul.json');
		this.load.atlas('energia',this.caminho+'anim_energia.png',this.caminho+'anim_energia.json');

		//RESUMO
		this.load.image('imgResumo', this.caminho+'resumo.png');


		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.image('initialText3', this.caminho+'initialText3.png');
		this.load.image('initialText4', this.caminho+'initialText4.png');


		this.load.image('intro_abacaxi', this.caminho+'intro_abacaxi.png');
		this.load.image('intro_igreja', this.caminho+'intro_igreja.png');
		this.load.image('intro_img_igreja', this.caminho+'intro_img_igreja.png');
		this.load.image('teclado', this.caminho+'teclado.png');

		// SCENE
		this.load.image('background', this.caminho+'background.png');
		this.load.image('corujas', this.caminho+'corujas.png');
		this.load.image('tecla_vazia', this.caminho+'tecla_vazia.png');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		// rodada 1
		this.load.image('onda', this.caminho+'onda.png');
		this.load.image('ilha', this.caminho+'ilha.png');
		this.load.image('uva', this.caminho+'uva.png');

		this.load.image('amigo', this.caminho+'R1_amigo.png');
		this.load.image('kiwi', this.caminho+'R1_kiwi.png');
		this.load.image('tatu', this.caminho+'R1_tatu.png');
		
		this.load.image('resp_onda', this.caminho+'R1_onda.png');
		this.load.image('resp_ilha', this.caminho+'R1_ilha.png');
		this.load.image('resp_uva', this.caminho+'R1_uva.png');

		//this.load.image('o', 'images/R1_letra_o.png');
		this.load.image('i', this.caminho+'R1_letra_i.png');
		//this.load.image('u', 'images/R1_letra_u.png');

		//rodada 2
		this.load.image('zebra', this.caminho+'zebra.png');
		this.load.image('lapis', this.caminho+'lapis.png');
		this.load.image('moeda', this.caminho+'moeda.png');
		
		this.load.image('resp_zebra', this.caminho+'R2_zebra.png');
		this.load.image('resp_lapis', this.caminho+'R2_lapis.png');
		this.load.image('resp_moeda', this.caminho+'R2_moeda.png');

		this.load.image('luz', this.caminho+'R2_luz.png');
		this.load.image('azul', this.caminho+'R2_azul.png');
		this.load.image('capim', this.caminho+'R2_capim.png');

		//rodada 3
		this.load.image('regua', this.caminho+'regua.png');
		this.load.image('escova', this.caminho+'escova.png');
		this.load.image('arara', this.caminho+'arara.png');
		
		this.load.image('resp_regua', this.caminho+'R3_regua.png');
		this.load.image('resp_escova', this.caminho+'R3_escova.png');
		this.load.image('resp_arara', this.caminho+'R3_arara.png');

		this.load.image('computador', this.caminho+'R3_computador.png');
		this.load.image('microfone', this.caminho+'R3_microfone.png');
		this.load.image('cadeira', this.caminho+'R3_cadeira.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD6OA02);

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD6OA2_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD6OA2_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD6OA2_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD6OA2_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD6OA2_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD6OA2_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD6OA2_INTRO.mp3']);

	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
