"use strict";

var player = {};

var lastUpdate = Date.now();

function reset() {
    player = {
        money: new Decimal(10),
        gain: new Decimal(10),

        upgrades: [0, 0, 0, 0, 0, 0, 0, 0], 

        infinities: new Decimal(0),
        infinityPoints: new Decimal(0),
        infinityUpgrades: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],

        break: false,
        breakUpgrades: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 0],

        infinityPower: new Decimal(0),
        infinityGeneratorsBought: [0, 0, 0, 0, 0, 0, 0, 0],
        infinityGeneratorsAmount: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
        infinityGeneratorsUpgrades: [0, 0, 0],

        receptors: new Decimal(0),
        maxReceptors: new Decimal(0),
        irisUpgrades: [],
        challengesCompletitions: [0, 0, 0, 0, 0, 0],
        currentChallenge: 0,

        selectedTab: "mainTab",
        showMilestones: true,
        hasSeenEndScreen: false
    }
}

reset()

function save() {
	localStorage.setItem("IncrementalTestSave", JSON.stringify(player));
}

function hardReset() {
    if (confirm("Are you sure you want to reset? You will lose everything!")) {
        reset();
        save();
        location.reload();
    }
}

setInterval(save, 10000)

function load() {
	reset();
	let loadgame = JSON.parse(localStorage.getItem("IncrementalTestSave"));
	if (loadgame !== null) {
        player = loadgame;
	}
}

load();

function exportGame() {
    save();
    navigator.clipboard.writeText(btoa(JSON.stringify(player))).then(function() {
        alert("Copied to clipboard.");
    }, function() {
        alert("Error: could not copy to clipboard, try again.");
    });
}
  
function importGame() {
    let loadgame = JSON.parse(atob(prompt("Input your save:")));
    if (loadgame && loadgame !== null && loadgame !== "") {
        reset();
        player = loadgame;
        save();
    }
    else {
        alert("Error: the string is not a valid save.");
    }
}

var upgrades = {
    cost: [new Decimal(10), new Decimal(150), new Decimal(1e3), new Decimal(1e6), new Decimal(1e18), new Decimal(1e38), new Decimal(1e80), new Decimal(1e180)],
    effect: [new Decimal(0), new Decimal(1), new Decimal(1), 1, [0, 0, 0], 1, [0, 0], 0],
    buy(upg) {
        if (Decimal.gte(player.money, this.cost[upg])) {
            player.upgrades[upg]++;
            player.money = Decimal.sub(player.money, this.cost[upg]);
            upgrades.updateCosts();
        }
    },
    updateCosts() {
        upgrades.cost[0] = Decimal.mul(Decimal.mul(Decimal.pow(1.15, player.upgrades[0]), 10), Decimal.pow(BIscaling[0], Decimal.pow(Decimal.max(player.upgrades[0] - upgLvlAtInf[0], 0), BIscaling[1])));
        upgrades.cost[1] = Decimal.mul(Decimal.mul(Decimal.pow(1.25 + player.upgrades[1] / 10, player.upgrades[1]), 150), Decimal.pow(BIscaling[0], Decimal.pow(Decimal.max(player.upgrades[1] - upgLvlAtInf[1], 0), BIscaling[1])));
        upgrades.cost[2] = Decimal.mul(Decimal.mul(Decimal.pow(2 + player.upgrades[2] / 20, Decimal.pow(player.upgrades[2], 1.05)), 1000), Decimal.pow(BIscaling[0], Decimal.pow(Decimal.max(player.upgrades[2] - upgLvlAtInf[2], 0), BIscaling[1])));
        upgrades.cost[3] = Decimal.mul(Decimal.mul(Decimal.pow(player.upgrades[3] + 1, player.upgrades[3] * (1 + Math.log2(player.upgrades[3] + 1) / 5) + 1), 1e6), Decimal.pow(BIscaling[0], Decimal.pow(Decimal.max(player.upgrades[3] - upgLvlAtInf[3], 0), BIscaling[1])));
        upgrades.cost[4] = Decimal.mul(Decimal.mul(Decimal.pow(10, player.upgrades[4]), 1e18), Decimal.pow(BIscaling[0], Decimal.pow(Decimal.max(player.upgrades[4] - upgLvlAtInf[4], 0), BIscaling[1])));
        upgrades.cost[5] = Decimal.mul(Decimal.mul(Decimal.pow(Decimal.add(5, Decimal.pow(player.upgrades[5], 1.5)), Decimal.pow(player.upgrades[5] * 2, 1.25)), 1e38), Decimal.pow(BIscaling[0], Decimal.pow(Decimal.max(player.upgrades[5] - upgLvlAtInf[5], 0), BIscaling[1])));
        upgrades.cost[6] = Decimal.mul(Decimal.mul(Decimal.pow(10, Decimal.pow(player.upgrades[6], 3)), 1e80), Decimal.pow(BIscaling[0], Decimal.pow(Decimal.max(player.upgrades[6] - upgLvlAtInf[6], 0), BIscaling[1])));
        if (player.break) {
            if (player.breakUpgrades[11]) {
                upgrades.cost[7] = Decimal.mul(Decimal.mul(Decimal.pow(7.5, Decimal.add(Decimal.pow(1.985, player.upgrades[7], 1.985)) - 4), 1e180), Decimal.pow(BIscaling[0], Decimal.pow(Decimal.max(player.upgrades[7] - upgLvlAtInf[7], 0), BIscaling[1])));
            }
            else {
                upgrades.cost[7] = Decimal.mul(Decimal.mul(Decimal.pow(10, Decimal.add(Decimal.pow(2, player.upgrades[7], 2)) - 4), 1e180), Decimal.pow(BIscaling[0], Decimal.pow(Decimal.max(player.upgrades[7] - upgLvlAtInf[7], 0), BIscaling[1])));
            }
        }
        else {
            if (player.upgrades[7] === 15) {
                upgrades.cost[7] = Infinity;
            }
            else if (player.upgrades[7] <= 4) {
                upgrades.cost[7] = Math.min(Math.pow(10, Math.pow(2, player.upgrades[7] + 2) - 4) * 1e180, 1e223);
            }
            else {
                upgrades.cost[7] = Decimal.mul(player.gain, (player.upgrades[7] - 4) ** 0.9 * 5)
            }
        }
        if (player.infinityUpgrades[12]) {
            upgrades.cost[7] = Decimal.div(upgrades.cost[7], 100);
        }
        if (player.breakUpgrades[3]) {
            upgrades.cost[7] = Decimal.div(upgrades.cost[7], "1e100000")
        }
    }
}

