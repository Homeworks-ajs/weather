import {hideBin} from 'yargs/helpers';
import yargs, {ArgumentsCamelCase} from "yargs";
import * as http from "http";
import {Config} from "./config";
import dotenv from "dotenv";
dotenv.config();

const init = yargs(hideBin(process.argv))
    .command({
        command: "$0 <city>",
        describe: "get weather by city",
        handler: (args: ArgumentsCamelCase<any>) => {
            const {city} = args;
            const token: string | undefined = process.env.WEATHER_API;
            const path: string = `${Config.URL}?access_key=${token}&query=${city}`;

            http.get(path, (res) => {
                const {statusCode} = res;

                if(statusCode !== 200) {
                    console.error(new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`))
                    return;
                }

                res.setEncoding("utf-8");
                let data = "";
                res.on("data", (chunk) => data += chunk);
                res.on("end", () => console.log(JSON.parse(data)))
            })
        }
    }).argv
