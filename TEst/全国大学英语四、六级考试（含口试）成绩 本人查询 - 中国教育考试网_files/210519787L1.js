function fsoftkey()
{
  $(".softkey").toggle();
  $("#keyboard").html("<img src=/tea/layui/css/modules/layer/default/loading-0.gif>");
  $.get("/query/js/rare_words.json",function(ret)
  {
     var arr=ret.Rare_words,htm=[];
     for(var i=0;i<arr.length;i++)
     {
         htm.push("<li class=letter>" + arr[i] + "</li>");
     }
     htm.push("<a class=letter-close onclick=javascript:$('.softkey').hide()>关闭</a>");
     $('#keyboard').html(htm.join(""));
     
     $('#keyboard li').click(function()
     {
         var character=$(this).html(); 
         var fxm=form1.xm;
         try
         {
             if(document.selection)
                 fxm.value=fxm.value+character;
             else
                 fxm.value=fxm.value.substring(0,fxm.selectionStart)+character+fxm.value.substring(fxm.selectionEnd);
         }catch(e)
         {
              fxm.value+=character;
         }
         fxm.focus();
     });
  });
}