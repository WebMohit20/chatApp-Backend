import bcrypt from "bcryptjs";

export async function passwordChecker(password,hashPassword){
    
    return await bcrypt.compare(password,hashPassword);
}




