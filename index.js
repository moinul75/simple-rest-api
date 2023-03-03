const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const shortid = require("shortid");
const fs = require("fs/promises")
const PORT = 4000;
const path = require('path')
const dblocation = path.resolve('src','data.json');

//use morgan cors json 
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

/**
 * Player Microservice 
 * CRUD - Create Read Updata Delete 
 * GET - / -find all player 
 * POST -/ - Create a player and save into the database 
 * GET  -/:id - find a single player 
 * PUT -/:id   - update or create player 
 * PATCH -/:id  - Update a player 
 * DELETE  -/:id  - DELETE a plyer from Database 
*/

//create a player 
app.post('/',async(req,res)=>{
    //name, country , rank, id 
   

   try {
    const player = {
        ...req.body,
        id: shortid.generate(),

    };
    
    const data = await fs.readFile(dblocation);
    const players = JSON.parse(data)
    players.push(player)
    
    await fs.writeFile(dblocation,JSON.stringify(players))
    res.status(201).json(player)

    
   } catch (error) {
    res.status(404).json({status:error.message})

    
   }
    
    
    
});

//find a player 
app.get('/', async(req,res)=>{
    try {
        const data = await fs.readFile(dblocation);
        const players = JSON.parse(data);
        res.status(202).json(players);
    
        
    } catch (error) {
        res.status(500).json({status:error.message})
        
    }

});

//find a single player
app.get("/:id",async(req,res)=>{
    //get the id 
  try {
    const id = req.params.id;
    const data = await fs.readFile(dblocation);
    const players = JSON.parse(data)
    const user =  players.find((item)=>item.id === id)
    
    //if the id was not valid 
    if(!user){
        res.status(404).json({status:`Player is not found by this ${id}`})
    }
    res.status(202).json(user)

    
  } catch (error) {
    res.status(500).json({status:error.message})
    
  }

})

//update a user using PATCH Method 
app.patch('/:id',async(req,res)=>{
  try {
    const id = req.params.id;
    const data = await fs.readFile(dblocation);
    const players = JSON.parse(data)
    const player = players.find((item)=>item.id === id)
    
    //if the id was not valid 
    if(!player){
        res.status(404).json({status:`Player is not found by this ${id}`})
    }

    //update the user
    player.name = req.body.name || player.name
    player.country = req.body.country || player.country
    player.rank = req.body.rank || player.rank 
    //set the data to the user by write the file 
    await fs.writeFile(dblocation,JSON.stringify(players))
    res.status(203).json(player)
    
  } catch (error) {
    res.status(500).json({status:error.message})
    
  }

})

//get update by using UPDATE 
app.put('/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        const data = await fs.readFile(dblocation)
        const players = JSON.parse(data)
        let player =players.find((item)=> item.id === id)
      if(!player){
        player = {
          ...req.body,
          id: shortid.generate()
        }

      }else{
        player.name = req.body.name || player.name
        player.country = req.body.country || player.country
        player.rank = req.body.rank || player.rank
      }
      await fs.writeFile(dblocation,JSON.stringify(players))
      res.status(202).json(player)


        
    } catch (error) {
        res.status(500).json(error.message);
        
    }

});

//DELETE 
app.delete('/:id',async(req,res)=>{
  try {
    const id = req.params.id;
    const data = await fs.readFile(dblocation)
    const players = JSON.parse(data)
    let player = players.find((item)=> item.id === id)
    
    if(!player){
      res.status(203).json({status:"Player is not found"});
    }
    //all the user except serch user 
    const newPlayer = players.filter(item => item.id !== id );
    await fs.writeFile(dblocation,JSON.stringify(newPlayer))
    res.status(201).json({status:"Player Deleted Successfully!!"})
    
  } catch (error) {
    res.status(500).json({status:error.message})
    
  }

});








//app listen 
app.listen(PORT,(req,res)=>{
    console.log(`server is running on port http://localhost:${PORT}`)
});
