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
    }
}catch(err){
     console.log(err);
     localStorage.removeItem("token")
    alert("Invalid Token!")
    
}
}