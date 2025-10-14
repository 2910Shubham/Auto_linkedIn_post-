import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import dotenv from 'dotenv';
import axios from 'axios';
import User from '../models/User.js';

// Ensure environment variables are loaded
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Custom LinkedIn OpenID Connect Strategy
class LinkedInStrategy extends OAuth2Strategy {
  constructor(options, verify) {
    options.authorizationURL = options.authorizationURL || 'https://www.linkedin.com/oauth/v2/authorization';
    options.tokenURL = options.tokenURL || 'https://www.linkedin.com/oauth/v2/accessToken';
    options.scope = options.scope || ['openid', 'profile', 'email'];
    
    super(options, verify);
    this.name = 'linkedin';
    this._userProfileURL = 'https://api.linkedin.com/v2/userinfo';
  }

  userProfile(accessToken, done) {
    axios.get(this._userProfileURL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })
    .then(response => {
      const profile = response.data;
      done(null, profile);
    })
    .catch(error => {
      done(error);
    });
  }
}

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ['openid', 'profile', 'email', 'w_member_social'],
      state: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('🔐 LinkedIn OAuth Callback - Profile received:', profile);
      
      try {
        // Extract user information from LinkedIn OpenID Connect profile
        const email = profile.email || null;
        const firstName = profile.given_name || '';
        const lastName = profile.family_name || '';
        const profilePicture = profile.picture || null;

        // Find or create user using 'sub' as the LinkedIn ID
        let user = await User.findOne({ linkedinId: profile.sub });

        if (user) {
          // Update existing user
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          user.lastLogin = new Date();
          user.email = email || user.email;
          user.firstName = firstName || user.firstName;
          user.lastName = lastName || user.lastName;
          user.profilePicture = profilePicture || user.profilePicture;
          user.linkedinProfile = profile;
          await user.save();
          
          console.log('✅ Updated existing user:', user.email);
        } else {
          // Create new user
          user = await User.create({
            linkedinId: profile.sub,
            email: email,
            firstName: firstName,
            lastName: lastName,
            profilePicture: profilePicture,
            accessToken: accessToken,
            refreshToken: refreshToken,
            linkedinProfile: profile,
          });
          
          console.log('✅ Created new user:', user.email);
        }

        return done(null, user);
      } catch (error) {
        console.error('❌ Error in LinkedIn OAuth callback:', error);
        return done(error, null);
      }
    }
  )
);

export default passport;