var infinity = {
    reset() {
        if (Decimal.gte(player.money, 1e308)) {
            if (player.irisUpgrades.includes(55)) {
                player.infinities = Decimal.add(player.maxReceptors, 1).pow(0.5).round().add(player.infinities);
            }
            else {
                player.infinities = Decimal.add(player.infinities, 1);
            }

            let pendingIP = Decimal.pow(player.money, 0.0009765625).sub(0.9988548118735103).mul(IPmulti).floor();
            if (player.irisUpgrades.includes(12)) {
                pendingIP = Decimal.mul(pendingIP, Decimal.mul(player.maxReceptors, player.irisUpgrades.length).pow(2));
            }
            if (player.irisUpgrades.includes(35)) {
                pendingIP = Decimal.mul(pendingIP, 1e50);
            }
            if (player.irisUpgrades.includes(54)) {
                pendingIP = Decimal.mul(pendingIP, 1e100);
            }

            if (player.irisUpgrades.includes(42)) {
                pendingIP = Decimal.pow(pendingIP, 0.75);
            }

            if (player.irisUpgrades.includes(14)) {
                pendingIP = Decimal.pow(pendingIP, 1.05);
            }
            if (player.irisUpgrades.includes(35)) {
                pendingIP = Decimal.pow(pendingIP, 1.05);
            }
            player.infinityPoints = Decimal.add(player.infinityPoints, pendingIP);

            if (player.break) {
                player.money = new Decimal(1e308);
                player.upgrades = [5058, 223, 213, 73, 291, 25, 7, 15];
            }
            else {
                player.money = 0;
                for (let i = 0; i < 8; i++) {
                    player.upgrades[i] = 0;
                }
            }
        }
    },
    upgrades: {
        cost: [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 5, 5, 5, 10],
        buy(upg) {
            if (Decimal.gte(player.infinityPoints, this.cost[upg]) && !player.infinityUpgrades[upg] && ((upg > 0)? player.infinityUpgrades[upg - 1] : true)) {
                player.infinityPoints = Decimal.sub(player.infinityPoints, this.cost[upg]);
                player.infinityUpgrades[upg] = true;
            }
            infinity.markBoughtUPG();
        }
    },
    break() {
        if (player.infinityUpgrades[15] && Decimal.gte(player.infinities, 100) && !player.break) {
            player.break = true;
            player.upgrades = [5058, 223, 213, 73, 291, 25, 7, 15];
            player.upgrades[7] = 4;
            this.markBoughtUPG();
        }
    },
    breakCost: [1e3, 5e4, 5e7, 2e9, 5e20, 5e24, 1e31, 1e43, 1e55, 5e63, 1e77, 3e91, 1e290, "1e570", "1e745", "1e810", 100],
    breakBuy(upg) {
        if (upg === 16 && player.hasSeenEndScreen) {
            let cost = Decimal.pow(100, player.breakUpgrades[16]);
            while (Decimal.lte(cost, player.infinityPoints)) {
                player.breakUpgrades[16]++;
                player.infinityPoints = Decimal.sub(player.infinityPoints, cost);
                cost = Decimal.pow(100, player.breakUpgrades[16]);
            }
        }
        else if (Decimal.gte(player.infinityPoints, this.breakCost[upg]) && player.break && ((upg !== 16) ? !player.breakUpgrades[upg] : true)) {
            if (upg === 16) {
                player.breakUpgrades[16]++;
            }
            else {
                player.breakUpgrades[upg] = true;
            }
            player.infinityPoints = Decimal.sub(player.infinityPoints, infinity.breakCost[upg]);

            if (upg === 3 && Decimal.eq(player.maxReceptors, 0)) {
                alert("grind to 4700 infinities.");
            }
        }
        this.markBoughtUPG();
    },
    markBoughtUPG() {
        for (let i = 0; i < 16; i++) {
            if (player.infinityUpgrades[i]) {
                document.getElementById("IU" + i).style.color = "grey";
            }
            else {
                document.getElementById("IU" + i).style.color = "black";
            }
            if (player.breakUpgrades[i]) {
                document.getElementById("BU" + i).style.color = "grey";
            }
            else {
                document.getElementById("BU" + i).style.color = "black";
            }
        }
        if (player.break) {
            document.getElementById("breakButton").style.color = "grey";
        }
        else {
            document.getElementById("breakButton").style.color = "black";
        }
    },
}

