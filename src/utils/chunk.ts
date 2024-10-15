export function chunk<T>(data: T[], n: number): T[][] {
    return data.reduce((arr, item, i) => {
        if (i % n == 0) {
            arr.push([item])
        } else {
            arr[Math.floor(i / n)].push(item)
        }
        return arr
    }, [] as T[][])
}
