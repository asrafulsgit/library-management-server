import mongoose from 'mongoose';



const mongoDbConnect =() =>{
    return  mongoose.connect(`${process.env.MONGO_DB_URL}`).then(()=>{
        console.log('✅ DB is connected');
    }).catch((err : any)=>{
        console.log('❌ DB connection failed:', err)
        throw err;
    })
};

export default mongoDbConnect;