var infinityGenerators = {
    effect: 1,
    genCost: [new Decimal(3e137), new Decimal(1e150), new Decimal(3e162), new Decimal(1e175), new Decimal(4e187), new Decimal(1e200), new Decimal(4e212), new Decimal(1e225)],
    upgCost: [new Decimal(1e9), new Decimal(1e60), NaN],
    multiplier: [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
    buyGen(gen) {
        if (Decimal.gte(player.infinityPoints, this.genCost[gen])) {
            player.infinityGeneratorsBought[gen]++;
            player.infinityGeneratorsAmount[gen] = Decimal.add(player.infinityGeneratorsAmount[gen], 1);
            player.infinityPoints = player.infinityPoints.sub(this.genCost[gen]);

            this.updateCosts();
        }
    },
    buyUpg(upg) {
        if (Decimal.gte(player.infinityPower, this.upgCost[upg])) {
            player.infinityGeneratorsUpgrades[upg]++;
            player.infinityPower = Decimal.sub(player.infinityPower, this.upgCost[upg]);

            if (upg == 2 && player.upgrades[2] === 0 && Decimal.eq(player.maxReceptors, 0)) {
                alert("Grind to 10000 infinities.");
            }

            this.updateCosts();
        }
    },
    update() {
        for (let i = 7; i >= 0; i--) {
            this.multiplier[i] = Decimal.pow(2 + player.infinityGeneratorsUpgrades[1] * 0.1, player.infinityGeneratorsBought[i]).mul(Decimal.pow(Decimal.min(player.infinities, 1e4), player.infinityGeneratorsUpgrades[2]));
            if (player.breakUpgrades[12]) {
                this.multiplier[i] = this.multiplier[i].mul(Decimal.log10(player.money)).div(1e4);
            }
            if (player.breakUpgrades[13]) {
                this.multiplier[i] = this.multiplier[i].mul(Decimal.log10(player.infinityPoints)).div(10);
            }
            if (player.breakUpgrades[14]) {
                this.multiplier[i] = this.multiplier[i].mul(Decimal.log10(Decimal.max(player.infinityPower, 10)));
            }
            if (player.breakUpgrades[15]) {
                this.multiplier[i] = this.multiplier[i].mul(Decimal.log10(Decimal.max(player.infinityGeneratorsAmount[i], 10)));
            }
            player.infinityGeneratorsAmount[i] = Decimal.add(player.infinityGeneratorsAmount[i], Decimal.mul(player.infinityGeneratorsAmount[i + 1], this.multiplier[i + 1]).mul(deltaTime / 1000));
        }
        player.infinityPower = Decimal.add(player.infinityPower, player.infinityGeneratorsAmount[0].mul(this.multiplier[0]));
    },
    updateCosts() {
        if (player.infinityGeneratorsBought[0] >= 175) {
            this.genCost[0] = Decimal.mul(Decimal.pow(10, (player.infinityGeneratorsBought[0] - 175) ** 2 * 5), "3e1012");
        }
        else {
            this.genCost[0] = Decimal.mul(Decimal.pow(10, player.infinityGeneratorsBought[0] * 5), 3e137);
        }
        if (player.infinityGeneratorsBought[1] >= 86) {
            this.genCost[1] = Decimal.mul(Decimal.pow(10, (player.infinityGeneratorsBought[1] - 86) ** 2 * 10), "1e1010");
        }
        else {
            this.genCost[1] = Decimal.mul(Decimal.pow(10, player.infinityGeneratorsBought[1] * 10), 1e150);
        }
        if (player.infinityGeneratorsBought[2] >= 57) {
            this.genCost[2] = Decimal.mul(Decimal.pow(10, (player.infinityGeneratorsBought[2] - 57) ** 2 * 15), "3e1017");
        }
        else {
            this.genCost[2] = Decimal.mul(Decimal.pow(10, player.infinityGeneratorsBought[2] * 15), 3e162);
        }
        if (player.infinityGeneratorsBought[3] >= 42) {
            this.genCost[3] = Decimal.mul(Decimal.pow(10, (player.infinityGeneratorsBought[3] - 42) ** 2 * 20), "1e1015");
        }
        else {
            this.genCost[3] = Decimal.mul(Decimal.pow(10, player.infinityGeneratorsBought[3] * 20), 1e175);
        }
        if (player.infinityGeneratorsBought[4] >= 24) {
            this.genCost[4] = Decimal.mul(Decimal.pow(10, (player.infinityGeneratorsBought[4] - 24) ** 2 * 35), "4e1027");
        }
        else {
            this.genCost[4] = Decimal.mul(Decimal.pow(10, player.infinityGeneratorsBought[4] * 35), 4e187);
        }
        if (player.infinityGeneratorsBought[5] >= 21) {
            this.genCost[5] = Decimal.mul(Decimal.pow(10, (player.infinityGeneratorsBought[5] - 21) ** 2 * 40), "1e1040");
        }
        else {
            this.genCost[5] = Decimal.mul(Decimal.pow(10, player.infinityGeneratorsBought[5] * 40), 1e200);
        }
        if (player.infinityGeneratorsBought[6] >= 18) {
            this.genCost[6] = Decimal.mul(Decimal.pow(10, (player.infinityGeneratorsBought[6] - 18) ** 2 * 45), "4e1022");
        }
        else {
            this.genCost[6] = Decimal.mul(Decimal.pow(10, player.infinityGeneratorsBought[6] * 45), 4e212);
        }
        if (player.infinityGeneratorsBought[7] >= 16) {
            this.genCost[7] = Decimal.mul(Decimal.pow(10, (player.infinityGeneratorsBought[7] - 16) ** 2 * 50), "1e1025");
        }
        else {
            this.genCost[7] = Decimal.mul(Decimal.pow(10, player.infinityGeneratorsBought[7] * 50), 1e225);
        }

        if (player.infinityGeneratorsUpgrades[0] >= 32) {
            this.upgCost[0] = Decimal.mul(Decimal.pow(10, (player.infinityGeneratorsUpgrades[0] - 32) ** 2 + (player.infinityGeneratorsUpgrades[0] - 32) ** 3 * 0.5), "1e553");
        }
        else {
            this.upgCost[0] = Decimal.mul(Decimal.pow(10, player.infinityGeneratorsUpgrades[0] + player.infinityGeneratorsUpgrades[0] ** 2 * 0.5), 1e9);
        }
        if (player.infinityGeneratorsUpgrades[1] >= 25) {
            this.upgCost[1] = Decimal.mul(Decimal.pow(10, (player.infinityGeneratorsUpgrades[1] - 25) ** 2 + (player.infinityGeneratorsUpgrades[1] - 25) ** 3 * 0.75), "5.623e553");
        }
        else {
            this.upgCost[1] = Decimal.mul(Decimal.pow(10, player.infinityGeneratorsUpgrades[1] + player.infinityGeneratorsUpgrades[1] ** 2 * 0.75), 1e60);
        }
        if (player.infinityGeneratorsUpgrades[2] >= 5) {
            this.upgCost[2] = Decimal.mul(Decimal.pow(10, (player.infinityGeneratorsUpgrades[2] - 5) ** 2 * 30 + (player.infinityGeneratorsUpgrades[2] - 5) ** 3 * 5), "1e555");
        }
        else {
            this.upgCost[2] = Decimal.mul(Decimal.pow(10, player.infinityGeneratorsUpgrades[2] * 30 + player.infinityGeneratorsUpgrades[2] ** 2 * 5), 1e280);
        }
    },
    buyMax() {
        for (let i = 0; i < 8; i++) {
            while (Decimal.lte(this.genCost[i], player.infinityPoints)) {
                this.buyGen(i);
            }
            if (i < 3) {
                while (Decimal.lte(this.upgCost[i], player.infinityPower)) {
                    this.buyUpg(i);
                }
            }
        }
    }
}

var iris = {
    reset() {
        let pendingReceptors = new Decimal(0);

        if (Decimal.gte(player.money, "e7.2e5") && Decimal.gte(player.infinityPoints, "e1007") || Decimal.gte(player.infinityPoints, this.challenges.goals[player.currentChallenge - 1]) && player.currentChallenge !== 0) {
            if (player.currentChallenge === 0) {
                pendingReceptors = Decimal.log10(player.money).sub(7e5).div(1e4).mul(Decimal.mul(player.infinityPoints, 1e3).log10().sub(9.9e2).div(10)).pow(1.5).round().min(100).sub(player.maxReceptors).max(0);
                pendingReceptors = Decimal.log10(player.money).sub(7e5).div(1e4).mul(Decimal.mul(player.infinityPoints, 1e3).log10().sub(9.9e2).div(10)).pow(1.05).round().min(150).sub(Decimal.max(player.maxReceptors, 100)).max(0).add(pendingReceptors);
                pendingReceptors = Decimal.log10(player.money).sub(7e5).div(1e4).mul(Decimal.mul(player.infinityPoints, 1e3).log10().sub(9.9e2).div(10)).pow(0.96).round().min(200).sub(Decimal.max(player.maxReceptors, 100)).max(0).add(pendingReceptors);
                pendingReceptors = Decimal.log10(player.money).sub(7e5).div(1e4).mul(Decimal.mul(player.infinityPoints, 1e3).log10().sub(9.9e2).div(10)).pow(0.9).round().min(370).sub(Decimal.max(player.maxReceptors, 100)).max(0).add(pendingReceptors);
                pendingReceptors = Decimal.log10(player.money).sub(8e5).div(1e3).add(370).sub(player.maxReceptors).floor().add(pendingReceptors).max(0);
            }

            if (player.currentChallenge !== 0) {
                player.challengesCompletitions[player.currentChallenge - 1]++;
                player.currentChallenge = 0;
                this.challenges.updateCompletitions();
            }

            player.receptors = Decimal.add(player.receptors, pendingReceptors);
            player.maxReceptors = Decimal.add(player.maxReceptors, pendingReceptors);
    
            player.money = new Decimal(10);
            player.gain = new Decimal(10);
    
            player.upgrades = [0, 0, 0, 0, 0, 0, 0, 0];
    
            autobuyers = [];
            player.infinities = new Decimal(0);
            player.infinityPoints = new Decimal(0);
            player.infinityUpgrades = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    
            player.break = false;
            player.breakUpgrades = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 0];
    
            player.infinityPower = new Decimal(0);
            player.infinityGeneratorsBought = [0, 0, 0, 0, 0, 0, 0, 0];
            player.infinityGeneratorsAmount = [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)];
            player.infinityGeneratorsUpgrades = [0, 0, 0];
        }

        this.challenges.updateDesc();
    },
    cost: {
        11: null,
        12: 50,
        13: 3,
        14: 50,
        15: null,

        21: 300,
        22: 1,
        23: null,
        24: 1,
        25: null,

        31: 50,
        32: null,
        33: null,
        34: null,
        35: 50,

        41: null,
        42: null,
        43: 1,
        44: null,
        45: null,

        51: 3,
        52: 50,
        53: null,
        54: 50,
        55: 3
    },
    markBoughtUPG() {
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 5; j++) {
                if (player.irisUpgrades.includes(10 * i + j)) {
                    document.getElementById("irisUpgrade" + (10 * i + j)).style.borderColor = 'gold';
                }
                else {
                    document.getElementById("irisUpgrade" + (10 * i + j)).style.borderColor = 'black';
                }
            }
        }
    },
    buy(upg) {
        let canBuy = false;
        if (Decimal.gte(player.receptors, iris.cost[upg]) && !player.irisUpgrades.includes(upg)) {
            switch (upg) {
                case 11:
                    canBuy = player.irisUpgrades.includes(12) && player.irisUpgrades.includes(31);
                    break;
                case 12:
                    canBuy = player.irisUpgrades.includes(13);
                    break;
                case 13:
                    canBuy = player.irisUpgrades.includes(22) && player.irisUpgrades.includes(24);
                    break;
                case 14:
                    canBuy = player.irisUpgrades.includes(13);
                    break;
                case 15:
                    canBuy = player.irisUpgrades.includes(14) && player.irisUpgrades.includes(35);
                    break;
                case 21:
                    canBuy = true;
                    break;
                case 22:
                    canBuy = true;
                    break;
                case 23:
                    canBuy = true;
                    break;
                case 24:
                    canBuy = true;
                    break;
                case 25:
                    canBuy = true;
                    break;
                case 31:
                    canBuy = player.irisUpgrades.includes(51);
                    break;
                case 32:
                    canBuy = true;
                    break;
                case 33:
                    break;
                case 34:
                    canBuy = true;
                    break;
                case 35:
                    canBuy = player.irisUpgrades.includes(55);
                    break;
                case 41:
                    canBuy = player.i&& player.irisUpgrades.includes(44);true;
                    break;
                case 42:
                    canBuy = true;
                    break;
                case 43:
                    canBuy = true;
                case 44:
                    canBuy = true;
                    break;
                case 45:
                    canBuy = true;
                    break;
                case 51:
                    canBuy = player.irisUpgrades.includes(22) && player.irisUpgrades.includes(43);
                    break;
                case 52:
                    canBuy = player.irisUpgrades.includes(51);
                    break;
                case 53:
                    canBuy = player.irisUpgrades.includes(52) && player.irisUpgrades.includes(54);
                    break;
                case 54:
                    canBuy = player.irisUpgrades.includes(55);
                    break;
                case 55:
                    canBuy = player.irisUpgrades.includes(24) && player.irisUpgrades.includes(43);
                    break;
            }
            if (canBuy) {
                player.receptors = Decimal.sub(player.receptors, iris.cost[upg]);
                player.irisUpgrades.push(upg);
            }
        }
        this.markBoughtUPG();
    },
    respec() {
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 5; j++) {
                if (player.irisUpgrades.includes(10 * i + j)) {
                    player.receptors = Decimal.add(player.receptors, this.cost[10 * i + j])
                }
            }
        }

        player.irisUpgrades = [];

        this.markBoughtUPG();

        this.reset();

        this.challenges.exit();

        player.receptors = Decimal.add(player.receptors, pendingReceptors);
        player.maxReceptors = Decimal.add(player.maxReceptors, pendingReceptors);

        player.money = new Decimal(10);
        player.gain = new Decimal(10);

        player.upgrades = [0, 0, 0, 0, 0, 0, 0, 0];

        autobuyers = [];
        player.infinities = new Decimal(0);
        player.infinityPoints = new Decimal(0);
        player.infinityUpgrades = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

        player.break = false;
        player.breakUpgrades = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 0];

        player.infinityPower = new Decimal(0);
        player.infinityGeneratorsBought = [0, 0, 0, 0, 0, 0, 0, 0];
        player.infinityGeneratorsAmount = [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)];
        player.infinityGeneratorsUpgrades = [0, 0, 0];
    },
    challenges: {
        goals: ["1e380", NaN, NaN, NaN, NaN, NaN],
        rewards: [NaN, NaN, NaN, NaN, NaN, NaN],
        total: 0,
        current: 0,
        start(chall) {
            let canStart = false;
            switch (chall) {
                case 1:
                    canStart = player.irisUpgrades.includes(21);
                    break;
                case 2:
                    canStart = player.irisUpgrades.includes(25);
                    break;
                case 3:
                    canStart = player.irisUpgrades.includes(45);
                    break;
                case 4:
                    canStart = player.irisUpgrades.includes(41);
                    break;
                case 5:
                    canStart = player.irisUpgrades.includes(32);
                    break;
                case 6:
                    canStart = player.irisUpgrades.includes(34);
                    break;
            }
            if (canStart) {
                iris.reset()

                player.receptors = Decimal.add(player.receptors, pendingReceptors);
                player.maxReceptors = Decimal.add(player.maxReceptors, pendingReceptors);
        
                player.money = new Decimal(10);
                player.gain = new Decimal(10);
        
                player.upgrades = [0, 0, 0, 0, 0, 0, 0, 0];
        
                autobuyers = [];
                player.infinities = new Decimal(0);
                player.infinityPoints = new Decimal(0);
                player.infinityUpgrades = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
        
                player.break = false;
                player.breakUpgrades = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 0];
        
                player.infinityPower = new Decimal(0);
                player.infinityGeneratorsBought = [0, 0, 0, 0, 0, 0, 0, 0];
                player.infinityGeneratorsAmount = [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)];
                player.infinityGeneratorsUpgrades = [0, 0, 0];

                player.currentChallenge = chall;
            }

            this.updateDesc();
        },
        exit() {
            if (player.currentChallenge !== 0) {
                player.currentChallenge = 0;
                iris.reset();
            }

            player.receptors = Decimal.add(player.receptors, pendingReceptors);
            player.maxReceptors = Decimal.add(player.maxReceptors, pendingReceptors);

            player.money = new Decimal(10);
            player.gain = new Decimal(10);

            player.upgrades = [0, 0, 0, 0, 0, 0, 0, 0];

            autobuyers = [];
            player.infinities = new Decimal(0);
            player.infinityPoints = new Decimal(0);
            player.infinityUpgrades = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

            player.break = false;
            player.breakUpgrades = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 0];

            player.infinityPower = new Decimal(0);
            player.infinityGeneratorsBought = [0, 0, 0, 0, 0, 0, 0, 0];
            player.infinityGeneratorsAmount = [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)];
            player.infinityGeneratorsUpgrades = [0, 0, 0];

            this.updateDesc();
        },
        updateCompletitions() {
            for (let i = 0; i < 6; i++) {
                document.getElementById("IrCcomp" + (i + 1)).innerHTML = player.challengesCompletitions[i];
                document.getElementById("IrCgoal" + (i + 1)).innerHTML = format(this.goals[i]);

                // aggiornare i goal
            }
        },
        updateRewards() {
            this.rewards[1] = 1 + player.challengesCompletitions[1] * 0.15;

            for (let i = 0; i < 6; i++) {
                if (i === 1) {
                    document.getElementById("IrCreward" + (i + 1)).innerHTML = this.rewards[i];
                }
            }
        },
        updateDesc() {
            if (player.currentChallenge === 0) {
                document.getElementById("currentChallenge").innerHTML = "You are currently not in any challenge";
            }
            else {
                document.getElementById("currentChallenge").innerHTML = "You are currently in Iris challenge " + player.currentChallenge;
            }
        }
    }
}

