/**
 * Possible types for API Edge Queries.
 */
export enum ApiEdgeQueryType {

    /**
     * List several entities of the source model.
     */
    List,

    /**
     * Get an entity of the source model.
     */
    Get,

    /**
     * Create a new entity in the source model.
     */
    Create,

    /**
     * Edit an entity in the source model.
     */
    Update,

    /**
     * Edit an entity in the source model.
     */
    Patch,

    /**
     * Delete an entity from the source model.
     */
    Delete,

    /**
     * Check whether an entity from the source model exists.
     */
    Exists,

    /**
     * Call a method in the provider.
     */
    Call

}