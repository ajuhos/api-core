/**
 * Possible types for API Edge Queries.
 */
export enum ApiEdgeQueryType {

    /**
     * List several entities of the source model.
     */
    List = 1 << 1,

    /**
     * Get an entity of the source model.
     */
    Get = 1 << 2,

    /**
     * Create a new entity in the source model.
     */
    Create = 1 << 3,

    /**
     * Edit an entity in the source model.
     */
    Update = 1 << 4,

    /**
     * Edit an entity in the source model.
     */
    Patch = 1 << 5,

    /**
     * Delete an entity from the source model.
     */
    Delete = 1 << 6,

    /**
     * Check whether an entity from the source model exists.
     */
    Exists = 1 << 7,

    Any = List | Get | Create | Update | Patch | Delete | Exists,
    Change = Update | Patch,
    Read = Get | List,
    ReadOrChange = Read | Change
}