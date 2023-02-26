//Randomize files in an array


var fs = require('fs');
const fromPath = '../output/webp';
const toPath = '../output/tokens';
let files = fs.readdirSync(fromPath);



const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }


 shuffleArray(files);

 for (let i=0;i<files.length;i++){
  const f = fromPath+'/'+files[i];
  const t = toPath+'/'+(i+1)+'.webp';
  console.log(f+" "+t);
  fs.copyFile(f, t, (err) => {
    if (err) throw err;
  });
 }

