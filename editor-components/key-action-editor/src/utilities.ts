const splitComboKeys = (comboKey: string): string[] => {
    return comboKey.split(/\s*\+\s*/).map((key) => key.toLowerCase());
}

export const isMatchingComboKeys = (testKeys: string[], expectedComboKeys: string[]): boolean => {
    const normalizedTestKeys = testKeys.map((key) => key.toLowerCase());
    return expectedComboKeys.some((expectedComboKey) => {
        const expectedKeys = splitComboKeys(expectedComboKey);
        return (
            (normalizedTestKeys.length === expectedKeys.length)
            &&
            normalizedTestKeys.every((testKey) => expectedKeys.includes(testKey))
        );
    })
}
