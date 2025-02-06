function convertCoordinates(coords, original, adjusted) {
    const numCoords = { ...coords, ...original, ...adjusted };
    Object.keys(numCoords).forEach((key) => {
        numCoords[key] = parseInt(numCoords[key]);
    });

    const { x, y } = numCoords;
    const { ow, oh } = numCoords;
    const { aw, ah } = numCoords;

    const scaleX = aw / ow;
    const scaleY = ah / oh;

    const adjustedX = x * scaleX;
    const adjustedY = y * scaleY;

    return { x: adjustedX, y: adjustedY };
}

export default convertCoordinates;
