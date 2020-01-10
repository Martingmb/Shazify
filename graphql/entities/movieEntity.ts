import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { ObjectType, Field, ID, Int } from "type-graphql";
import { ObjectID } from "mongodb";

@ObjectType()
export class Movie {
    @Field(() => ID)
    readonly _id: ObjectID;

    @Field(() => String)
    @Property({ required: true })
    title: string;

    @Field(() => String)
    @Property({ required: false })
    description: string;

    @Field(() => Int)
    @Property({ required: true })
    duration: number;

    @Field(() => String)
    @Property({required: false})
    imageURL: string;
}

export const MovieModel = getModelForClass(Movie);