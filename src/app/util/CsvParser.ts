import {default as csv} from 'csv-parser';
import {assert} from "chai";
import {createReadStream} from "fs";
import * as util from "util";
import * as stream from "stream";

const pipeline = util.promisify(stream.pipeline);

export enum CsvTypeEnum {
    LAST_SHOT,
    ALL_SHOTS,
    AVERAGE_SHOTS_TO_HOLE
}

export const parseCsvToFirstRowAsObject = async (csvPath: string): Promise<any> => {
    return parseCsv(csvPath, CsvTypeEnum.LAST_SHOT)
}

export const parseCsvToAllRowsAsObjects = async (csvPath: string): Promise<any[]> => {
    return parseCsv(csvPath, CsvTypeEnum.ALL_SHOTS)
}

export const parseCsvToArrayOfColumnArrays = async (csvPath: string): Promise<[number[], number[]]> => {
    return parseCsv(csvPath, CsvTypeEnum.AVERAGE_SHOTS_TO_HOLE)
}

const parseCsv = async (csvPath: string, csvReturnTypeEnum: CsvTypeEnum): Promise<any> => {
    assert(!!csvPath, "!csvPath");

    const results: any[] = [];
    try {
        await pipeline(
            createReadStream(csvPath),
            csv(
                {
                    mapHeaders: ({header, index}): string => {
                        // make header more readable
                        return header.trim()
                            .toLowerCase()
                            .replace(/ /g, "_")
                            .replace(/\(/g, "")
                            .replace(/\)/g, "")
                            .replace(/\//g, "")
                    },
                    mapValues: ({header, index, value}): string | number => {
                        // convert to number if possible
                        const valueAsNumber: number = Number(value);
                        if (Number.isNaN(valueAsNumber)) {
                            return String(value).trim();
                        }
                        return valueAsNumber;
                    }
                }
            )
                .on('data', (data) => results.push(data))
                .on('error', (e): void => {
                    console.error(`on error ${e}`)
                }),
        );

        if (!!results && Array.isArray(results) && results.length > 0) {
            switch (csvReturnTypeEnum) {
                case CsvTypeEnum.LAST_SHOT:
                    return results[0];
                case CsvTypeEnum.ALL_SHOTS:
                    return results;
                case CsvTypeEnum.AVERAGE_SHOTS_TO_HOLE:
                    const distances: number[] = results.map((result, index: number) => {
                            return Number(Object.values(result)[0]);
                        }
                    );
                    const strokes: number[] = results.map((result, index: number) => {
                            return Number(Object.values(result)[1]);
                        }
                    );
                    return [distances, strokes];
            }
        }
        return undefined;
    } catch (error) {
        console.error(`catching error ${error}`)
    }
}
