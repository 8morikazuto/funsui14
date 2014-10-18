funsui14
========

[九州大学噴水企画'14]のWebサイトのソースです。Webの勉強のために自由に活用してください。  
ただし流用する場合はコメントなどに以下の記述を入れてください。

`Copyright (c) 2014 九州大学噴水企画'14 | MIT Lisence | http://git.io/JbFCbw`

なお、動画、画像の転用は禁止です。

HTMLテンプレートエンジンとして[EJS]、CSSプリプロセッサとして[Stylus]、そしてタスクランナーとして[Gulp]を使用しています。  
もしこれらを学びたいのであれば、[こちらのスライド](http://www.slideshare.net/yutoyoshinari/ss-37936903 "フロントエンドの効率化")を見ることをおすすめします。  
また、[こちらの名著](http://www.amazon.co.jp/gp/product/4774165786/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4774165786&linkCode=as2&tag=kimamass-22 "フロントエンドエンジニア養成読本 [HTML、CSS、JavaScriptの基本から現場で役立つ技術まで満載! ]")の購入をおすすめします。

ソースファイルはすべて develop フォルダの中に入っています。  
これらのファイルをコンパイルしたいときには、ターミナル上で、ダウンロードしたこのフォルダのディレクトリに移動し、以下のコマンドを実行してください。  
release フォルダが出力されます。　　

    npm install  # node の依存ファイルをダウンロード
    gulp         # release フォルダに出力

なお、以下のコマンドも準備されています。  

    gulp clean    # release フォルダを消す
    gulp release  # minify, gzip したものを release フォルダに出力

もし実行できないときは[node.js]、[Gulp]をインストールしてください。

[九州大学噴水企画'14]: http://www.design.kyushu-u.ac.jp/~festival/2014/funsui/ "九州大学噴水企画'14"
[EJS]: http://www.embeddedjs.com/ "EJS - JavaScript Templates"
[Stylus]: http://learnboost.github.io/stylus/ "Stylus — expressive, robust, feature-rich CSS preprocessor"
[Gulp]: http://gulpjs.com/ "gulp.js - the streaming build system"
[node.js]: http://nodejs.org/ "node.js"