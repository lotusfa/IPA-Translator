let IPA_result = "";
let IPA_DB = {};

function normalize_ipa_data(lang_data) {
  const normalized = {};
  const lang = Object.keys(lang_data)[0];
  const entries = lang_data[lang];
  entries.forEach(entry => {
    Object.keys(entry).forEach(word => {
      normalized[word] = entry[word];
    });
  });
  return normalized;
}

function update_result() {
  let c_w = get_IPA_tBox();

  set_IPA_tBox("loading....");

  get_IPA_DB((obj) => {
    let str = "";

    for (var i = 0; i < c_w.length; i++) {
      let word = c_w[i];

      preprocess_fr(word, (t_word) => {
        if (word != "") {
          if (typeof obj[t_word] != "undefined") {
            let ipa = obj[t_word];

            if (document.getElementById("wf_c_words").checked) {
              str += "( " + word + " : " + ipa + " ) ";
            } else {
              str += ipa + " ";
            }
          } else {
            str += word + " ";
          }

          set_IPA_tBox(str);
        }
      });
    }
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

  let data_file;
  if (document.getElementById("IPA_fr_FR").checked) {
    data_file = "../json/fr_FR.json";
  } else if (document.getElementById("IPA_fr_QC").checked) {
    data_file = "../json/fr_QC.json";
  } else {
    data_file = "../json/fr_FR.json";
  }

  xmlhttp.open("GET", data_file, true);
  xmlhttp.send();
}

function get_IPA_tBox() {
  return document.getElementById("cWords_tBox").value;
}

function set_IPA_tBox(v = IPA_result) {
  document.getElementById("IPA_tBox").value = v;
}

function preprocess_fr(x, callback) {
  x = x.replace(/A/g, "a");
  x = x.replace(/B/g, "b");
  x = x.replace(/C/g, "c");
  x = x.replace(/D/g, "d");
  x = x.replace(/E/g, "e");
  x = x.replace(/F/g, "f");
  x = x.replace(/G/g, "g");
  x = x.replace(/H/g, "h");
  x = x.replace(/I/g, "i");
  x = x.replace(/J/g, "j");
  x = x.replace(/K/g, "k");
  x = x.replace(/L/g, "l");
  x = x.replace(/M/g, "m");
  x = x.replace(/N/g, "n");
  x = x.replace(/O/g, "o");
  x = x.replace(/P/g, "p");
  x = x.replace(/Q/g, "q");
  x = x.replace(/R/g, "r");
  x = x.replace(/S/g, "s");
  x = x.replace(/T/g, "t");
  x = x.replace(/U/g, "u");
  x = x.replace(/V/g, "v");
  x = x.replace(/W/g, "w");
  x = x.replace(/X/g, "x");
  x = x.replace(/Y/g, "y");
  x = x.replace(/Z/g, "z");
  x = x.replace(/\./g, "");
  x = x.replace(/\,/g, "");
  x = x.replace(/\n/g, "");
  callback(x);
}

// Initialize event listeners when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  const cWords_tBox = document.getElementById("cWords_tBox");
  const inlineRadioOptions = document.querySelectorAll(
    'input[name="inlineRadioOptions"]'
  );
  const wf_c_words = document.getElementById("wf_c_words");
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

  // Update when radio buttons change (IPA_fr_FR/IPA_fr_QC)
  inlineRadioOptions.forEach(function (radio) {
    radio.addEventListener("change", update_result);
  });

  wf_c_words.addEventListener("change", update_result);

  // Initial load
  update_result();
});
