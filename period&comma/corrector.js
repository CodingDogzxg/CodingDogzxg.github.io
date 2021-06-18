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
            reg = /[,.:;!?]/g.exec(text);
            console.log(reg);
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