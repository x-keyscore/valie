export declare class Issue extends Error {
    print(context: string, message: string, plugin?: string): void;
    constructor(context: string, message: string, plugin?: string);
}
