let IPA_result = "";
let IPA_DB = {};

function normalize_ipa_data(lang_data) {
  const normalized = {};
  lang_data.ja.forEach(entry => {
    Object.keys(entry).forEach(char => {
      normalized[char] = entry[char];
    });
  });
  return normalized;
}

function update_result() {
  let c_w = get_IPA_tBox ();
  set_IPA_tBox ("loading....");
  get_IPA_DB ((obj)=>{

    let str = "";

    for (var i = 0; i < c_w.length ; i++) {
      if(typeof obj[c_w[i]] != "undefined"){

        if (document.getElementById("allow_words_search").checked) {

          let search_words = c_w[i];
          let words_index = 0;
          for (let len = 6; len >= 1; len--) {
            if (i + len <= c_w.length) {
              let word = c_w.substring(i, i + len);
              if (typeof obj[word] != "undefined") {
                search_words = word;
                words_index = len - 1;
                break;
              }
            }
          }

          if (document.getElementById("wf_c_words").checked) {
            str += "( " + search_words + " " + obj[search_words] + " )";
          }else  str += "/" + obj[search_words];
          i += words_index;

        }else{
          if (document.getElementById("wf_c_words").checked) {
            str += c_w[i] + obj[c_w[i]];
          }else  str = str + obj[c_w[i]];
        }
      }else str += c_w[i] + " ";
    }

    set_IPA_tBox (str);

  });
}

function get_IPA_DB(s) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      IPA_DB = normalize_ipa_data(myObj);
      return s(IPA_DB);
    }
  };

  xmlhttp.open("GET", "../json/ja.json", true);
  xmlhttp.send();
}

function get_IPA_tBox() {
  return document.getElementById("cWords_tBox").value;
}

function set_IPA_tBox(v = IPA_result) {
  document.getElementById("IPA_tBox").value = v;
}

// Initialize event listeners when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  const cWords_tBox = document.getElementById("cWords_tBox");
  const wf_c_words = document.getElementById("wf_c_words");
  const allow_words_search = document.getElementById("allow_words_search");
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  // Dark mode toggle
  const iconImg = darkModeToggle.querySelector(".icon");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    iconImg.src = "../img/dark-mode.svg";
  } else {
    iconImg.src = "../img/light-mode.svg";
  }

  darkModeToggle.addEventListener("click", function () {
    darkModeToggle.classList.add("btn-theme-transition");
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    iconImg.src = isDark
      ? "../img/dark-mode.svg"
      : "../img/light-mode.svg";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // Auto-update on input
  cWords_tBox.addEventListener("input", update_result);

  // Select all text on focus
  cWords_tBox.addEventListener("focus", function () {
    this.select();
  });

  if (wf_c_words) wf_c_words.addEventListener("change", update_result);
  if (allow_words_search) allow_words_search.addEventListener("change", update_result);

  // Initial load
  update_result();
});
