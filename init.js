let selectedTheme = localStorage.getItem("theme");

const body = document.body
const tooltip = document.querySelectorAll(".tooltip");
const tooltipText = document.querySelectorAll(".tooltipText");
const tooltip2 = document.querySelectorAll(".tooltip2");
const tooltipText2 = document.querySelectorAll(".tooltipText2");
const irisChallenge = document.querySelectorAll(".irisChallenge");
const a = document.querySelectorAll("a");
const select = document.querySelectorAll("select");

if (selectedTheme === "dark") {
    body.style.color = "#fff";
    body.style.backgroundColor = "#000";

    for (let i of a) {
        i.style.color = "#0ff";
    }

    for (let i of select) {
        i.style.color = "#fff";
        i.style.backgroundColor = "#000";
        i.style.borderColor = "#fff"
    }

    for (let i of tooltip) {
        i.style.color = "#fff";
        i.style.backgroundColor = "#000";
        i.style.borderColor = "#fff";
    }
    for (let i of tooltipText) {
        i.style.color = "#fff";
        i.style.backgroundColor = "#000";
        i.style.borderColor = "#fff";
    }

    for (let i of tooltip2) {
        i.style.color = "#fff";
        i.style.backgroundColor = "#000";
        i.style.borderColor = "#fff";
    }
    for (let i of tooltipText2) {
        i.style.color = "#fff";
        i.style.backgroundColor = "#000";
        i.style.borderColor = "#fff";
    }

    for (let i of irisChallenge) {
        i.style.color = "#fff";
        i.style.borderColor = "#fff";
    }
}
else {
    body.style.color = "#000";
    body.style.backgroundColor = "#fff";

    for (let i of a) {
        i.style.color = "#f00";
    }

    for (let i of select) {
        i.style.color = "#000";
        i.style.backgroundColor = "#fff";
        i.style.borderColor = "#000"
    }

    for (let i of tooltip) {
        i.style.color = "#000";
        i.style.backgroundColor = "#fff";
        i.style.borderColor = "#000";
    }
    for (let i of tooltipText) {
        i.style.color = "#000";
        i.style.backgroundColor = "#fff";
        i.style.borderColor = "#000";
    }

    for (let i of tooltip2) {
        i.style.color = "#000";
        i.style.backgroundColor = "#fff";
        i.style.borderColor = "#000";
    }
    for (let i of tooltipText2) {
        i.style.color = "#000";
        i.style.backgroundColor = "#fff";
        i.style.borderColor = "#000";
    }

    for (let i of irisChallenge) {
        i.style.color = "#fff";
        i.style.borderColor = "#000";
    }
}