function funcReEnglish(text) {
    // [,.:;!?]后接的并不是空格、引号或数字0-9中的一个
    let reg = /[,.:;!?](?!([ |"|\[0-9\]]))/g;
    let answer = "";
    text = text + " ";
    // console.log(text);
    let text_temp = text;
    while(res = reg.exec(text_temp)) {
        // let count = 0;
        let solid = text.match(/^([a-z]| |\n|[,.:;!?] )+/g);
        let idx = !solid ? 0 : solid[0].length;
        // if(solid) console.log("solid" + solid[0].length);
        let punc = res[0];
        let str = '[p](?! )';
        let reg_new = str.replace('p', punc);
        // console.log(reg_new);
        reg_new1 = new RegExp(reg_new);
        text = text.replace(reg_new1, `<span class="alerts_corrections" onclick="show_corrections('en-spc_err');">${punc}</span>`);
        // count ++;
        answer += text.slice(0, idx + 83); // slice 不包括下标end
        text = text.slice(idx + 82 + 1); // slice 包括下标start
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
};