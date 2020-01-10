import { Movie, MovieModel } from '../entities/movieEntity';
import { Resolver, Query, Arg, Mutation, InputType, Field, Int } from "type-graphql";

@InputType()
class MovieInput {
    @Field()
    title!: string;
     
    @Field()
    description!: string;

    @Field(() => Int)
    duration!: number;

    @Field()
    imageURL: string;
}

@Resolver()
export class MovieResolver {

    @Mutation(() => Movie) 
    async createMovie(@Arg("movieData", () => MovieInput) movieData: MovieInput) {

        let movie = new MovieModel(movieData);

        await movie.save();

        console.log(movie);
        return movie;
    }


    @Query(() => Movie, {nullable: true})
    async Movie(@Arg("title") title: string) {
        let movie = await MovieModel.findOne({title: title});
        console.log("Query", movie)
        return movie;
    }

    @Query(() => [Movie], {nullable: true})
    async Movies() {
        let movies = await MovieModel.find();
        return movies;
    }
}