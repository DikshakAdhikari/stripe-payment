
export const verifyToken = async ()=> {
    try{

    
    const token= localStorage.getItem('token')
    if(token){
        const res= await fetch('http://localhost:3002/user/validateToken', {
            headers:{
                'Content-Type':'application/json',
                'authorization': token
            }
        });
        if(!res.ok){
            throw new Error("network problem")
        }

        const data= await res.json()
    }else{
        localStorage.clear()
    }
}catch(err){
    // console.log(err);
    localStorage.clear()
    
}
}