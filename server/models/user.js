var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: [true, "Email has already been registered"],
        required: [true, "Email address is required"],
        validate: {
            validator: function( email ) {
                var e = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return e.test( email );
            },
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
        }
    },
    name: {
        first: {
          type: String,
          required: [true, "You need to enter a first name"],
          trim: true,
        },
        last: {
          type: String,
          required: [true, "You need to enter a last name"],
          trim: true
        },
      },
    //   phone: {
    //     type: String,
    //     validate: [{
    //       validator: function( number ) {
    //         return /\d{3}-\d{3}-\d{4}/.test( number );
    //       },
    //       message: "{ VALUE } is not a valid phone number"
    //     },
    //     {
    //       validator: function( number ) {
    //         return false;
    //       },
    //       message: "{ VALUE } failed this validator"
    //     }
    //   ],
    //     required: [true, "Customer phone number required"]
    //   },
    //   gender: {
    //     type: String,
    //     enum: ['MALE', 'FEMALE'],
    //     uppercase: true,
    //     trim: true,
    //     default: "MALE"
    //   },
    //   age: {
    //     type: Number,
    //     min: [18, "Maybe you need to be a little older"],
    //     max: [85, "You might want to be enjoying your retirement rather than using this site"],
    //     required: true
    //   },
      pw: {
        type: String,
        required: [true, "Password cannot be blank!"],
        // minlength: 8,
        // maxlength: 32,
        // validate: {
        //   validator: function( value ) {
        //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test( value );
        //   },
        //   message: "Password failed validation, you must have at least 1 number, uppercase and special character"
        // }
      },
      confirm_pw: {
        type: String,
        required: [true, "Confirm Password cannot be blank!"],
      },
      birthday: {
        type: Date,
        required: [true, "Birthday cannot be blank!"],
        trim: true, 
      }
    //   pets: {
    //     type: [{
    //       type: Schema.Types.ObjectId,
    //       ref: "Pet"
    //     }],
    //     default: []
    //   }
      }, {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
   })

UserSchema.virtual( 'name.full' ).get( function () {
// return this.name.first + " " + this.name.last;
return `${ this.name.first } ${ this.name.last}`;
});

UserSchema.pre('validate', function(next){
    if (this.pw != this.confirm_pw){
        next(Error('Confirm Password must match Password'));
    } else {
        next();
    }
});

UserSchema.pre('save', function(next){
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('pw')) return next();
    
    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.pw, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.pw = hash;
            next();
        });
    });
})
// Set up method to compare password in database
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.pw, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', UserSchema);