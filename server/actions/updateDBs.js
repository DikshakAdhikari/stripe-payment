import files from "../models/files.js";
import orders from "../models/orders.js";
import user from "../models/user.js";

const updateDBs = async(session)=> {
    const updatedProduct = await orders.findOneAndUpdate(
        { paymentIntentId: session.id },
        { status: session.status },
        { new: true }
      );
  
      const filesUrls=[]
      await Promise.all(updatedProduct.products.map(async(val)=>{
        const fileData= await files.findOne({_id:val.fileId})
        filesUrls.push(fileData.file)
      }))
  
        const obj={
          orderId: updatedProduct.id,
          status: updatedProduct.status,
          products: updatedProduct.products,
        }
  
        const userData= await user.findOneAndUpdate({_id:session.metadata.userId}, {
          $push:{myOrders:obj}
        },{new:true})

        return filesUrls
}

export default updateDBs