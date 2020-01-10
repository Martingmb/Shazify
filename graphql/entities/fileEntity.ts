import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";
import { ObjectID } from "mongodb";

@ObjectType()
export class File {
    @Field(() => ID)
    readonly _id: ObjectID;

    @Field(() => String)
    @Property({required: true})
    fileName: string;

    @Field(() => String)
    @Property({required: true})
    fileURL: string;

    @Field(() => String)
    @Property({required: true})
    mimetype: string;

    @Field(() => String)
    @Property({required: false})
    encoding: string;

}

@ObjectType()
export class imageFile extends File {
    @Field(() => String)
    @Property({required: true})
    fileTBURL: string;
}


export const fileModel = getModelForClass(File);
export const fileImageModel = getModelForClass(imageFile);