declare function FDB(configPath?: string): {
    get: (key: string) => Promise<string | undefined>;
    set: (key: string, value: string) => Promise<void>;
    remove: (key: string) => Promise<void>;
};

export { FDB as default };
