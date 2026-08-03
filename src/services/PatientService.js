const tempPatients = [
    {
        id: 1,
        name: "Milo",
        species: "Cat",
        breed: "Domestic Shorthair",
        weight: 11.4,
        sex: "Male",
        dob: "2021-04-12",
        createdAt: "2026-07-18T09:30:00Z",
    },
    {
        id: 2,
        name: "Luna",
        species: "Dog",
        breed: "Golden Retriever",
        weight: 62.8,
        sex: "Female",
        dob: "2019-09-03",
        createdAt: "2026-07-19T14:15:00Z",
    },
    {
        id: 3,
        name: "Oliver",
        species: "Cat",
        breed: "Maine Coon",
        weight: 16.2,
        sex: "Male",
        dob: "2020-01-22",
        createdAt: "2026-07-21T11:45:00Z",
    },
    {
        id: 4,
        name: "Bella",
        species: "Dog",
        breed: "French Bulldog",
        weight: 24.5,
        sex: "Female",
        dob: "2022-06-17",
        createdAt: "2026-07-23T08:20:00Z",
    },
    {
        id: 5,
        name: "Charlie",
        species: "Dog",
        breed: "Beagle",
        weight: 29.7,
        sex: "Male",
        dob: "2018-11-08",
        createdAt: "2026-07-25T16:10:00Z",
    },
    {
        id: 6,
        name: "Coco",
        species: "Rabbit",
        breed: "Holland Lop",
        weight: 4.1,
        sex: "Female",
        dob: "2023-02-14",
        createdAt: "2026-07-27T10:05:00Z",
    },
    {
        id: 7,
        name: "Rocky",
        species: "Dog",
        breed: "Boxer",
        weight: 68.3,
        sex: "Male",
        dob: "2017-05-29",
        createdAt: "2026-07-28T13:40:00Z",
    },
    {
        id: 8,
        name: "Nala",
        species: "Cat",
        breed: "Siamese",
        weight: 9.8,
        sex: "Female",
        dob: "2021-12-01",
        createdAt: "2026-07-30T15:25:00Z",
    },
    {
        id: 9,
        name: "Kiwi",
        species: "Bird",
        breed: "Cockatiel",
        weight: 0.2,
        sex: "Male",
        dob: "2022-08-10",
        createdAt: "2026-08-01T09:50:00Z",
    },
    {
        id: 10,
        name: "Daisy",
        species: "Dog",
        breed: "Border Collie",
        weight: 41.6,
        sex: "Female",
        dob: "2020-03-25",
        createdAt: "2026-08-02T17:10:00Z",
    },
];


const PatientService = {
    
    async getPatients(id){
        try{
            return tempPatients;
        } catch(error){
            throw new Error(error);
        }
    },

    async addPatient(){
        try{

        } catch(error){
            throw new Error(error);
        }
    },

    async updatePatient(){
        try{

        } catch(error){
            throw new Error(error);
        }
    },

    async deletePatient(){
        try{

        } catch(error){
            throw new Error(error);
        }
    }
};

export default PatientService;