function switchTab(tab) {
    infinity.markBoughtUPG();
    iris.markBoughtUPG();
    iris.challenges.updateDesc();

    document.getElementById("mainTab").style.display = "none";
    document.getElementById("infinityTab").style.display = "none";
    document.getElementById("breakInfinityTab").style.display = "none";
    document.getElementById("infinityGeneratorsTab").style.display = "none";
    document.getElementById("irisTab").style.display = "none";
    document.getElementById("irisChallengesTab").style.display = "none";
    document.getElementById("optionsTab").style.display = "none";

    document.getElementById(tab).style.display = "block";
    player.selectedTab = tab;
}

function toggleChallengesMilestones() {
    if (player.showMilestones) {
        document.getElementById("challengesMilestones").style.display = "none";
        document.getElementById("toggleChallengesMilestonesButton").innerHTML = "Show challenges milestones.";
    }
    else {
        document.getElementById("challengesMilestones").style.display = "block";
        document.getElementById("toggleChallengesMilestonesButton").innerHTML = "Hide challenges milestones.";
    }
    player.showMilestones = !player.showMilestones;
}

var autobuyers = []
for (let i = 0; i < 9; i++) {
    autobuyers[i] = false;
}

function buyMax() {
    for (let i = 0; i < 8; i++) {
        while (Decimal.lte(upgrades.cost[i], player.money)) {
            upgrades.buy(i);
        }
    }
}

