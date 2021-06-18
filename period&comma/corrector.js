const { defineComponent, ref, h } = Vue

var Main = defineComponent({
    methods: {
        open1() {
            a = this.textarea;
            if(this.select_value == "选择语境") {
                this.$notify({
                    title: '提示',
                    message: h('i', {style: 'color: #409EFF'}, '空语境？句读之不知？')
                    });
            } else if(!a) {
                this.$notify({
                    title: '提示',
                    message: h('i', {style: 'color: #409EFF'}, '空句读？惑之不解？')
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
        prompt_unfinish_text(lang) {
            this.$notify({
                title: '提示',
                message: h('i', {style: 'color: #409EFF'}, lang + '语境功能尚未完成，客官敬请期待！')
                });
        },
        select_change(value) {
            console.log(value);
        },
        funcReEnglish(text) {
            let reg = /[,.:;!?](?! ])/g;
            let text_temp = text;
            while(res = reg.exec(text_temp)) {
                let punc = res[0];
                let str = '[p](?! )';
                let reg_new = str.replace('p', punc);
                console.log(reg_new);
                reg_new1 = new RegExp(reg_new);
                console.log(reg_new1);
                text = text.replace(reg_new1, `<span class="alerts_corrections ">${punc}</span>`);
                console.log(text);
            }
            var div = document.createElement('div');
            div.innerHTML = text;
            let advice_inner = document.getElementById("result");
            advice_inner.innerText = "";
            advice_inner.appendChild(div);
        },
    },
    setup() {
        return {
            select_value: ref("选择语境"),
            input1: ref(''),
            textarea: ref(''),
        }
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