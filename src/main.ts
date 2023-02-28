import fetch from "node-fetch";
import dotenv from "dotenv";
import record from "../record.config";
dotenv.config();

let MY_IP: string;

async function getMyIp() {
  let response = await fetch("https://cloudflare.com/cdn-cgi/trace?format=json");

  let data = await response.text();

  let obj = data.trim().split("\n").reduce((acc: { [key: string]: string }, curr) => {
    let [key, value] = curr.split('=');
    acc[key] = value;
    return acc;
  }, {});

  return obj["ip"];
}

async function updateDns(type: string, id: string, name: string, content: string, proxied: boolean = true) {
  let headersList = {
    "Authorization": `Bearer ${process.env.API_TOKEN as string}`,
    "Content-Type": "application/json"
  }

  let bodyContent = JSON.stringify({
    "type": type,
    "content": content,
    "name": name,
    "ttl": 1,
    "proxied": proxied
  });

  let response = await fetch(
  `https://api.cloudflare.com/client/v4/zones/${process.env.ZONE_ID as string}/dns_records/${id}`, {
    method: "PUT",
    body: bodyContent,
    headers: headersList
  });

  console.log(await response.text());
}

async function firstPoll() {
  MY_IP = await getMyIp();
  record.forEach((item) => {
    updateDns(item.type, item.id, item.cname, MY_IP, item.proxy);
  })
}

firstPoll();

setInterval(async () => {
  try {
    let new_ip = await getMyIp();
    if (MY_IP != new_ip) {
      MY_IP = new_ip;
      record.forEach((item) => {
        updateDns(item.type, item.id, item.cname, MY_IP, item.proxy);
      })
    }
  } catch (e) {
    console.error(e);
  }
}, 1000 * 60 * 60 * 1);