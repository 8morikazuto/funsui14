funsui14
========

[九州大学噴水企画'14]のWebサイトのソースです。Webの勉強のために自由に活用してください。  
ただし流用する場合はコメントなどに以下の記述を入れてください。

`Copyright (c) 2014 九州大学噴水企画'14 | MIT Lisence | http://git.io/JbFCbw`

なお、動画、画像の転用は禁止です。

HTMLテンプレートエンジンとして [EJS]、CSSプリプロセッサとして [Stylus]、そしてタスクランナーとして [Gulp] を使用しています。  
もしこれらを学びたいのであれば、[こちらのスライド](http://www.slideshare.net/yutoyoshinari/ss-37936903 "フロントエンドの効率化")を見ることをおすすめします。  
また[こちらの名著](http://www.amazon.co.jp/gp/product/4774165786/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774165786&linkCode=as2&tag=kimamass-22 "フロントエンドエンジニア養成読本 [HTML、CSS、JavaScriptの基本から現場で役立つ技術まで満載! ]")の購入をおすすめします。

ソースファイルはすべて develop フォルダの中に入っています。  
これらのファイルをコンパイルしたいとき、ターミナル上で、ダウンロードしたこのフォルダのディレクトリに移動し、以下のコマンドを実行してください。  
release フォルダが出力されます。　　

    npm install  # node.js の依存ファイルをダウンロード
    gulp         # release フォルダに出力

なお、以下のコマンドも準備されています。  

    gulp clean    # release フォルダを消す
    gulp release  # minify, gzip したものを release フォルダに出力

もし実行できないときは[node.js]、[Gulp]をインストールしてください。

##使用したライブラリ、外部API

###JavaScript

[jQuery] (フロントエンドを簡単に出来る。少々重いので可能ならば [zepto.js] や [Minified.js] を、腕に自身があれば [Vanilla JS] を使うべき)  
[Modernizr] (HTML5, CSS3 の各種機能の対応を確認)  
[Animation Image Splitter] (自作ライブラリ。APNG, XJPEG からフレームを切り出す)  
[Glide] (jQueryプラグイン。レスポンシブ対応なスライド生成)  
[SweetAlert] (jQueryプラグイン。綺麗なアラートを生成)  
[jquery-srcset-retina-polyfill] (jQueryプラグイン。img タグの srcset の対応)  

###CSS

[normalize.css] (ブラウザ間のデフォルトスタイルの違いを吸収)  

###API

[YouTube Data API v3] (YouTube から動画情報などを取得)  

###node.js プラグイン

[Gulp] (タスクランナー。ファイルを監視して操作できる)  
[gulp-concat] (テキストファイルの結合)  
[gulp-clean] (ファイルの消去。非推奨なので使わないほうがいいです。。。)  
[gulp-if] (Gulp 内で条件分岐。`gulp.dest()`を通らなかった時 end イベントを呼ばないので注意！)  
[gulp-plumber] (Gulp 内でエラーを catch する)  

[gulp-ejs] (EJS を HTML にコンパイル)  
[gulp-stylus] (Stylus を CSS にコンパイル)  
[gulp-prettify] (HTML の見栄えを良くする)  
[gulp-autoprefixer] (CSS の prefix を自動でつけてくれる。options はちゃんと入れておいた方がいい)  
[gulp-csscomb] (CSS のプロパティの順番を整理してくれる。圧縮率アップ)  
[gulp-css-base64] (CSS のイメージを base64 に変換。HTTPリクエストを減らせる)  
[gulp-minify-html] (HTML の minify)  
[gulp-minify-css] (CSS の minify)  
[gulp-uglify] (JavaScript の minify)  
[gulp-zopfli] (テキストファイルを GZIP に、より小さく圧縮してくれる。zopfli 自体は Google が開発。かなり時間がかかる。中に含まれるバイナリが若干古い？)  

[imagemin-jpegoptim] (JPEG の lossy 圧縮。)  
[imagemin-mozjpeg] (JPEG の lossless 圧縮。mozjpeg 自体は mozilla が開発)  
[imagemin-pngquant] (PNG の lossy 圧縮。24bit PNG を透明度を残したまま 8bit PNG にする。インデックスカラー化。圧縮後 Photoshop で開けないので注意！)  
[imagemin-zopfli] (PNG の lossless 圧縮。zopfli の PNG への応用)  


[九州大学噴水企画'14]: http://www.design.kyushu-u.ac.jp/~festival/2014/funsui/ "九州大学噴水企画'14"

[EJS]: http://www.embeddedjs.com/ "EJS - JavaScript Templates"
[Stylus]: http://learnboost.github.io/stylus/ "Stylus — expressive, robust, feature-rich CSS preprocessor"
[Gulp]: http://gulpjs.com/ "gulp.js - the streaming build system"
[node.js]: http://nodejs.org/ "node.js"

[jQuery]: http://jquery.com/
[Zepto.js]: http://zeptojs.com/
[Minified.js]: http://minifiedjs.com/
[Vanilla JS]: http://vanilla-js.com/

[Glide]: http://jedrzejchalubek.com/glide/
[jquery-srcset-retina-polyfill]: https://github.com/jcampbell1/jquery-srcset-retina-polyfill
[SweetAlert]: http://tristanedwards.me/sweetalert
[Modernizr]: http://modernizr.com/
[Animation Image Splitter]: https://github.com/petamoriken/AISplitter
[normalize.css]: http://necolas.github.io/normalize.css/
[YouTube Data API v3]: https://developers.google.com/youtube/v3/

[gulp-concat]: https://www.npmjs.org/package/gulp-concat
[gulp-clean]: https://www.npmjs.org/package/gulp-clean
[gulp-if]: https://www.npmjs.org/package/gulp-if
[gulp-plumber]: https://www.npmjs.org/package/gulp-plumber
[gulp-ejs]: https://www.npmjs.org/package/gulp-ejs
[gulp-stylus]: https://www.npmjs.org/package/gulp-stylus
[gulp-prettify]: https://www.npmjs.org/package/gulp-prettify
[gulp-autoprefixer]: https://www.npmjs.org/package/gulp-autoprefixer
[gulp-csscomb]: https://www.npmjs.org/package/gulp-csscomb
[gulp-css-base64]: https://www.npmjs.org/package/gulp-css-base64
[gulp-minify-html]: https://www.npmjs.org/package/gulp-minify-html
[gulp-minify-css]: https://www.npmjs.org/package/gulp-minify-css
[gulp-uglify]: https://www.npmjs.org/package/gulp-uglify
[gulp-zopfli]: https://www.npmjs.org/package/gulp-zopfli

[imagemin-jpegoptim]: https://www.npmjs.org/package/imagemin-jpegoptim
[imagemin-mozjpeg]: https://www.npmjs.org/package/imagemin-mozjpeg
[imagemin-pngquant]: https://www.npmjs.org/package/imagemin-pngquant
[imagemin-zopfli]: https://www.npmjs.org/package/imagemin-zopfli