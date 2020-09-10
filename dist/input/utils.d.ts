import { InputProps } from './type';
declare type BuildInPatterns = {
    [key in NonNullable<InputProps['format']>]: {
        pattern: string;
        delimiter?: string;
        lastRepeat?: boolean;
        repeat?: boolean;
    };
};
export declare const buildInPattern: BuildInPatterns;
export declare function formatMoney(moneyStr?: string, delimiter?: string): string;
export declare function parserNumber(value?: string): string;
export declare function parserInteger(value?: string): string;
export declare function parserGeneral(value?: string): string;
export declare function parserLength(value: string | undefined, maxLength: number): string;
export declare function parserThan(value: string | undefined, num: number, isMin?: boolean): string;
export {};
