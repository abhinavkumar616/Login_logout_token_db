const mongoose=require("mongoose")

const LogoutSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    password:{
        type:String
    },
    username:{
        type:String
    },
    tokens:{
        type:String
    }
})

const Logout=new mongoose.model("Logout",LogoutSchema)
module.exports=Logout