export const thousandLimiter = (number: string | number, currency: string | null): string => {
    if (number === undefined || number === null) return '';
    let n: string;
    if (typeof number === 'number') {
        n = number.toString();
    } else {
        n = number
    }
    let counter: number = 1;
    const result: string[] = [];
    for (let index = n.length - 1; index >= 0; index--) {
        result.push(n[index]);
        if (counter % 3 === 0) {
            result.push('.');
        }
        counter++
    }
    if (result[result.length - 1] === '.') result.pop();
    if (currency) {
        return `${currency}. ${result.reverse().join("")}`;
    }
    console.log(`${result.reverse().join("")}`, ">>>> delimiter")
    return `${result.reverse().join("")}`;
}