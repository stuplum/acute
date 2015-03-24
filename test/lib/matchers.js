function constructorName(func) {

    var regex   = /function (.{1,})\(/,
        results = (regex).exec(func.constructor.toString());

    return (results && results.length > 1) ? results[1] : '';
}

window.isJqueryElement = sinon.match(function (value) {
    return value.jquery;
}, 'is jquery element');

window.isScope = sinon.match(function (value) {
    return constructorName(value) === 'Scope';
}, 'is scope');

beforeEach(function () {

});