function format(x) {
    x = new Decimal(x);

    if (x.gt(1e308) && !player.break) {
        return "Infinite";
    }

    if (x.lt(0.001) && x.neq(0)) {
        return "~0";
    }

    if (x.lt(1000)) {
        return x.mag.toFixed(3);
    }

    if (x.lt("ee9")) {
        let exp = Decimal.floor(Decimal.log(x, 10));
        let mantissa = Decimal.div(x, Decimal.pow10(exp));
        if (mantissa.mag === 10) {
            mantissa.mag = 1;
            exp.mag++;
        }
        return mantissa.mag.toFixed(3) + "e" + exp.mag;
    }

    x = x.log10();
    let exp = Decimal.floor(Decimal.log(x, 10));
    let mantissa = Decimal.div(x, Decimal.pow10(exp));
    if (mantissa.mag === 10) {
        mantissa.mag = 1;
        exp.mag++;
    }
    return "e" + mantissa.mag.toFixed(5) + "e" + exp.mag;
}

var deltaTime = 0;
var IUmulti = 1;
function productionLoop() {
    if (Decimal.eq(player.gain, 0)) {
        player.money = new Decimal(10);
    }

    player.gain = Decimal.pow(Decimal.mul(Decimal.mul(upgrades.effect[0], upgrades.effect[1]), upgrades.effect[2]), upgrades.effect[3]);

    IUmulti = 1;

    if (player.infinityUpgrades[0]) IUmulti *= 4;
    if (player.infinityUpgrades[1]) IUmulti *= 2;
    if (player.infinityUpgrades[3]) IUmulti *= 1.25;
    if (player.infinityUpgrades[14]) player.gain = Decimal.mul(player.gain, player.breakUpgrades[3]? Decimal.pow(Decimal.mul(1e10, Decimal.add(player.infinityPoints, 1)), Decimal.min(Decimal.div(player.infinities, 100).add(3), 50)) : Decimal.mul(100, Decimal.add(player.infinityPoints, 1)));

    if (!player.breakUpgrades[0]) player.gain = Decimal.mul(player.gain, IUmulti);

    if (!player.break && player.gain.gt(1e308)) player.gain = new Decimal(1e308);
    
    if (!player.infinityUpgrades[15]) {
        if (player.gain.gte(1e50)) {
            player.gain = Decimal.mul(1e50, Decimal.pow(Decimal.div(player.gain, 1e50), 0.85 + upgrades.effect[7]));
        }
        if (player.gain.gte(1e100)) {
            player.gain = Decimal.mul(1e100, Decimal.pow(Decimal.div(player.gain, 1e100), (0.85 + upgrades.effect[7]) ** 2));
        }
        if (player.gain.gte(1e175)) {
            player.gain = Decimal.mul(1e175, Decimal.pow(Decimal.div(player.gain, 1e175), (0.85 + upgrades.effect[7]) ** 3));
        }
    }
    else {
        player.gain = Decimal.min(Decimal.pow(player.gain, upgrades.effect[7] + 1), (player.break)? Infinity : 1e308);
    }

    if (player.infinityUpgrades[2] && !player.breakUpgrades[0]) {
        player.gain = Decimal.mul(player.gain, Math.SQRT2);
    }
    else if (player.breakUpgrades[0]) {
        player.gain = Decimal.mul(player.gain, Decimal.pow(2.5, Decimal.pow(IUmulti * Math.SQRT2, 2.5)));
    }

    deltaTime = Math.max(Date.now() - lastUpdate, 0);
    lastUpdate = Date.now();

    infinityGenerators.update();

    player.gain = Decimal.mul(player.gain, infinityGenerators.effect);

    if (player.irisUpgrades.includes(22)) {
        player.gain = Decimal.mul(player.gain, 1e3);
    }
    if (player.irisUpgrades.includes(12)) {
        player.gain = Decimal.mul(player.gain, Decimal.pow("1e1000", player.irisUpgrades.length));
    }
    if (player.irisUpgrades.includes(13)) {
        player.gain = Decimal.mul(player.gain, Decimal.pow(100, player.maxReceptors));
    }
    if (player.irisUpgrades.includes(14)) {
        player.gain = Decimal.mul(player.gain, Decimal.log10(Decimal.max(player.money, 10)).pow(1000));
    }
    if (player.irisUpgrades.includes(31)) {
        player.gain = Decimal.mul(player.gain, "1e25000")
    }
    if (player.irisUpgrades.includes(51)) {
        player.gain = Decimal.mul(player.gain, Decimal.add(player.maxReceptors, 1).pow(250));
    }
    if (player.irisUpgrades.includes(52)) {
        player.gain = Decimal.mul(player.gain, "1e50000");
    }

    if (player.irisUpgrades.includes(12)) {
        player.gain = Decimal.pow(player.gain, 1.05);
    }
    if (player.irisUpgrades.includes(31)) {
        player.gain = Decimal.pow(player.gain, 1.05);
    }

    if (player.currentChallenge === 1) {
        player.gain = Decimal.pow(player.gain, Decimal.pow(0.99, Decimal.log10(Decimal.max(player.money, 1e10)).log10().pow(Decimal.slog(Decimal.max(player.money, 10)).sub(0.3))));
    }

    if (player.irisUpgrades.includes(44)) {
        player.gain = player.gain.pow(0.5);
    }
    if (player.gain.gte("ee5") && player.irisUpgrades.includes(23)) {
        player.gain = Decimal.mul("ee5", Decimal.pow(Decimal.div(player.gain, "ee5"), 0.25));
    }

    if (player.gain.gte("ee5") && !player.irisUpgrades.includes(52)) {
        player.gain = Decimal.mul("ee5", Decimal.pow(Decimal.div(player.gain, "ee5"), 0.6));
    }
    if (player.gain.gte("e2e5") && !player.irisUpgrades.includes(54)) {
        player.gain = Decimal.mul("e2e5", Decimal.pow(Decimal.div(player.gain, "e2e5"), 0.6 ** 1.25));
    }
    if (player.gain.gte("e4e5") && !player.irisUpgrades.includes(52)) {
        player.gain = Decimal.mul("e4e5", Decimal.pow(Decimal.div(player.gain, "e4e5"), 0.6));
    }
    if (player.gain.gte("e5e5") && !player.irisUpgrades.includes(54)) {
        player.gain = Decimal.mul("e5e5", Decimal.pow(Decimal.div(player.gain, "e5e5"), 0.6));
    }
    if (player.gain.gte("e7e5")) {
        player.gain = Decimal.mul("e7e5", Decimal.pow(Decimal.div(player.gain, "e7e5"), (0.1 + (player.irisUpgrades.includes(31) + player.irisUpgrades.includes(35) + player.irisUpgrades.includes(43) + player.irisUpgrades.includes(51) + player.irisUpgrades.includes(52) + player.irisUpgrades.includes(54) + player.irisUpgrades.includes(55)) * 0.025)));
    }

    if (player.gain.gte("e7.2e5")) {
        player.gain = Decimal.mul("e7.2e5", Decimal.pow10(Decimal.pow(Decimal.sub(Decimal.log10(player.gain), 720000), 0.5 + Math.min(player.irisUpgrades.length, 5) * 0.1)));
    }
    if (player.gain.gte("e7.4e5")) {
        player.gain = Decimal.mul("e7.4e5", Decimal.pow10(Decimal.pow(Decimal.sub(Decimal.log10(player.gain), 740000), 0.5 + Math.min(Math.max(player.irisUpgrades.length - 5, 0), 5) * 0.1)));
    }
    if (player.gain.gte("e7.6e5")) {
        player.gain = Decimal.mul("e7.6e5", Decimal.pow10(Decimal.pow(Decimal.sub(Decimal.log10(player.gain), 760000), 0.5 + Math.min(Math.max(player.irisUpgrades.length - 9, 0), 2) * 0.25)));
    }
    if (player.gain.gte("e7.8e5")) {
        player.gain = Decimal.mul("e7.8e5", Decimal.pow10(Decimal.pow(Decimal.sub(Decimal.log10(player.gain), 780000), 0.5 + Math.min(Math.max(player.irisUpgrades.length - 10, 0), 3) * 0.2)));
    }

    player.money = Decimal.min(Decimal.add(player.money, Decimal.mul(player.gain, deltaTime / 1000)), (player.break)? Infinity : 1e308);

    if (player.break) {
        buyMax();
    }
    else {
        for (let i = 0; i < 8; i++) {
            if (autobuyers[i]) {
                upgrades.buy(i);
            }
        }
    }
}

