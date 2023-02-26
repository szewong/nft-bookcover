import FormData from "form-data";
import fetch from "node-fetch";
import path from "path";
import fs from "fs";

const basePath = process.cwd()+'/eBook';
const files = fs.readdirSync(basePath);



async function runUpload() {
  for (const file of files) {
    if (file === ".DS_Store") continue;

    const formData = new FormData();
    const fileStream = fs.createReadStream(`${basePath}/${file}`);
    formData.append("file", fileStream);

    console.log("Trying to upload: "+file);

    //export NFTPORT_API=XXXX
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

    console.log(data);

    const fileName = file.replace('.webp','');
    console.log("FileName = "+fileName);
    console.log("IPFS ="+data.ipfs_url);
    }

}

runUpload();