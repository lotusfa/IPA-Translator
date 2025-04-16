let IPA_result = "";

function update_result () {

  let c_w = get_IPA_tBox ();
  set_IPA_tBox ("loading....");
  get_IPA_DB ((obj)=>{

    let str = "";

    for (var i = 0; i < c_w.length ; i++) {
      if(typeof obj[c_w[i]] != "undefined"){

        if (document.getElementById("allow_words_search").checked) {

          let s_words = [];
          s_words[0] = c_w[i];
          s_words[1] = s_words[0] + c_w[i+1];
          s_words[2] = s_words[1] + c_w[i+2];
          s_words[3] = s_words[2] + c_w[i+3];
          s_words[4] = s_words[3] + c_w[i+4];
          s_words[5] = s_words[4] + c_w[i+5];

          let words_index = 0;
          if (typeof obj[s_words[5]] != "undefined") { words_index = 5; }
          else if (typeof obj[s_words[4]] != "undefined") { words_index = 4;}
          else if (typeof obj[s_words[3]] != "undefined") { words_index = 3;}
          else if (typeof obj[s_words[2]] != "undefined") { words_index = 2;}
          else if (typeof obj[s_words[1]] != "undefined") { words_index = 1;}
          else if (typeof obj[s_words[0]] != "undefined") { words_index = 0;}

          search_words = s_words[words_index];
          if (document.getElementById("wf_c_words").checked) {
            str += "（" + search_words + "/" + obj[search_words] + "/）";
          }else  str += "/" + obj[search_words] + "/ ";
          i += words_index;

        }else{
          if (document.getElementById("wf_c_words").checked) {
            str += c_w[i] + "/" + obj[c_w[i]] + "/ ";
          }else  str = str + "/" + obj[c_w[i]] + "/ ";
        }
      }else str += c_w[i] + " ";
    }

    set_IPA_tBox (str);

  });
}

function get_IPA_DB (s) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myObj = JSON.parse(this.responseText);
          return s(myObj);
      }
  };

  xmlhttp.open("GET", "./yue.json", true);
  xmlhttp.send();
}

function get_IPA_tBox () {
  return document.getElementById("cWords_tBox").value
}

function set_IPA_tBox (v = IPA_result) {
  let tBox_str = format_main(v);
  document.getElementById("IPA_tBox").value = tBox_str;
}

function format_main(t_str){
  let f_str = t_str;

  if (document.getElementById("IPA_num").checked) f_str = format_IPA_num (t_str);
  else if (document.getElementById("IPA_org").checked) f_str = format_IPA_org (t_str);
  else if (document.getElementById("Jyutping").checked) f_str = format_Jyutping (t_str);
  
  return f_str;
}

function format_IPA_org (x){
  return x;
}

function format_IPA_num (x) {
    x = x.replace(/˥/g, "5");
    x = x.replace(/˧/g, "3");
    x = x.replace(/˨/g, "2");
    x = x.replace(/˩/g, "1");
    x = x.replace(/:/g, "");
    return x;
}

function format_Jyutping (x) {
    x = x.replace(/˥˧/g, "1");
    x = x.replace(/˥˥/g, "1");
    x = x.replace(/˧˥/g, "2");
    x = x.replace(/˧˥/g, "2");
    x = x.replace(/˧˧/g, "3");
    x = x.replace(/˨˩/g, "4");
    x = x.replace(/˩˩/g, "4");
    x = x.replace(/˩˧/g, "5");
    x = x.replace(/˨˧/g, "5");
    x = x.replace(/˨˨/g, "6");

    x = x.replace(/k˥/g, "k7");
    x = x.replace(/k˧/g, "k8");
    x = x.replace(/k˨/g, "k9");

    x = x.replace(/t˥/g, "t7");
    x = x.replace(/t˧/g, "t8");
    x = x.replace(/t˨/g, "t9");

    x = x.replace(/p˥/g, "p7");
    x = x.replace(/p˧/g, "p8");
    x = x.replace(/p˨/g, "p9");

    x = x.replace(/˥/g, "1");
    x = x.replace(/˧/g, "3");
    x = x.replace(/˨/g, "6");

    x = x.replace(/:/g, "");
    return x;
}

update_result ();
