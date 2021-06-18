const { defineComponent, ref, h } = Vue

var Main = defineComponent({
    methods: {
        open1() {
            this.$notify({
            title: '提示',
            message: h('i', { style: 'color: #409EFF'}, '功能正在制作，客官敬请期待！')
            });
        },
    },
    setup() {
        return {
            input1: ref(''),
            textarea: ref('')
        }
    },
    data() {
        return {
            options: [{
                value: '选项1',
                label: 'English',
            }, {
                value: '选项2',
                label: 'Français',
            }, {
                value: '选项3',
                label: '中文',
            }, {
                value: '选项4',
                label: '日本語',
            }, {
                value: '选项5',
                label: '混合',
            }],
            value: 'English'
        }
    }
});
const app = Vue.createApp(Main);
app.use(ElementPlus);
app.mount("#app")