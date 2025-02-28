export function commonResponse(res,status,message,data=null,error=null){
    return res.status(status).json({message,data,error});
}