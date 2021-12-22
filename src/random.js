const random =()=>{
    let sum = 0
    for(let i = 0; i < 6e9;i++){
        sum+=i
    }
    return sum
}

process.on("message",(message)=>{
    if(message === "start"){
        let sum = random()
        process.send(sum)
    }else{
        console.log("no se ha iniciado el proceso")
    }
})