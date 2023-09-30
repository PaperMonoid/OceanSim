function complexAdd(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
};

function complexSubtract(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
};

function complexMultiply(a, b) {
    return [(a[0] * b[0] - a[1] * b[1]), (a[0] * b[1] + a[1] * b[0])];
};
