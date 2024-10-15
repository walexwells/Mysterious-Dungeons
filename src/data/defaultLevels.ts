import { IDungeon } from '../editor/IDungeon'

export const defaultLevels: {
    [key: string]: IDungeon
} = {
    'One--X-is-the-Exit': {
        width: 15,
        height: 10,
        cells: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1,
            1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
        ],
        name: 'One: X is the Exit',
    },
    'Two--Windows-and-Doors': {
        width: 15,
        height: 10,
        cells: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 5, 3, 5, 1, 4, 0, 0, 0,
            0, 0, 0, 0, 0, 2, 2, 5, 1, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 7, 0, 6, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 8, 1, 8, 1, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
        ],
        name: 'Two: Windows and Doors',
    },
    'Three--Teleportation': {
        width: 15,
        height: 10,
        cells: [
            3, 1, 9, 2, 9, 1, 1, 12, 5, 13, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 2, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 2, 1, 0, 1, 0, 10, 0, 1, 2, 0, 0, 0, 0, 0, 0, 10, 0, 1, 1, 2, 0, 0, 0,
            10, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
        ],
        name: 'Three: Teleportation',
    },
    'Four--Fog': {
        width: 15,
        height: 10,
        cells: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 1, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 15, 2, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 15, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 15, 1, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0,
            15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 2, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 15, 15, 15, 0, 0,
        ],
        name: 'Four: Fog',
    },
    'Five--Many-Exits': {
        width: 23,
        height: 4,
        cells: [
            1, 4, 1, 1, 15, 2, 15, 1, 1, 1, 1, 0, 1, 4, 10, 4, 10, 1, 4, 4, 4, 1, 1, 3, 1, 1, 1, 1,
            15, 4, 15, 15, 1, 1, 6, 1, 4, 1, 1, 4, 1, 1, 15, 1, 1, 2, 1, 1, 4, 1, 15, 15, 1, 15, 1,
            15, 1, 0, 1, 4, 4, 1, 4, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 15, 4, 15, 8, 15, 1, 7, 4, 1, 1,
            1, 1, 4, 1, 1, 15, 4, 1, 1,
        ],
        name: 'Five: Many Exits',
    },
    'Six--Moving-Walls': {
        width: 15,
        height: 10,
        cells: [
            2, 14, 16, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 16, 17, 9, 0, 0, 0, 16, 18, 1,
            0, 0, 0, 10, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 11, 17, 16,
            0, 1, 0, 0, 0, 2, 2, 2, 0, 0, 4, 0, 0, 0, 1, 0, 17, 0, 0, 0, 2, 2, 2, 17, 0, 13, 3, 16,
            18, 2, 18, 16, 1, 16, 0, 2, 2, 17, 16, 0, 0, 0, 17, 0, 18, 0, 0, 0, 18, 0, 0, 5, 0, 1,
            1, 1, 17, 16, 0, 16, 17, 1, 1, 1, 0, 0, 5, 0, 1, 1, 0, 0, 18, 0, 1, 0, 0, 0, 0, 0, 0, 8,
            17, 16, 1, 0, 10, 2, 18, 16, 0, 0, 0, 0, 0,
        ],
        name: 'Six: Moving Walls',
    },
    'Seven--That-s-Just-Mean-': {
        width: 15,
        height: 11,
        cells: [
            11, 17, 2, 2, 0, 2, 17, 4, 17, 2, 0, 2, 2, 10, 0, 17, 16, 2, 2, 17, 0, 16, 14, 16, 0,
            17, 2, 2, 17, 0, 5, 17, 5, 17, 16, 17, 0, 16, 0, 17, 16, 17, 0, 16, 0, 1, 16, 1, 0, 17,
            16, 1, 18, 1, 16, 17, 2, 0, 6, 0, 2, 2, 2, 0, 0, 5, 18, 16, 18, 16, 0, 5, 1, 6, 5, 2, 8,
            2, 5, 12, 18, 16, 3, 16, 18, 5, 1, 13, 0, 9, 2, 2, 2, 0, 0, 5, 18, 16, 18, 1, 0, 1, 5,
            15, 2, 5, 16, 0, 0, 17, 16, 16, 18, 16, 16, 17, 0, 8, 15, 2, 11, 17, 0, 17, 16, 17, 0,
            5, 0, 17, 16, 17, 0, 15, 2, 5, 0, 2, 2, 17, 0, 1, 2, 1, 0, 17, 2, 2, 0, 2, 9, 8, 2, 2,
            1, 18, 16, 1, 1, 17, 16, 2, 2, 6, 2,
        ],
        name: "Seven: That's Just Mean!",
    },
}
