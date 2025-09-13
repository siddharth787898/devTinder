const mongoose = require('mongoose');
const User = require('./user');
// const { schema } = require('./user')
// const { type } = require('express/lib/response')

const connectionRequestSchema = mongoose.Schema({

fromUserId:{
  type:mongoose.Schema.Types.ObjectId,
  required:true,
  ref:"User"
},
toUserId:{
  type:mongoose.Schema.Types.ObjectId,
  required:true,
  ref:"User"
},
status: {
  type: String,
  enum: {
    values: ["ignored", "interested", "accepted", "rejected"], // 👈 array goes in "values"
    message: `{VALUE} is not a valid status type`              // 👈 uppercase VALUE is correct
  },
  required: true
},
},

{ timestamps: true }
);
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("CAN'T SEND THE CONNECTION TO YOURSELF");
  }
  next();
});

const connectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema   // ✅ fixed name here too
);

module.exports = connectionRequestModel;
