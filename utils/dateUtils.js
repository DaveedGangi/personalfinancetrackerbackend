
function getStartOfDay(){
    let now=new Date();
    return new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0);

    
}

function getEndOfDay(){
    let now=new Date();
    return new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,59);
}

function getStartOfMonth(){

    let now=new Date();
    return new Date(now.getFullYear(),now.getMonth(),1,0,0,0);
}

function isLastDayOfMonth(){
    let today=new Date();
    let tomorrow=new Date(today);
    tomorrow.setDate(today.getDate()+1);
    return tomorrow.getDate()===1;


}

module.exports={getStartOfDay,getEndOfDay,getStartOfMonth,isLastDayOfMonth};