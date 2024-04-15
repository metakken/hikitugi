//import "./styles.css" assert { type: 'css' };

// 入力ダイアログを表示 ＋ 入力内容を user に代入
var user = "";
while(user === ""){
  user = window.prompt("学籍番号を入力してください", "");
  if(user === "" || user === null || user === undefined){
    alert("学籍番号を入力してください");
    user = window.prompt("学籍番号を入力してください", "");
  }  
}


var data_size = 14;
var start_data = [];

//1問ごとに取得するデータ配列
var alldata = [];

//現在の日付時刻を取得する
function getCurrentTime() {
	var now = new Date();
	var res = "" + now.getFullYear() + "/" + padZero(now.getMonth() + 1) + 
		"/" + padZero(now.getDate()) + " " + padZero(now.getHours()) + ":" + 
		padZero(now.getMinutes()) + ":" + padZero(now.getSeconds()) + "." + padZero(now.getMilliseconds());
	return res;
}
//先頭ゼロ付加
function padZero(num) {
	var result;
	if (num < 10) {
		result = "0" + num;
	} else {
		result = "" + num;
	}
	return result;
}

//現在の日付を取得
function getCurrentDate() {
	var now = new Date();
	var res = now.getFullYear() + padZero(now.getMonth() + 1) + 
		padZero(now.getDate()) + padZero(now.getHours()) +  
		padZero(now.getMinutes()) +  padZero(now.getSeconds());
	return res;
}
var train_date = getCurrentDate();
var new_sheet = train_date + "_" +  user;

/*
var datetime = [];
var copy = new Date();
datetime.push(copy);
*/
//曜日によって使用するデータセットを変える(月曜:image0,火曜:image1,水曜:image2,木曜:image3,金曜:image4)
var daytest = new Date();
var day_id = daytest.getDay();
var img_dataset =["image0","image1","image2","image3","image4"];
var dataset_today = img_dataset[day_id-1];
console.log(dataset_today);

var now = getCurrentTime();

start_data.push(now);
for(let i=1;i<data_size;i++){
  start_data.push(""); 
}

alldata.push(start_data);



//問題番号を格納
var question_num = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}
//画像の番号を格納する配列
/*
var img_array = [];
var min = 0;
var max = 19;
var length = 20;
for (let i = 0; i < length; i++) {
  while (true) {
    var tmp = getRandomInt(min, max);
    if (!img_array.includes(tmp)) {
      img_array.push(tmp);
      break;
    }
  }
}
*/
//var filename = "C:\home\src\App\src\image0";
//var fileObj = new File([filename], "0.jpg");
//var flag = fileObj.exists;
var img_array = [];
function chk(url){
  return new Promise(function (resolve, reject) {
      const img = new Image();
      img.src = 'src/'+dataset_today+'/'+url+'.jpg';
      img.onload = function () { 
        img_array.push(url);
   
        return resolve(url) 
      };
      img.onerror = function () { return reject(url) };
  });
};

for(let i=1;i<301;i++){
chk(i)
  .then((url) => {
      //console.log('存在します');
  })
  .catch((url) => {
      //console.log('存在しません');
  });
}
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await _sleep(5000);

