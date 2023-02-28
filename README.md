# Cloudflare-DnsRecord-AutoUpdate
A tool use to update dns record on cloudflare to point to your ip useful for those who doesn't have static ipv4 like me.

## Installation

rename [.env.example](/.env.example) -> .env\
add your ZONE_ID and API_TOKEN from cloudflare api

edit [record.config.ts](/record.config.ts)

edit interval time in [main.ts](/src/main.ts#L67) to value you like

## Usage
```
yarn dev
```

```
yarn build
yarn start
```