import { Song, songModel } from './../entities/songEntity';
import { imageFile, fileImageModel } from './../entities/fileEntity';
import { Resolver, Query, Arg, Mutation, InputType, Field } from "type-graphql";
import { File, fileModel } from "../entities/fileEntity";
import { unlink } from "fs";


@InputType() 
class fileInput {
    @Field()
    fileName!: string;

    @Field()
    fileURL!: string;

    @Field()
    fileTB: string;
    
    @Field()
    mimetype!: string;

    @Field()
    encoding!: string;
}

@Resolver()
export class fileResolver {
    @Mutation(() => File) 
    async saveFile(@Arg("fileData", () => fileInput) fileData: fileInput) {
        let file = new fileModel(fileData);

        await file.save();

        console.log(file);

        return file;

    }

    @Mutation(() => String)
    async deleteFile(@Arg("fileName", () => String) fileName: String) {
        await fileImageModel.findOneAndDelete({fileName: fileName}, (err, doc) => {
            if(err) {
                return "There was an error couldn't delete " + fileName;
            }

            unlink(doc.fileURL, (err) => {
                if (err) {
                    console.error(err);
                    return
                }
            });

            unlink(doc.fileTBURL, (err) => {
                if(err) {
                    console.error(err);
                    return
                }
            })

            return 0;
        });

        return `Successfully deleted the file: ${fileName}`;
    }

    @Query(() => [File], {nullable: true})
    async Files() {
        let files = fileModel.find();

        return files;
    }

    @Query(() => [imageFile], {nullable: true})
    async Images() {
        let images = fileImageModel.find();
        return images;
    }

    @Query(() => [Song], {nullable: true})
    async SongFromArtist(@Arg("artist", () => String) artist: String) {
        let song = await songModel.find({songArtist: artist});
        return song;
    }

    @Query(() => [Song], {nullable: true})
    async Songs() {
        let songs = await songModel.find();
        return songs;
    }

    @Mutation(() => String) 
    async deleteSong(@Arg("songName", () => String) songName: string) {
        await songModel.findOneAndDelete({fileName: songName}, (err, doc) => {
            if(err) console.error(err);

            unlink(doc.fileURL, (err) => {
                if (err) {
                    console.error(err);
                    return
                }
            });

            return 0;
        });

        return `Successfully deleted the file: ${songName}`;
    }
}