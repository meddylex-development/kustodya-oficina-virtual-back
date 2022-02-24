const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let moment = require("moment");
let path = require("path");
let fs = require('fs');
let nodemailer = require('nodemailer');
let handlebars = require('handlebars');
const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name');
const jwt = require("../libs/jwt");
// let User = require("../controllers/user");
let User = require("../models/user");

const readHTMLFile = (pathTmp) => {
    return new Promise((resolve, reject) => {
        let pathTemplate = path.join(__dirname, '..', pathTmp);
        fs.readFile(pathTemplate, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                reject(err); 
            throw err;
            } else {
                resolve(html);
            }
        });
    })
};

const getAPIRestUrl = (url_api) => {
    return new Promise((resolve, reject) => {
        let urlApi = url_api;
        fetch(urlApi)
        .then(res => res.json())
        .then(json => {            if (!json) {
                reject(false);
            } else {
                resolve(json)
            }
        });
    });
}

const getDateNow = (format = '') => {
    let formatDate = (format) ? format : 'DD/MM/YYYY HH:mm';
    return moment().format(formatDate);
}

const getDateNowValueOf = () => {
    return moment().valueOf();
}

const getDateFormat = (timestamp = '', format = '') => {
    // 'DD/MM/YYYY'
    // 'DD/MM/YYYY HH:mm'
    let formatDate = (format) ? format : 'DD/MM/YYYY';
    return moment(timestamp).format(formatDate);
}

const sendEmail = (stringHTML, textBodyEmail, replacementsHTML, dataInfoMail, filesToSend) => {
    return new Promise((resolve, reject) => {

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, 
            secure: true,
            // service: 'gmail',
            auth: {
              user: 'meddylex.development@gmail.com',
              pass: 'eejnoxuksuawommh'
            }
        });

        if (!dataInfoMail || dataInfoMail == '' || dataInfoMail == null) {
            let error = new Error("Ocurrio un error con las opciones de envio del email");
            reject({ state: false, data: error });
        } else {
            let mailOptions = dataInfoMail;
            if (stringHTML) {
                let template = handlebars.compile(stringHTML);
                let replacements = replacementsHTML;
                let htmlToSend = template(replacements);
                mailOptions['html'] = htmlToSend;
                mailOptions['text'] = '';
            }
    
            if (textBodyEmail) {
                mailOptions['text'] = textBodyEmail;
                mailOptions['html'] = '';
            }

            if(filesToSend) {
                mailOptions['attachments'] = filesToSend;
            }

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    reject({ state: false, data: error });
                } else {
                    resolve({ state: true, data: info });
                }
            });
        }
    });
}

const fnJsonToExcelFile = (dataXls, pathFileSave, nameFile, columnNames) => {
    return new Promise ((resolve, reject) => {
        let writeFile = null;
        const data = dataXls;
        const headingColumnNames = columnNames;
    
        //Write Column Title in Excel file
        let headingColumnIndex = 1;
        headingColumnNames.forEach(heading => {
            ws.cell(1, headingColumnIndex++)
                .string(heading)
        });
    
        //Write Data in Excel file
        let rowIndex = 2;
        data.forEach( record => {
            let columnIndex = 1;
            Object.keys(record).forEach(columnName =>{
                ws.cell(rowIndex,columnIndex++).string(record[columnName]);
            });
            rowIndex++;
        });
        wb.write(pathFileSave + nameFile);
        resolve(true);
        // writeFile = wb.write(pathFileSave + nameFile);
        // if (writeFile) {        //     resolve(true);
        // } else {        //     reject(false);
        // }
        
    });
};

const fnAuthToken = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject(false);
        } else {
            let tokenDecode = jwt.decodeToken(token);
            let dateNow = moment().valueOf();
            if (tokenDecode['dateExp'] < dateNow) {
                resolve(false);
            } else {
                resolve(tokenDecode);
            }
        }
    });
};

const fnFindUserById = (id_user) => {
    return new Promise((resolve, reject) => {
        if (!id_user) {
            reject(false);
        } else {
            User.findOne({ _id: id_user }, (err, dataUser) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(dataUser);
                }
            });
        }
    });
};

const fnUserSystemValid = (token) => {
    console.log('token: ', token);
    return new Promise((resolve, reject) => {
        fnAuthToken(token).then((responseAuthToken) => {
            console.log('responseAuthToken: ', responseAuthToken);
            let idUser = responseAuthToken['_id'] || '';
            if (!idUser) {
                reject(false)
            } else {
                fnFindUserById(idUser).then((responseValid) => {
                    resolve(responseValid);
                });
            }
        })
    });
}

const sendEmailTemplate = (template_url, token, email_to, email_subject) => {
    return new Promise((resolve, reject) => {
        if (!template_url || !token || !email_to || !email_subject) {
            reject(false);
        } else {
            let templateEmailToSend = template_url;
            readHTMLFile(templateEmailToSend).then((responseData) => {
                let stringHTML = responseData;
                let textBodyEmail = null;
                let replacementsHTML = {
                    token: 'http://localhost:4200/#/auth/activate-account?payload=' + token,
                };
                let dataInfoMail = {
                    from: 'Meddylex Oficina Virtual <meddylex.development@gmail.com>',
                    to: email_to,
                    subject: email_subject,
                };
                let filesToSend = null;
                sendEmail(stringHTML, textBodyEmail, replacementsHTML, dataInfoMail, filesToSend).then((respSendMail) => {
                    let trackSendMail = respSendMail;
                    if (!trackSendMail['state']) {
                        reject(new Error("Error server!"));
                        // response.status(500).send({ error: trackSendMail['data'] });
                    } else {
                        resolve(trackSendMail['data']);
                        // response.status(200).send({ response: trackSendMail['data'] });
                    }
                });
        
            });
        }
    });

}

const encriptEmailUser = (email) => {
    console.log('email: ', email);
    // let testMail = "meddylex.development@gmail.com";
    let testMail = email;
    let collection = testMail.split("@");
    let firstPartMail = collection[0];
    let domainPartMail = collection[1];
    let lastChars = firstPartMail.slice(-(firstPartMail.length/3));
    let emailEncript = "******" + lastChars + "@" + domainPartMail;
    console.log('emailEncript: ', emailEncript);
    return emailEncript;
}

module.exports = {
    readHTMLFile,
    getAPIRestUrl,
    getDateNow,
    getDateNowValueOf,
    sendEmail,
    fnJsonToExcelFile,
    getDateFormat,
    fnAuthToken,
    fnFindUserById,
    fnUserSystemValid,
    sendEmailTemplate,
    encriptEmailUser,
};