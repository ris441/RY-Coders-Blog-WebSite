exports.curr_date = function(){

    const options = {
        // weekday:"long",
        day:"numeric",
        month: "short",
        year:"numeric"
    }
    const today = new Date();
    // console.log(today.toLocaleDateString("hi-IN",options))
    // console.log(today.toLocaleDateString("en-US",options))
   return  today.toLocaleDateString("en-US",options);

}
