import FormData from "form-data";
import fetch from "node-fetch";
import path from "path";
import fs from "fs";

const basePath = process.cwd();
const files = fs.readdirSync(`${basePath}/output/webp`);

const BOOKNAME = "Craft your world: Create a life worth living through entrepreneurship";
const BOOKDESC = "You don't have to change the world. You just have to change your world.\nThis book provides you with one of the key ways that you can craft your world: entrepreneurship.\nThrough entrepreneurship, you can shape your professional life, your financial future, and who you will interact with on a regular basis. Rather than feeling stuck, you can take charge of your life and craft a world that you can find success in.\nThrough entrepreneurship, you can create an opportunity to do what you love.";


const icons = ["Paper Plane", "Formular1", "Jet", "Cessna", "Rocket"];
const bgColors = ["Aureolin", "Melon", "Pale Azure","Tea Rose", "Tea Green"];
const backdrops = ["None", "Hong Kong 1", "Hong Kong 2", "Washington DC", "World", "Wave", "Arrow"];
const signatures = ["None", "Know Yourself", "Do what you love"];

function parseFilename(filename){
  let parts = filename.split('-');
  const icon = icons[Number(parts[2])];
  const bgColor = bgColors[Number(parts[3])];
  const backdrop = backdrops[Number(parts[4])];
  const signature = signatures[Number(parts[5])];
 return {icon, bgColor, backdrop, signature};
}

async function runUpload() {
  for (const file of files) {
    const formData = new FormData();
    const fileStream = fs.createReadStream(`${basePath}/output/webp/${file}`);
    formData.append("file", fileStream);

    console.log("Trying to upload: "+file);
    const apiKey = process.env.NFTPORT_API;
    console.log("API KEY "+apiKey);

    let url = "https://api.nftport.xyz/v0/files";
    let options = {
      method: "POST",
      headers: {
        Authorization: apiKey,
      },
      body: formData,
    };

    const data = await fetch(url, options)
      .then((res) => res.json())
      .catch((err) => console.error("error:" + err));

    if (data.file_name === ".DS_Store") continue;
    

    const fileName = file.replace('.webp','');
    console.log("FileName = "+fileName);
    let {icon, bgColor, backdrop, signature} = parseFilename(fileName);
    let metaData = {
      name: BOOKNAME,
      description: BOOKDESC,
      fileName:fileName,
      ipfs_hash:data.ipfs_url,
      attributes: {
        icon:icon,
        bgColor:bgColor,
        backdrop:backdrop,
        signature:signature
      }
    }

    //write into json
    fs.writeFileSync(
      `${basePath}/output/json/${fileName}.json`,
      JSON.stringify(metaData, null, 2)
    );

    console.log(
     // `${data.file_name} uploaded to ipfs & ${fileName}.json updated!`
    );
  }
}

runUpload();