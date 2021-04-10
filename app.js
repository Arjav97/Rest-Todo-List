import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongodb from 'mongodb';
const app=express();
const assert=require('assert');

var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydb',function(error){
   if(error) console.log(error);
});

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var schema=new mongoose.Schema({"_id":String,"text":String,"isCompleted":Boolean,"description":String});
var list=mongoose.model('Todo',schema);  //It appends 's in the behind


app.get('/api/v1/todos',(req,res)=>{
      list.find({},{"__v":0},(err,docs)=>{
          if(err) console.log(err);

        res.status(200).send({
            success:'true',
            message:'todos retreived successfully',
            todos:docs
        }); 
        });
      });
     


app.get('/api/v1/todos/:id',(req,res)=>{
    
    list.findOne({"_id":req.params.id},(err,doc)=>{
        if(err) console.log(err);
       
        res.status(200).send({
            success:'true',
            message:'todo retreived successfully',
            todos:doc
         });
      });
});

app.post('/api/v1/todos',(req,res)=>{
    if(!req.body._id){
        return res.status(400).send({
            success:'false',
            message:'id is required'
        });
    }
   else if(!req.body.text){
     return res.status(400).send({
            success:'false',
            message:'text is required'
        });
    }
        new list({
            _id:req.body._id,
            text:req.body.text,
            isCompleted:req.body.isCompleted,
            description:req.body.description
            }).save((err,doc)=>{
                if(err) console.log(err);
                else
                {
                    res.status(200).send({
                        success:'true',
                        message:'Added Successfully',
                        todos:doc
                    });
                }
            })
    });

app.delete('/api/v1/todos/:id',(req,res)=>{

    var id=req.params.id;
    list.findByIdAndDelete(id,(error,doc)=>{
        if(error)
        {
            return res.status(404).send({
                success:'false',
                message:'todo not found'
            });
        }
        else
        {   
            return res.status(200).send({
                success:'true',
                message:'Todo deleted successfully'
            });
        }
    });
});

app.put('/api/v1/todos/:id',(req,res)=>{

    var id=req.params.id;
    list.findByIdAndUpdate(id,{$set:{isCompleted:req.body.isCompleted,description:req.body.description}
    },(err,doc)=>{
        if(err){
            console.log(err);
            res.status(404).send(err);
        }
        else
        {
            res.status(200).send({
                success:'true',
                message:'Todo updated successfully'
            });
        }
    });

});

const PORT=5000
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})