//это уже доставать из JSON.parse(resp).resp.data[0]
const getNextNode = (_k, restName) => {
    const letter = restName[0];
    return _k.pl
        ? _k.pl
        : _k[letter]
            ? getNextNode(_k[letter], restName.slice(1))
            : null;
}

module.exports = getNextNode;