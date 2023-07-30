import bcrypt from 'bcrypt'


export const HassPassword=async(password)=>{
    try{
        const saltRound=10
        const HassPassword=await bcrypt.hash(password,saltRound)
        return HassPassword
    }catch(error){
        console.log(error)
    }
}

export const comparePassword=async(password,HassPassword)=> {
    return bcrypt.compare(password,HassPassword)
}