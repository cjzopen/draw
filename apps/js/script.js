// url hash value
var committeeType ='';
function tab(){
  committeeType = decodeURI(window.location.hash.substr(1));
}
tab();

//load and save
//data2.json 暫定為後端給予資料的路徑
//test.php 暫定為後端接收與處理資料的路徑
var loadingReq = new Request('data2.json', {method: 'GET', cache: 'reload'});
function feachSave(json){
  var savingReq = new Request('test.php', {
    method: 'POST',
    mode: "same-origin",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    //request payload
    body: JSON.stringify(json)
  });
  fetch(savingReq)
  .then(function(response){
    if (!response.ok) {
      throw Error(response.statusText);
    }else{
      // console.info(response)
      console.log(response.json())
    }
  }).catch(function(err) {
    console.log(err)
  })
}

var originalData='';


function loadingFetch(tabsExist){
  tabsExist = tabsExist || false;
  fetch(loadingReq).then(function(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    originalData = Promise.resolve(response.json()).then(function (result) {
      //照抽籤順序排序
      result.sort(function(a, b) {
        return parseInt(a.drawOrder) - parseInt(b.drawOrder);
      });
      //產生html
      var total=0;
      var memberArray = new Array();
      var tabsArray = new Array();
      $.each(result,function(key,value) {
        //create tabs
        if(!tabsExist){
          if(tabsArray.indexOf(value.committee) == -1){
            tabsArray.push(value.committee);
            $('#nav ul').append('<li><a href="#' + value.committee + '">' + value.committee + '</a></li>');
          }
        }
        //create data
        if(value.committee == committeeType){
          total++
          var speakingOrderValue = value.speakingOrder || '#';
          var memberDisplay = '#';
          if(value.drawOrder) memberDisplay = value.member;
          memberArray.push(value.member);
          document.getElementById('draw-order').innerHTML += '<li data-speakingorder="'+ value.speakingOrder + '" data-draw="'+ value.drawOrder +'" data-number="'+ value.number +'"><div>' + speakingOrderValue + '</div><div class="member-group">' + memberDisplay + '</div></li>';
        }
      });
      //beside array
      // var dd=[];
      // $('#draw-order li').each(function(){
      //   var dataDraw = $(this).attr('data-speakingorder');
      //   if(dataDraw){
      //     dd.push(dataDraw);
      //   }
      // });
      //draw
      function draw(amount){
        // var cards = Array(amount).fill().map((_,i)=>i+1);
        var cards = new Array();
        for(var i=1;i<=amount;i++){
          cards.push(i)
        }
      //   besides.forEach(function(key){
      //     // console.log('key='+key)
      //     cards = cards.filter(function(e) { return e != key });
      //     // console.log('card='+cards);
      //   });
        cards.sort(function(){return Math.random()>0.5?-1:1;});
        return cards;
      }
      var drawer = draw(total);
      // var arr = Array(total).fill().map((_,i)=>i+1);
      var arr = new Array();
      for(var i=1;i<=total;i++){
        arr.push(i)
      }
      // click draw button
      document.getElementById('d-r-a-w').addEventListener('click',function(){
        var duration = Number(document.getElementById("duration1").value)*1000 || 1000;
        if(isNaN(duration) || duration < 0 ){
          duration = 1000;
        }else if(duration >= 10000){
          duration = 10000;
        }
        $('#draw-order li[data-speakingorder=""]').each(function(index){
          var $this = $(this);
          var i=0;
          var se = setInterval(function() {
            $this.children().eq(0).text(arr.sort(function() { return 0.5 - Math.random() })[0]);
            i++;
            if (i>= duration/50) {
              clearInterval(se);
              $this.attr('data-speakingorder', drawer[index]);
              $this.children().eq(0).text(drawer[index]);
      //         //main code in draw,
      //         var tempDraw = Array(1).fill().map(()=>drawer.next().value)[0];
      //         $this.attr('data-speakingorder', tempDraw);
      //         $this.children().eq(0).text(tempDraw);
      //         //******************
            }
          }, 50);
        });
      //   $('button').delay(duration).show(0);
      });


      function drawMember(array){
        for (var x = array.length - 1; x > 0; x--) {
          var y = Math.floor(Math.random() * (x + 1));
          var temp = array[x];
          array[x] = array[y];
          array[y] = temp;
        }
        return array;
      }
      // click draw2 button
      document.getElementById('d-r-a-w-2').addEventListener('click',function(){
        $('#d-r-a-w-2').hide()
        //加上slice()避免被覆寫
        var newMemberArray = drawMember(memberArray.slice());
        var duration = Number(document.getElementById("duration2").value)*1000 || 1000;
        if(isNaN(duration) || duration < 0 ){
          duration = 1000;
        }else if(duration >= 10000){
          duration = 10000;
        }
        $('#draw-order li').each(function(index){
          var $this = $(this);
          var i=0;
          var se = setInterval(function() {
            drawMember(memberArray)
            $this.children().eq(1).text(memberArray[total-1]);
            i++;
            if (i>= duration/50) {
              clearInterval(se);
              $this.children().eq(1).text(newMemberArray[index]);
              if(!$('#d-r-a-w-2').is(':visible')){
                $('#d-r-a-w-2').show()
              }
            }
          }, 50);
        });
      });

      // }
      //sort by attribute data
      function sortData(dataName){
        var $li = $('#draw-order li');
        var delay = function(s){
          return new Promise(function(resolve,reject){
            setTimeout(resolve,s);
          });
        };
        delay().then(function(){
          $li.each(function(){
            var i = $(this).index();
            $li.eq(i).css({
              'opacity':'0',
              'transform':'translateY('+(-i*3)+'rem)'
            });
          });
          return delay(400);
        }).then(function(){
          $li.sort(sortLi).appendTo('#draw-order');
          $li.css({'opacity':'1','transform':'translateY(0)'});
          return delay(400);
        });
        function sortLi(a, b) {
          return ($(b).data(dataName)) < ($(a).data(dataName)) ? 1 : -1;
        }
      }
      document.getElementById('sort-speakingorder').addEventListener("click", function(){
        sortData('speakingorder');
      });
      document.getElementById('sort-number').addEventListener("click", function(){
        sortData('number');
      });
    });
  }).then(function(j) {
    // console.log(j)
  }).catch(function(err) {
    console.log(err)
  })
}
loadingFetch();

$('body').on('click', '#nav a', function(){
  $(this).closest('li').siblings().removeClass('act');
  $(this).closest('li').addClass('act');
});
$(window).on('hashchange', function (e) {
  tab();
  // $('#draw-order *').remove();
  document.getElementById('draw-order').innerHTML='';
  loadingFetch(true);
});


//click save
var saveArray = [];
$('body').on('click', '#save', function(){
  saveArray=[];
  // $('#draw-order li div').eq(0).text();
  $('#draw-order li').each(function(){
    var tempObj={
      "committee": committeeType,
      "speakingOrder": $(this).children(':first').text(),
      "member": $(this).find('.member-group').text()
    }
    saveArray.push(tempObj);
  });
  console.log(saveArray);
  feachSave(saveArray);
});
