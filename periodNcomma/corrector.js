function funcReEnglish(text) {
    let errorClass = {
        "en-spa_err" : [],
        "en-quo_err" : [],
        "en-brk_err" : [],
        "en-dsh_err" : [],
        "en-and_err" : [],
        "en-slh_err" : [],
        "en-nan_err" : []
    }
    text = text + " ";
    let text_temp = text;
    let answer = "";
    let indexs = [];
    let reExp = [
        // [,.:;!?]后接的并不是空格、引号或数字0-9中的一个
        // /[,.:;!?](?!([ |"|\[0-9\]]))/g,
        // [,.:;!?]前存在空格 /(?<= )[,.:;!?]/g,
        /(?<=( |"))[,.:;!?]|[:;!?](?!( |"|\n))|[.](?!( |"|\n|[0-9]+))|,(?!( |"|[0-9]{3}))/g,
        // 所有双引号（对错在其他地方进行判断）
        /"/g,
        // 左括号前或右括号后不是空格或引号 左括号后或右括号前存在空格
        /(?!")\(|\)(?!")|\((?= )|(?= )\)/g,
        // 连字符或破折号前后存在空格
        /(?<= )(-|—)|(-|—)(?= )/g,
        // &号前后不是空格
        /(?<! )&|&(?! )/g,
        // 所有slash
        /\//g,
        // 存在语境中不存在的标点
        /[，。：；！？￥……（）、“”]/g,
    ]
    for(let i=0; i<reExp.length; i++) {
        let res = null;
        while(res = reExp[i].exec(text)) {
            // errorClass.push(res["index"]);
            switch(i) {
                case 0 : errorClass["en-spa_err"].push(res["index"]); break;
                case 1 : errorClass["en-quo_err"].push(res["index"]); break;
                case 2 : errorClass["en-brk_err"].push(res["index"]); break;
                case 3 : errorClass["en-dsh_err"].push(res["index"]); break;
                case 4 : errorClass["en-and_err"].push(res["index"]); break;
                case 5 : errorClass["en-slh_err"].push(res["index"]); break;
                case 6 : errorClass["en-nan_err"].push(res["index"]); break;
            }
            indexs.push(res["index"]);
        }        
    }
    indexs.sort(function(a, b) {return a > b ? 1 : -1});
    let quo_left = 1; // left quo(1) or right quo(-1)
    for(idx of indexs) {
        if(errorClass["en-spa_err"].includes(idx)) {
            errorClass["en-spa_err"].splice(0,1);
            // let solid = text.match(/^([a-z]|[A-Z]| (?![,.:;!?])|\n|[,.:;!?] )+/g);
            // let amount = !solid ? 0 : solid[0].length;
            let raw= /(?<=( |"))[,.:;!?]|[:;!?](?!( |"|\n))|[.](?!( |"|\n|[0-9]+))|,(?!( |"|[0-9]{3}))/.exec(text);
            let punc = raw[0];
            let amount = raw["index"];
            let newRegExp = null;
            switch(punc) {
                case(".") : newRegExp = new RegExp('[.](?!( |"|\n|[0-9]+))'); break;
                case(",") : newRegExp = new RegExp(',(?!( |"|[0-9]{3}))'); break;
                default : newRegExp = new RegExp('(?<=( |"))[p1]|[p2](?!( |"|\n))'.replace('p1', punc).replace('p2', punc));
            }
            text = text.replace(newRegExp, `<span class="alerts_corrections" onclick="show_corrections('en-spa_err');">${punc}</span>`);
            answer += text.slice(0, amount + 83); // slice 不包括下标end
            text = text.slice(amount + 83);
            continue;
        } else if(errorClass["en-quo_err"].includes(idx)) {
            errorClass["en-quo_err"].splice(0,1);
            let amount = /"/.exec(text)["index"];
            text = text.replace(/"/, `<span class="alerts_inspections" onclick="show_corrections('en-quo_err');">"</span>`);
            answer += text.slice(0, amount + 83); // slice 不包括下标end
            text = text.slice(amount + 83);
            continue;
        } else if(errorClass["en-brk_err"].includes(idx)) {
            errorClass["en-brk_err"].splice(0,1);
            let correct_re = function() {
                let amount = /\(|\)/.exec(text)["index"];
                answer += text.slice(0, amount + 1);
                text = text.slice(amount + 1);
            }
            let incorrect_re = function() {
                let raw = /\(|\)/.exec(text);
                let punc = raw[0];
                let amount = raw["index"];
                newRegExp = new RegExp('\\p'.replace('p', punc));
                text = text.replace(newRegExp, `<span class="alerts_corrections" onclick="show_corrections('en-brk_err');">${punc}</span>`);
                answer += text.slice(0, amount + 83);
                text = text.slice(amount + 83);
            }
            let cur = text_temp.slice(idx, idx+1);
            let puncs = [" ", "\"", ".", ",", ":", ";", "!", "?"];
            if(idx == 0) {
                if(cur == "(") {
                    if(text_temp.slice(idx+1, idx+2) != " ") {
                        correct_re();
                        continue;
                    } else { incorrect_re(); continue;}
                } else {
                    if(text_temp.slice(idx-1, idx) != " " && puncs.includes(text_temp.slice(idx+1, idx+2))) {
                        correct_re();
                        continue;
                    } else { incorrect_re(); continue;}
                }
            } else if(cur == "(") {
                if(puncs.includes(text_temp.slice(idx-1, idx)) && text_temp.slice(idx+1, idx+2) != " ") {
                    correct_re();
                    continue;
                } else { incorrect_re(); continue;}
            } else {
                if(text_temp.slice(idx-1, idx) != " " && puncs.includes(text_temp.slice(idx+1, idx+2))) {
                    correct_re();
                    continue;
                } else { incorrect_re(); continue;}
            }
            continue;
        } else if(errorClass["en-dsh_err"].includes(idx)) {
            errorClass["en-dsh_err"].splice(0,1);
            let raw = /(?<= )(-|—)|(-|—)(?= )/.exec(text);
            let punc = raw[0];
            let amount = raw["index"];
            newRegExp = new RegExp('(?<= )p|p(?= )'.replace(/p/g, punc));
            text = text.replace(/(?<= )(-|—)|(-|—)(?= )/, `<span class="alerts_corrections" onclick="show_corrections('en-dsh_err');">${punc}</span>`);
            answer += text.slice(0, amount + 83); // slice 不包括下标end
            text = text.slice(amount + 83);
            continue;
        } else if(errorClass["en-and_err"].includes(idx)) {
            errorClass["en-and_err"].splice(0,1);
            let amount = /(?<! )&|&(?! )/.exec(text)["index"];
            text = text.replace(/(?<! )&|&(?! )/, `<span class="alerts_corrections" onclick="show_corrections('en-and_err');">&</span>`);
            answer += text.slice(0, amount + 83); // slice 不包括下标end
            text = text.slice(amount + 83);
            continue;
        } else if(errorClass["en-slh_err"].includes(idx)) {
            errorClass["en-slh_err"].splice(0,1);
            let amount = /\//.exec(text)["index"];
            text = text.replace(/\//, `<span class="alerts_inspections" onclick="show_corrections('en-slh_err');">/</span>`);
            answer += text.slice(0, amount + 83); // slice 不包括下标end
            text = text.slice(amount + 83);
        } else {
            errorClass["en-nan_err"].splice(0,1);
            let raw = /[，。：；！？￥……（）、“”]/.exec(text)
            let amount = raw["index"];
            let punc = raw[0];
            newRegExp = new RegExp('p'.replace('p', punc));
            text = text.replace(newRegExp, `<span class="alerts_corrections" onclick="show_corrections('en-nan_err');">${punc}</span>`);
            answer += text.slice(0, amount + 83); // slice 不包括下标end
            text = text.slice(amount + 83);
        }
    }
    answer += text ? text : "";
    answer = answer.replace(/\n/g,"<br>");
    let div = document.createElement('div');
    div.innerHTML = answer;
    let advice_inner = document.getElementById("result");
    advice_inner.innerText = "";
    advice_inner.appendChild(div);
};
let advice_dict = {
    "en-spa_err" : `问题：缺失半角空格/重复使用标点
                    [.,:;!?]的使用标准:
                    1->标点前不能存在空格 标点后需要有一个半角空格
                    2->不能连用标点
                    3->但是上述标点前可以跟在[")]中的任意一个标点后面
                    请根据使用标准检查错误并更正
                    `,
    "en-quo_err" : `提示：引号使用提示
                    [""]暂时无法自动检查 请手动检查是否存在以下使用不正确：
                    [""]的使用标准:
                    1->左引号前和右引号后需要有一个半角空格
                    2->左引号后和右引号前不能有空格
                    请根据使用标准检查错误并更正
                    `,
    "en-brk_err" : `问题：括号空格错误
                    [()]的使用标准:
                    1->左括号前需要有一个半角空格
                    2->右括号后需要一个半角空格或[,.:;!?"]中的一个标点
                    3->左括号后和右括号前不能有空格
                    请根据使用标准检查错误并更正
                    `,
    "en-dsh_err" : `问题：连字符/破折号错误
                    [- —]的使用标准:
                    1->连字符和破折号前后都不能有空格
                    请根据使用标准检查错误并更正
                    `,
    "en-and_err" : `问题：&号错误
                    [&]的使用标准:
                    1->&符合前后都需要有一个半角空格
                    请根据使用标准检查错误并更正
                    `,
    "en-slh_err" : `提示：[/]使用提示
                    [/]的用法过于复杂 请手动检查是否存在以下使用不正确：
                    [/]的使用标准：
                    1->表示单词间的或：前后都不能有空格
                       e.g. his/her he/she and/or
                    2->表示多词术语/复合词的或：前后都要有一个半角空格
                       e.g. World War I / First World War
                    3->表示缩写：前后都不能有空格
                       e.g. w/o = without 
                            w/ = with
                    4->表示时间：前后都不能有空格：
                       e.g. 11/17/16
                    5->表示诗词断句：前不能有空格 后有一个半角空格
                       e.g. Mary had a little lamb/ little lamb, little lamb/ 
                    `,
    "en-nan_err" : `问题：存在全角标点
                    请将全角标点换为半角
                    `,
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
                    case "en" : funcReEnglish(tx); break;
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
        report() {
            this.$alert(`若反馈意见得到采纳<br>
                         则文档导出功能上线后 获得抢先使用资格！<br>
                         <a href="https://www.zhihu.com/people/qaucodingdog" target="_blank">知乎反馈</a><br>
                         <a href="mailto:codingdogzxg@gmail.com" target="_blank">邮箱反馈</a><br>
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
        this.change_color();
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