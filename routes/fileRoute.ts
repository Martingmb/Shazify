import { songModel } from './../graphql/entities/songEntity';
import { songPath } from './../data/dataPath';
import { fileImageModel } from './../graphql/entities/fileEntity';
import { imagePath } from '../data/dataPath';
import { Router } from "express";
import multer from 'multer';
import Formidable from "formidable";
import Jimp from 'jimp';
import { writeFile, createReadStream, statSync } from 'fs';

const router = Router();
const upload = multer();

router.post('/image', (request, response) => {

    let formidable = new Formidable.IncomingForm();
    let thumbnailPath: string;
    let filePath: string;

    formidable.parse(request, (err) => {
        if(err) throw Error(err);
    });

    formidable.on('fileBegin', (_, file) => {
        file.path = imagePath + file.name;
        filePath = file.path;
        thumbnailPath = imagePath + '[tb]' + file.name;
    });

    formidable.on('file', async (_, file) => {
        
        let mime: string = file.name.split('.')[1];

        let fileDoc = new fileImageModel({
            fileName: file.name,
            fileURL: file.path,
            fileTBURL: thumbnailPath,
            mimetype: mime
        });

        let doc = await fileImageModel.find({fileURL: file.path});

        if(doc.length == 0) {
            await fileDoc.save();
        }
    });

    formidable.on('end', async() => {
        Jimp.read(filePath, (err, thumbnail) => {
            if(err) console.error(err);

            thumbnail.resize(300, 300)
            .quality(100)
            .write(thumbnailPath);

        });
    });

    response.sendStatus(201);
});

router.post('/uploadSong', upload.any(), async (request, response) => {

    //@ts-ignore
    writeFile(songPath + request.body.songName.replace(/\s/g, "") + '.mp3', request.files[0] , () => {});

    let song = new songModel({
        fileName: request.body.songName.replace(/\s/g, ""),
        fileURL: songPath + request.body.songName + '.mp3',
        mimetype: request.body.mime,
        songArtist: request.body.artist,
        songAlbum: request.body.album,
        songDuration: request.body.duration,
        songNumber: request.body.songNumber
    });

    await song.save();


    response.sendStatus(201);
});

router.get('/getimage/:name', (request, response) => {
    const file = "/Users/martin/Desktop/Nodejs projects/graphqlMongoTest/data/image/[tb]" + request.params.name;
    response.sendFile(file)
});

router.get('/getsong/:name', (request, response) => {
    console.log("\nREQUEST\n")
    const file = songPath + request.params.name;
    const stat = statSync(file);
    const fileSize = stat.size;
    const range = request.headers.range;
    console.log("File= ", file);
    console.log("Stat= ", stat);
    console.log("FileSize= ", fileSize);
    console.log("Range= ", range);
    if(range) {
        const parts = range.replace(/bytes=/, "").split("-");
        console.log("Parts= ", parts);
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;
        const song = createReadStream(file, {start: start, end: end});
        console.log({
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg',
        })
        response.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg',
        });
        song.pipe(response);
    } else {
        response.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mp3',
        });
        createReadStream(file).pipe(response);
    }
    
});


router.get('/getme/:name', (request, response) => {
    const file = songPath + request.params.name;
    console.log(file);
    response.sendFile(file, (err) => {
        if(err) console.error(err);
    });
});

export default router;