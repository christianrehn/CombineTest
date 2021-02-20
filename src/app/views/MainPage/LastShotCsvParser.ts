import {default as csv} from 'csv-parser';
import {createReadStream} from "fs";
import * as util from "util";
import * as stream from "stream";

const pipeline = util.promisify(stream.pipeline);

export const parseLastShotCsv = async (lastShotCsvPath: string): Promise<any> => {
    const results: any[] = [];
    await pipeline(
        createReadStream(lastShotCsvPath),
        csv(
            {
                mapHeaders: ({header, index}): string => {
                    return header.trim()
                        .toLowerCase()
                        .replace(/ /g, "_")
                        .replace(/\(/g, "")
                        .replace(/\)/g, "")
                        .replace(/\//g, "")
                },
                mapValues: ({header, index, value}): string | number => {
                    const valueAsNumber: number = Number(value);
                    if (Number.isNaN(valueAsNumber)) {
                        return String(value).trim();
                    }
                    return valueAsNumber;
                }
            }
        ).on('data', (data) => results.push(data))
    );

    if (!!results && Array.isArray(results) && results.length > 0) {
        return results[0];
    }
    return undefined;
}