/*
* 爬取长江海事局：长江流域天气信息，长江航道信息
* */
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const https = require("https");
const schedule = require('node-schedule');//定时器
let detailUrl = "";
let channelDetailUrl = "";

let optionsList = {
    url: 'https://www.cj.msa.gov.cn/xxgk/xxgkml/aqxx/qxyg/',
    method: 'GET',
    charset: "utf-8",
    agent: new https.Agent({
        rejectUnauthorized: false
    }),
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36",
        "cookie": 'q_c1=0c84fab3dc9242bc9a91c26000058226|1578991237000|1577157440; _zap=1e7708f9-0034-4114-9528-d030c0186e32; d_c0="AEAhQNaNjRCPTg1nzdNz-JdYXkr4-W5IMgI=|1577157438"; _ga=GA1.2.1660455762.1582712386; tst=r; __utma=155987696.1660455762.1582712386.1590485565.1590485565.1; __utmz=155987696.1590485565.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); z_c0=Mi4xYVlBUEJnQUFBQUFBUUNGQTFvMk5FQmNBQUFCaEFsVk5lalFfWUFDSG9BM09ybnZldHhUSW9SaGFxVEI2QXZicjdn|1599202938|e9bec2b45a68487b6bf92dc481af9a804840733a; q_c1=0de591395e7e43ad973b8a9d7e45dc0c|1604989006000|1583132017000; _xsrf=50eb2959-8dfd-4c67-8975-70f050dd041a; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1605593659,1605594019,1605599880,1605667670; Hm_lpvt_98beee57fd2ef70ccdd5ca52b9740c49=1605667670; KLBRSID=9d75f80756f65c61b0a50d80b4ca9b13|1605667842|1605667647'
    }
};

let options = {
    url: 'https://www.cj.msa.gov.cn/xxgk/xxgkml/aqxx/qxyg/'+channelDetailUrl,
    method: 'GET',
    charset: "utf-8",
    agent: new https.Agent({
        rejectUnauthorized: false
    }),
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36",
        "cookie": 'q_c1=0c84fab3dc9242bc9a91c26000058226|1578991237000|1577157440; _zap=1e7708f9-0034-4114-9528-d030c0186e32; d_c0="AEAhQNaNjRCPTg1nzdNz-JdYXkr4-W5IMgI=|1577157438"; _ga=GA1.2.1660455762.1582712386; tst=r; __utma=155987696.1660455762.1582712386.1590485565.1590485565.1; __utmz=155987696.1590485565.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); z_c0=Mi4xYVlBUEJnQUFBQUFBUUNGQTFvMk5FQmNBQUFCaEFsVk5lalFfWUFDSG9BM09ybnZldHhUSW9SaGFxVEI2QXZicjdn|1599202938|e9bec2b45a68487b6bf92dc481af9a804840733a; q_c1=0de591395e7e43ad973b8a9d7e45dc0c|1604989006000|1583132017000; _xsrf=50eb2959-8dfd-4c67-8975-70f050dd041a; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1605593659,1605594019,1605599880,1605667670; Hm_lpvt_98beee57fd2ef70ccdd5ca52b9740c49=1605667670; KLBRSID=9d75f80756f65c61b0a50d80b4ca9b13|1605667842|1605667647'
    }
};
let channelUrlList = {
    url: 'https://www.cj.msa.gov.cn/xxgk/xxgkml/aqxx/hdxx/',
    method: 'GET',
    charset: "utf-8",
    agent: new https.Agent({
        rejectUnauthorized: false
    }),
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36",
        "cookie": 'q_c1=0c84fab3dc9242bc9a91c26000058226|1578991237000|1577157440; _zap=1e7708f9-0034-4114-9528-d030c0186e32; d_c0="AEAhQNaNjRCPTg1nzdNz-JdYXkr4-W5IMgI=|1577157438"; _ga=GA1.2.1660455762.1582712386; tst=r; __utma=155987696.1660455762.1582712386.1590485565.1590485565.1; __utmz=155987696.1590485565.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); z_c0=Mi4xYVlBUEJnQUFBQUFBUUNGQTFvMk5FQmNBQUFCaEFsVk5lalFfWUFDSG9BM09ybnZldHhUSW9SaGFxVEI2QXZicjdn|1599202938|e9bec2b45a68487b6bf92dc481af9a804840733a; q_c1=0de591395e7e43ad973b8a9d7e45dc0c|1604989006000|1583132017000; _xsrf=50eb2959-8dfd-4c67-8975-70f050dd041a; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1605593659,1605594019,1605599880,1605667670; Hm_lpvt_98beee57fd2ef70ccdd5ca52b9740c49=1605667670; KLBRSID=9d75f80756f65c61b0a50d80b4ca9b13|1605667842|1605667647'
    }
};