function arrayShuffle(array) {
  for(let i = (array.length - 1); 0 < i; i--){

    // 0〜(i+1)の範囲で値を取得
    let r = Math.floor(Math.random() * (i + 1));

    // 要素の並び替えを実行
    let tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}

// 配列を5回シャッフルする
for(let i=0; i < 5; i++) {
  arrayShuffle(img_array);
}
//var img_rand = Math.floor(Math.random() * (max + 1 - min)) + min;




//1問目の画像を描画
const target1 = document.getElementById("sample");
target1.setAttribute("src", `src/${dataset_today}/${img_array[0]}.jpg`);


//解いた問題がの正解・不正解を格納する配列
var result_array = [];

//良品・不良品どちらと解答したかを格納する配列
var select_array = [];

var decision_result = ["正解","不正解"];
var decision_select = ["良品", "不良品"];

//サンプル画像と解答から正解・不正解かを判定して返す関数
function decision(select){
  var decision_answer = 0;
  if(img_array[question_num] < 150){
    if(select != 0){
      decision_answer = 1;
    }
  }else if(img_array[question_num] >= 150){
    if(select != 1){
      decision_answer = 1;
    }
  }
  return decision_answer;
}

//正答率を計算する
function crt_ans_rate(result_array){
  var correct = 0;
  for(let i=0;i<result_array.length;i++){
    if(result_array[i]==`正解`){
      correct++;
    }
  }
  var total = (correct / result_array.length)*100 
  return total;

}

//「良品」ボタンを押したときに次の問題を表示してデータを配列に渡す
function countUp_quality() {
  var checkbox = [];
  var checkflag = [];
  for (let i = 0; i < el.length; i++) {
    checkbox[i] = el[i].checked;
    if(checkbox[i]){
      checkflag[i]=1;
    }else{
      checkflag[i]=0;
    }
  }

  var dec = decision(0);
  result_array.push(decision_result[dec]);
  select_array.push(decision_select[0]);

  //一時配列まとめて格納
  var onetime_data = [];
  onetime_data.push(getCurrentTime());
  onetime_data.push(question_num+1);
  onetime_data.push(result_array[question_num]);
  onetime_data.push(img_array[question_num]);
  onetime_data.push(0);
  for(let i=0;i<8;i++){
    onetime_data.push(checkflag[i]);
  }
  onetime_data.push(day_id);
  alldata.push(onetime_data);


  /*
  var  time = new Date();
  datetime.push(time);
  var diff =  (datetime[question_num + 1].getTime() - datetime[question_num].getTime()) / 1000;
  console.log(diff);
  */

  /*
  let total = result_array.reduce(function(sum, element){
    return sum + element;
  }, 0);
  */

  document.getElementById("answer_log").innerHTML = `<p>「${result_array[question_num]}」:あなたの前回の解答は「良品」(正答率:${crt_ans_rate(result_array)}%)</p>`;
  document.getElementById("answer_img").innerHTML = `<img id="sample"src="src/${dataset_today}/${img_array[question_num]}.jpg"width="500px"height="168px" style="display:block;">`;

  question_num++;
  document.getElementById("app").innerHTML = `<h1>No.${question_num + 1}</h1>`;
  const target = document.getElementById("sample");
  target.setAttribute("src", `src/${dataset_today}/${img_array[question_num]}.jpg`);
  target.setAttribute("alt", `画像の代わり${img_array[question_num]}`);
  
  //let answer = postData_quality();
  
  checkAll.checked = false;
  for (let i = 0; i < el.length; i++) {
    el[i].checked = false;
  }
 
}

//「不良品」ボタンを押したときに次の問題を表示してデータを配列に渡す
function countUp_defective() {
  var checkbox = [];
  var checkflag = [];
  for (let i = 0; i < el.length; i++) {
    checkbox[i] = el[i].checked;
    if(checkbox[i]){
      checkflag[i]=1;
    }else{
      checkflag[i]=0;
    }
  }
  
  var dec = decision(1);
  result_array.push(decision_result[dec]);
  select_array.push(decision_select[1]);

  //一時配列まとめて格納
  var onetime_data = [];
  onetime_data.push(getCurrentTime());
  onetime_data.push(question_num+1);
  onetime_data.push(result_array[question_num]);
  onetime_data.push(img_array[question_num]);
  onetime_data.push(1);
  for(let i=0;i<8;i++){
    onetime_data.push(checkflag[i]);
  }
  onetime_data.push(day_id);
  alldata.push(onetime_data);


  document.getElementById("answer_log").innerHTML = `<p>「${result_array[question_num]}」:あなたの前回の解答は「不良品」(正答率:${crt_ans_rate(result_array)}%)</p>`;
  document.getElementById("answer_img").innerHTML = `<img id="sample"src="src/${dataset_today}/${img_array[question_num] }.jpg"width="500px"height="168px" style="display:block;">`;

  question_num++;
  document.getElementById("app").innerHTML = `<h1>No.${question_num + 1}</h1>`;
  const target = document.getElementById("sample");
  target.setAttribute("src", `src/${dataset_today}/${img_array[question_num] }.jpg`);
  target.setAttribute("alt", `画像の代わり${img_array[question_num] }`);

 
  //let answer = postData_defective();

  checkAll.checked = false;
  for (let i = 0; i < el.length; i++) {
    el[i].checked = false;
  }
}

const quality = document.getElementById("quality");
quality.addEventListener("click", () => countUp_quality());

const defective = document.getElementById("defective");
defective.addEventListener("click", () => countUp_defective());

//GASにテータ送信
function postData_quality() {
  let URL ="https://script.google.com/macros/s/AKfycbwXPHRTH9La8snMU2EjHgYgHniyJCF_SgSZAYthHVcxW2GccsWrbH4N7aQyZHYFCebR/exec";  
  let SendDATA = {
    //answer: quality.textContent,
    answer: alldata,
    sheetname: new_sheet,

  };
  var postparam = {
    method: "POST",
    mode: "no-cors",
    "Content-Type": "application/x-www-form-urlencoded",
    body: JSON.stringify(SendDATA),
  };
  fetch(URL, postparam);
  return quality.textContent;
}


var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

// 線の色
c.strokeStyle = "red";
// パスの開始
c.beginPath();
c.lineWidth = 3;
// 1本目
c.moveTo(275, 20);
c.lineTo(275, 160);
// 2本目
c.moveTo(50, 90);
c.lineTo(500, 90);
// 3本目
c.moveTo(162.5, 20);
c.lineTo(162.5, 160);

c.moveTo(387.5, 20);
c.lineTo(387.5, 160);
// 描画
c.stroke();
c.strokeRect(50, 20, 450, 140);

//「全て選択」のチェックボックス
let checkAll = document.getElementById("checkAll");
//「全て選択」以外のチェックボックス
let el = document.getElementsByClassName("checks");

//全てにチェックを付ける・外す
const funcCheckAll = (bool) => {
    for (let i = 0; i < el.length; i++) {
        el[i].checked = bool;
    }
};

//「checks」のclassを持つ要素のチェック状態で「全て選択」のチェックをON/OFFする
const funcCheck = () => {
    let count = 0;
    for (let i = 0; i < el.length; i++) {
        if (el[i].checked) {
            count += 1;
        }
    }
    if (el.length === count) {
        checkAll.checked = true;
    } else {
        checkAll.checked = false;
    }
};

//「全て選択」のチェックボックスをクリックした時
checkAll.addEventListener("click", () => {
    funcCheckAll(checkAll.checked);
  },false);

//「全て選択」以外のチェックボックスをクリックした時
for (let i = 0; i < el.length; i++) {
    el[i].addEventListener("click", funcCheck, false);
}

//const clickBtn = document.getElementById('click-btn');
const clickBtn = document.getElementsByClassName('ans_btn');
const popupWrapper = document.getElementById('popup-wrapper');
const close = document.getElementById('close');


var loadcount = 0;
var que_cnt = 10;

// 良品or不良品ボタンを計10回クリックしたときにポップアップを表示させる
for (var k =0; k<clickBtn.length; k++){
  clickBtn[k].addEventListener('click', () => {
  //console.log(question_num);
   if(question_num % 10 == 0){
    if(question_num == 40){
      document.getElementById("close").innerHTML = `<button type="button"id="close">訓練を終了する</button>`;
    }
  popupWrapper.style.display = "block";
  const target = document.getElementById("sample");
  var canvas = document.getElementById("board");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 600, 500);
  var images =[];
  var img_src = [];
  for (let i = 0; i < que_cnt; i++) {
    images[i] = new Image();
    img_src.push(img_array[question_num-10+i]);
    images[i].src = 'src/'+dataset_today+'/'+img_src[i]+'.jpg';
  }
  var loadedCount = 0;
  for(let i = 0; i < que_cnt; i++){
    loadedCount++; 
    images[i].onload =function() {
      if (loadedCount == images.length) {
        var x = 0;
        var y = 0;
        for (let j = 0; j < que_cnt; j++) {
          ctx.drawImage(images[j], x, y, 200, 70);
          x += 200;
          if(x>=600){y += 125;  x=0;}
        }
      }
    }
  }; 
  var txt_x = 0;
  var txt_y = 90;
  for (let i = 0; i < que_cnt; i++) {
    ctx.font = '15pt Arial';
    ctx.fillStyle = 'rgba(0, 0, 0)';  
    ctx.fillText(question_num-9+i+","+"解答:"+select_array[question_num-10+i], txt_x, txt_y);
    if (result_array[question_num-10+i]=="正解"){
      ctx.fillStyle = 'rgba(0, 0, 255)';      
    }else{
      ctx.fillStyle = 'rgba(255, 0, 0)';
    }
    ctx.fillText(result_array[question_num-10+i], txt_x, txt_y+30);
    txt_x += 200;
    if(txt_x>=600){
      txt_y += 125;
      txt_x=0;
      }
    }
  }
},false);
}

// ポップアップの外側又は戻るマークをクリックしたときポップアップを閉じる
popupWrapper.addEventListener('click', e => {
  if (e.target.id === popupWrapper.id || e.target.id === close.id) {
    var now = getCurrentTime();
    var look_data = [];
    look_data.push(now);
    for(let i=1;i<data_size;i++){
      look_data.push(""); 
    }
    alldata.push(look_data);
    
    popupWrapper.style.display = 'none';
    if(question_num == 40){
      document.getElementById("close").innerHTML = `<button type="button"id="close">訓練を終了する</button>`;
      let answer = postData_quality();
      alert("ウインドウを閉じてください");
    }
  }
});

