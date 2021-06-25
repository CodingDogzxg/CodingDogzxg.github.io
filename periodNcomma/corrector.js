let advice_dict = {
    "en-spa_err" : `问题：缺失半角空格/重复使用标点
                    [.,:;!?]的使用标准:
                    1->标点前不能存在空格 标点后需要有一个半角空格
                    2->不能连用标点
                    3->但是上述标点前可以跟在[")]中的任意一个标点后面
                    暂时无法检测[.]表示缩写的情况 请自行检查
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
                    1->&符号前后都需要有一个半角空格
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
                    message: h('i', {style: `color: ${this.theme_color}`}, '空语境？句读之不知？\n请在左侧选择语境')
                    });
            } else if(!a) {
                this.$notify({
                    title: '提示',
                    message: h('i', {style: `color: ${this.theme_color}`}, '空句读？惑之不解？\n请在下方输入内容')
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
        this.$alert(`因为iPhone环境中所有浏览器不支持正向后行零宽断言<br>
                     所以本网站暂时不支持任何iPhone设备上的任何浏览器<br>
                     MacOS中需使用<a href="https://www.microsoft.com/zh-cn/edge" target="_blank">Edge</a>/<a href="https://www.google.cn/chrome/" target="_blank">Chrome浏览器</a><br>
                     <p style="color:red">iPhone用户请复制网址使用电脑访问本网站！</p>
                     <p style="color:red">或者也可以用Android！</p><br>
                     BTW: Safari sucks! 错怪Firefox了 火狐没Safari那么垃圾
                         `, '提示', {
              confirmButtonText: '哇嘎哒',
              dangerouslyUseHTMLString: true,
            }).catch(e=>e);
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
