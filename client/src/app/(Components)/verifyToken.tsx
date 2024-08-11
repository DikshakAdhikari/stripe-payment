import { BASE_URL } from "./base";

export const verifyToken = async ()=> {
    try{

    
    const token= localStorage.getItem('token')
    if(token){
        const res= await fetch(`${BASE_URL}/user/validateToken`, {
            headers:{
                'Content-Type':'application/json',
                'authorization': token
            }
        });
        if(!res.ok){
            throw new Error("network problem")
        }

        const data= await res.json()
        console.log(data);
        
    }else{
        localStorage.removeItem("token")
    }
}catch(err){
    // console.log(err);
    alert("Invalid Token!")
    localStorage.removeItem("token")
    
}
}