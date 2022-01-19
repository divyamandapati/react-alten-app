const dateConversion = (date: string) => {
    let monthArray = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    
    let month = Number(date?.slice(5, 7));
    let day = date?.slice(8, 10);
    let year = date?.slice(0, 4);
    return `${monthArray[month - 1]} ${day}, ${year} `;
};
const DateConversion = {
    dateConversion
};
export default DateConversion;