let channelUrl = {
    url: 'https://www.cj.msa.gov.cn/xxgk/xxgkml/aqxx/qxyg/'+detailUrl,
    method: 'GET',
    charset: "utf-8",
    agent: new https.Agent({
        rejectUnauthorized: false
    }),
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36",
        "cookie": 'q_c1=0c84fab3dc9242bc9a91c26000058226|1578991237000|1577157440; _zap=1e7708f9-0034-4114-9528-d030c0186e32; d_c0="AEAhQNaNjRCPTg1nzdNz-JdYXkr4-W5IMgI=|1577157438"; _ga=GA1.2.1660455762.1582712386; tst=r; __utma=155987696.1660455762.1582712386.1590485565.1590485565.1; __utmz=155987696.1590485565.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); z_c0=Mi4xYVlBUEJnQUFBQUFBUUNGQTFvMk5FQmNBQUFCaEFsVk5lalFfWUFDSG9BM09ybnZldHhUSW9SaGFxVEI2QXZicjdn|1599202938|e9bec2b45a68487b6bf92dc481af9a804840733a; q_c1=0de591395e7e43ad973b8a9d7e45dc0c|1604989006000|1583132017000; _xsrf=50eb2959-8dfd-4c67-8975-70f050dd041a; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1605593659,1605594019,1605599880,1605667670; Hm_lpvt_98beee57fd2ef70ccdd5ca52b9740c49=1605667670; KLBRSID=9d75f80756f65c61b0a50d80b4ca9b13|1605667842|1605667647'
    }
};
const crawler=()=>{
    let fileName = 'data_'+Date.now()+'.json';
    let strArr = "";
    let fileContent = "";
    request(optionsList,function(err,result){
        if(err){
            console.log(err);
        }
        let $ = cheerio.load(result.body);
        let strs = $('.lie ul li').eq(0).find('a').attr("href");
        detailUrl = strs.substr(2,strs.length-1);
        options.url = 'https://www.cj.msa.gov.cn/xxgk/xxgkml/aqxx/qxyg/'+detailUrl;

        request(options,function(err,result){
            if(err){
                console.log(err);
            }
            let $ = cheerio.load(result.body);
            let obj = $('.TRS_Editor table tr');
            for(let i=1;i<obj.length;i++){
                console.log(obj.eq(i).find('td').eq(0).find('p').text());
                let comma = ",";
                if(i == obj.length-1){
                    comma = "";
                }
                strArr += '{' +
                    '\n"address":"'+obj.eq(i).find('td').eq(0).find('p').text()+'",' +
                    '\n"tqqk":"'+obj.eq(i).find('td').eq(1).find('p').text()+'",' +
                    '\n"minT":"'+obj.eq(i).find('td').eq(2).find('p').text()+'",' +
                    '\n"maxT":"'+obj.eq(i).find('td').eq(3).find('p').text()+'",' +
                    '\n"windDirection":"'+obj.eq(i).find('td').eq(4).find('p').text()+'",' +
                    '\n"seeing":"'+obj.eq(i).find('td').eq(5).find('p').text()+'",' +
                    '\n"fog":"'+obj.eq(i).find('td').eq(6).find('p').text()+'",' +
                    '\n"haze":"'+obj.eq(i).find('td').eq(7).find('p').text()+'"' +
                    '}'+comma;
            }

            fileContent = "["+strArr+"]";
            fs.open(fileName, 'w+', (err, fd) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(fileContent);
                    fs.writeFile(fileName, fileContent, () => {

                    })
                }
            })
        })

    });
};

const channel=()=>{
    let fileName = 'channel_'+Date.now()+'.json';
    let strArr = "";
    let fileContent = "";
    request(channelUrlList,function(err,result){
        if(err){
            console.log(err);
        }
        let $ = cheerio.load(result.body);
        let strs = $('.lie ul li').eq(0).find('a').attr("href");
        channelDetailUrl = strs.substr(2,strs.length-1);
        channelUrl.url = 'https://www.cj.msa.gov.cn/xxgk/xxgkml/aqxx/hdxx/'+channelDetailUrl;

        request(channelUrl,function(err,result){
            if(err){
                console.log(err);
            }
            let $ = cheerio.load(result.body);
            let obj = $('.TRS_Editor');
            strArr = obj.text();
            let str = "。"+strArr;
            str = str.replace(/\s+/g,"");
            str = str.split("。据");
            let aastr = "";
            for(let i=1;i<str.length;i++){
                let comma = ",";
                if(i == str.length-1){
                    comma = "";
                }
                aastr += '{' +
                    '\n"channelMessage":"'+ str[i] +'"}'+comma
            }
            fileContent = "["+aastr+"]";
            fs.open(fileName, 'w+', (err, fd) => {
                if (err) {
                    console.error(err);
                } else {
                    fs.writeFile(fileName, fileContent, () => {

                    })
                }
            })
        })

    });
};

//每日11点10分，17点10分，爬取一次数据
const  scheduleCronstyle = ()=>{
    schedule.scheduleJob('* 10 11 * * *',()=>{
        crawler();
        channel();
    });
    schedule.scheduleJob('* 10 17 * * *',()=>{
        crawler();
        channel();
    });
}
scheduleCronstyle();
