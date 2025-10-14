import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// LinkedIn OAuth login
router.get('/linkedin', passport.authenticate('linkedin'));

// LinkedIn OAuth callback
router.get(
  '/linkedin/callback',
  (req, res, next) => {
    passport.authenticate('linkedin', (err, user, info) => {
      if (err) {
        console.error('❌ LinkedIn OAuth Error:', err);
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/failure?error=${encodeURIComponent(err.message || 'authentication_failed')}`
        );
      }

      if (!user) {
        console.error('❌ LinkedIn OAuth Failed: No user returned', info);
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/failure?error=no_user&error_description=${encodeURIComponent(info?.message || 'Authentication failed')}`
        );
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('❌ Login Error:', loginErr);
          return res.redirect(
            `${process.env.FRONTEND_URL}/auth/failure?error=login_failed`
          );
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, linkedinId: user.linkedinId },
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
        );

        console.log('✅ LinkedIn OAuth Success:', {
          userId: user._id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`
        });

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
      });
    })(req, res, next);
  }
);

// Auth failure
router.get('/failure', (req, res) => {
  console.error('❌ Auth failure route hit');
  res.redirect(`${process.env.FRONTEND_URL}/auth/failure`);
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await req.app.locals.User.findById(decoded.userId).select('-accessToken -refreshToken');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        linkedinId: user.linkedinId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        headline: user.headline,
      },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

export default router;
