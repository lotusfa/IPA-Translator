let IPA_result = "";

function update_result () {
  
  let c_w = (pre(get_IPA_tBox())+" ").split(" ");

  set_IPA_tBox ("loading....");

  get_IPA_DB ((obj)=>{

    
    let str = "";

    for (var i = 0; i < c_w.length; i++) {

      let word = c_w[i];

      console.log(word, obj[word]);
      if ( word != "") {
        if(typeof obj[word] != "undefined" ){
          //console.log(word,obj[word]);

          let s_words = [];
          s_words[0] = c_w[i];
          s_words[1] = s_words[0] + " " + c_w[i+1];
          s_words[2] = s_words[1] + " " + c_w[i+2];
          s_words[3] = s_words[2] + " " + c_w[i+3];
          s_words[4] = s_words[3] + " " + c_w[i+4];
          s_words[5] = s_words[4] + " " + c_w[i+5];

          let words_index = 0;
          if (typeof obj[s_words[5]] != "undefined") { words_index = 5; }
          else if (typeof obj[s_words[4]] != "undefined") { words_index = 4;}
          else if (typeof obj[s_words[3]] != "undefined") { words_index = 3;}
          else if (typeof obj[s_words[2]] != "undefined") { words_index = 2;}
          else if (typeof obj[s_words[1]] != "undefined") { words_index = 1;}
          else if (typeof obj[s_words[0]] != "undefined") { words_index = 0;}

          search_words = s_words[words_index];

          if (document.getElementById("wf_c_words").checked) {

              str += "{ " + search_words + " - " + obj[search_words] + " }";

          }else  str += obj[search_words] + " ";

          i += words_index;

        }else str += word + " ";

        set_IPA_tBox (str);

      }
    }

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

  xmlhttp.open("GET", "./fa.json", true);
  xmlhttp.send();
}

function get_IPA_tBox () {
  return document.getElementById("cWords_tBox").value
}

function set_IPA_tBox (v = IPA_result) {
  document.getElementById("IPA_tBox").value = v;
}

function pre(x){
  x = x.replace(/\./g, "");
  x = x.replace(/\,/g, "");
  x = x.replace(/\n/g, "");
  return x;
}

update_result ();