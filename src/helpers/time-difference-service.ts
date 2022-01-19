import moment from 'moment';

const timeDifference = (now: any, then: any) => {
    let time = moment(now, 'HH:mm:ss').diff(moment(then, 'HH:mm:ss'));
    let d = moment.duration(time);
    let diffTime = Math.floor(d.asHours()) + moment.utc(time).format(':mm:ss');

    return diffTime;
};
const TimeDifference = {
    timeDifference
};
export default TimeDifference;
