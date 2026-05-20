import type { GoogleAPIResponse } from '../../shared/types/api';

type Env = {
	GOOGLE_FONTS_API_KEY: string;
};

const CACHE_TTL = 24 * 60 * 60;

export default {
	async fetch(_request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// const URL = `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${(env as Env).GOOGLE_FONTS_API_KEY}`;
		const URL = `https://www.googleapis.com/webfonts/v1/webfonts?&key=${(env as Env).GOOGLE_FONTS_API_KEY}`;
		const cache = caches.default;

		const cached = await cache.match(URL);
		if (cached) {
			return cached;
		}
		const response = await fetch(URL);
		const data: GoogleAPIResponse = await response.json();
		const fontData = data.items.map(({ family, variants, files, menu }) => ({ family, variants, files, menu }));

		const newResponse = Response.json(fontData, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Cache-Control': `public, max-age=${CACHE_TTL}`,
			},
		});

		ctx.waitUntil(cache.put(URL, newResponse.clone()));

		return newResponse;
	},
} satisfies ExportedHandler<Env>;
