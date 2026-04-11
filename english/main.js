let IPA_result = "";
let IPA_DB = {};

function normalize_ipa_data(lang_data) {
  const normalized = {};
  const lang = IPA_US.checked ? "en_US" : "en_UK";
  lang_data[lang].forEach(entry => {
    Object.keys(entry).forEach(word => {
      normalized[word] = entry[word];
    });
  });
  return normalized;
}

function update_result() {
  let c_w = get_IPA_tBox().split(" ");

  set_IPA_tBox("loading....");

  get_IPA_DB((obj) => {
    let str = "";

    for (var i = 0; i < c_w.length; i++) {
      let word = c_w[i];

      preprocess_input(word, (t_word) => {
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

  const data_file = document.getElementById("IPA_US").checked
    ? "../json/en_US.json"
    : "../json/en_UK.json";

  xmlhttp.open("GET", data_file, true);
  xmlhttp.send();
}

function get_IPA_tBox() {
  return document.getElementById("cWords_tBox").value;
}

function set_IPA_tBox(v = IPA_result) {
  document.getElementById("IPA_tBox").value = v;
}

function preprocess_input(x, callback) {
  callback(x
    .replace(/[A-Z]/g, c => c.toLowerCase())
    .replace(/[.,\n]/g, "")
    );
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

  // Update when any control changes
  inlineRadioOptions.forEach(function (radio) {
    radio.addEventListener("change", update_result);
  });

  wf_c_words.addEventListener("change", update_result);

  // Initial load
  update_result();
});
