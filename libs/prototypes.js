String.prototype.toHHMMSS = function () {
    const sec_num = parseInt(this, 10);

    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    return (parseInt(hours.toString()) !== 0? hours+":" : "")+minutes+":"+seconds;
};

Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }

    return this;
};

Math.randint = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

