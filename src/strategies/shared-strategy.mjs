import passport from 'passport';
import { User } from '../mongoose/schemas/user.mjs';
import { DiscordUser } from '../mongoose/schemas/discord-user.mjs';

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const findUser =
			(await User.findById(id)) || (await DiscordUser.findById(id));
		if (!findUser) throw new Error('User Not Found');
		done(null, findUser);
	} catch (err) {
		done(err, null);
	}
});
