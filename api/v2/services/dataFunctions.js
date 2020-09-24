var exports = module.exports = {};

exports.transform = function(data) {
    tranform = {}
    data.values.forEach((value) => {
        tranform[value.name] = value.value;
    })
    return tranform
}

exports.transformAll = function(datas) {
    all = []
    if(datas){
        datas.forEach((value) => {
            all.push(exports.transform(value))
        })
    }    
    return all
}

exports.converter = function(contract, body) {
    values = [];
    fields = contract.fields;
    for (let index = 0; index < fields.length; index++) {
        const key = fields[index].name;
        values.push({name: key, value: body[key]});                
    }
    return values;
}

exports.getKey = function(contract, body) {
    value = null;
    fields = contract.fields;
    for (let index = 0; index < fields.length; index++) {
        if(fields[index].key) {
            const key = fields[index].name;
            value = body[key];
        }        
    }
    return value;
}