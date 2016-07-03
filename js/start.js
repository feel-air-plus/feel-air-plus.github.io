var milkcocoa = new MilkCocoa("eggipdy4kpy.mlkcca.com");
var groupDataStore = milkcocoa.dataStore("group");
var userDataStore = milkcocoa.dataStore("user");
var iconDataStore = milkcocoa.dataStore("icon");

window.onload = function(){

    // 画面描画時
    // グループデータストア内の項目を一覧で取得
    groupDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したグループ情報を画面のセレクトボックスに反映
        datas.forEach(function(data) {
            createGroupRow(data);
        });
    });

    // アイコンデータストア内の項目を一覧で取得
    iconDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したアイコン情報を元に画面のラジオボタンに反映
        datas.forEach(function(data) {
            createIconRow(data);            
        });
    });
};

function createGroupRow(data){
    // グループのセレクトボックス要素を生成
    $('.selectgroup').append(
    '<option value="'
    + data.value.groupName
    + '">'
    + data.value.groupName
    + '</option>');
};

function createIconRow(data){
    // アイコンのラジオボタン要素を生成
    var iconName = data.value.iconName;
    var iconUrl = data.value.url;
    $('.icon-radio-row').append('<label class='
    + iconName
    + '>'
    + '<input type="radio" name="iconStatus"'
    + 'value="'
    + data.value.iconId
    + '" ></label>');
    $('.'+iconName).addClass("crobd");
    $('.'+iconName).css('background', 'url('
    + iconUrl
    + ') no-repeat left top');
};

function enterChatMap() {
    alert("ボタン押下");
    var userName = $(".input__field")[0].value;
    var selectedGroup = $(".selectgroup")[0].value;
    var selectedIcon = $("input[name='iconStatus']:checked").val();

        // 決定ボタン(仮)押下時
        // 　○選択しているグループの入室上限チェック
        // 　 ・上限を超えている場合
        // 　　　○エラー文言表示
        // 　 ・上限を超えていない場合
        // 　　　○後続処理

        // 　○入力されたユーザ名上限チェック
        // 　 ・上限を超えている場合
        // 　　　○エラー文言表示
        // 　 ・上限を超えていない場合
        // 　　　○後続処理

        // 　○選択しているグループの入室上限更新(データストア)
        // 　○選択内容をデータストアに反映
        // 　　・ユーザデータストア
        // 　　　○ユーザ名、グループID、選択しているアイコンID
        //     ※ユーザ名がひらがなだと処理で扱いづらい。この時点でユーザIDを自動発番？

        // ユーザ情報はセッションストレージで引き継ぐ
        // sessionStorage.clear();
        // sessionStorage.setItem('test', num);
        // sessionStorage.getItem('test');
};
