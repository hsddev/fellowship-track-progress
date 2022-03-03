// Get the level function form xps
const getLevel = (xp: number) => {
    const squareRoot = Math.sqrt(
        (-(9 * xp) / 11 - 778042 / 1331) ** 2 + 11698628938101 / 28344976
    );
    const cubicRoot = Math.pow(
        (-9 * xp) / 22 + squareRoot / 2 - 389021 / 1331,
        1 / 3
    );
    return -cubicRoot / 3 - 83 / 66 + 7567 / (484 * cubicRoot);
};

export default getLevel;
