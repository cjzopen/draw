(function(){
  // url hash value
  var committeeType ='';
  function tab(){
    return committeeType = decodeURI(window.location.hash.substr(1));
  }
  tab();
  // default tab
  $(function(){
    if(!committeeType){
      $('#nav li').eq(0).find('a').get(0).click();
    }else{
      if($('#nav a[href="#'+committeeType+'"]').length){
        $('#nav a[href="#'+committeeType+'"]').get(0).click();
      }else{
        $('#nav li').eq(0).find('a').get(0).click();
      }
    }
  });

  var memberArray = new Array();

  //load and save
  //data2.json 暫定為後端給予資料的路徑
  //test.php 暫定為後端接收與處理資料的路徑
  var loadingReq = new Request('data2.json', {method: 'GET', cache: 'reload'});
  // var committeeReq = new Request('committee.json', {method: 'GET'});
  // var sortingReq = new Request('sort.json', {method: 'GET', cache: 'reload'});
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
  var total=0;
  var tabsArray = new Array();
  var saveArray=[];

  //小組成員
  fetch(loadingReq).then(function(response) {
    Promise.resolve(response.json()).then(function (result) {
      $.each(result,function(key,value) {
        memberArray.push(value.member);
        total++;
      });
    });
  }).catch(function(err) {
    console.log(err)
  })


  function loadingFetch(updateOrInsert){
    updateOrInsert = updateOrInsert || false;
    fetch(loadingReq).then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      originalData = Promise.resolve(response.json()).then(function (result) {
        //照質詢順序排序
        result.sort(function(a, b) {
          return parseInt(a.speakingOrder) - parseInt(b.speakingOrder);
        });
        //產生html
        // var total=0;
        // var memberArray = new Array();
        // var tabsArray = new Array();
        document.getElementById('draw-order').innerHTML='';
        $.each(result,function(key,value) {
          //create tabs
          // if(!tabsExist){
          //   if(tabsArray.indexOf(value.committee) == -1){
          //     tabsArray.push(value.committee);
          //     $('#nav ul').append('<li><a href="#' + value.committee + '">' + value.committee + '</a></li>');
          //   }
          // }
          //create data
          // if(value.committee == committeeType){
            var speakingOrderValue = value.speakingOrder || '#';
            var memberDisplay = '#';
            if(value.drawOrder) memberDisplay = value.member;
            memberArray = memberArray;
            // memberArray.push(value.member);
            document.getElementById('draw-order').innerHTML += '<li data-speakingorder="'+ value.speakingOrder + '" data-draw="'+ value.drawOrder +'" data-number=""><div><span>' + speakingOrderValue + '</span></div><div class="member-group">' + memberDisplay + '</div></li>';
          // }
        });
        //beside array
        // var dd=[];
        // $('#draw-order li').each(function(){
        //   var dataDraw = $(this).attr('data-speakingorder');
        //   if(dataDraw){
        //     dd.push(dataDraw);
        //   }
        // });

        // }
        //sort by attribute data
        // function sortData(dataName){
        //   var $li = $('#draw-order li');
        //   var delay = function(s){
        //     return new Promise(function(resolve,reject){
        //       setTimeout(resolve,s);
        //     });
        //   };
        //   delay().then(function(){
        //     $li.each(function(){
        //       var i = $(this).index();
        //       $li.eq(i).css({
        //         'opacity':'0',
        //         'transform':'translateY('+(-i*3)+'rem)'
        //       });
        //     });
        //     return delay(400);
        //   }).then(function(){
        //     $li.sort(sortLi).appendTo('#draw-order');
        //     $li.css({'opacity':'1','transform':'translateY(0)'});
        //     return delay(400);
        //   });
        //   function sortLi(a, b) {
        //     return ($(b).data(dataName)) < ($(a).data(dataName)) ? 1 : -1;
        //   }
        // }
        // document.getElementById('sort-speakingorder').addEventListener("click", function(){
        //   sortData('speakingorder');
        // });
        // document.getElementById('sort-number').addEventListener("click", function(){
        //   sortData('number');
        // });
      });
    }).then(function(j) {
      // console.log(j)
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
        // var drawer = draw(total);
        // var arr = Array(total).fill().map((_,i)=>i+1);
        var arr = new Array();
        for(var i=1;i<=total;i++){
          arr.push(i)
        }
        // click lottery button
        document.getElementById('d-r-a-w').addEventListener('click',function(){
          var drawer = draw(total);
          var column = $('#draw-order li[data-speakingorder=""]');
          if(column.length !== 0){
            column.each(function(index){
              $(this).attr('data-speakingorder', drawer[index]);
              $(this).children().eq(0).find('span').text(drawer[index]);
            });
            saveFunction();
            //以上已完成亂數排序和儲存資料，以下為文字亂數動畫
            var duration = Number(document.getElementById("duration1").value)*1000 || 1000;
            if(isNaN(duration) || duration <= 0 ){
              duration = 1000;
            }else if(duration >= 10000){
              duration = 10000;
            }
            var se = setInterval(function() {
              column.each(function(index){
                var $this = $(this);
                $this.children().eq(0).find('span').text(arr.sort(function() { return 0.5 - Math.random() })[0]);
              });
            },50);
            setTimeout(function(){
              clearInterval(se);
              column.each(function(index){
                var $this = $(this);
                $this.attr('data-speakingorder', drawer[index]);
                $this.children().eq(0).find('span').text(drawer[index]);
              });
            }, duration);
            // column.each(function(index){
            //   var $this = $(this);
            //   var i=0;
            //   var se = setInterval(function() {
            //     console.log(i);
            //     // var tempNum = arr.sort(function() { return 0.5 - Math.random() })[0];
            //     $this.children().eq(0).find('span').text(arr.sort(function() { return 0.5 - Math.random() })[0]);
            //     i++;
            //     if (i>= duration/250) {
            //       clearInterval(se);
            //       console.log('end');
            //       $this.attr('data-speakingorder', drawer[index]);
            //       $this.children().eq(0).find('span').text(drawer[index]);
            //     }
            //   }, 250);
            // });
          }
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

        // click lottery2 button
        document.getElementById('d-r-a-w-2').addEventListener('click',function(){
          // $('#d-r-a-w-2').hide();
          //加上slice()避免被覆寫
          var newMemberArray = drawMember(memberArray.slice());
          var tempRandomMemberArray = newMemberArray;
          var column = $('#draw-order li[data-draw=""]');
          if(column.length !== 0){
            column.each(function(index){
              $(this).children().eq(1).text(newMemberArray[index]);
              $(this).attr('data-draw',index+1);
            })
            saveFunction();
            //以上已完成亂數排序和儲存資料，以下為文字亂數動畫
            var duration = Number(document.getElementById("duration2").value)*1000 || 1000;
            if(isNaN(duration) || duration <= 0 ){
              duration = 1000;
            }else if(duration >= 10000){
              duration = 10000;
            }
            column.each(function(index){
              var $this = $(this);
              var i=0;
              var se = setInterval(function() {
                // drawMember(memberArray);
                $this.children().eq(1).text(memberArray[Math.floor(Math.random() * (total - 1))]);
                i++;
                if (i>= duration/50) {
                  clearInterval(se);
                  $this.children().eq(1).text(newMemberArray[index]);
                  if(!$('#d-r-a-w-2').is(':visible')){
                    $('#d-r-a-w-2').show();
                  }
                }
              }, 50);
            });
          }
        });
    }).catch(function(err) {
      console.log(err)
    })
  }
  loadingFetch();
  // $('#nav li').eq(0).find('a').trigger('click')

  $('body').on('click', '#nav a', function(){
    $(this).closest('li').siblings().removeClass('act');
    $(this).closest('li').addClass('act');
  });

  //save
  function saveFunction(){
    saveArray=[];
    // $('#draw-order li div').eq(0).text();
    $('#draw-order li').each(function(){
      var tempObj={
        "committee": committeeType,
        "speakingOrder": $(this).children(':first').text(),
        "drawOrder": $(this).attr('data-draw'),
        "member": $(this).find('.member-group').text()
      }
      saveArray.push(tempObj);
    });
    console.log(saveArray);
    feachSave(saveArray);
  }

  $(window).on('hashchange', function (e) {
    // history.go(0);
    // memberArray =[];
    saveArray= [];
    tab();
    // $('#draw-order *').remove();
    document.getElementById('draw-order').innerHTML='';
    loadingFetch(true);
  });
})($);


