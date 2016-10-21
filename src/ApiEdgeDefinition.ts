/**
 * Created by ajuhos on 2016. 10. 20..
 */

export interface ApiEdgeDefinition {

    name: string;
    methods: Object;

    getEntry: (id: string) => any;
    listEntries: (filters: any[]) => any[];
    createEntry: (entry: any) => any;
    updateEntry: (id: string, entryFields: any) => any;
    updateEntries: (filters: any[], entryFields: any) => any;
    removeEntry: (id: string) => any;
    removeEntries: (filters: any[]) => any[];

}