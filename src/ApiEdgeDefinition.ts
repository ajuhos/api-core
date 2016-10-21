/**
 * Created by ajuhos on 2016. 10. 20..
 */

export interface ApiEdgeDefinition {

    name: string;
    methods: Object;
    relations: ApiEdgeRelation[];

    getEntry: (id: string) => Promise<any>;
    listEntries: (filters: any[]) => Promise<any[]>;
    createEntry: (entry: any) => Promise<any>;
    updateEntry: (id: string, entryFields: any) => Promise<any>;
    updateEntries: (filters: any[], entryFields: any) => Promise<any>;
    removeEntry: (id: string) => Promise<any>;
    removeEntries: (filters: any[]) => Promise<any[]>;

}