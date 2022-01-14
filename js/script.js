'use strict';

var dataTot ;

//인풋박스 엔터키로 도서 검색 실행
$("#searchBox").keydown(key => {
  if(key.keyCode == 13){//키가 13이면 실행 (엔터는 13)
    $("#btnSearch").click();
  }
});

//검색버튼 클릭시 도서 검색 실행
$("#btnSearch").click(function() {

  //검색시 화면 리셋
  $("#textArea").html("");
  
  
  //input박스 검색어 api 정보 호출
  $.ajax({
    method: "GET", 
    url: "https://dapi.kakao.com/v3/search/book?target=title",
    data: { query: $("#searchBox").val(), page: 1},
    headers: {Authorization: "KakaoAK f1998dcda2f4d4a311708cd5d2be46e7"},
    
    //성공시 검색어 관련 책 보이기
    success: msg => {
      dataTot = msg;
      // console.log(msg); //테스트코드
      
      for (var i = 0; i < msg.documents.length; i++){
        let title = msg.documents[i].title;
        
        //제목 부가정보 삭제하고 표기하기
        if (title.indexOf("(") > 0) {
          title = title.substring(0,title.indexOf("("));
        }
        
        $("<div></div>").attr("id","book"+i).addClass("book").appendTo("#textArea");
        $("<div></div>").attr("id","img"+i).addClass("img").appendTo("#book"+i);
        $("<div></div>").attr("id","text"+i).addClass("text").appendTo("#book"+i);
        $("<h3></h3>").html(title).appendTo("#text"+i);
        $("<img></img>").attr("src", msg.documents[i].thumbnail).appendTo("#img"+i);
        $("<p></p>").text(`저자 : ${msg.documents[i].authors}`).appendTo("#text"+i);
        $("<p></p>").text(`출판사 : ${msg.documents[i].publisher}`).appendTo("#text"+i);
        $(`<p>정가 : <span class='price'> ${msg.documents[i].price}</span>원</p>`).appendTo("#text"+i);
        $(`<p>할인가 : <span class='salePrice'> ${msg.documents[i].sale_price}</span>원</p>`).appendTo("#text"+i);
      }
    }
  });
  //정보 표시 후 인풋박스 클리어
  $("#searchBox").val("");
});

//책을 클릭시 카드에 담고 금액, 수량 표시
$(document).on("click", ".book", function() {
  if ($(this).hasClass("select")) {
    $(this).remove();
    
  }else {
    $(this).clone().appendTo(".selectBook").addClass("select");
  }
  culc();
});

//금액과 수량을 구하는 함수
function culc () {
  let price = 0;
  let salePrice = 0;

  $("#basket .price").each(function (i,d) {
    //parseInt($(this).text(),10);
    price += parseInt($(this).text(),10);
  });

  $("#basket .salePrice").each(function (i,d) {
    //parseInt($(this).text(),10);
    salePrice += parseInt($(this).text(),10);
  });

  let n = $(".selectBook img").length;
  
  $(".totPrice").text(`${price} 원`);
  $(".totDiscount").text(`${price-salePrice} 원`);
  $(".count").text(`${n} 개`);
  $(".totalPrice").text(`${salePrice} 원`);
}

