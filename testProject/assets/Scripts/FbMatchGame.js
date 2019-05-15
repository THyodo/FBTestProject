

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.myPlayerID = null; // 自身のID取得
        this.entryPointData = null; // エントリポイントデータ（対戦を申し込んだユーザー情報、スコア）
        this.applyMath = false; // 対戦を申し込むフラグ
        this.joinMath = false; // 対戦を受けるフラグ
        this.mathResult = null; // 勝敗　0:勝利 1:敗北 2:引き分け

        if (typeof FBInstant != 'undefined') {
            // 自身のID取得
            this.myPlayerID = FBInstant.player.getID();

            // エントリポイントデータ（対戦を申し込んだユーザー情報、スコア）
            this.entryPointData = FBInstant.getEntryPointData();

            // 対戦可能かの判定
            if (this.entryPointData != null && this.myPlayerID != this.entryPointData.mathPlayerId) {
                var self = this;
                FBInstant.context.getPlayersAsync().then(function (players) {
                    players.map(function (player) {
                        if (player.getID() == self.entryPointData.mathPlayerId) {
                            self.joinMath = true;
                        };
                    });
                });
            }
        }
    },

    start() {
    },

    // update (dt) {},

    // 現在のコンテキストがチャット状態か
    OnEnableTHREAD: function () {
        if (typeof FBInstant == 'undefined')
            return false;

        return FBInstant.context.getType() == "THREAD";
    },

    // 対戦の申し込みが可能な状態か
    OnApplyMath() {
        return this.applyMath;
    },

    // 対戦を受けているか
    OnJoinMath() {
        return this.joinMath;
    },

    // 対戦相手のID
    GetMathPlayerID() {
        if (this.entryPointData != null) {
            return this.entryPointData.mathPlayerId;
        }
        return null;
    },

    // 対戦相手の名前
    GetMathPlayerName() {
        if (this.entryPointData != null) {
            return this.entryPointData.mathPlayerName;
        }
        return null;
    },

    // 対戦相手のプロフ画像
    GetMathPlayerPhoto() {
        if (this.entryPointData != null && this.joinMath) {
            return this.entryPointData.mathPlayerPhoto;
        }
        return null;
    },

    // 対戦相手のスコア
    GetMathScore() {
        if (this.entryPointData != null) {
            return this.entryPointData.mathScore;
        }
        return null;
    },

    // 自分のプロフ画像
    GetMyPhoto() {
        if (typeof FBInstant != 'undefined' && this.entryPointData != null) {
            return FBInstant.player.getPhoto();
        }
        return null;
    },

    // 勝敗 0:勝利 1:敗北 2:引き分け
    GetMathResult(score) {
        if (this.entryPointData != null) {
            if (this.mathResult == null) {
                if (score > this.entryPointData.mathScore) {
                    this.mathResult = 0;
                    return this.mathResult; // 勝利
                } else if (score < this.entryPointData.mathScore) {
                    this.mathResult = 1; // 敗北
                    return this.mathResult;
                } else {
                    this.mathResult = 2; // 引き分け
                    return this.mathResult;
                }
            } else {
                return this.mathResult
            }

        }
        return null;
    },

    // フレンドを選択ダイアログから選択しチャットにコンテキストを変更
    // コンテキスト変更後orすでに選択したチャットのコンテキストの場合、対戦申し込みが可の状態とする
    MathBattleFriendChoose() {
        if (typeof FBInstant == 'undefined')
            return;
        var self = this;

        FBInstant.context.chooseAsync().then(function () {
            console.log("FBInstant.context.chooseAsync complete");
            self.applyMath = true;
            self.MathUpdateAsync(81);
        }).catch(function (error) {
            console.log(error);
            if (error.code == "SAME_CONTEXT") {
                self.applyMath = true;
                self.MathUpdateAsync(81);
            }
        });
    },

    // チャットへ対戦を促すメッセージを送信する
    MathUpdateAsync(score = 0) {
        if (typeof FBInstant == 'undefined')
            return;
        var player = FBInstant.player;
        FBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Play',
            image: this.getImgBase64(),

            //言語別で表示するメッセージを変える。言語コードについては→　　https://so-zou.jp/web-app/tech/data/code/language.htm
            text:
            {
                default: FBInstant.player.getName() + "just played. It's your turn!",
                localizations: {
                    /*必須言語*/
                    //英語(アメリカ)
                    en_US: FBInstant.player.getName() + ' earned ' + score + ' points!\nNext is your turn!',
                    //ポルトガル語(ブラジル)
                    pt_BR: FBInstant.player.getName() + ' marcou ' + score + ' pontos！\nEm seguida é sua vez!',
                    //インドネシア語)(インドネシア)
                    id_ID: FBInstant.player.getName() + ' mencetak ' + score + ' poin！\nBerikutnya giliran Anda!',
                    //フランス語(フランス)
                    fr_FR: FBInstant.player.getName() + ' a marqué ' + score + ' points！\nEnsuite vient ton tour!',
                    //ベトナム語(ベトナム)
                    vi_VN: FBInstant.player.getName() + ' ghi được ' + score + ' điểm！\nTiếp theo là lượt của bạn!',
                    //タイ語(タイ)
                    th_TH: FBInstant.player.getName() + ' ได้ ' + score + ' คะแนน！\nถัดไปคือตาคุณ!',
                    //トルコ語(トルコ)
                    tr_TR: FBInstant.player.getName() + ' ' + score + ' sayı attı！\nSıra sizde!',
                    //ドイツ語(ドイツ)
                    de_DE: FBInstant.player.getName() + ' erzielte ' + score + ' Punkte！\nAls nächstes sind Sie dran!',
                    //スペイン語(スペイン)
                    es_ES: FBInstant.player.getName() + ' anotó ' + score + ' puntos！\nEl siguiente es tu turno!',
                    //アラビア語(アメリカ)
                    ar_AE: ' نقاط!' + score + ' ' + FBInstant.player.getName() + '\nالتالي هو دورك!',

                    /*推奨言語*/
                    //日本語(日本)
                    ja_JP: FBInstant.player.getName() + 'さんが' + score + 'ポイント獲得しました！\n次はあなたの番です!',
                    //イタリア語(イタリア)
                    it_IT: FBInstant.player.getName() + ' ha segnato ' + score + ' punti！\nIl prossimo è il tuo turno!',
                    //中国語(簡体)
                    zh_Hans: FBInstant.player.getName() + '拿下' + score + '分！\n接下来轮到你了!',
                    //中国語(繁体)
                    zh_Hant: FBInstant.player.getName() + '拿下' + score + '分！\n接下來輪到你了!',
                    //ロシア語(ロシア)
                    ru_RU: FBInstant.player.getName() + ' набрал ' + score + ' очков ！\nДалее твоя очередь!',
                    //ポーランド語(ポーランド)
                    pl_PL: FBInstant.player.getName() + ' zdobyła ' + score + ' punktów ！\nNastępna jest twoja kolej!',
                    //オランダ語(オランダ)
                    nl_NL: FBInstant.player.getName() + ' scoorde ' + score + ' punten！\nHet volgende is jouw beurt!',
                    //スウェーデン語(スウェーデン)
                    sv_SE: FBInstant.player.getName() + ' gjorde ' + score + ' poäng！\nNästa är din tur!',
                    //スウェーデン語(フィンランド)
                    sv_FI: FBInstant.player.getName() + ' gjorde ' + score + ' poäng！\nNästa är din tur!',
                    //ハンガリー語(ハンガリー)
                    hu_HU: FBInstant.player.getName() + ' ' + score + ' pontot szerzett！\nEzután a sorod!',
                    //ギリシャ語(ギリシャ)
                    el_GR: FBInstant.player.getName() + ' σημείωσε ' + score + ' πόντους！\nΣτη συνέχεια είναι η σειρά σας!',
                    //チェコ語(チェコ)
                    cs_CZ: FBInstant.player.getName() + ' vstřelil ' + score + ' bodů！\nDalší je řada na vás!',
                }
            },
            template: 'WORD_PLAYED',
            // 自身のプレイヤー情報とスコアを送信
            data: {
                mathPlayerId: player.getID(),
                mathPlayerName: player.getName(),
                mathPlayerPhoto: player.getPhoto(),
                mathScore: score
            },
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH',
        }).then(function () {
            console.log('Message was sent successfully OK');
        }).catch(error => console.error(error));
    },

    //Canvasの左下から指定したサイズ分のスクショを撮る。画像データはbase64に変換される。
    getImgBase64(w, h) {
        let target = cc.find('Canvas');

        let width = 720, height = 375;      //デフォ値。
        if (w != null && h != null)
            width = w, height = h;

        let renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        let canvas = document.createElement('canvas');      //HTML要素生成。
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;                             //縦横幅設定
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            let texture = renderTexture.getSprite().getTexture();
            let image = texture.getHtmlElementObj();
            ctx.drawImage(image, width / 2, height / 2);
        }
        //基本的にWebGLらしい。ビルド設定からWebGL優先に設定しているため。
        else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            let buffer = gl.createFramebuffer();                                                        //フレームバッファ生成
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);                                                 //フレームバッファをWebGLにバインド
            let texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);   //フレームバッファへのテクスチャの紐付け
            let data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);                        //←第1,2引数を弄るとオフセットがずれるが、ずれた分は表示されない(真っ白)
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);                                                   //フレームバッファをWebGLにバインド
            let rowBytes = width * 4;
            //プリンタみたいに1行(px)ずつデータ書き込み。
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;            //描画する高さ設定。上から順に。
                let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                let imageData = new ImageData(data2, width, 1);     //ピクセルデータ設定。
                ctx.putImageData(imageData, 0, row);            //Canvasに指定のImageDataオブジェクトのデータを描画。
            }
        }
        return canvas.toDataURL('image/png');
    },
});
