var mongoose = require ('mongoose'),
    userSchema, userModel;

userSchema = {
  local: {
    email: String,
    password: String
  },
  facebook : {
    id: String,
    token: String,
    displayName: String
  }
};

userModel = mongoose.model ('users', userSchema);
