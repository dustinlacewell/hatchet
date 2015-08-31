function choice(arr) {
    let rand = Math.random();
    rand *= arr.length;
    return arr[Math.floor(rand)];
};

export default choice
