$(function () {

  let currentIndex = 0;

  //切换标签
  $('.title-item').on('click', function () {

    //获取下标
    let index = $(this).index();
    // console.log('index ==> ', index);

    //如果当前已经选中，则不做任何事情
    if (currentIndex == index) {
      console.log('当前已选中');
      return;
    }

    //获取html的font-size
    let fontSize = parseFloat($('html').css('font-size'));
    // console.log('fontSize ==> ', fontSize);

    //获取当前元素的宽度
    let currentWidth = $(this).width();
    // console.log('currentWidth ==> ', currentWidth);

    //如何将currentWidth转成rem值
    var distance = currentWidth / fontSize + 0.4;
    // console.log('distance ==> ', distance);

    //移动下划线
    $('.move-line').animate({
      left: index * distance + 'rem'
    }, 200);

    currentIndex = index;

  })

  // 获取地理位置
  function locationIP() {
    $.ajax({
      type: 'GET',
      url: 'https://api.map.baidu.com/location/ip',
      data: {
        ak: '70AchZM3iTQVSvvGcWCEshZp6xmXH9N9',
      },
      dataType: 'jsonp',
      success(res) {
        // console.log(res);
        // console.log(res.content.address_detail.city);
        let nowcity = res.content.address_detail.city;
        nowWeather(nowcity);
        dayWeather(nowcity);
      }
    })
  }


  // 获取当前天气
  function nowWeather(city) {
    $.ajax({
      type: 'GET',
      url: 'https://api.heweather.net/s6/weather',
      data: {
        location: city,
        key: 'd7b88d3ab34f4521b79ab13c9a94ca07'
      },
      dataType: 'json',
      success(res) {
        // console.log(res);
        if(res.HeWeather6[0].status == "unknown location"){
          return;
        }

        let noww = res.HeWeather6[0].now;
        // console.log(noww);
        // console.log(city);
        $(".location-text").text(city);
        

        $(".w").each(function (index, value) {
          let ids = $(value).attr("id");
          // console.log(ids);
          $(this).text(noww[ids]);

        })
        // console.log(res.HeWeather6[0].basic.lon);
        // console.log(res.HeWeather6[0].basic.lat);
        gridMinute(res.HeWeather6[0].basic.lon, res.HeWeather6[0].basic.lat);
      },
      error(err) {
        console.log(err);
      }
    })
  }

  // 获取分钟级降水
  function gridMinute(lon, lat) {
    // lon经度
    // lat纬度
    $.ajax({
      type: 'GET',
      url: 'https://tianqiapi.com/api',
      dataType: 'json',
      data: {
        appid: "51363754",
        appsecret: 'kwIXk9Yn',
        version: 'v11',
        lng: lon,
        lat: lat
      },
      success(res) {
        // console.log(res);
        // console.log(res.msg);
        $(".preview").text(res.msg);

      },
      error(err) {
        console.log(err);
      }
    })

    // $.ajax({
    //     type:'GET',
    //     url : 'https://api.heweather.net/s6/weather/grid-minute',
    //     dataType : 'json',
    //     data:{
    //       location: lon+','+lat,
    //       key : '27f943c2719f4a14ac294d26b0006ba7'
    //     },
    //     success(res){
    //       console.log(res);

    //     },
    //     error(err){
    //       console.log(err);
    //     }
    //   })

  }

  // 逐日预报
  function dayWeather(city) {
    $.ajax({
      type: 'GET',
      url: 'https://api.heweather.net/s6/weather',
      data: {
        location: city,
        key: 'd7b88d3ab34f4521b79ab13c9a94ca07'
      },
      dataType: 'json',
      success(res) {
        

        // console.log(res.HeWeather6[0].daily_forecast);
        let dayarr = res.HeWeather6[0];
        // console.log(dayarr);
        if(dayarr.status == "unknown location"){
          console.log("暂无该城市信息");
          return ;
        }
        Day(dayarr , "daily_forecast");

        $(".title-item").on("click",function(){
          // console.log($(this).data("type"));
          Day(dayarr , $(this).data("type"));
        })



      },
      error(err) {
        console.log(err);
      }
    })
  }


  // 渲染逐日，逐时
  function Day(data , type) {
    let dataarr = data[type];
    // console.log(dataarr);
    let html = "";
    
    for(let i = 0 ; i < dataarr.length ; i++){
      $(".weather-list").css({
        width : 0.8 * dataarr.length +"rem"
      });

      let wday = "";  
      let txt = "";
      let code = null;
      let tmp = null;
      if(type == "daily_forecast"){
        wday = dataarr[i].date.slice(5);
        txt = dataarr[i].cond_txt_d;
        code = dataarr[i].cond_code_d;
        tmp = dataarr[i].tmp_min+"℃~"+dataarr[i].tmp_max+"℃";
      }else if(type == "hourly"){
        // console.log(dataarr[i]);
        wday = dataarr[i].time.split(' ')[1];
        txt = dataarr[i].cond_txt;
        code = dataarr[i].cond_code;
        // console.log(code);
        tmp = dataarr[i].tmp+"℃";
      }
      
      html +=`<div class="weather-item fl">
      <div class="date">
        <div class="day-w">${wday}</div>
        <div class="day-txt-d">${txt}</div>
      </div>
      <div class="weather-icon">
        <img src="./images/icons/${code}.png" >
      </div>
      <div class="date mxitmp">${tmp}</div>
    </div>`
    
    // 清空之前的内容并添加新的html
    $(".weather-list").empty().append(html);
      
    }

  }



    // console.log(month,day);


  // 根据不同时间段设置背景颜色
  function setBackground() {
    let time = new Date();
    let nowtime = time.getHours();
    // console.log(nowtime);
    let t = null;
    if (nowtime >= 6 && nowtime < 12) {
      t = "morning";
    } else if(nowtime >= 12 && nowtime < 19 ){
      t = "afternoon";
    }else{
      t = "evening";
    }
    $(".weather-box").addClass(t);
  }

  // 搜索城市
  function inputCity(){
    $(".search-icon").on("click",function(){
      let city = $(".search-ipt").val();

      // console.log(city);
      
      nowWeather(city);
      dayWeather(city);
      $(".search-ipt").val("");
    })
  }

  function init() {
    locationIP();
    setBackground();
    inputCity();
  }

  init();


})