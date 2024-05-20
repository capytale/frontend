import { user } from '@/constants'

export let me

if (user === 'teacher') {
me = {
    "uid": 443,
    "profil": "teacher",
    "muuid": "e4t-_uOkDw71bVcrKgCOJ8RdCdBb0T6684T5P1mcv0",
    "roles": [
        "teacher",
    ],
    "firstname": "Claude",
    "lastname": "Profdensi",
    "classe": "enseignants"
} } else {
me = {
    "uid": 443,
    "profil": "student",
    "muuid": "e4t-_5P1DwJ8RdC8mBb07dCOAT661bVcrKgcv0uOk4T",
    "roles": [
        "student",
    ],
    "firstname": "Claude",
    "lastname": "Elevedensi",
    "classe": "1e4"
}
}
