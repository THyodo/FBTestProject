// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.myPlayerID = null;
        this.entryPointData = null;

        if(typeof FBInstant != 'undefined')
        {
            // 自身のID取得
            this.myPlayerID = FBInstant.player.getID();
            console.log('this.myPlayerID ; ' + this.myPlayerID);

            // エントリポイントデータ（対戦を申し込んだユーザーのID、スコア）
            this.entryPointData = FBInstant.getEntryPointData();
            console.log('this.entryPointData  : ' + JSON.stringify(this.entryPointData));
        }
    },

    start () {

    },

    // update (dt) {},

    // 現在のコンテキストがチャット状態か
    OnEnableTHREAD: function () {
        if (typeof FBInstant == 'undefined')
            return false;

        return FBInstant.context.getType() == "THREAD";
    },

    // フレンドを選択ダイアログから選択しチャットにコンテキストを変更
    // コンテキスト変更後orすでに選択したチャットのコンテキストの場合、カスタムメッセージ送信
    PlayBattleFriendChoose() {
        if (typeof FBInstant == 'undefined')
            return;
        var self = this;
        console.log(FBInstant.context.getID());

        FBInstant.context.chooseAsync().then(function () {
            console.log("FBInstant.context.chooseAsync complete");
            console.log(FBInstant.context.getID());
            self.BattleUpdateAsync();
        }).catch(function (error) {
            console.log(error);
            if(error.code == SAME_CONTEXT) {
                self.BattleUpdateAsync();
            }
        });
    },

    // チャットへ対戦を促すメッセージを送信する
    BattleUpdateAsync() {
        if (typeof FBInstant == 'undefined')
            return;
        console.log('BattleUpdateAsync');
        FBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Play',
            image: this.getImgBase64(),

            //言語別で表示するメッセージを変える。言語コードについては→　　https://so-zou.jp/web-app/tech/data/code/language.htm
            text:
                {
                    default: FBInstant.player.getName() + "just played. It's your turn!",
                    localizations: {
                        //派生言語は別に追加する必要あり。
                        en_US: '',                                                                  //英語(アメリカ)
                        pt_BR: '',                                                                  //ポルトガル語(ブラジル)
                        id_ID: '',                                                                  //インドネシア語(インドネシア)
                        fr_CA: '',                                                                  //フランス語(フランス)
                        vi_VN: '',                                                                  //ベトナム語(ベトナム)
                        th_TH: '',                                                                  //タイ語(タイ)
                        tr_TR: '',                                                                  //トルコ語(トルコ)
                        de_DE: '',                                                                  //ドイツ語(ドイツ)
                        es_ES: '',                                                                  //スペイン語(スペイン)
                        ar_AE: '',                                                                  //アラビア語(アメリカ)

                        ja_JP: FBInstant.player.getName() + '対戦をしましょう',     //日本語(日本)
                    }
                },
            template: 'WORD_PLAYED',
            // 自身のプレイヤーIDとスコアを送信
            data: { battlePlayerId: this.myPlayerID,
                battleScore: '22'},
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH',
        }).then(function () {
            console.log('Message was sent successfully OK');
        }).catch(error => console.error(error));
    },

    // 仮でスクショ画像使用.
    // 最終的には必ず別の画像を用意してください
    getImgBase64() {
        let target = cc.find('Canvas');
        let width = cc.winSize.width, height = cc.winSize.height;
        let renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        let canvas = document.createElement('canvas');      //HTML要素生成。
        let ctx = canvas.getContext('2d');
        canvas.width = width;                               //
        canvas.height = height;                             //縦横幅設定
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            let texture = renderTexture.getSprite().getTexture();
            let image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
            console.log('renderType:canvas');
        }
        else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            let buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            let texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            let data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                let imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
            console.log('renderType:WebGL');
        }
        return canvas.toDataURL('image/png');
    },
});
