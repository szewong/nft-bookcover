import { parse } from "json2csv";
import fs from "fs";
const basePath = process.cwd();

const s3BaseURL = "https://craftyourworld-book-nft.s3.amazonaws.com/webp";
const readDir = `${basePath}/output/json`;
let files = fs.readdirSync(readDir);

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }


function formatIndex(index) {
  if (index < 10) {
    return `000${index}`;
  }
  if (index < 100) {
    return `00${index}`;
  }
  if (index < 1000) {
    return `0${index}`;
  }
  return index;
}


let data = [];
for (const file of files){
    if (file === "_metadata.csv" || file === ".DS_Store") {
        continue;
      }
      const rawData = fs.readFileSync(`${readDir}/${file}`);
      const converted = JSON.parse(rawData);
      data.push({
//            image: converted.ipfs_hash,
              image: `${s3BaseURL}/${converted.fileName}.webp`,
            fileName: converted.fileName,
            metadata: converted,
      });
  
}


//ShuffleArray data destructively.
shuffleArray(data);


const populatedMeta = data.map((item, index) => {

  //Generate token URI
  let tokenURI = {};
  tokenURI.image = `${s3BaseURL}/${item.fileName}.webp`
      //write into json
      fs.writeFileSync(
        `${basePath}/output/token/${index}.json`,
        JSON.stringify(tokenURI, null, 2)
      );

  
  return {
    nftId: `craftyourworld-${formatIndex(index)}`,
    uri: `${s3BaseURL}/${index}.json`,
    image: item.image,
    metadata: {
      ...item.metadata,
      description: `#${formatIndex(index)}`,
    },
  };
});

const csv = parse(populatedMeta);

fs.writeFileSync(`${basePath}/output/json/_metadata.csv`, csv);