import fetch from "node-fetch";
import dotenv from "dotenv";
import record from "../record.config";
dotenv.config();

let MY_IP: string;

async function getMyIp() {
  const response = await fetch(
    "https://cloudflare.com/cdn-cgi/trace?format=json",
  );

  const data = await response.text();

  const obj = data
    .trim()
    .split("\n")
    .reduce((acc: Record<string, string>, curr) => {
      const [key, value] = curr.split("=");
      acc[key] = value;
      return acc;
      // eslint-disable-next-line object-curly-newline
    }, {});

  return obj.ip;
}

async function updateDns(
  type: string,
  id: string,
  name: string,
  content: string,
  proxied = true,
) {
  const headersList = {
    Authorization: `Bearer ${process.env.API_TOKEN!}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify({
    type: type,
    content: content,
    name: name,
    ttl: 1,
    proxied: proxied,
  });

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${process.env
      .ZONE_ID!}/dns_records/${id}`,
    {
      method: "PUT",
      body: bodyContent,
      headers: headersList,
    },
  );

  console.log(await response.text());
}

async function firstPoll() {
  MY_IP = await getMyIp();
  record.forEach((item) => {
    void updateDns(item.type, item.id, item.cname, MY_IP, item.proxy);
  });
}

void firstPoll();

setInterval(
  () => {
    void (async () => {
      try {
        const newIp = await getMyIp();
        if (MY_IP !== newIp) {
          MY_IP = newIp;
          record.forEach((item) => {
            void updateDns(item.type, item.id, item.cname, MY_IP, item.proxy);
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  },
  1000 * 60 * 60 * 1,
);
