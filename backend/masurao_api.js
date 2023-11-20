const extractDetailFromJSON = require('./function');
const axios = require('axios');
const url = 'https://masurao.fr/api/employees';
const groupToken = 'cXV8fSfLSGakg5jtBWzsyN_DqCEUlVNT';

module.exports = function (app) {

    app.post('/login', async (req, res) => {
        axios({
            method: 'post',
            url: url + '/login',
            headers: { 'X-Group-Authorization': groupToken },
            data: { "email": req.email, "password": req.password }
        }).then(apiResponse => {
            let obj = {};

            obj['JWTBearer'] = apiResponse.data;
            AsyncStorage.setItem('token', apiResponse.data);
            res.json(obj);
        })
            .catch(error => { res.status(error.response.status).json({ erreur: extractDetailFromJSON(error.response.data) }); });
    });

    app.get('/all-employees', async (req, res) => {
        const token = req.header('Authorization');
        const config = { headers: { 'X-Group-Authorization': groupToken, 'Authorization': 'Bearer ' + token } };

        try {
            let obj = {};
            const response = await axios.get(url, config);

            obj['employees'] = response.data;
            res.json(obj);
        } catch (error) {
            console.log(error.response.data);
            res.status(error.response.status).json({ erreur: extractDetailFromJSON(error.response.data) })
        }
    });

    app.get('/info', async (req, res) => {
        const config = { headers: { 'X-Group-Authorization': groupToken, 'Authorization': 'Bearer ' + req.JWTBearer } };

        try {
            let obj = {};
            const response = await axios.get(url + '/me', config);

            obj['info'] = response.data;
            res.json(obj);
        } catch (error) {
            res.status(error.response.status).json({ erreur: extractDetailFromJSON(error.response.data) })
        }
    });

    app.get('/leaders', async (req, res) => {
        const config = { headers: { 'X-Group-Authorization': groupToken, 'Authorization': 'Bearer ' + req.JWTBearer } };

        try {
            let obj = {};
            const response = await axios.get(url + '/leaders', config);

            obj['leaders'] = response.data;
            res.json(obj);
        } catch (error) {
            res.status(error.response.status).json({ erreur: extractDetailFromJSON(error.response.data) })
        }
    });

    app.get('/info-id', async (req, res) => {
        const config = { headers: { 'X-Group-Authorization': groupToken, 'Authorization': 'Bearer ' + req.JWTBearer } };

        try {
            let obj = {};
            const response = await axios.get(url + '/' + req.id, config);

            obj['info'] = response.data;
            res.json(obj);
        } catch (error) {
            res.status(error.response.status).json({ erreur: extractDetailFromJSON(error.response.data) })
        }
    });

    app.get('/image-id', async (req, res) => {
        const config = { headers: { 'X-Group-Authorization': groupToken, 'Authorization': 'Bearer ' + req.JWTBearer } };

        try {
            let obj = {};
            const response = await axios.get(url + '/' + req.id + '/image', config);

            obj['image'] = response.data;
            res.json(obj);
        } catch (error) {
            res.status(error.response.status).json({ erreur: extractDetailFromJSON(error.response.data) })
        }
    });

};
