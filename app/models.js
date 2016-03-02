var mongoose = require ('mongoose'),
    userSchema, userModel,
    meetingSchema, meetingModel;

userSchema = {
  local: { email: String, password: String },
  facebook : { id: String, token: String, displayName: String },
  upcomingMeetings: { type: Array },
  invitations: { type: Array },
  createdMeetings: { type: Array }
};

meetingSchema = {
  creator: { type: String },
  members: { type: Array },
  freeSlots: { type: Object },
  venue: { type: String },
  duration: { type: Number },
  agenda: { type: String },
  description: { type: String },
  date: { type: Date }
};

userModel = mongoose.model ('users', userSchema);
meetingModel = mongoose.model ('meetings', meetingSchema);
