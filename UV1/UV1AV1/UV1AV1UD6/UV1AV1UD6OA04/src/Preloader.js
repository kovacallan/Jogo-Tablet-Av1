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
		
		// AMINAÇOES LOCAIS 

		this.caminho = getPathFile(UV1AV1UD6OA04);

		this.load.atlas('bumba',this.caminho+'anim_bumba.png', this.caminho+'anim_bumba.json');
		this.load.atlas('fred',this.caminho+'anim_fred.png', this.caminho+'anim_fred.json');
		this.load.atlas('poly',this.caminho+'anim_poly.png', this.caminho+'anim_poly.json');
		this.load.atlas('walter',this.caminho+'anim_walter.png', this.caminho+'anim_walter.json');

		this.load.atlas('gear',this.caminho+'anim_gear.png', this.caminho+'anim_gear.json');

		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('gear_vazio', this.caminho+'gear.png');
		
		// SILABAS 
		this.load.image('tar', this.caminho+'tar.png');
		this.load.image('ta', this.caminho+'ta.png');
		this.load.image('ru', this.caminho+'ru.png');
		this.load.image('ga', this.caminho+'ga.png');
		this.load.image('ra', this.caminho+'ra.png');
		this.load.image('fa', this.caminho+'fa.png');

		this.load.image('ca', this.caminho+'ca.png');
		this.load.image('ne', this.caminho+'NE.png');
		this.load.image('me', this.caminho+'ME.png');
		this.load.image('le', this.caminho+'LE.png');
		this.load.image('bo', this.caminho+'BO.png');
		this.load.image('do', this.caminho+'DO.png');
		this.load.image('po', this.caminho+'PO.png');
		this.load.image('ni', this.caminho+'NI.png');
		this.load.image('ba', this.caminho+'BA.png');
		this.load.image('da', this.caminho+'DA.png');
		this.load.image('pi', this.caminho+'PI.png');
		this.load.image('to', this.caminho+'TO.png');
		this.load.image('li', this.caminho+'LI.png');
		this.load.image('vi', this.caminho+'VI.png');
		this.load.image('ti', this.caminho+'TI.png');
		this.load.image('com', this.caminho+'COM.png');
		this.load.image('dor', this.caminho+'DOR.png');
		this.load.image('pu', this.caminho+'PU.png');
		this.load.image('bu', this.caminho+'BU.png');
		this.load.image('du', this.caminho+'DU.png');
		this.load.image('mi', this.caminho+'MI.png');
		this.load.image('cro', this.caminho+'CRO.png');
		this.load.image('fo', this.caminho+'FO.png');
		this.load.image('ro', this.caminho+'RO.png');
		this.load.image('go', this.caminho+'GO.png');
		this.load.image('hi', this.caminho+'HI.png');
		this.load.image('poo', this.caminho+'POO.png');
		this.load.image('mo', this.caminho+'MO.png');
		this.load.image('lo', this.caminho+'LO.png');
		this.load.image('no', this.caminho+'NO.png');
		this.load.image('ja', this.caminho+'JA.png');
		this.load.image('ka', this.caminho+'KA.png');
		this.load.image('ri', this.caminho+'RI.png');
		this.load.image('ron', this.caminho+'RON.png');
		this.load.image('te', this.caminho+'TE.png');
		this.load.image('ce', this.caminho+'CE.png');
		this.load.image('se', this.caminho+'SE.png');
		this.load.image('je', this.caminho+'JE.png');

		// SCENE
		this.load.image('background', this.caminho+'background.png');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');
		
		
		//rodada 1

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD6OA04);
		
		this.load.audio('caneca', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_1_CANECA.mp3']);
		this.load.audio('le', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_1_LE.mp3']);
		this.load.audio('me', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_1_ME.mp3']);
		this.load.audio('ne', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_1_NE.mp3']);
		
		this.load.audio('boneca', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_2_BONECA.mp3']);
		this.load.audio('bo', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_2_BO.mp3']);
		this.load.audio('do', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_2_DO.mp3']);
		this.load.audio('po', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_2_PO.mp3']);
		
		this.load.audio('bonita', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_3_BONITA.mp3']);
		this.load.audio('ba', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_3_BA.mp3']);
		this.load.audio('da', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_3_DA.mp3']);
		this.load.audio('ta', [this.caminho+'rodada_1/UV1AV1UD6OA4_P1_3_TA.mp3']);
		
		// rodada 2
		this.load.audio('pirulito', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_1_PIRULITO.mp3']);
		this.load.audio('li', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_1_LI.mp3']);
		this.load.audio('ti', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_1_TI.mp3']);
		this.load.audio('vi', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_1_VI.mp3']);
		
		this.load.audio('computador', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_2_COMPUTADOR.mp3']);
		this.load.audio('bu', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_2_BU.mp3']);
		this.load.audio('du', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_2_DU.mp3']);
		this.load.audio('pu', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_2_PU.mp3']);
		
		this.load.audio('microfone', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_3_MICROFONE.mp3']);
		this.load.audio('fo', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_3_FO.mp3']);
		this.load.audio('go', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_3_GO.mp3']);
		this.load.audio('ro', [this.caminho+'rodada_2/UV1AV1UD6OA4_P2_3_RO.mp3']);
		
		//rodada 3
		this.load.audio('hipopotamo', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_1_HIPOPOTAMO.mp3']);
		this.load.audio('lo', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_1_LO.mp3']);
		this.load.audio('mo', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_1_MO.mp3']);
		this.load.audio('no', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_1_NO.mp3']);
		
		this.load.audio('jabuticaba', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_2_JABUTICABA.mp3']);
		this.load.audio('ka', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_2_CA.mp3']);
		this.load.audio('ga', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_2_GA.mp3']);
		this.load.audio('ja', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_2_JA.mp3']);
		
		this.load.audio('rinoceronte', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_3_RINOCERONTE.mp3']);
		this.load.audio('ce', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_3_CE.mp3']);
		this.load.audio('je', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_3_GE.mp3']);
		this.load.audio('se', [this.caminho+'rodada_3/UV1AV1UD6OA4_P3_3_SE.mp3']);

		
		
		this.load.audio('soundP1', [this.caminho+'UV1AV1UD6OA4_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD6OA4_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD6OA4_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD6OA4_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD6OA4_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD6OA4_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD6OA4_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }


};
