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