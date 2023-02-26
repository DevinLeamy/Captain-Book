export type LibgenSearch = {
    query: {
        type: "title" | "author";
        text: string;
        category: "fiction" | "non-fiction";
    };
    filter: {
        languages: string[];
        formats: string[];
    };
};
