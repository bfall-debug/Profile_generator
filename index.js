const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./generatedHTML");
const open = require('open');
const pdf = require('html-pdf');

function prompt() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "github",
                message: "What is your GitHub username?"
            },
            {
                type: "list",
                name: "color",
                message: "What is your favorite color?",
                choices: ["red", "blue", "green", "pink"]
            }
        ])
}

function writeToFile(file) {
    pdf.create(file).toFile('./profile.pdf', err => {
        if (err) throw err;
        open("profile.pdf");
    });
}

prompt()
    .then(answers => {
        const url = `https://api.github.com/users/${answers.github}`;
        axios.get(url).then(response => {
            const data = {
                color: answers.color,
                ...response.data
            }
            const html = generateHTML(data);
            writeToFile(html);
        })
    })
    .catch(err => { if (err) throw err })
