import passport from 'passport';
import Strategy from 'passport-discord';
import { DiscordUser } from '../mongoose/schemas/discord-user.mjs';

export default passport.use(
	new Strategy(
		{
			clientID: '1238464944207298560',
			clientSecret: process.env.DISCORD_OAUTH2_SECRET,
			callbackURL: 'http://localhost:3000/api/auth/passport/discord/redirect',
			scope: ['identify'],
		},
		async (accessToken, refreshToken, profile, done) => {
			let findUser;
			try {
				findUser = await DiscordUser.findOne({ discordId: profile.id });
			} catch (err) {
				return done(err, null);
			}
			try {
				if (!findUser) {
					const newUser = new DiscordUser({
						username: profile.username,
						discordId: profile.id,
					});
					const newSavedUser = await newUser.save();
					return done(null, newSavedUser);
				}
				return done(null, findUser);
			} catch (err) {
				return done(err, null);
			}
		}
	)
);
