
const genOtp = (num)=>{
    const length = num;
    let otp = ''
    for(x = 0; x < length; x++){
        otp += Math.floor(Math.random(0) * 9);
    }
    return otp
}

module.exports = genOtp