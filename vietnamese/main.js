let IPA_result = "";
let IPA_DB = {};
let currentVariant = "vi_C"; // Default to Central Vietnamese

function normalize_ipa_data(lang_data) {
  const normalized = {};
  const variant = currentVariant;
  if (lang_data[variant]) {
    lang_data[variant].forEach(entry => {
      Object.keys(entry).forEach(char => {
        normalized[char] = entry[char];
      });
    });
  }
  return normalized;
}

function update_result() {
  let c_w = get_IPA_tBox();
  set_IPA_tBox("loading....");
  get_IPA_DB((obj) => {

    let str = "";

    for (var i = 0; i < c_w.length; i++) {
      if (typeof obj[c_w[i]] != "undefined") {

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
          } else str += "/" + obj[search_words];
          i += words_index;

        } else {
          if (document.getElementById("wf_c_words").checked) {
            str += c_w[i] + obj[c_w[i]];
          } else str = str + obj[c_w[i]];
        }
      } else str += c_w[i] + " ";
    }

    set_IPA_tBox(str);

  });
}

function get_IPA_DB(s) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myObj = JSON.parse(this.responseText);
          IPA_DB = normalize_ipa_data(myObj);
          return s(IPA_DB);
      }
  };

  xmlhttp.open("GET", "../json/" + currentVariant + ".json", true);
  xmlhttp.send();
}

function get_IPA_tBox() {
  return document.getElementById("cWords_tBox").value;
}

function set_IPA_tBox(v = IPA_result) {
  let tBox_str = format_main(v);
  document.getElementById("IPA_tBox").value = tBox_str;
}

function format_main(t_str) {
  let f_str = t_str;

  if (document.getElementById("IPA_num").checked) f_str = format_IPA_num(t_str);
  else if (document.getElementById("IPA_org").checked) f_str = format_IPA_org(t_str);

  return f_str;
}

function format_IPA_org(x) {
  return x;
}

function format_IPA_num(x) {
  // Simplified tone number conversion for Vietnamese
  // Replace tone marks with numbers
  x = x.replace(/˧˥/g, "5");
  x = x.replace(/˧/g, "3");
  x = x.replace(/˨˩/g, "4");
  x = x.replace(/˩/g, "1");
  x = x.replace(/˧˧/g, "3");
  x = x.replace(/˦˥/g, "6");
  x = x.replace(/˦/g, "4");
  x = x.replace(/˧˩/g, "4");
  x = x.replace(/˨˧/g, "5");
  x = x.replace(/˥/g, "1");
  x = x.replace(/:/g, "");
  return x;
}

// Initialize event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const cWords_tBox = document.getElementById('cWords_tBox');
  const IPA_tBox = document.getElementById('IPA_tBox');
  const formatRadios = document.querySelectorAll('input[name="format"]');
  const wf_c_words = document.getElementById('wf_c_words');
  const allow_words_search = document.getElementById('allow_words_search');
  const variantRadios = document.querySelectorAll('input[name="variant"]');
  const darkModeToggle = document.getElementById('dark-mode-toggle');

  // Dark mode toggle
  const iconImg = darkModeToggle.querySelector('.icon');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    iconImg.src = '../img/dark-mode.svg';
  } else {
    iconImg.src = '../img/light-mode.svg';
  }

  darkModeToggle.addEventListener('click', function() {
    darkModeToggle.classList.add('btn-theme-transition');
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    iconImg.src = isDark ? '../img/dark-mode.svg' : '../img/light-mode.svg';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Auto-update on input
  cWords_tBox.addEventListener('input', update_result);

  // Select all text on focus
  cWords_tBox.addEventListener('focus', function() {
    this.select();
  });

  // Update when any control changes
  formatRadios.forEach(function(radio) {
    radio.addEventListener('change', update_result);
  });

  wf_c_words.addEventListener('change', update_result);
  allow_words_search.addEventListener('change', update_result);

  // Update on variant change and reload data
  variantRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      currentVariant = this.value;
      update_result();
    });
  });

  // Initial load
  update_result();
});