var upgBase1 = 1.15;
var upgBase2 = 2;
var upgLvlAtInf = [5058, 223, 213, 73, 291, 25, 7, 15];
var IPmulti = 1;
var BIscaling = [2, 2];
function variablesLoop() {
    if (player.breakUpgrades[10]) {
        BIscaling[0] = 1.9125;
    }
    else if (player.breakUpgrades[8]) {
        BIscaling[0] = 1.95;
    }
    if (player.breakUpgrades[6]) {
        BIscaling[1] = 1.95;
    }
    else if (player.breakUpgrades[4]) {
        BIscaling[1] = 1.975;
    }

    upgrades.updateCosts();
    infinityGenerators.updateCosts();

    upgrades.effect[0] = Decimal.pow(player.upgrades[0] * (player.infinityUpgrades[13]? 5 : 1) + upgrades.effect[4][0], upgrades.effect[5]);

    upgBase1 = 1.15 + upgrades.effect[6][0];
    for (let i = 4; i < 8; i++) {
        if (player.breakUpgrades[1]) {
            upgBase1 += 0.05 * i ** 1.5;
        }
        else {
            upgBase1 += player.infinityUpgrades[i] * 0.001 * 2 ** (i - 4);
        }
    }
    upgrades.effect[1] = Decimal.pow(upgBase1, player.upgrades[1] + upgrades.effect[4][1]);
    
    upgBase2 = 2 + upgrades.effect[6][1];
    upgrades.effect[2] = Decimal.pow(upgBase2, player.upgrades[2] + upgrades.effect[4][1]);
    
    upgrades.effect[3] = 1 + (player.upgrades[3] + upgrades.effect[4][2]) * 0.05;
    if (player.breakUpgrades[5]) {
        upgrades.effect[3] = 1 + (upgrades.effect[3] - 1) * 1.1;
    }
    
    upgrades.effect[4][0] = 100 * (Math.log(player.upgrades[4] + Math.E) - 1) ** 0.5;
    if (player.infinityUpgrades[8]) {
        upgrades.effect[4][0] *= 2;
    }
    upgrades.effect[4][1] = 3 * (Math.log(player.upgrades[4] + Math.E) - 1) ** 0.2;
    if (player.infinityUpgrades[9]) {
        upgrades.effect[4][1] *= 1.333;
    }
    upgrades.effect[4][2] = (Math.log(player.upgrades[4] + Math.E) - 1) ** 0.25;
    if (player.infinityUpgrades[10]) {
        upgrades.effect[4][2] *= 1.1;
    }
    if (player.infinityUpgrades[11]) {
        for (let i = 0; i < 3; i++) {
            upgrades.effect[4][i] *= 1.05;
        }
    }
    if (player.breakUpgrades[2]) {
        for (let i = 0; i < 3; i++) {
            upgrades.effect[4][i] **= 2;
        }
    }
    
    upgrades.effect[5] = 1 + player.upgrades[5] / 10;
    if (player.breakUpgrades[7]) {
        upgrades.effect[5] = 1 + (upgrades.effect[5] - 1) * 1.125;
    }
    
    upgrades.effect[6][0] = player.upgrades[6] * (player.breakUpgrades[9]? 0.03 : 0.025);
    if (player.breakUpgrades[9]) {
        upgrades.effect[6][1] = (player.upgrades[6] - 30) * 0.015
    }

    upgrades.effect[7] = player.upgrades[7] * (player.breakUpgrades[11]? 0.011 : 0.01);
    if (player.breakUpgrades[3]) {
        upgrades.effect[7] = (upgrades.effect[7] + 1) ** (player.upgrades[7] / 15 + 1) - 1;
    }

    if (!autobuyers[7]) {
        if (Decimal.gte(player.infinities, 2)){
            autobuyers[0] = true;
        }
        if (Decimal.gte(player.infinities, 4)) {
            autobuyers[1] = true;
        }
        if (Decimal.gte(player.infinities, 6)) {
            autobuyers[2] = true;
        }
        if (Decimal.gte(player.infinities, 8)) {
            autobuyers[3] = true;
        }
        if (Decimal.gte(player.infinities, 10)) {
            autobuyers[4] = true;
        }
        if (Decimal.gte(player.infinities, 13)) {
            autobuyers[5] = true;
        }
        if (Decimal.gte(player.infinities, 16)) {
            autobuyers[6] = true;
        }
        if (Decimal.gte(player.infinities, 20)) {
            autobuyers[7] = true;
        }
    }

    infinity.breakCost[16] = Decimal.pow(100, player.breakUpgrades[16] + 1);

    IPmulti = Decimal.pow(4 + player.irisUpgrades.includes(14), player.breakUpgrades[16]);

    if (player.irisUpgrades.includes(13)) {
        IPmulti = Decimal.mul(IPmulti, Decimal.add(player.maxReceptors, 1).pow(3));
    }
    if (player.irisUpgrades.includes(24)) {
        IPmulti = Decimal.mul(IPmulti, 256);
    }

    infinityGenerators.effect = Decimal.max(Decimal.pow(player.infinityPower, 1000 + player.infinityGeneratorsUpgrades[0] * 250), 1);

    iris.challenges.total = 0;
    for (let i in player.challengesCompletitions) {
        iris.challenges.total += player.challengesCompletitions[i];
    }
}

