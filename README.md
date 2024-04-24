# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/guides/vite) for details on supported features.

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

-   `build/server`
-   `build/client`

## Bug report

Hi everyone,

I deployed a Remix + Vite site using AWS AppRunner with a Dockerfile. My issue is that I get a 404 error on every page other than my project's `_index` page.

**Investigation**

When I click a Link on my index page that navigates to `/signin` I can observe the following:

1. I get a console warning: `"No routes matched location "/signin"` and then a 404 error `'Error: No route matches URL "/signin"'`.
   -> Double checked the spelling. There is a file called `signin.tsx` in my routes folder
2. In the Network tab I can see that when hitting a route (for example `/signin`) the HTML file loads, then the JS files and CSS loads.
   -> I don't see the JSON data from the `loader`.

**Reproduction Steps**

I don't expect anyone to set up an AppRunner or any other kind of container based service to reproduce this. But theoretically here is all that is needed:

1. Create a remix app with the latest template: `pnpm create remix --template remix-run/remix/templates/express bug-reproduction`
2. Add the following `Dockerfile`:

```dockerfile
FROM node:20-slim AS base
COPY . /app
WORKDIR /app
RUN npm install -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
EXPOSE  8080
CMD [ "pnpm", "start" ]
```

3. And `.dockerignore`:

```
node_modules
.git
.gitignore
*.md
build
```

4. Set environment variables: `PORT=8080` and `NODE_ENV=production`
5. Add a sample route: `sample.tsx` in `routes` and add a `loader` and component.
6. Add a `Link` in `_index.tsx` to navigate to `/sample`
7. Deploy and click the Link
