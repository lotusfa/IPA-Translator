let IPA_result = "";
let data_file = "./ja.json";

function preprocess_ja_str(str) {
  return str
    .replace(/[A-Z]/g, c => c.toLowerCase())
    .replace(/[.,\n]/g, "");
}

function update_result() {
  let c_w = get_IPA_tBox();

  set_IPA_tBox("loading....");

  get_IPA_DB((obj) => {
    let str = "";

    for (var i = 0; i < c_w.length; i++) {
      let t_char = preprocess_ja_str(c_w[i]);
      if (t_char != "") {
        if (typeof obj[t_char] != "undefined") {
          if (document.getElementById("allow_words_search") && document.getElementById("allow_words_search").checked) {
            let search_words = t_char;
            let words_index = 0;
            for (let len = 6; len >= 1; len--) {
              if (i + len <= c_w.length) {
                let word = preprocess_ja_str(c_w.substring(i, i + len));
                if (typeof obj[word] != "undefined") {
                  search_words = word;
                  words_index = len - 1;
                  break;
                }
              }
            }
            if (document.getElementById("wf_c_words") && document.getElementById("wf_c_words").checked) {
              str += "( " + search_words + " " + obj[search_words] + " )";
            } else {
              str += obj[search_words];
            }
            i += words_index;
          } else {
            if (document.getElementById("wf_c_words") && document.getElementById("wf_c_words").checked) {
              str += t_char + " " + obj[t_char];
            } else {
              str += obj[t_char];
            }
          }
        } else {
          str += t_char;
        }
      }
    }
    set_IPA_tBox(str);
  });
}

function get_IPA_DB(s) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      return s(myObj);
    }
  };

  xmlhttp.open("GET", data_file, true);
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
