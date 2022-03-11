const cors = require('cors');
const express = require("express");
const res = require('express/lib/response');
const app = express();
const stripe = require('stripe')("sk_test_51Kc2FWCxOg6ThvoBDGyHhJzGXZfl5DMLAtckvi6Ze6RweFyOVv4GElZwGLkpn9QFb0Ink1auO505mbMCJvGjZL8A00LonkTcC2");
const {v1} = require('uuid');

app.use(express.json());  // isko remove karke check krna h baad me 
app.use(cors())


app.post("/payment",(req,res)=>{
  const {product,token} = req.body;
  const idempotency =  v1();
  return stripe.customers.create({
    email:token.email,
    source : token.id
  })
  .then(customer => {
    stripe.charge.create({
      amount:product.price*100,
      currency : 'usd',
      customer:customer.id,
      receipt_email:token.email,
      description:`purchase of ${product.name}`,
      shipping : {
        name:token.card.name,
        address:{
          country:token.card.address_country
        }
      }
    },idempotency)
  })
  .then(result=>res.status(200).json({result})) 
  .catch(err=>res.json({err}))
})

app.listen(3000,()=>{
  console.log("Port listening at 3000");
});

