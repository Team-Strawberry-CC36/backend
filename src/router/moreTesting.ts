import { Request, Response, Router } from 'express';

const moreTestingRouter: Router = Router();

moreTestingRouter.get('/places/:id/votes', (req: Request, res: Response) => {
    // Please get data prepared in the following example format
    // Interface for data format is in frontend/src/utils/interfaces/PlaceEtiquetteVotes.ts
    
    // Feel free to change variable name from mockEtiquetteVotesData to something else
    // userID property can be retrieved from firebase authentication
    const mockEtiquetteVotesData = {
        placeId: 1,
        userId: 'users uid from firebase',
        userHasVoted : false,
        etiquetteVotes : [
            { etiquetteId: 1, etiquetteType: 'Smoking', numberOfVotesForAllowed: 100, numberOfVotesForNotAllowed: 1000 },
            { etiquetteId: 2, etiquetteType: 'Tattoos', numberOfVotesForAllowed: 400, numberOfVotesForNotAllowed: 700 },
            { etiquetteId: 3, etiquetteType: 'Towels', numberOfVotesForAllowed: 1050, numberOfVotesForNotAllowed: 50},
            { etiquetteId: 4, etiquetteType: 'Swimming', numberOfVotesForAllowed: 550, numberOfVotesForNotAllowed: 550},
            { etiquetteId: 5, etiquetteType: 'Existential Dread', numberOfVotesForAllowed: 1100, numberOfVotesForNotAllowed: 0}
        ],
        usersVote: [
            { etiquetteId: 1, etiquetteType: 'Smoking', vote: undefined },
            { etiquetteId: 2, etiquetteType: 'Tattoos', vote: undefined },
            { etiquetteId: 3, etiquetteType: 'Towels', vote: undefined },
            { etiquetteId: 4, etiquetteType: 'Swimming', vote: undefined },
            { etiquetteId: 5, etiquetteType: 'Existential Dread', vote: undefined },
        ],
    };

    // Please make sure that data is returned like this
    res.status(200).json({ message: "Hooray, it was a success", data:mockEtiquetteVotesData });
});

moreTestingRouter.post('/places/:id/votes', (req: Request, res: Response) => {
    const { votes, placeId } = req.body;
    console.log(req.body);

    // The data sent to this endpoint looks like this:
    // {
    //     votes: [
    //       { etiquetteId: 1, etiquetteType: 'Smoking' },
    //       { etiquetteId: 2, etiquetteType: 'Tattoos', vote: 'allowed' },
    //       { etiquetteId: 3, etiquetteType: 'Towels', vote: 'not-allowed' },
    //       { etiquetteId: 4, etiquetteType: 'Swimming' },
    //       { etiquetteId: 5, etiquetteType: 'Existential Dread', vote: 'allowed' }
    //     ],
    //     placeId: 1
    // }

    // If there is no "vote" property on an object in the votes array, it is because the user did not select to vote for it
    // so on the front end, it is undefined
    // Interface for front end can be found at frontend/src/utils/interfaces/PlaceEtiquetteVotes.ts
    // But for reference, each object in the votes array follows these:
    // interface IEtiquetteUsersVote {
    //     etiquetteId: number;
    //     etiquetteType: string;
    //     vote: EtiquetteStatus;
    // }
    // type EtiquetteStatus = 'allowed' | 'not-allowed' | undefined;

    // The numberOfVotesForAllowed and numberOfVotesForNotAllowed will need updating as well.

    res.status(200).json({ "message": "success" });
});

moreTestingRouter.patch('/places/:id/votes', (req: Request, res: Response) => {
    const { votes, placeId } = req.body;
    console.log(req.body);

    // The data sent to this endpoint looks like this:
    // {
    //     votes: [
    //       { etiquetteId: 1, etiquetteType: 'Smoking' },
    //       { etiquetteId: 2, etiquetteType: 'Tattoos', vote: 'allowed' },
    //       { etiquetteId: 3, etiquetteType: 'Towels', vote: 'not-allowed' },
    //       { etiquetteId: 4, etiquetteType: 'Swimming' },
    //       { etiquetteId: 5, etiquetteType: 'Existential Dread', vote: 'allowed' }
    //     ],
    //     placeId: 1
    // }

    // If there is no "vote" property on an object in the votes array, it is because the user did not select to vote for it
    // so on the front end, it is undefined
    // Interface for front end can be found at frontend/src/utils/interfaces/PlaceEtiquetteVotes.ts
    // But for reference, each object in the votes array follows these:
    // interface IEtiquetteUsersVote {
    //     etiquetteId: number;
    //     etiquetteType: string;
    //     vote: EtiquetteStatus;
    // }
    // type EtiquetteStatus = 'allowed' | 'not-allowed' | undefined;

    // The numberOfVotesForAllowed and numberOfVotesForNotAllowed will need updating as well.
    res.status(200).json({ "message": "success" });
})

export default moreTestingRouter;