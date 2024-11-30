import { Request, Response, Router } from 'express';

const moreTestingRouter: Router = Router();

moreTestingRouter.post('/places/:id/votes', (req: Request, res: Response) => {
    const { votes, userId } = req.body;
    // Process the votes into a table of some sort
    console.log(votes);
    console.log(userId);
    res.status(200).json({"message": "success"});
});

moreTestingRouter.get('/places/:id/votes', (req: Request, res: Response) => {
    // Please get data prepared in the following example format
    // Interface in frontend/src/utils/interfaces/PlaceEtiquetteVotes.ts
    
    // Feel free to change this variable name
    // User id can be retrieved from firebase authentication.
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
})

export default moreTestingRouter;