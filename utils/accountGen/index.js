const generateAccountNumber = async  (num)=>{
    const length = num;
    const startingNumber =  4;
    
   const accountNumberPromise = await new Promise((resolve, reject)=>{
       let numbers = `${startingNumber}`;
       for( x = numbers.length; x < length ; x++){
        const number  = Math.floor(Math.random(0) * 9);
        numbers+= number;
        numbers.length === length && resolve(numbers)
       }
   });
   return accountNumberPromise
}
module.exports =  generateAccountNumber