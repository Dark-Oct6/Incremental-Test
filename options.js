const themeSelect = document.getElementById("themeSelect");

themeSelect.addEventListener("change", function () {
    const selectedTheme = themeSelect.value;

    localStorage.setItem('theme', selectedTheme);

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
    else if (selectedTheme === "light") {
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
    else {
        document.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));
        document.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.parentNode.removeChild(el));
    }
});