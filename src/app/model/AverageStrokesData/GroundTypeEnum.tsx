export enum GroundTypeEnum {
    Tee,
    Fairway,
    Rough,
    Green,
    OutOfBounds,
}

export type StartGroundTypeEnumsType =
    GroundTypeEnum.Tee
    | GroundTypeEnum.Fairway
    | GroundTypeEnum.Rough
    | GroundTypeEnum.Green;

export const startGroundTypeEnums: StartGroundTypeEnumsType[] = [
    GroundTypeEnum.Tee
    , GroundTypeEnum.Fairway
    , GroundTypeEnum.Rough
    , GroundTypeEnum.Green
];

export type EndGroundTypeEnumsType =
    GroundTypeEnum.Green
    | GroundTypeEnum.Fairway
    | GroundTypeEnum.Rough
    | GroundTypeEnum.OutOfBounds;

export const endGroundTypeEnums: EndGroundTypeEnumsType[] = [
    GroundTypeEnum.Green
    , GroundTypeEnum.Fairway
    , GroundTypeEnum.Rough
    , GroundTypeEnum.OutOfBounds
];

export type GroundTypeEnumStringsType = keyof typeof GroundTypeEnum;
