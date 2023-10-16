# Cloudflare-DnsRecord-AutoUpdate
A tool use to update dns record on cloudflare to point to your ip useful for those who doesn't have static ipv4 like me.

## Note
I have just discover about [Cloudflare Zero Trust](https://developers.cloudflare.com/cloudflare-one/) and [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) recommend using that instead of this project.

## Installation

rename [.env.example](/.env.example) -> .env\
add your ZONE_ID and API_TOKEN from cloudflare api

edit [record.config.ts](/record.config.ts)

edit interval time in [main.ts](/src/main.ts#L85) to value you like

## Usage
```
yarn dev
```

```
yarn build
yarn start
```
