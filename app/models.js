var mongoose = require ('mongoose'),
    userSchema, userModel,
    meetingSchema, meetingModel;

userSchema = new mongoose.Schema ({
  local: { email: String, password: String },
  facebook : { id: String, token: String, displayName: String },
  upcomingMeetings: { type: Array },
  invitations: { type: Array },
  createdMeetings: { type: Array }
});

meetingSchema = new mongoose.Schema ({
  creator: { type: String },
  members: { type: Array },
  freeSlots: { type: Object },  //slots marked free by all the members of this meeting: Object Key=User _id, Object value=Slot information
  venue: { type: String },
  duration: { type: Number }, //in minutes
  agenda: { type: String },
  description: { type: String },
  date: { type: Date }
});

userModel = mongoose.model ('users', userSchema, 'users');
meetingModel = mongoose.model ('meetings', meetingSchema, 'meetings');
