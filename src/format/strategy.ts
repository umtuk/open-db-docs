const enum ReferenceTableStrategy {
    INCLUDE_ALL_COLUMN = 'INCLUDE_ALL_COLUMN',
    INCLUDE_PK_OR_REF_COLUMN = 'INCLUDE_PK_OR_REF_COLUMN',
};

interface FormatStrategy {
    referenceTableStrategy: ReferenceTableStrategy
};

export {
    ReferenceTableStrategy,
    FormatStrategy,
}