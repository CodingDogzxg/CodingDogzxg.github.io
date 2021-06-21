let advice_dict = {
    "en-spc_err" : "问题：缺失半角空格/重复使用标点。 解决方法：标点后加空格/删除重复标点。",
};

function show_corrections(type) {
    advice = document.getElementById("advice");
    advice.innerText = advice_dict[type];
};

const { defineComponent, ref, h } = Vue

let Main = defineComponent({
    methods: {
        periodComma() {
            a = this.textarea;
            if(this.select_value == "选择语境") {
                this.$notify({
                    title: '提示',
                    message: h('i', {style: `color: ${this.theme_color}`}, '空语境？句读之不知？')
                    });
            } else if(!a) {
                this.$notify({
                    title: '提示',
                    message: h('i', {style: `color: ${this.theme_color}`}, '空句读？惑之不解？')
                    });
            } else {
                let tx = this.textarea;
                let lang = this.select_value;
                switch (lang) {
                    case "en" : this.funcReEnglish(tx); break;
                    case "fr" : this.prompt_unfinish_text("Français"); break;
                    case "zh" : this.prompt_unfinish_text("中文"); break;
                    case "jp" : this.prompt_unfinish_text("日本語"); break;
                    case "mx" : this.prompt_unfinish_text("混合"); break;
                }
            }
        },
        change_color() {
            // Yank theme color from localStorage and use it.
            // document.documentElement.style.setProperty("--mainColor", localStorage.getItem("userThemeColor"));
            let colorInput = document.querySelector("#choose-theme-color");
            let that = this;
            colorInput.addEventListener("change", function() {
                document.documentElement.style.setProperty("--mainColor", this.value);
                that.theme_color = this.value;
                // lighten func: convert sliced hex string to dec; minus 31 and convert back
                let lighter = "#" + ((parseInt(Number("0x" + this.value.slice(1)), 10) - 31) % 16777215).toString(16);
                document.documentElement.style.setProperty("--mainColor-btn-prm", lighter);
                // Save the value for next time page is visited.
                // localStorage.setItem("userThemeColor", this.value);
            });
        },
        prompt_unfinish_text(lang) {
            this.$notify({
                title: '提示',
                message: h('i', {style: `color: ${this.theme_color}`}, lang + '语境功能尚未完成，客官敬请期待！')
                });
        },
        select_onchange(lang) {
            if(lang == "en") {
                this.input_disabled = 1;
                this.input_placeholder = "请输入Title";
            } else {
                this.input_disabled = 0;
                this.input_placeholder = "仅在英文语境下可用";
            }
        },
        instruct() {
            this.$alert(`1.选择您论文的语言语境<br>
                         2.输入/粘贴您的论文到正文框<br>
                         3.点击句读按钮<br><br>
                         ps: 本站不提供语法错误标红<br>
                         获得语法支持请到：<br>
                         <a href="https://app.grammarly.com/" target="_blank">Grammarly</a><br>
                         `, '教程', {
              confirmButtonText: '哇嘎哒',
              dangerouslyUseHTMLString: true,
            }).catch(e=>e);
        },
        title_change(title) {
            let funcWords = ["a", "an", "the", "for", "and", "nor", "but", "or", "yet", "so", "at", "around", 
                             "by", "after", "along", "for", 'from', "of", "on", "to", "with", "without"];
            let title_array = title.split(" ");
            console.log("onblur called");
        },
        funcReEnglish(text) {
            // [,.:;!?]后接的并不是空格、引号或数字0-9中的一个
            let reg = /[,.:;!?](?!([ |"|\[0-9\]]))/g;
            let answer = "";
            text = text + " ";
            console.log(text);
            let text_temp = text;
            while(res = reg.exec(text_temp)) {
                let count = 0;
                let solid = text.match(/^([a-z]| |[,.:;!?] )+/g);
                let idx = !solid ? 0 : solid[0].length;
                // if(solid) console.log("solid" + solid[0].length);
                let punc = res[0];
                let str = '[p](?! )';
                let reg_new = str.replace('p', punc);
                // console.log(reg_new);
                reg_new1 = new RegExp(reg_new);
                text = text.replace(reg_new1, `<span class="alerts_corrections" onclick="show_corrections('en-spc_err');">${punc}</span>`);
                count ++;
                answer += text.slice(0, idx + count * 83); // slice 不包括下标end
                text = text.slice(idx + count * 82 + 1); // slice 包括下标start
                // console.log("answer: " + answer);
                // console.log("text: " + text);
            }
            answer += text ? text : "";
            answer = answer.replace(/\n/g,"<br>");
            let div = document.createElement('div');
            div.innerHTML = answer;
            let advice_inner = document.getElementById("result");
            advice_inner.innerText = "";
            advice_inner.appendChild(div);
        },
    },
    setup() {
        return {
            theme_color : "#409EFF",
            input_disabled : 0,
            input_placeholder: ref("仅在英文语境下可用"),
            select_value: ref("选择语境"),
            input_title: ref(''),
            textarea: ref(''),
        }
    },
    mounted(){
        this.change_color()
    },
    data() {
        return {
            options: [{
                value: 'en',
                label: 'English',
            }, {
                value: 'fr',
                label: 'Français',
            }, {
                value: 'zh',
                label: '中文',
            }, {
                value: 'jp',
                label: '日本語',
            }, {
                value: 'mx',
                label: '混合',
            }],
            value: this.select_value
        }
    }
});
const app = Vue.createApp(Main);
app.use(ElementPlus);
app.mount("#app")