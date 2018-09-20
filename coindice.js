/**
 *  ITE Robot 
 */
var EOS = require('eosjs');
var moment = require('moment');

var eosClient = EOS({
    broadcast: true,
    sign: true,
    chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
    keyProvider: ["replace you private key here"],// 这里换成你的私钥， replace your private key here
    httpEndpoint: "http://api.eosnewyork.io"
});

var from = "itedeveloper"; // 这里换成你的账号， replace your eos account here

var to = "itehappydice";

var arg = [from, to, '1.0000 ITECOIN', "bet small"];

function fetchTaksInfo() {
    eosClient.getTableRows({
        json: "true",
        code: to,
        scope: from,
        table: "task"
    }).then(data => {
        if (data && data.rows && data.rows.length > 0) {
            var tasks = data.rows;
            var refresh_time = tasks[1];
            var now = moment().format("X");
            if (refresh_time < now) {
                sendTransfer(arg);
            } else {
                console.log("done.");
            }
        }
    }).catch(e => {
        console.log(e);
    });
}

function sendTransfer(arg) {
    eosClient.contract("itecointoken").then(contract => {
        contract.transfer(...arg).then(tx => {
            console.log(`success..`, tx.transaction_id);
            fetchTaksInfo();
        }).catch(e => {
            console.log(e);
        });
    }).catch(e => {
        console.log(e);
    });
}

fetchTaksInfo();