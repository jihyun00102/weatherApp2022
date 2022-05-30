$(document).ready(function(){
    //06366ed89fca9c8713977d78e5a79540
    //https://api.openweathermap.org/data/2.5/weather?q=seoul&appid=06366ed89fca9c8713977d78e5a79540


    var cityName = []; //버튼 클릭시 또는 검색바에서 입력 후 엔터를 누를 시, 도시명 데이터를 수집한다.
    console.log(cityName);

    var myAPI = "06366ed89fca9c8713977d78e5a79540";

    var state_icon = ""; //텍스트 아이콘을 이미지 아이콘으로 변경할 수 있는 데이터


    var w_box = `
        <li>
            <div class="top">
                <div class="cur_icon">
                    <i class="wi"></i>
                </div>
                <div class="info">
                    <div class="temp"><span class="degree"></span>&nbsp;℃</div>
                    <p class="interTemp">
                        최저 <span class="temp_min"></span>℃ /
                        최고 <span class="temp_max"></span>℃
                    </p>
                    <h4></h4>
                    <p class="location">
                        <span class="city"></span>, 
                        <span class="nation"></span>
                    </p>
                </div>
            </div>

            <div class="bottom">
                <div class="wind">
                    <i class="wi wi-strong-wind"></i>
                    <p><span>0.00</span>m/s</p>
                </div>
                <div class="humidity">
                    <i class="wi wi-humidity"></i>
                    <p><span>00</span>%</p>
                </div>
                <div class="cloud">
                    <i class="wi wi-cloudy"></i>
                    <p><span>00</span>%</p>
                </div>
            </div>
    </li>`;

    function w_info(){

        $("#weather ul").empty();

        for(v of cityName){
            $("#weather ul").append(w_box);
        }

        $("#weather ul li").each(function(index){

        //append 또는 prepend() 자식을 추가하는 메서드는 기존 자식을 남기는 상태에서 새로운 자식들을 추가 ==> 신규 데이터를 새롭게 반복하여 적용하고자 할 때는 반복문 이전에 초기화가 필요



        
            //ajax 구문의 시작
            $.ajax({
                url : "https://api.openweathermap.org/data/2.5/weather?q="+cityName[index]+"&appid="+myAPI+"",
                dataType : `json`,
                error:function(err){
                    console.log(err);
                },
                success : function(data){
                console.log(data);
                var weather = data.weather[0].main;
                console.log("현재 날씨 : " + weather);
                var temp = Math.round(data.main.temp - 273.15);
                console.log("현재 온도 : " + temp);
                var min_temp = Math.round(data.main.temp_min - 273.15);
                console.log("최저 온도 : " + min_temp);
                var max_temp = Math.round(data.main.temp_max - 273.15);
                console.log("최고 온도 : " + max_temp);
                var city = data.name
                console.log("도시명 : " + city);
                var nation = data.sys.country
                console.log("국가명 : " + nation);
                var wind = data.wind.speed
                console.log("현재풍속 : " + wind);
                var humidity = data.main.humidity
                console.log("현재습도 : " + humidity);
                var cloud = data.clouds.all
                console.log("현재습도 : " + cloud);
            
            
                //텍스트화 된 날씨(변수명 weather) 데이터 이미지를 아이콘으로 변경
                if(weather == "Clear") state_icon = "wi-day-sunny";
                else if(weather == "Clouds") state_icon = "wi-cloud";
                else if(weather == "Rain") state_icon = "wi-rain";
                else if(weather == "Snow") state_icon = "wi-snow";
                else if(weather == "Mist") state_icon = "wi-fog";
                else if(weather == "Haze") state_icon = "wi-day-haze";
            
                $("#weather li").eq(index).find(".cur_icon i").addClass(state_icon);
                $("#weather li").eq(index).find(".temp .degree").text(temp);
                $("#weather li").eq(index).find(".interTemp .temp_min").text(min_temp);
                $("#weather li").eq(index).find(".interTemp .temp_max").text(max_temp);
                $("#weather li").eq(index).find(".location .city").text(city);
                $("#weather li").eq(index).find(".location .nation").text(nation);
                $("#weather li").eq(index).find(".wind span").text(wind);$("#weather li .humidity span").text(humidity);
                $("#weather li").eq(index).find(".cloud span").text(cloud);
                $("#weather li").eq(index).find(".info h4").text(weather);
                }
            });
            //ajax 구문의 종료

        });
    }


    $(document).on("click",".cities button",function(){
        console.log(this);
        var city_txt = $(this).text(); //클릭한 곳의 텍스트를 추출
        console.log(city_txt);

        cityName.unshift(city_txt); //cityname이라는 전역 변수에 배열데이터의 첫번째 인덱스에 추출한 텍스트(도시명)를 넣어준다.
        console.log(cityName);

        $(this).remove();//클릭한 곳의 버튼을 제거한다


                
        w_info();

    });

    function searching(){
        var search_val = $("#search_box").val();
        if(search_val.trim() == ""){
            alert("검색어를 입력바랍니다.");
            $("#search_box").focus();
        }else{
            cityName.unshift(search_val);
            w_info();
        }
    }

    $(".search button").click(function(){
        searching();
    });

    $("#search_box").keydown(function(e){
        if(e.keyCode == "13"){
            searching();
        }
    });


    //현재 나의 위치 정보를 가져와서 해당하는 날씨를 보여준다
    //https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid={API key}
    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);

        var latiude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log(latiude);
        console.log(longitude);


        $.ajax({
            url:`https://api.openweathermap.org/data/2.5/weather?lat=${latiude}&lon=${longitude}&appid=${myAPI}`,
            dataType:`json`,
            success:function(data){
                console.log(data);
                var city = data.name;
                console.log("도시명 : " + city);

                cityName.unshift(city); //브라우저가 로딩하자마자 현재 나의 위치를 배열 데이터에 넣는다
                w_info(); //함수문을 호출한다 => 배열데이터에 접근하여 구조를 조정하고 그 데이터 내용을 넣겠다는 의미
            }
        });

        


    });




    



});