
import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

  mongoose.connect("mongodb://localhost:27017/AnigenDB", {
 // mongoose.connect("mongodb+srv://umairafzal92:gearofwar1234@cluster0.kn9tbkm.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})


const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  avatarUrl: {
    type: String,
    default: ""
  },
  filename:{
    type: [String],
    default: ["default"]
  }
})
const User = new mongoose.model("User", userSchema)
//Routes
app.post("/login",(req,res)=>{
  const { email, password} = req.body
  console.log("Login");
  User.findOne({email:email},(err,user)=>{
    if(user){
      if(password===user.password){
        res.send({message:"LogIn successful",user:user})
      }
      else{
        res.send({message:"Password did not match",user:user})
      }
    }
    else{
      res.send({message:"User not found",user:user})
    }
  })
})

app.get("/TTS/:email/filenames", (req, res) => {
  const email = req.params.email;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ filenames: user.filename });
    } else {
      res.send({ message: "User not found" });
    }
  });
});

app.get("/WebGL/:email/avatarURL", (req, res) => {
  const email = req.params.email;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ avatarURL: user.avatarUrl });
    } else {
      res.send({ message: "User not found" });
    }
  });
});


app.post("/TTS/:email", (req, res) => {
  const email = req.params.email;
  console.log(req.body);
  const { filename } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      user.filename.push(filename);
      user.save((err) => {
        if (err) {
          console.log(err);
          res.send({ message: "Error updating user" });
        } else {
          res.send({ message: "Filename added successfully" });
        }
      });
    } else {
      res.send({ message: "User not found" });
    }
  });
});




app.post("/avatar", (req, res) => {

  const { email, avatarUrl } = req.body;
  console.log("Updating avatar for user with email:", email);
  console.log("New avatar URL:", avatarUrl);
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      user.avatarUrl = avatarUrl;
      user.save((err) => {
        if (err) {
          console.log(err);
          res.send({ message: "Error updating user" });
        } else {
          res.send({ message: "Avatar URL updated successfully" });
        }
      });
    } else {
      res.send({ message: "User not found" });
    }
  });
});


app.post("/r",(req,res)=>{
  const { name, email, password} = req.body
  User.findOne({email:email},(err,user)=>{
    if(user){
      res.send({message:"User already registered"})
    }
    else{
      const user = new User({
        name,
        email,
        password
      })
      user.save(err => {
        if(err){
          res.send(err)
        }
        else{
          res.send({message: "Successfully Registered"})
        }
      })
    }
  })

});


const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})