function GUIUpdate() {
    let softcap = 1;
    if (!player.infinityUpgrades[15]) {
        if (Decimal.gte(player.gain, 1e50)) {
            softcap *= 0.85 + upgrades.effect[7];
        }
        if (Decimal.gte(player.gain, 1e100)) {
            softcap *= (0.85 + upgrades.effect[7]) ** 2;
        }
        if (Decimal.gte(player.gain, 1e175)) {
            softcap *= (0.85 + upgrades.effect[7]) ** 3;
        }
    }
    else {
        softcap += upgrades.effect[7];
    }

    document.getElementById("money").innerHTML = format(player.money);
    document.getElementById("gain").innerHTML = format(player.gain);

    document.getElementById("softcap").innerHTML = format(softcap);

    document.getElementById("upgradeEffect2").innerHTML = format(upgBase1);
    document.getElementById("upgradeEffect3").innerHTML = format(upgBase2);

    for (let i = 1; i <= 8; i++) {
        document.getElementById("upgradeCost" + i).innerHTML = format(upgrades.cost[i - 1]);

        document.getElementById("infGen" + i + "Multi").innerHTML = format(infinityGenerators.multiplier[i - 1]);
        document.getElementById("infGen" + i + "Amount").innerHTML = format(player.infinityGeneratorsAmount[i - 1])
        document.getElementById("infGen" + i + "Cost").innerHTML = format(infinityGenerators.genCost[i - 1]);
        if (i === 8) {
            break;
        }
        document.getElementById("infGen" + i + "Gain").innerHTML = format(Decimal.mul(player.infinityGeneratorsAmount[i], infinityGenerators.multiplier[i]));
        document.getElementById("infGen" + i + "GainRel").innerHTML = format(Decimal.mul(player.infinityGeneratorsAmount[i], infinityGenerators.multiplier[i]).div(Decimal.add(player.infinityGeneratorsAmount[i - 1], 1)));
    }

    document.getElementById("infPowGain").innerHTML = format(Decimal.mul(player.infinityGeneratorsAmount[0], infinityGenerators.multiplier[0]));

    if (Decimal.gte(player.money, 1e308)) {
        document.getElementById("infinityReset").style.color = "white";
        document.getElementById("infinityReset").style.backgroundColor = "green";
    }
    else {
        document.getElementById("infinityReset").style.color = "black";
        document.getElementById("infinityReset").style.backgroundColor = "lightgray";
    }

    let pendingIP;
    pendingIP = Decimal.mul(Decimal.floor(Decimal.sub(Decimal.pow(player.money, 0.0009765625), 0.9988548118735103)), IPmulti);
    if (player.irisUpgrades.includes(12)) {
        pendingIP = Decimal.mul(pendingIP, Decimal.mul(player.maxReceptors, player.irisUpgrades.length).pow(2));
    }
    if (player.irisUpgrades.includes(35)) {
        pendingIP = Decimal.mul(pendingIP, 1e50);
    }
    if (player.irisUpgrades.includes(54)) {
        pendingIP = Decimal.mul(pendingIP, 1e100);
    }

    if (player.irisUpgrades.includes(42)) {
        pendingIP = Decimal.pow(pendingIP, 0.75);
    }

    if (player.irisUpgrades.includes(14)) {
        pendingIP = Decimal.pow(pendingIP, 1.05);
    }
    if (player.irisUpgrades.includes(35)) {
        pendingIP = Decimal.pow(pendingIP, 1.05);
    }
    document.getElementById("pendingIP").innerHTML = format(pendingIP);

    document.getElementById("IP").innerHTML = format(player.infinityPoints);
    document.getElementById("infinities").innerHTML = format(player.infinities);

    if (Decimal.lt(player.infinities, 2)) {
        document.getElementById("auto").innerHTML = "You have no autobuyers.";
    }
    else if (Decimal.lt(player.infinities, 4)) {
        document.getElementById("auto").innerHTML = "You have the autobuyer for the first upgrade.";
    }
    else if (Decimal.lt(player.infinities, 20)) {
        let auto = 0;
        for (let i = 0; i < 8; i++) {
            auto += autobuyers[i];
        }
        document.getElementById("auto").innerHTML = "You have the autobuyers for the first " + auto + " upgrades.";
    }
    else {
        document.getElementById("auto").innerHTML = "You have the autobuyers for all the upgrades.";
    }

    document.getElementById("IPmultiCost").innerHTML = format(infinity.breakCost[16]);

    document.getElementById("infinityPower").innerHTML = format(player.infinityPower);
    document.getElementById("infinityPowerBoost").innerHTML = format(infinityGenerators.effect);

    for (let i = 1; i <= 3; i++) {
        document.getElementById("infGenUpgCost" + i).innerHTML = format(infinityGenerators.upgCost[i - 1]);
    }

    document.getElementById("receptors").innerHTML = format(player.receptors);

    let pendingReceptors
    if (Decimal.gte(player.money, "e7.2e5") && Decimal.gte(player.infinityPoints, "e1007")) {
        pendingReceptors = Decimal.log10(player.money).sub(7e5).div(1e4).mul(Decimal.mul(player.infinityPoints, 1e3).log10().sub(9.9e2).div(10)).pow(1.5).round().min(100).sub(player.maxReceptors).max(0);
        pendingReceptors = Decimal.log10(player.money).sub(7e5).div(1e4).mul(Decimal.mul(player.infinityPoints, 1e3).log10().sub(9.9e2).div(10)).pow(1.05).round().min(150).sub(Decimal.max(player.maxReceptors, 100)).max(0).add(pendingReceptors);
        pendingReceptors = Decimal.log10(player.money).sub(7e5).div(1e4).mul(Decimal.mul(player.infinityPoints, 1e3).log10().sub(9.9e2).div(10)).pow(0.96).round().min(200).sub(Decimal.max(player.maxReceptors, 100)).max(0).add(pendingReceptors);
        pendingReceptors = Decimal.log10(player.money).sub(7e5).div(1e4).mul(Decimal.mul(player.infinityPoints, 1e3).log10().sub(9.9e2).div(10)).pow(0.9).round().min(370).sub(Decimal.max(player.maxReceptors, 100)).max(0).add(pendingReceptors);
        pendingReceptors = Decimal.log10(player.money).sub(8e5).div(1e3).add(370).sub(player.maxReceptors).floor().add(pendingReceptors).max(0);
    }
    else {
        pendingReceptors = new Decimal(0);
    }
    document.getElementById("pendingReceptors").innerHTML = format(pendingReceptors);

    if (Decimal.gte(player.infinityPoints, "1e1007") && Decimal.gt(pendingReceptors, 0) || Decimal.gte(player.infinityPoints, iris.challenges.goals[player.currentChallenge - 1]) && player.currentChallenge !== 0) {
        document.getElementById("irisReset").style.backgroundImage = "linear-gradient(to right, red, green, blue)";
        document.getElementById("irisReset").style.color = "white";
    }
    else {
        document.getElementById("irisReset").style.backgroundImage = "none";
        document.getElementById("irisReset").style.color = "black";
    }

    if (!player.hasSeenEndScreen && Decimal.gte(player.money, "e8e5")) {
        document.getElementById("end-screen").style.display = "block";
        localStorage.setItem("win", true);
    }
}

function continueGame() {
    player.hasSeenEndScreen = true;
    document.getElementById("end-screen").style.display = "none";
    document.getElementById("secret-theme").style.display = "block";
}

if (localStorage.getItem("win")) {
    document.getElementById("secret-theme").style.display = "block";
} 

function mainLoop() {
    variablesLoop();
    productionLoop();
    GUIUpdate();
}

switchTab(player.selectedTab);
toggleChallengesMilestones();
toggleChallengesMilestones();
iris.challenges.updateCompletitions();
iris.challenges.updateRewards();

setInterval(mainLoop, 50);