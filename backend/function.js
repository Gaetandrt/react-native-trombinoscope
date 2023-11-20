
function extractDetailFromJSON(jsonObj) {
    if (jsonObj && jsonObj.detail)
        return jsonObj.detail;
    return null;
};

function addEmployeesToDb(jsonEmployees) {

};

module.exports = extractDetailFromJSON;
