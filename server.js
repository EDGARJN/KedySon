const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

var app = express();

// Initialize Of Service
app.use(express.static("Pages"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// Initialize the EJS engine
app.set("view engine", "ejs");


var db = mysql.createConnection({
host:"127.0.0.1",
user:"edceo",
password:"edbiser01?",
database:"KedySon"
});

db.connect((err)=>{
    if(!err){
        console.log("Database Connected...");
    }else throw err;
});


app.get('/',(req,res)=>{
    res.render(__dirname+"/Pages/Authentication/register",{name:"KedySon"});
});

// API for inserting user's infos....

app.post("/test",(req,res)=>{
    var u_name = req.body.u_name;
    var password = req.body.password;

    db.query("INSERT INTO test(password,username) VALUES(?,?)",[u_name,password],(err)=>{
        if(!err){
            console.log("Inserted" + " " + u_name);
            res.render(__dirname+"/Pages/home",{u_name})
        }else{
            console.log("Mhh Mhh");
        }
    });
});


// API for inserting user lovers
app.post('/crush',(req,res)=>{
    var me = req.body.me;
    var myLo = req.body.myLove;
    var total = me.length+myLo.length;
    var LoPercent = (me.length/total)*100+"%";
    db.query("INSERT INTO Lovers(myName,myCrush,time,percent) VALUES(?,?,now(),?)",[me,myLo,LoPercent],(err)=>{
        if(!err){
            console.log("Woow.. You have " + LoPercent);
            res.redirect("/ans")
        }else throw err;
    })
});


// API for reading user crushes
app.get("/ans",(req,res)=>{
    db.query("SELECT id, myName,myCrush,percent from Lovers",(err,result)=>{
        var data = [];
        for(var i = 0; i<result.length; i++){
            var id = result[i].id;
            var me = result[i].myName;
            var crush = result[i].myCrush
            var percent = result[i].percent;

            data.push({"me":me, "crush":crush, "id":id, "percent":percent});
        }

        res.render(__dirname+"/Pages/listOfCrush",{"data":data, "percent":percent,"me":me, "crush":crush,});
    });
});


// API for editing
app.get("/edit/:meId",(req,res)=>{
    var id = req.params.meId;
    db.query("SELECT id,myName,myCrush FROM Lovers where id=?",[id],(err,result)=>{
        if(!err){
            var me = result[0].myName;
            var crush = result[0].myCrush;
            var ide = result[0].id;
            res.render(__dirname+"/Pages/update",{"me":me, "crush":crush, "ide":ide});
        }else throw err;
    });
});

// API for inserting What You Edit...

app.post("/update",(req,res)=>{
    var id = req.body.meId;
    var me = req.body.me;
    var myCrush = req.body.MyCrush;
    var crushcent = myCrush.length+me.length;
    newCent = (me.length/crushcent)*100+"%";
    db.query("UPDATE Lovers SET myName = ?, myCrush = ?,percent=? WHERE id=?",[me,myCrush,newCent,id],(err)=>{
        if(!err){
            console.log("Yaah");
            res.redirect("/ans")
        }else throw err;
    });
});

// API for deleting data in list Of Crushes
app.get("/delete/:delId",(req,res)=>{
    var id = req.params.delId;
    db.query("SELECT myName,myCrush from Lovers where id=?",[id],(err,result)=>{
        if(!err){
            var me = result[0].myName;
            var crush = result[0].myCrush;
            console.log(me + " " + crush);

            db.query("INSERT INTO trash(trashMe,trashCrush, time) VALUES(?,?,now())",[me,crush],(err)=>{
                if(!err){
                    console.log("CodeIsFun");

                    db.query("DELETE FROM Lovers where id=?",[id],(err)=>{
                        if(!err){
                            console.log("Deleted");
                            res.redirect("/ans")
                        }
                    });
                }else throw err;
            });
        }else throw err;
    });
});


// PORT FOR PULL % PUSH DATa...
app.listen(2550);

// Codes by EDGAR