const convertMinsToHrsMins = (mins: string) => {
    let h = Math.floor(Number(mins) / 60);
    let m = Number(mins) % 60;
    let hrs = h < 10 ? '0' + h : h;
    let min = m < 10 ? '0' + m : m;
    return `${hrs}:${min}`;
};
const convertMinsToHrsMin = {
    convertMinsToHrsMins
};
export default convertMinsToHrsMin;
