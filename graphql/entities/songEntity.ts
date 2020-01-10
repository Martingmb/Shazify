import { File } from './fileEntity';
import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class Song extends File {
    @Field(() => String)
    @Property({required: true})
    songArtist: String

    @Field(() => String)
    @Property({required: false})
    songAlbum: String

    @Field(() => String)
    @Property({required: false})
    songDuration: String

    @Field(() => Int)
    @Property({required: true})
    songNumber: Number
}


export const songModel = getModelForClass(Song);