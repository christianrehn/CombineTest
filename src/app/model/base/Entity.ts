import {assert} from "chai";
import {Dispatch, SetStateAction} from "react";

export interface IEntity {
    getUuid: () => string;
    getName: () => string;
    toJson: () => any;
}

export abstract class Entity implements IEntity {
    protected _uuid: string;

    constructor(
        uuid: string,
    ) {
        assert(!!uuid, "!uuid");

        this._uuid = uuid;
    }

    public getUuid = (): string => {
        assert(!!this._uuid, "getUuid - !this._uuid");

        return this._uuid;
    }

    public static handleSaveEntity = <T extends IEntity>
    (entity: T,
     setEntity: Dispatch<SetStateAction<T>>,
     saveEntity: (entity: T) => void
    ) => (changedEntity: T): void => {
        const entityClone: T = {...entity};
        console.log("handleSaveEntity - entityUuid=", entityClone.getUuid());

        // entity has been updated or is new
        assert(!!changedEntity.getUuid(), "!changedEntity.getUuid()");

        setEntity(entityClone);
        saveEntity(entityClone);
    }

    public static handleSaveEntities = <T extends IEntity>
    (entities: T[],
     setEntities: Dispatch<SetStateAction<T[]>>,
     selectedEntity: T,
     setSelectedEntity: Dispatch<SetStateAction<T>>,
     saveEntities: (entities: T[]) => void
    ) => (changedEntity: T): void => {
        const entitiesClone: T[] = [...entities];
        const entityUuids: string[] = entitiesClone.map((entity: T) => entity.getUuid());
        console.log("handleSaveEntities - entityUuids=", entityUuids);

        if (!changedEntity) {
            // selectedEntity has been deleted
            const deletedEntityIndex: number = entityUuids.indexOf(selectedEntity.getUuid())
            console.log("handleSaveEntities - deletedEntityIndex=", deletedEntityIndex);
            if (deletedEntityIndex >= 0) {
                // an already existing entity has been deleted (not a newly created one)
                entitiesClone.splice(deletedEntityIndex, 1);
                setSelectedEntity(undefined);
            }
        } else {
            // selectedEntity has been updated or is new
            assert(!!changedEntity.getUuid(), "!changedEntity.getUuid()");
            const changedEntityIndex: number = entityUuids.indexOf(changedEntity.getUuid())
            console.log("handleSaveEntities - changedEntityIndex=", changedEntityIndex);
            if (changedEntityIndex >= 0) {
                entitiesClone[changedEntityIndex] = changedEntity; // replace with changed entry
            } else {
                entitiesClone.push(changedEntity); // new entry
            }
            setSelectedEntity(changedEntity);
        }

        setEntities(entitiesClone);
        saveEntities(entitiesClone);
    }

    public abstract getName(): string;

    abstract toJson(): any;
}
