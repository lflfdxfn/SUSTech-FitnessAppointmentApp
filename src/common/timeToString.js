export default function timeToString(time) {
    time = time/1000;

    const hours = Math.floor(time/3600).toString().padStart(2, '0');
    const remain = time % 3600;

    const minutes = Math.floor(remain/60).toString().padStart(2, '0');
    const seconds = (remain % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`
}
