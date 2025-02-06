export function convertToTargetPlane(coords, from, to) {
    const lambdaX = to.width / (from.width)
    const lambdaY = to.height / (from.height)
    const x = lambdaX * coords.x
    const y = lambdaY * coords.y
    return({
        x,
        y
    })
}